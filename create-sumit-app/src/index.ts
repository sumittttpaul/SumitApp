#!/usr/bin/env node

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { Command } from 'commander';
import { execa } from 'execa';
import prompts from 'prompts';
import chalk from 'chalk';
import fs from 'fs-extra';
import degit from 'degit';
import path from 'path';
import ora from 'ora';

import { TEMPLATES, getTemplate, listTemplates } from './lib/templates.js';
import { CreateProjectOptions, Template, Config } from './types/index.js';
import { Logger } from './lib/logger.js';
import {
  loadConfig,
  updateConfig,
  resetConfig,
  showConfig,
  getConfigPath,
} from './lib/config.js';
import {
  getPackageManagerInfo,
  checkForUpdates,
  isDirectoryEmpty,
  validateProjectName,
  formatDuration,
  // initializeGitRepository,
} from './lib/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getTemplatePath(template: Template): string {
  return template.path || `templates/${template.name}`;
}

async function cleanupGitDirectory(
  projectPath: string,
  logger: Logger
): Promise<void> {
  const gitDir = path.join(projectPath, '.git');

  if (!(await fs.pathExists(gitDir))) {
    return;
  }

  let retries = 3;
  while (retries > 0) {
    try {
      await fs.remove(gitDir);
      logger.verbose('Removed template .git directory');
      return;
    } catch (error: any) {
      retries--;

      if (error.code === 'EBUSY' || error.code === 'EPERM') {
        if (retries > 0) {
          logger.verbose(
            `Git cleanup failed, retrying... (${retries} attempts left)`
          );
          // Wait a bit before retrying
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Try to make files writable on Windows
          try {
            await makeGitFilesWritable(gitDir);
          } catch (chmodError) {
            // Ignore chmod errors
          }
        } else {
          logger.warn('Could not remove .git directory automatically');
          logger.info(
            'You may need to manually delete the .git folder if it exists'
          );
          return;
        }
      } else {
        // For other errors, just warn and continue
        logger.verbose(`Git cleanup error: ${error.message}`);
        return;
      }
    }
  }
}

// Helper function to make git files writable
async function makeGitFilesWritable(gitDir: string): Promise<void> {
  try {
    const files = await fs.readdir(gitDir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(gitDir, file.name);

      if (file.isDirectory()) {
        await makeGitFilesWritable(fullPath);
      } else {
        try {
          await fs.chmod(fullPath, 0o666); // Make file writable
        } catch (error) {
          // Ignore individual file errors
        }
      }
    }
  } catch (error) {
    // Ignore directory traversal errors
  }
}

async function selectPackageManager(
  config: Config,
  logger: Logger,
  packageManagerName?: string
): Promise<string> {
  // Available package managers with descriptions
  const availableManagers = [
    {
      name: 'bun',
      description: '⚡ Ultra-fast JavaScript runtime and package manager',
    },
    // {
    //   name: 'pnpm',
    //   description: '📦 Fast, disk space efficient package manager',
    // },
    // {
    //   name: 'yarn',
    //   description: '🐈 Fast, reliable, and secure dependency management',
    // },
    // {
    //   name: 'npm',
    //   description: '📦 Simple and widely used Node.js package manager',
    // },
  ];

  // If package manager specified via CLI, use it
  if (packageManagerName) {
    const manager = availableManagers.find(
      (m) => m.name === packageManagerName
    );
    if (!manager) {
      logger.error(`Package manager "${packageManagerName}" not found.`);
      logger.info('Available package managers:');
      availableManagers.forEach((m) =>
        logger.info(`  • ${m.name} - ${m.description}`)
      );
      process.exit(1);
    }
    logger.verbose(`Using CLI specified package manager: ${manager.name}`);
    return manager.name;
  }

  // If default package manager in config, use it
  if (config.packageManager) {
    logger.verbose(
      `Using config default package manager: ${config.packageManager}`
    );
    return config.packageManager;
  }

  // Check for lockfiles in the CURRENT directory for auto-detection
  const lockFiles = [
    { name: 'bun', file: 'bun.lockb' },
    { name: 'pnpm', file: 'pnpm-lock.yaml' },
    { name: 'yarn', file: 'yarn.lock' },
    { name: 'npm', file: 'package-lock.json' },
  ];

  for (const lockFile of lockFiles) {
    if (await fs.pathExists(path.join(process.cwd(), lockFile.file))) {
      logger.verbose(`Auto-detected ${lockFile.name} from ${lockFile.file}`);
      return lockFile.name;
    }
  }

  // Interactive selection (no auto-detection from global availability)
  logger.newLine();
  logger.log('📦 Choose a package manager:');

  const { selectedManager } = await prompts({
    type: 'select',
    name: 'selectedManager',
    message: 'Select a package manager',
    choices: availableManagers.map((manager) => ({
      title: `${manager.name}`,
      description: manager.description,
      value: manager.name,
    })),
    initial: 0, // Default to bun (first option)
  });

  if (!selectedManager) {
    logger.error('Package manager selection cancelled');
    process.exit(0);
  }

  return selectedManager;
}

async function selectTemplate(
  config: Config,
  logger: Logger,
  templateName?: string
): Promise<Template> {
  // If template specified via CLI, use it
  if (templateName) {
    const template = getTemplate(templateName);
    if (!template) {
      logger.error(`Template "${templateName}" not found.`);
      logger.info('Available templates:');
      TEMPLATES.forEach((t) => logger.info(`  • ${t.name} - ${t.description}`));
      process.exit(1);
    }
    return template;
  }

  // If default template in config, use it
  if (config.defaultTemplate) {
    const template = getTemplate(config.defaultTemplate);
    if (template) {
      logger.verbose(`Using default template: ${template.name}`);
      return template;
    }
  }

  // Interactive selection
  // logger.newLine();
  logger.log('🎨 Choose a template for your project:');

  const { selectedTemplate } = await prompts({
    type: 'select',
    name: 'selectedTemplate',
    message: 'Select a template',
    choices: TEMPLATES.map((template, index) => ({
      title: `${template.name}`,
      description: template.description,
      value: template,
    })),
    initial: 0,
  });

  if (!selectedTemplate) {
    logger.error('Template selection cancelled');
    process.exit(0);
  }

  return selectedTemplate;
}

async function createProject(
  projectName?: string,
  options: CreateProjectOptions = {}
) {
  const startTime = Date.now();
  const logger = new Logger(options.verbose);
  const config = await loadConfig();

  // Show banner
  logger.banner();

  // Check for updates
  if (!config.skipUpdateCheck && !options.verbose) {
    await checkForUpdates(logger);
  }

  let targetDir = projectName;

  // Handle project name
  if (!targetDir) {
    const { projectName: inputName } = await prompts({
      type: 'text',
      name: 'projectName',
      message: 'What is your project named?',
      initial: 'my-sumit-app',
      validate: async (value: string) => {
        if (!value.trim()) return 'Project name is required';

        // Allow dot (.) for current directory
        if (value === '.') return true;

        const validation = await validateProjectName(value);
        return validation.valid || validation.message!;
      },
    });

    if (!inputName) {
      logger.warn('Project creation cancelled.');
      process.exit(0);
    }

    targetDir = inputName;
  } else {
    // Validate provided project name (allow dot for current directory)
    if (targetDir !== '.') {
      const validation = await validateProjectName(targetDir);
      if (!validation.valid) {
        logger.error(validation.message!);
        process.exit(1);
      }
    }
  }

  // Type guard to ensure targetDir is defined
  if (!targetDir) {
    logger.error('Project name is required');
    process.exit(1);
  }

  // Handle current directory installation
  let resolvedProjectPath: string; // ← Changed name to avoid conflict
  let displayPath: string; // ← Changed name to avoid conflict

  if (targetDir === '.') {
    // Install in current directory
    resolvedProjectPath = process.cwd();
    displayPath = 'current directory';

    // Validate current directory name for package.json compatibility
    const currentDirName = path.basename(resolvedProjectPath);
    const validation = await validateProjectName(currentDirName);
    if (!validation.valid) {
      logger.error(
        `Current directory name "${currentDirName}" is not a valid package name.`
      );
      logger.error(validation.message!);
      logger.info(
        'Please rename your directory to use lowercase letters, numbers, hyphens, underscores, and dots only.'
      );
      process.exit(1);
    }
  } else {
    // Install in new directory
    resolvedProjectPath = path.resolve(process.cwd(), targetDir);
    const relativeProjectPath = path.relative(
      process.cwd(),
      resolvedProjectPath
    );
    displayPath = relativeProjectPath || 'current directory';
  }

  logger.newLine();
  logger.step(1, 4, `Creating project in ${chalk.cyan(displayPath)}`);

  // Check if directory exists and is not empty
  if (await fs.pathExists(resolvedProjectPath)) {
    if (!(await isDirectoryEmpty(resolvedProjectPath))) {
      logger.error(
        `Directory "${targetDir === '.' ? 'current directory' : targetDir}" already exists and is not empty.`
      );

      const { overwrite } = await prompts({
        type: 'confirm',
        name: 'overwrite',
        message: 'Remove existing files and continue?',
        initial: false,
      });

      if (overwrite) {
        // Add spinner while deleting files
        const deleteSpinner = ora({
          text: 'Removing existing files...',
          spinner: 'dots',
        }).start();

        try {
          await fs.emptyDir(resolvedProjectPath);
          deleteSpinner.succeed(chalk.green('Existing files removed'));
        } catch (error) {
          deleteSpinner.fail(chalk.red('Failed to remove existing files'));
          logger.error(`Directory cleanup failed: ${error}`);
          process.exit(1);
        }
      } else {
        logger.warn('Project creation cancelled.');
        process.exit(0);
      }
    }
  }

  // Select template
  logger.newLine();
  const template = await selectTemplate(config, logger, options.template);
  logger.newLine();
  logger.step(2, 4, `Using template: ${chalk.cyan(template.name)}`);

  // Show template features
  if (options.verbose) {
    logger.box(
      template.features.map((f) => `• ${f}`).join('\n'),
      `✨ ${template.name} template's features`
    );
  }

  // Clone template with sparse checkout for subdirectories
  const downloadSpinner = ora({
    text: 'Downloading template...',
    spinner: 'dots12',
  }).start();

  try {
    logger.verbose(`Downloading from: ${template.url}`);

    // Ensure target directory is ready
    if (targetDir !== '.' && (await fs.pathExists(resolvedProjectPath))) {
      await fs.remove(resolvedProjectPath);
    }

    // Ensure directory exists
    await fs.ensureDir(resolvedProjectPath);

    // For templates with subdirectories, use degit
    if (template.url.includes('SumitApp.git')) {
      const templatePath = getTemplatePath(template);

      // Extract repo info from URL
      // https://github.com/sumittttpaul/SumitApp.git -> sumittttpaul/SumitApp
      const repoMatch = template.url.match(/github\.com[/:]([\w-]+)\/([\w-]+)/);
      if (!repoMatch) {
        throw new Error('Invalid GitHub repository URL');
      }

      const [, owner, repo] = repoMatch;
      const repoPath = `${owner}/${repo.replace('.git', '')}/${templatePath}`;

      // degit downloads ONLY this specific folder
      const emitter = degit(repoPath, {
        cache: false,
        force: true,
        verbose: options.verbose,
      });

      // Download directly to target directory
      await emitter.clone(resolvedProjectPath);

      logger.verbose(`Downloaded template from: ${repoPath}`);
    } else {
      // For standalone repos, still use degit
      const repoMatch = template.url.match(/github\.com[/:]([\w-]+)\/([\w-]+)/);
      if (repoMatch) {
        const [, owner, repo] = repoMatch;
        const emitter = degit(`${owner}/${repo.replace('.git', '')}`, {
          cache: false,
          force: true,
          verbose: options.verbose,
        });
        await emitter.clone(resolvedProjectPath);
      } else {
        throw new Error('Invalid repository URL');
      }
    }

    downloadSpinner.succeed(chalk.green('Template downloaded successfully!'));
  } catch (error: any) {
    downloadSpinner.fail(chalk.red('Failed to download template'));
    logger.error(`Download failed: ${error.message || error}`);
    logger.info(
      'Make sure the repository and template folder exist and are accessible.'
    );

    // Clean up failed download
    try {
      if (await fs.pathExists(resolvedProjectPath)) {
        await fs.remove(resolvedProjectPath);
      }
    } catch (cleanupError) {
      // Ignore
    }

    process.exit(1);
  }

  // Clean up git directory
  await cleanupGitDirectory(resolvedProjectPath, logger);
  logger.verbose('Removed template .git directory');

  // Detect/Select package manager
  const packageManager = await selectPackageManager(
    config,
    logger,
    options.packageManager
  );
  const pmInfo = getPackageManagerInfo(packageManager as any);

  logger.newLine();
  logger.step(3, 4, `Using package manager: ${chalk.cyan(packageManager)}`);

  // Install dependencies
  if (!options.skipInstall) {
    const installSpinner = ora({
      text: `Installing dependencies with ${packageManager}...`,
      spinner: 'bouncingBar',
    }).start();

    try {
      await execa(pmInfo.command, pmInfo.installArgs, {
        cwd: resolvedProjectPath,
        stdio: options.verbose ? 'inherit' : 'pipe',
      });
      installSpinner.succeed(
        chalk.green('Dependencies installed successfully!')
      );
    } catch (error) {
      installSpinner.fail(chalk.red('Failed to install dependencies'));
      logger.error(`Dependency installation failed: ${error}`);
      logger.warn('You can install dependencies manually by running:');
      logger.info(`  cd ${targetDir}`);
      logger.info(`  ${pmInfo.command} ${pmInfo.installArgs.join(' ')}`);
    }
  } else {
    logger.info('Skipped dependency installation');
  }

  // Initialize git repository
  // logger.step(4, 5, 'Initializing git repository...');
  // logger.newLine();
  // if (options.git !== false && config.git !== false) {
  //   const gitSuccess = await initializeGitRepository(projectPath, logger);
  //   if (gitSuccess) {
  //     logger.success('Git repository initialized');
  //   } else {
  //     logger.warn(
  //       'Git initialization failed, but project was created successfully'
  //     );
  //   }
  // } else {
  //   logger.info('Skipped git initialization');
  // }

  // Get the actual project name for display
  const actualProjectName =
    targetDir === '.' ? path.basename(resolvedProjectPath) : targetDir;

  // Success message
  const duration = formatDuration(Date.now() - startTime);
  logger.newLine();
  logger.step(4, 4, 'Project setup complete!');

  logger.newLine();
  logger.success(
    `🎉 Successfully created ${chalk.green(actualProjectName)} in ${chalk.green(duration)}`
  );
  logger.newLine();

  // Next steps - show actual commands based on directory
  const nextSteps: string[] = [];

  if (targetDir === '.') {
    // Current directory - no cd command needed
    nextSteps.push(
      `${pmInfo.command} ${pmInfo.name === 'npm' ? 'run ' : ''}dev`
    );
  } else {
    // New directory - include cd command
    nextSteps.push(`cd ${chalk.hex('#FFFFFF')(actualProjectName)}`);
    nextSteps.push(
      `${pmInfo.command} ${pmInfo.name === 'npm' ? 'run ' : ''}dev`
    );
  }

  if (options.skipInstall) {
    // Insert install command at appropriate position
    const installCmd = `${pmInfo.command} ${pmInfo.installArgs.join(' ')}`;
    if (targetDir === '.') {
      nextSteps.splice(0, 0, installCmd); // Add as first step
    } else {
      nextSteps.splice(1, 0, installCmd); // Add after cd command
    }
  }

  logger.box(
    nextSteps
      .map((step, i) => `${i + 1}. ${chalk.hex('#FFE600FF')(step)}`)
      .join('\n'),
    '🚀 Get started'
  );

  logger.newLine();
  logger.log('Happy coding! 🎨✨');
  logger.newLine();
}

// CLI Setup
const program = new Command();
const require = createRequire(import.meta.url);
const packageJson = require('../package.json');
const CLI_VERSION = packageJson.version;

program
  .name('create-sumit-app')
  .description(
    "✨ A beautiful CLI to bootstrap projects from Sumit.app's project templates"
  )
  .version(CLI_VERSION)
  .argument('[project-name]', 'The name of the project to create')
  .option(
    '-t, --template <template>',
    'Template to use (default, react-native, nextjs, minimal)'
  )
  .option(
    '-p, --package-manager <manager>',
    'Package manager to use (npm, yarn, pnpm, bun)'
  )
  .option('-v, --verbose', 'Enable verbose logging')
  // .option('--no-git', 'Skip git repository initialization')
  .option('--skip-install', 'Skip dependency installation')
  .action(async (projectName, options) => {
    await createProject(projectName, options);
  });

// Config command
program
  .command('config')
  .description('Manage CLI configuration')
  .option('-l, --list', 'List current configuration')
  .option('-s, --set <key=value>', 'Set configuration value')
  .option('-r, --reset', 'Reset configuration to defaults')
  .action(async (options) => {
    const logger = new Logger();

    if (options.list) {
      await showConfig(logger);
      return;
    }

    if (options.reset) {
      await resetConfig();
      logger.success('Configuration reset to defaults');
      return;
    }

    if (options.set) {
      const [key, value] = options.set.split('=');
      if (!key || value === undefined) {
        logger.error('Invalid format. Use: --set key=value');
        return;
      }

      // Validate configuration keys
      const validKeys = [
        'defaultTemplate',
        'packageManager',
        // 'git',
        'verbose',
        'skipUpdateCheck',
      ];
      if (!validKeys.includes(key)) {
        logger.error(`Invalid configuration key: ${key}`);
        logger.info(`Valid keys: ${validKeys.join(', ')}`);
        return;
      }

      // Parse boolean values
      let parsedValue: any = value;
      if (value === 'true' || value === 'false') {
        parsedValue = value === 'true';
      }

      await updateConfig(key, parsedValue);
      logger.success(
        `Configuration updated: ${chalk.cyan(key)} = ${chalk.green(String(parsedValue))}`
      );
      logger.info(`Config file: ${chalk.gray(getConfigPath())}`);
    }
  });

// Templates command
program
  .command('templates')
  .description('List available templates')
  .action(() => {
    listTemplates();
  });

// Info command
program
  .command('info')
  .description('Display environment info')
  .action(async () => {
    const logger = new Logger();
    const packageJson = await fs.readJson(
      path.join(__dirname, '..', 'package.json')
    );

    logger.banner();

    logger.box(
      `Version: ${packageJson.version}\n` +
        `Node: ${process.version}\n` +
        `Platform: ${process.platform}\n` +
        `Architecture: ${process.arch}\n` +
        `Config: ${getConfigPath()}`,
      '🔍 Environment Info'
    );
  });

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  const logger = new Logger();
  logger.error(`Unexpected error: ${error.message}`);
  logger.debug(error.stack || '');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  const logger = new Logger();
  logger.error(`Unhandled rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});

program.parse(process.argv);
