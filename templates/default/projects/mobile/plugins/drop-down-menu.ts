import { ConfigPlugin, withDangerousMod, createRunOncePlugin } from "@expo/config-plugins";
import { copyFiles, getRootNodeModulePath } from "./lib/utils";
import * as path from "path";
import * as fs from "fs";

const sumit_DropDownMenu: ConfigPlugin = (config) => {
  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const { projectRoot } = config.modRequest;

      const srcResDir = path.join(projectRoot, "plugins/assets/drop-down-menu");
      const sourceMenuViewPath = path.join(projectRoot, "plugins/assets/drop-down-menu/MenuView.kt");
      const sourceMenuViewManagerBasePath = path.join(projectRoot, "plugins/assets/drop-down-menu/MenuViewManagerBase.kt");

      const menuPackageRootPath = getRootNodeModulePath(projectRoot, "@react-native-menu/menu");
      const menuPackagePath = path.join(menuPackageRootPath, "android");
      const destResDir = path.join(menuPackagePath, "src/main/res");
      const destMenuViewPath = path.join(menuPackagePath, "src/main/java/com/reactnativemenu/MenuView.kt");
      const destMenuViewManagerBasePath = path.join(menuPackagePath, "src/main/java/com/reactnativemenu/MenuViewManagerBase.kt");

      // 1. Copy all custom resource files
      await copyFiles(srcResDir, destResDir);

      // 2. Copy the custom MenuView.kt file
      if (fs.existsSync(sourceMenuViewPath)) {
        const newMenuViewContent = await fs.promises.readFile(sourceMenuViewPath, "utf-8");
        await fs.promises.writeFile(destMenuViewPath, newMenuViewContent);
      }

      // 3. Copy the custom MenuViewManagerBase.kt file directly
      if (fs.existsSync(sourceMenuViewManagerBasePath)) {
        const newMenuViewManagerBaseContent = await fs.promises.readFile(sourceMenuViewManagerBasePath, "utf-8");
        await fs.promises.writeFile(destMenuViewManagerBasePath, newMenuViewManagerBaseContent);
      } else {
        console.warn("⚠️  MenuViewManagerBase.kt not found in assets folder. Please create it at:", sourceMenuViewManagerBasePath);
      }

      return config;
    },
  ]);

  return config;
};

export default createRunOncePlugin(sumit_DropDownMenu, "sumit-drop-down-menu", "1.0.0");
