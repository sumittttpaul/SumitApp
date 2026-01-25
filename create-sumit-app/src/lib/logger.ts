import gradient from "gradient-string";
import boxen from "boxen";
import chalk from "chalk";

export class Logger {
  private verboseEnabled: boolean;

  constructor(verbose = false) {
    this.verboseEnabled = verbose;
  }

  banner() {
    const banner = `
   ███████╗██╗   ██╗███╗   ███╗██╗████████╗   █████╗ ██████╗ ██████╗   
   ██╔════╝██║   ██║████╗ ████║██║╚══██╔══╝  ██╔══██╗██╔══██╗██╔══██╗  
   ███████╗██║   ██║██╔████╔██║██║   ██║     ███████║██████╔╝██████╔╝  
   ╚════██║██║   ██║██║╚██╔╝██║██║   ██║     ██╔══██║██╔═══╝ ██╔═══╝   
   ███████║╚██████╔╝██║ ╚═╝ ██║██║   ██║ ██╗ ██║  ██║██║     ██║       
   ╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝   ╚═╝ ╚═╝ ╚═╝  ╚═╝╚═╝     ╚═╝       
    `;
    const description = `   🚀 Create beautiful apps in seconds`;
    // console.log(gradient.pastel.multiline(banner));
    console.log(chalk.hex("#505050")(banner));
    console.log(chalk.hex("#FFFFFF")(description));
    // console.log();
  }

  log(message: string) {
    console.log(message);
  }

  info(message: string, icon = "ℹ") {
    console.log(`${chalk.cyan(icon)}  ${message}`);
  }

  success(message: string, icon = "✓") {
    console.log(`${chalk.green(icon)} ${chalk.green(message)}`);
  }

  error(message: string, icon = "✗") {
    console.error(`${chalk.red(icon)} ${chalk.red(message)}`);
  }

  warn(message: string, icon = "⚠") {
    console.log(`${chalk.yellow(icon)}  ${chalk.yellow(message)}`);
  }

  debug(message: string, icon = "🐛") {
    if (this.verboseEnabled) {
      console.log(`${chalk.gray(icon)} ${chalk.gray(message)}`);
    }
  }

  verbose(message: string, icon = "📝") {
    if (this.verboseEnabled) {
      console.log(`${chalk.dim(icon)} ${chalk.dim(message)}`);
    }
  }

  step(step: number, total: number, message: string) {
    const progress = `${chalk.cyan(`[${step}/${total}]`)}`;
    console.log(`${progress} ${message}`);
  }

  newLine() {
    console.log();
  }

  divider() {
    console.log(chalk.gray("─".repeat(60)));
  }

  box(message: string, title?: string) {
    console.log(
      boxen(message, {
        title,
        padding: 1,
        borderColor: "gray",
        borderStyle: "classic", // round
      }),
    );
  }

  gradient(text: string, colors: string[] = ["#ff6b6b", "#4ecdc4"]) {
    return gradient(colors)(text);
  }
}
