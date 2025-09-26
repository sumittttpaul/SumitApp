#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { Command } from 'commander';
import { execa } from 'execa';
import prompts from 'prompts';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';

import { Logger } from './lib/logger.js';
import { TEMPLATES, getTemplate, listTemplates } from './lib/templates.js';
import {
  loadConfig,
  updateConfig,
  resetConfig,
  showConfig,
  getConfigPath,
} from './lib/config.js';
import {
  detectPackageManager,
  getPackageManagerInfo,
  checkForUpdates,
  isDirectoryEmpty,
  validateProjectName,
  formatDuration,
  initializeGitRepository,
} from './lib/utils.js';
import { CreateProjectOptions, Template, Config } from './types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getTemplatePath(template: Template): string {
  return template.path || `templates/${template.name}`;
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
  logger.info('🎨 Choose a template for your project:');
  logger.newLine();

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
    // Validate provided project name
    const validation = await validateProjectName(targetDir);
    if (!validation.valid) {
      logger.error(validation.message!);
      process.exit(1);
    }
  }

  // Type guard to ensure targetDir is defined
  if (!targetDir) {
    logger.error('Project name is required');
    process.exit(1);
  }

  const projectPath = path.resolve(process.cwd(), targetDir);
  const relativeProjectPath = path.relative(process.cwd(), projectPath);
  const projectDirForDisplay = relativeProjectPath || 'current directory';

  logger.step(1, 5, `Creating project in ${chalk.cyan(projectDirForDisplay)}`);

  // Check if directory exists and is not empty
  if (await fs.pathExists(projectPath)) {
    if (!(await isDirectoryEmpty(projectPath))) {
      logger.error(`Directory "${targetDir}" already exists and is not empty.`);

      const { overwrite } = await prompts({
        type: 'confirm',
        name: 'overwrite',
        message: 'Remove existing files and continue?',
        initial: false,
      });

      if (overwrite) {
        await fs.emptyDir(projectPath);
        logger.success('Existing files removed');
      } else {
        logger.warn('Project creation cancelled.');
        process.exit(0);
      }
    }
  }

  // Select template
  const template = await selectTemplate(config, logger, options.template);
  logger.step(2, 5, `Using template: ${chalk.magenta(template.name)}`);

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
    logger.verbose(`Cloning from: ${template.url}`);

    // For templates with subdirectories, use sparse checkout
    if (template.url.includes('SumitApp.git')) {
      // Step 1: Clone with no checkout
      await execa(
        'git',
        ['clone', '--no-checkout', '--depth=1', template.url, targetDir],
        {
          stdio: options.verbose ? 'inherit' : 'pipe',
        }
      );

      // Step 2: Configure sparse checkout
      await execa('git', ['sparse-checkout', 'init'], {
        cwd: projectPath,
        stdio: options.verbose ? 'inherit' : 'pipe',
      });

      // Step 3: Set the specific template directory
      const templatePath = getTemplatePath(template); // e.g., "templates/default"
      await execa('git', ['sparse-checkout', 'set', templatePath], {
        cwd: projectPath,
        stdio: options.verbose ? 'inherit' : 'pipe',
      });

      // Step 4: Checkout the files
      await execa('git', ['checkout'], {
        cwd: projectPath,
        stdio: options.verbose ? 'inherit' : 'pipe',
      });

      // Step 5: Move files from subdirectory to root
      const templateDir = path.join(projectPath, templatePath);
      if (await fs.pathExists(templateDir)) {
        const files = await fs.readdir(templateDir);
        for (const file of files) {
          await fs.move(
            path.join(templateDir, file),
            path.join(projectPath, file)
          );
        }
        // Clean up the empty template directory structure
        await fs.remove(path.join(projectPath, 'templates'));
      }
    } else {
      // Standard clone for standalone repositories
      await execa('git', ['clone', '--depth=1', template.url, targetDir], {
        stdio: options.verbose ? 'inherit' : 'pipe',
      });
    }

    downloadSpinner.succeed(chalk.green('Template downloaded successfully!'));
  } catch (error) {
    downloadSpinner.fail(chalk.red('Failed to download template'));
    logger.error(`Git clone failed: ${error}`);
    logger.info(
      'Make sure you have git installed and the repository is accessible.'
    );
    process.exit(1);
  }

  // Clean up git directory
  await fs.remove(path.join(projectPath, '.git'));
  logger.verbose('Removed template .git directory');

  // Detect package manager
  const packageManager =
    options.packageManager ||
    config.packageManager ||
    (await detectPackageManager(logger));
  const pmInfo = getPackageManagerInfo(packageManager as any);

  logger.step(3, 5, `Using package manager: ${chalk.blue(packageManager)}`);

  // Install dependencies
  if (!options.skipInstall) {
    const installSpinner = ora({
      text: `Installing dependencies with ${packageManager}...`,
      spinner: 'bouncingBar',
    }).start();

    try {
      await execa(pmInfo.command, pmInfo.installArgs, {
        cwd: projectPath,
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
  logger.step(4, 5, 'Initializing git repository...');
  if (options.git !== false && config.git !== false) {
    const gitSuccess = await initializeGitRepository(projectPath, logger);
    if (gitSuccess) {
      logger.success('Git repository initialized');
    } else {
      logger.warn(
        'Git initialization failed, but project was created successfully'
      );
    }
  } else {
    logger.info('Skipped git initialization');
  }

  // Success message
  const duration = formatDuration(Date.now() - startTime);
  logger.step(5, 5, 'Project setup complete!');

  logger.newLine();
  logger.success(
    `🎉 Successfully created ${chalk.magenta(targetDir)} in ${chalk.green(duration)}`
  );
  logger.newLine();

  // Next steps
  const nextSteps = [
    `cd ${targetDir}`,
    `${pmInfo.command} ${pmInfo.name === 'npm' ? 'run ' : ''}dev`,
  ];

  if (options.skipInstall) {
    nextSteps.splice(1, 0, `${pmInfo.command} ${pmInfo.installArgs.join(' ')}`);
  }

  logger.box(
    nextSteps.map((step, i) => `${i + 1}. ${chalk.cyan(step)}`).join('\n'),
    '🚀 Get started'
  );

  logger.newLine();
  logger.info('Happy coding! 🎨✨');
}

// CLI Setup
const program = new Command();

program
  .name('create-sumit-app')
  .description(
    "✨ A beautiful CLI to bootstrap projects from Sumit.app's project templates"
  )
  .version('1.0.0')
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
  .option('--no-git', 'Skip git repository initialization')
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
        'git',
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
