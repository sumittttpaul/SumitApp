#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import prompts from 'prompts';

const GITHUB_REPO_URL = 'https://github.com/sumittttpaul/Project-Template.git';

const program = new Command();

program
  .name('create-sumit-app')
  .description('A CLI to bootstrap projects from a Sumit template')
  .argument('[project-name]', 'The name of the project to create')
  .action(async (projectName) => {
    let targetDir = projectName;
    if (!targetDir) {
      const response = await prompts({
        type: 'confirm',
        name: 'useCurrentDir',
        message:
          'No project name specified. Would you like to install in the current directory?',
        initial: true,
      });

      if (response.useCurrentDir) {
        targetDir = '.';
      } else {
        console.log(chalk.yellow('\nInstallation cancelled.'));
        process.exit(0);
      }
    }

    const projectPath = path.resolve(process.cwd(), targetDir);
    const relativeProjectPath = path.relative(process.cwd(), projectPath);
    const projectDirForDisplay =
      relativeProjectPath === ''
        ? 'the current directory'
        : `"${relativeProjectPath}"`;

    console.log(
      `\nCreating a new project in ${chalk.cyan(projectDirForDisplay)}`
    );

    if (relativeProjectPath === '') {
      const files = await fs.readdir(projectPath);
      if (files.length > 0) {
        console.error(
          chalk.red(
            '\nError: The current directory is not empty. Please use a new or empty directory.'
          )
        );
        process.exit(1);
      }
    } else {
      if (await fs.pathExists(projectPath)) {
        console.error(
          chalk.red(`\nError: Directory "${targetDir}" already exists.`)
        );
        process.exit(1);
      }
    }

    const spinner = ora('Downloading template...').start();
    try {
      await execa('git', ['clone', '--depth=1', GITHUB_REPO_URL, targetDir]);
      spinner.succeed(chalk.green('Template downloaded successfully!'));
    } catch (error) {
      spinner.fail(chalk.red('Failed to download template.'));
      console.error(error);
      process.exit(1);
    }

    await fs.remove(path.join(projectPath, '.git'));

    const installSpinner = ora('Installing dependencies...').start();
    try {
      await execa('yarn', ['install'], { cwd: projectPath });
      installSpinner.succeed(
        chalk.green('Dependencies installed successfully!')
      );
    } catch (error) {
      installSpinner.fail(chalk.red('Failed to install dependencies.'));
      console.error(error);
      process.exit(1);
    }

    console.log(chalk.green('\n🎉 Project setup complete!'));
    console.log('To get started, run the following command(s):');
    if (relativeProjectPath !== '') {
      console.log(`\n  ${chalk.cyan(`cd ${targetDir}`)}`);
    }
    console.log(`  ${chalk.cyan('yarn dev')}\n`);
  });

program.parse(process.argv);
