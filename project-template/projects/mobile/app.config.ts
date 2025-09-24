import "tsx/cjs";
import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "mobile",
  scheme: "mobile",
  slug: "Mobile",
  version: "1.0.0",
  assetBundlePatterns: ["**/*"],
  orientation: "portrait",
  userInterfaceStyle: "dark",
  icon: "./assets/icon.png",
  platforms: ["android", "ios"],
  experiments: { typedRoutes: true, reactCompiler: true, tsconfigPaths: true, reactServerFunctions: true },
  android: {
    edgeToEdgeEnabled: true,
    package: "com.mobile.app",
    adaptiveIcon: { foregroundImage: "./assets/adaptive-icon.png", backgroundColor: "#0a0a0a" },
  },
  ios: { bundleIdentifier: "com.mobile.app", icon: "./assets/adaptive-icon.png", supportsTablet: true },
  plugins: [
    "expo-font",
    "expo-router",
    ["expo-screen-orientation", { initialOrientation: "DEFAULT" }],
    ["expo-splash-screen", { image: "./assets/splash-icon.png", backgroundColor: "#0a0a0a", imageWidth: 200 }],
    "./plugins/drop-down-menu.ts",
    "./plugins/navigation-bar.ts",
    "./plugins/snack-bar.ts",
    "./plugins/material-theme.ts",
  ],
});
