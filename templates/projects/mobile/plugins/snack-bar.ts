import { ConfigPlugin, withDangerousMod, withAppBuildGradle, createRunOncePlugin } from "@expo/config-plugins";
import { findNodeModuleFile, getRootNodeModulePath } from "./lib/utils";
import * as path from "path";
import * as fs from "fs";

const sumit_Snackbar: ConfigPlugin = (config) => {
  config = withAppBuildGradle(config, (config) => {
    const buildGradle = config.modResults.contents;
    const dependency = "implementation 'com.google.android.material:material:1.12.0'";

    if (!buildGradle.includes(dependency)) {
      config.modResults.contents = buildGradle.replace(/dependencies\s*{/, `dependencies {\n    ${dependency}`);
    }
    return config;
  });

  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const { projectRoot } = config.modRequest;

      const libraryRootPath = getRootNodeModulePath(projectRoot, "react-native-snackbar");
      const libraryPath = path.join(libraryRootPath, "android");

      // Copy custom layout file
      const sourceLayoutPath = path.join(projectRoot, "plugins/assets/snack-bar/layout/custom_snackbar_view.xml");
      const destLayoutDir = path.join(libraryPath, "src/main/res/layout");
      fs.mkdirSync(destLayoutDir, { recursive: true });
      fs.copyFileSync(sourceLayoutPath, path.join(destLayoutDir, "custom_snackbar_view.xml"));

      // Copy all drawable files
      const sourceDrawableDir = path.join(projectRoot, "plugins/assets/snack-bar/drawable");
      const destDrawableDir = path.join(libraryPath, "src/main/res/drawable");
      fs.mkdirSync(destDrawableDir, { recursive: true });
      if (fs.existsSync(sourceDrawableDir)) {
        fs.readdirSync(sourceDrawableDir).forEach((file) => {
          if (file.endsWith(".xml")) {
            fs.copyFileSync(path.join(sourceDrawableDir, file), path.join(destDrawableDir, file));
          }
        });
      }

      const sourceModulePath = path.join(projectRoot, "plugins/assets/snack-bar/SnackbarModule.java");
      const destModulePath = path.join(libraryPath, "src/main/java/com/azendoo/reactnativesnackbar/SnackbarModule.java");
      fs.mkdirSync(path.dirname(destModulePath), { recursive: true });
      fs.copyFileSync(sourceModulePath, destModulePath);

      const snackbarTsPath = findNodeModuleFile(projectRoot, "react-native-snackbar", "src/index.d.ts");
      if (snackbarTsPath) {
        let tsContent = fs.readFileSync(snackbarTsPath, "utf-8");
        if (!tsContent.includes("icon?: string;")) {
          tsContent = tsContent.replace(
            "action?: SnackbarAction;",
            `action?: SnackbarAction;

            /**
             * The name of a drawable resource to be used as an icon.
             * This should be the filename without the extension.
             * @example 'ic_custom_bell'
             */
            icon?: string;

            /**
             * The name of a drawable resource to be used as a close icon.
             * This should be the filename without the extension.
             * @example 'ic_custom_close'
             */
            closeIcon?: string;`,
          );
          fs.writeFileSync(snackbarTsPath, tsContent);
        }
      }

      const snackbarJsPath = findNodeModuleFile(projectRoot, "react-native-snackbar", "lib/index.js");
      if (snackbarJsPath) {
        let jsContent = fs.readFileSync(snackbarJsPath, "utf-8");
        if (!jsContent.includes("icon: options.icon")) {
          jsContent = jsContent.replace(
            "textAlignCenter,",
            "textAlignCenter,\n      icon: options.icon,\n      closeIcon: options.closeIcon,\n      marginBottom: options.marginBottom,",
          );
          fs.writeFileSync(snackbarJsPath, jsContent);
        }
      }

      return config;
    },
  ]);

  return config;
};

export default createRunOncePlugin(sumit_Snackbar, "sumit-snack-bar", "1.0.0");
