const path = require("path");
const fs = require("fs");

module.exports = function (api) {
  api.cache(true);

  // Dynamically find all packages
  const packagesDir = path.resolve(__dirname, "../../packages");
  const packageAliases = {};

  if (fs.existsSync(packagesDir)) {
    const packages = fs.readdirSync(packagesDir).filter((dir) => fs.statSync(path.join(packagesDir, dir)).isDirectory());

    // Generate aliases dynamically
    packages.forEach((pkg) => {
      packageAliases[`@packages/${pkg}`] = `../../packages/${pkg}/src`;
    });
  }

  const plugins = [
    ["module-resolver", { root: ["."], alias: { "@/": "./src", ...packageAliases }, extensions: [".js", ".jsx", ".ts", ".tsx"] }],
    "react-native-paper/babel",
  ];

  if (process.env.NODE_ENV === "production") plugins.push(["transform-remove-console", { exclude: ["error", "warn"] }]);
  plugins.push("react-native-worklets/plugin");

  return { presets: [["babel-preset-expo"]], plugins };
};
