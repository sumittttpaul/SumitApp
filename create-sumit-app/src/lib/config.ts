import { Config } from "../types/index.js";
import { Logger } from "./logger.js";
import fs from "fs-extra";
import path from "path";

const CONFIG_DIR_NAME = "sumitapp";
const CONFIG_FILE_NAME = "config.json";
const CONFIG_PATH = path.join(CONFIG_DIR_NAME, CONFIG_FILE_NAME);

export async function loadConfig(): Promise<Config> {
  const configPath = path.join(process.cwd(), CONFIG_PATH);

  try {
    if (await fs.pathExists(configPath)) {
      return await fs.readJson(configPath);
    }
  } catch (error) {
    // Silently ignore config loading errors
  }

  return {};
}

export async function saveConfig(config: Config): Promise<void> {
  const configPath = path.join(process.cwd(), CONFIG_PATH);
  const configDir = path.join(process.cwd(), CONFIG_DIR_NAME);

  await fs.ensureDir(configDir);
  await fs.writeJson(configPath, config, { spaces: 2 });
}

export async function updateConfig(key: string, value: any): Promise<void> {
  const config = await loadConfig();
  (config as any)[key] = value;
  await saveConfig(config);
}

export async function resetConfig(): Promise<void> {
  const configPath = path.join(process.cwd(), CONFIG_PATH);

  try {
    await fs.remove(configPath);
  } catch (error) {
    // Ignore errors if file doesn't exist
  }
}

export function getConfigPath(): string {
  return CONFIG_PATH;
}

export async function showConfig(logger: Logger): Promise<void> {
  const config = await loadConfig();

  if (Object.keys(config).length === 0) {
    logger.info("No configuration found. Using defaults.");
    return;
  }

  logger.box(JSON.stringify(config, null, 2), "🔧 Current Configuration");
}
