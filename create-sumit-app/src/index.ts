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

import {
  PROJECTS,
  PRESETS,
  BASE_TEMPLATE,
  getPreset,
  getProject,
  listPresets,
  listProjects,
  getTemplate,
  listTemplates,
} from './lib/templates.js';
import { CreateProjectOptions, Preset, Config } from './types/index.js';
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
} from './lib/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function cleanupGitDirectory(
  projectPath: string,
  logger: Logger,
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
            `Git cleanup failed, retrying... (${retries} attempts left)`,
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));

          try {
            await makeGitFilesWritable(gitDir);
          } catch (chmodError) {
            // Ignore chmod errors
          }
        } else {
          logger.warn('Could not remove .git directory automatically');
          logger.info(
            'You may need to manually delete the .git folder if it exists',
          );
          return;
        }
      } else {
        logger.verbose(`Git cleanup error: ${error.message}`);
        return;
      }
    }
  }
}

async function makeGitFilesWritable(gitDir: string): Promise<void> {
  try {
    const files = await fs.readdir(gitDir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(gitDir, file.name);

      if (file.isDirectory()) {
        await makeGitFilesWritable(fullPath);
      } else {
        try {
          await fs.chmod(fullPath, 0o666);
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
  packageManagerName?: string,
): Promise<string> {
  const availableManagers = [
    {
      name: 'bun',
      description: '⚡ Ultra-fast JavaScript runtime and package manager',
    },
    {
      name: 'pnpm',
      description: '📦 Fast, disk space efficient package manager',
    },
    {
      name: 'yarn',
      description: '🐈 Fast, reliable, and secure dependency management',
    },
    {
      name: 'npm',
      description: '📦 The default Node.js package manager',
    },
  ];

  if (packageManagerName) {
    const manager = availableManagers.find(
      (m) => m.name === packageManagerName,
    );
    if (!manager) {
      logger.error(`Package manager "${packageManagerName}" not found.`);
      logger.info('Available package managers:');
      availableManagers.forEach((m) =>
        logger.info(`  • ${m.name} - ${m.description}`),
      );
      process.exit(1);
    }
    logger.verbose(`Using CLI specified package manager: ${manager.name}`);
    return manager.name;
  }

  if (config.packageManager) {
    logger.verbose(
      `Using config default package manager: ${config.packageManager}`,
    );
    return config.packageManager;
  }

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
    initial: 0,
  });

  if (!selectedManager) {
    logger.error('Package manager selection cancelled');
    process.exit(0);
  }

  return selectedManager;
}

async function selectPresetOrProjects(
  config: Config,
  logger: Logger,
  presetName?: string,
  projectNames?: string[],
): Promise<string[]> {
  // If specific projects provided via CLI, use them
  if (projectNames && projectNames.length > 0) {
    const validProjects = projectNames.filter((p) => PROJECTS[p]);
    if (validProjects.length !== projectNames.length) {
      const invalid = projectNames.filter((p) => !PROJECTS[p]);
      logger.error(`Invalid project(s): ${invalid.join(', ')}`);
      logger.info(`Available projects: ${Object.keys(PROJECTS).join(', ')}`);
      process.exit(1);
    }
    return validProjects;
  }

  // If preset specified via CLI, use it
  if (presetName) {
    const preset = getPreset(presetName);
    if (!preset) {
      logger.error(`Preset "${presetName}" not found.`);
      logger.info('Available presets:');
      PRESETS.forEach((p) => logger.info(`  • ${p.name} - ${p.description}`));
      process.exit(1);
    }
    if (preset.name === 'custom') {
      return await selectProjects(logger);
    }
    return preset.projects;
  }

  // If default preset in config, use it
  if (config.defaultPreset) {
    const preset = getPreset(config.defaultPreset);
    if (preset && preset.name !== 'custom') {
      logger.verbose(`Using default preset: ${preset.name}`);
      return preset.projects;
    }
  }

  // Interactive project selection - show multi-select checkboxes directly
  return await selectProjects(logger);
}

async function selectProjects(logger: Logger): Promise<string[]> {
  logger.log(
    '📦 Select projects to include (space to toggle, enter to confirm):',
  );

  const { selectedProjects } = await prompts({
    type: 'multiselect',
    name: 'selectedProjects',
    message: 'Choose projects',
    choices: Object.values(PROJECTS).map((project) => ({
      title: project.name,
      description: project.description,
      value: project.name,
      selected: true, // All selected by default
    })),
    min: 1,
    hint: '- Space to toggle, Enter to confirm',
  });

  if (!selectedProjects || selectedProjects.length === 0) {
    logger.error('At least one project must be selected');
    process.exit(0);
  }

  return selectedProjects;
}

function generatePackageJson(
  projectName: string,
  selectedProjects: string[],
  packageManager: string,
): object {
  const hasMobile = selectedProjects.includes('mobile');

  // Package manager versions
  const packageManagerVersions: Record<string, string> = {
    bun: 'bun@1.2.22',
    pnpm: 'pnpm@9.15.0',
    yarn: 'yarn@4.6.0',
    npm: 'npm@10.9.2',
  };

  // Clean commands per package manager
  const cleanCommands: Record<string, string> = {
    bun: 'turbo run clean && node scripts/clean.js && bun pm cache rm',
    pnpm: 'turbo run clean && node scripts/clean.js && pnpm store prune',
    yarn: 'turbo run clean && node scripts/clean.js && yarn cache clean',
    npm: 'turbo run clean && node scripts/clean.js && npm cache clean --force',
  };

  const packageJson: any = {
    name: projectName,
    version: '1.0.0',
    private: true,
    strict: true,
    scripts: {
      dev: 'turbo run dev',
      build: 'turbo run build',
      lint: 'turbo run lint',
      format: 'prettier --write .',
      'check-types': 'turbo run check-types',
      clean: cleanCommands[packageManager] || cleanCommands.bun,
    },
    devDependencies: {
      '@packages/eslint-config': 'workspace:^',
      '@packages/typescript-config': 'workspace:^',
      '@types/node': '^22.18.12',
      prettier: '^3.6.2',
      'prettier-plugin-tailwindcss': '^0.7.1',
      rimraf: '^6.0.1',
      turbo: '^2.5.8',
      typescript: '^5.9.3',
    },
    engines: {
      node: '>=22',
    },
    workspaces: ['projects/*', 'packages/*'],
    packageManager:
      packageManagerVersions[packageManager] || packageManagerVersions.bun,
  };

  // Add expo-dev-menu resolution only if mobile project is selected
  if (hasMobile) {
    packageJson.resolutions = {
      'expo-dev-menu': '^7.0.10',
    };
  }

  return packageJson;
}

async function generatePackageManagerConfig(
  projectPath: string,
  packageManager: string,
  logger: Logger,
): Promise<void> {
  switch (packageManager) {
    case 'yarn':
      // Yarn: Use node-modules linker instead of PnP
      const yarnrcContent = `# Yarn configuration - using node-modules for compatibility
nodeLinker: node-modules
`;
      await fs.writeFile(path.join(projectPath, '.yarnrc.yml'), yarnrcContent);
      logger.verbose('Created .yarnrc.yml with node-modules linker');
      break;

    case 'pnpm':
      // pnpm: Use hoisted node_modules for compatibility
      const npmrcContent = `# pnpm configuration - hoisted node_modules for compatibility
node-linker=hoisted
shamefully-hoist=true
`;
      await fs.writeFile(path.join(projectPath, '.npmrc'), npmrcContent);
      
      // pnpm requires pnpm-workspace.yaml instead of workspaces in package.json
      const pnpmWorkspaceContent = `# pnpm workspace configuration
packages:
  - 'projects/*'
  - 'packages/*'
`;
      await fs.writeFile(path.join(projectPath, 'pnpm-workspace.yaml'), pnpmWorkspaceContent);
      logger.verbose('Created .npmrc and pnpm-workspace.yaml');
      break;

    case 'bun':
      // Bun: Add config for better compatibility on Windows
      const bunfigContent = `# Bun configuration
[install]
# Use standard node_modules structure
`;
      await fs.writeFile(path.join(projectPath, 'bunfig.toml'), bunfigContent);
      logger.verbose('Created bunfig.toml');
      break;

    case 'npm':
      // npm: Uses node_modules by default, no special config needed
      logger.verbose('npm uses node_modules by default, no config needed');
      break;

    default:
      break;
  }
}

async function createProject(
  projectName?: string,
  options: CreateProjectOptions = {},
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

  // Handle legacy --template option
  let presetName = options.preset;
  if (options.template && !presetName) {
    const template = getTemplate(options.template);
    if (template) {
      presetName = template.name;
      logger.warn(`--template is deprecated, use --preset instead`);
    }
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
    if (targetDir !== '.') {
      const validation = await validateProjectName(targetDir);
      if (!validation.valid) {
        logger.error(validation.message!);
        process.exit(1);
      }
    }
  }

  if (!targetDir) {
    logger.error('Project name is required');
    process.exit(1);
  }

  // Handle current directory installation
  let resolvedProjectPath: string;
  let displayPath: string;

  if (targetDir === '.') {
    resolvedProjectPath = process.cwd();
    displayPath = 'current directory';

    const currentDirName = path.basename(resolvedProjectPath);
    const validation = await validateProjectName(currentDirName);
    if (!validation.valid) {
      logger.error(
        `Current directory name "${currentDirName}" is not a valid package name.`,
      );
      logger.error(validation.message!);
      logger.info(
        'Please rename your directory to use lowercase letters, numbers, hyphens, underscores, and dots only.',
      );
      process.exit(1);
    }
  } else {
    resolvedProjectPath = path.resolve(process.cwd(), targetDir);
    const relativeProjectPath = path.relative(
      process.cwd(),
      resolvedProjectPath,
    );
    displayPath = relativeProjectPath || 'current directory';
  }

  logger.newLine();
  logger.step(1, 5, `Creating project in ${chalk.cyan(displayPath)}`);

  // Check if directory exists and is not empty
  if (await fs.pathExists(resolvedProjectPath)) {
    if (!(await isDirectoryEmpty(resolvedProjectPath))) {
      logger.error(
        `Directory "${targetDir === '.' ? 'current directory' : targetDir}" already exists and is not empty.`,
      );

      const { overwrite } = await prompts({
        type: 'confirm',
        name: 'overwrite',
        message: 'Remove existing files and continue?',
        initial: false,
      });

      if (overwrite) {
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

  // Select preset or custom projects
  logger.newLine();
  const selectedProjects = await selectPresetOrProjects(
    config,
    logger,
    presetName,
    options.projects,
  );

  logger.newLine();
  logger.step(
    2,
    5,
    `Selected projects: ${chalk.cyan(selectedProjects.join(', '))}`,
  );

  // Download base template
  const baseSpinner = ora({
    text: 'Downloading base template...',
    spinner: 'dots12',
  }).start();

  try {
    await fs.ensureDir(resolvedProjectPath);

    const repoMatch = BASE_TEMPLATE.url.match(
      /github\.com[\/:]([\w-]+)\/([\w-]+)/,
    );
    if (!repoMatch) {
      throw new Error('Invalid GitHub repository URL');
    }

    const [, owner, repo] = repoMatch;
    const repoPath = `${owner}/${repo.replace('.git', '')}/${BASE_TEMPLATE.path}`;

    const emitter = degit(repoPath, {
      cache: false,
      force: true,
      verbose: options.verbose,
    });

    await emitter.clone(resolvedProjectPath);

    baseSpinner.succeed(chalk.green('Base template downloaded!'));
  } catch (error: any) {
    baseSpinner.fail(chalk.red('Failed to download base template'));
    logger.error(`Download failed: ${error.message || error}`);
    process.exit(1);
  }

  // Download selected projects
  logger.newLine();
  logger.step(3, 5, 'Downloading selected projects...');

  const projectsDir = path.join(resolvedProjectPath, 'projects');
  await fs.ensureDir(projectsDir);

  for (const projectName of selectedProjects) {
    const project = PROJECTS[projectName];
    const projectSpinner = ora({
      text: `Downloading ${projectName}...`,
      spinner: 'dots',
    }).start();

    try {
      const repoMatch = BASE_TEMPLATE.url.match(
        /github\.com[\/:]([\w-]+)\/([\w-]+)/,
      );
      if (!repoMatch) {
        throw new Error('Invalid GitHub repository URL');
      }

      const [, owner, repo] = repoMatch;
      const repoPath = `${owner}/${repo.replace('.git', '')}/${project.path}`;

      const emitter = degit(repoPath, {
        cache: false,
        force: true,
        verbose: options.verbose,
      });

      const projectTargetPath = path.join(projectsDir, project.name);
      await emitter.clone(projectTargetPath);

      projectSpinner.succeed(chalk.green(`Downloaded ${projectName}`));
    } catch (error: any) {
      projectSpinner.fail(chalk.red(`Failed to download ${projectName}`));
      logger.error(`Download failed: ${error.message || error}`);
      process.exit(1);
    }
  }

  // Detect/Select package manager (moved before package.json generation)
  const packageManager = await selectPackageManager(
    config,
    logger,
    options.packageManager,
  );
  const pmInfo = getPackageManagerInfo(packageManager as any);

  // Generate package.json based on selected projects and package manager
  const actualProjectName =
    targetDir === '.' ? path.basename(resolvedProjectPath) : targetDir;
  const packageJsonContent = generatePackageJson(
    actualProjectName,
    selectedProjects,
    packageManager,
  );
  await fs.writeJson(
    path.join(resolvedProjectPath, 'package.json'),
    packageJsonContent,
    { spaces: 2 },
  );
  logger.verbose('Generated package.json with correct configuration');

  // Generate package manager config files to ensure node_modules in root
  await generatePackageManagerConfig(
    resolvedProjectPath,
    packageManager,
    logger,
  );

  // Clean up git directory
  await cleanupGitDirectory(resolvedProjectPath, logger);

  logger.newLine();
  logger.step(4, 5, `Using package manager: ${chalk.cyan(packageManager)}`);

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
        chalk.green('Dependencies installed successfully!'),
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

  // Success message
  const duration = formatDuration(Date.now() - startTime);
  logger.newLine();
  logger.step(5, 5, 'Project setup complete!');

  logger.newLine();
  logger.success(
    `🎉 Successfully created ${chalk.green(actualProjectName)} in ${chalk.green(duration)}`,
  );
  logger.newLine();

  // Next steps
  const nextSteps: string[] = [];

  if (targetDir === '.') {
    nextSteps.push(
      `${pmInfo.command} ${pmInfo.name === 'npm' ? 'run ' : ''}dev`,
    );
  } else {
    nextSteps.push(`cd ${chalk.hex('#FFFFFF')(actualProjectName)}`);
    nextSteps.push(
      `${pmInfo.command} ${pmInfo.name === 'npm' ? 'run ' : ''}dev`,
    );
  }

  if (options.skipInstall) {
    const installCmd = `${pmInfo.command} ${pmInfo.installArgs.join(' ')}`;
    if (targetDir === '.') {
      nextSteps.splice(0, 0, installCmd);
    } else {
      nextSteps.splice(1, 0, installCmd);
    }
  }

  logger.box(
    nextSteps
      .map((step, i) => `${i + 1}. ${chalk.hex('#FFE600FF')(step)}`)
      .join('\n'),
    '🚀 Get started',
  );

  logger.newLine();
  logger.log('Happy coding! 🎨✨');
  logger.newLine();
}

async function addProject(
  projectName: string,
  options: { verbose?: boolean },
): Promise<void> {
  const logger = new Logger(options.verbose);

  logger.banner();

  // Validate project name
  if (!PROJECTS[projectName]) {
    logger.error(`Invalid project: ${projectName}`);
    logger.info(`Available projects: ${Object.keys(PROJECTS).join(', ')}`);
    process.exit(1);
  }

  // Check if we're in a SumitApp project
  const projectsDir = path.join(process.cwd(), 'projects');
  const packagesDir = path.join(process.cwd(), 'packages');

  if (
    !(await fs.pathExists(projectsDir)) ||
    !(await fs.pathExists(packagesDir))
  ) {
    logger.error('This does not appear to be a SumitApp project.');
    logger.info('Run this command from the root of your SumitApp project.');
    process.exit(1);
  }

  // Check if project already exists
  const targetPath = path.join(projectsDir, projectName);
  if (await fs.pathExists(targetPath)) {
    logger.error(`Project "${projectName}" already exists.`);
    process.exit(1);
  }

  // Download the project
  const spinner = ora({
    text: `Adding ${projectName} project...`,
    spinner: 'dots12',
  }).start();

  try {
    const project = PROJECTS[projectName];
    const repoMatch = BASE_TEMPLATE.url.match(
      /github\.com[\/:]([\w-]+)\/([\w-]+)/,
    );
    if (!repoMatch) {
      throw new Error('Invalid GitHub repository URL');
    }

    const [, owner, repo] = repoMatch;
    const repoPath = `${owner}/${repo.replace('.git', '')}/${project.path}`;

    const emitter = degit(repoPath, {
      cache: false,
      force: true,
      verbose: options.verbose,
    });
    await emitter.clone(targetPath);

    spinner.succeed(chalk.green(`Added ${projectName} project successfully!`));

    // Update package.json if adding mobile (needs expo-dev-menu resolution)
    if (projectName === 'mobile') {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath);
        if (!packageJson.resolutions) {
          packageJson.resolutions = {};
        }
        if (!packageJson.resolutions['expo-dev-menu']) {
          packageJson.resolutions['expo-dev-menu'] = '^7.0.10';
          await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
          logger.info('Updated package.json with expo-dev-menu resolution');
        }
      }
    }

    logger.newLine();
    logger.info('Next steps:');
    logger.info('  1. Run: bun install');
    logger.info('  2. Run: bun dev');
  } catch (error: any) {
    spinner.fail(chalk.red(`Failed to add ${projectName} project`));
    logger.error(error.message);
    process.exit(1);
  }
}

// CLI Setup
const program = new Command();
const require = createRequire(import.meta.url);
const packageJson = require('../package.json');
const CLI_VERSION = packageJson.version;

program
  .name('create-sumit-app')
  .description(
    "✨ A beautiful CLI to bootstrap projects from Sumit.app's project templates",
  )
  .version(CLI_VERSION)
  .argument('[project-name]', 'The name of the project to create')
  .option(
    '-p, --preset <preset>',
    'Preset to use (default, mobile-and-backend, website-and-backend, custom)',
  )
  .option(
    '--projects <projects>',
    'Comma-separated list of projects (website, mobile, backend)',
  )
  .option('-m, --package-manager <manager>', 'Package manager to use (bun)')
  .option('-v, --verbose', 'Enable verbose logging')
  .option('--skip-install', 'Skip dependency installation')
  .option('-t, --template <template>', '[DEPRECATED] Use --preset instead')
  .action(async (projectName, options) => {
    // Parse projects option if provided
    if (options.projects) {
      options.projects = options.projects
        .split(',')
        .map((p: string) => p.trim());
    }
    await createProject(projectName, options);
  });

// Add command for adding projects later
program
  .command('add <project>')
  .description(
    'Add a project to an existing SumitApp setup (website, mobile, backend)',
  )
  .option('-v, --verbose', 'Enable verbose logging')
  .action(async (projectName, options) => {
    await addProject(projectName, options);
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

      const validKeys = [
        'defaultPreset',
        'packageManager',
        'verbose',
        'skipUpdateCheck',
      ];
      if (!validKeys.includes(key)) {
        logger.error(`Invalid configuration key: ${key}`);
        logger.info(`Valid keys: ${validKeys.join(', ')}`);
        return;
      }

      let parsedValue: any = value;
      if (value === 'true' || value === 'false') {
        parsedValue = value === 'true';
      }

      await updateConfig(key, parsedValue);
      logger.success(
        `Configuration updated: ${chalk.cyan(key)} = ${chalk.green(String(parsedValue))}`,
      );
      logger.info(`Config file: ${chalk.gray(getConfigPath())}`);
    }
  });

// Presets command
program
  .command('presets')
  .description('List available presets')
  .action(() => {
    listPresets();
  });

// Projects command
program
  .command('projects')
  .description('List available projects')
  .action(() => {
    listProjects();
  });

// Templates command (legacy, for backward compatibility)
program
  .command('templates')
  .description('[DEPRECATED] List available templates (use "presets" instead)')
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
      path.join(__dirname, '..', 'package.json'),
    );

    logger.banner();

    logger.box(
      `Version: ${packageJson.version}\n` +
        `Node: ${process.version}\n` +
        `Platform: ${process.platform}\n` +
        `Architecture: ${process.arch}\n` +
        `Config: ${getConfigPath()}`,
      '🔍 Environment Info',
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
