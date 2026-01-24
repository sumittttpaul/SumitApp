const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
  minifierConfig: {
    keep_classnames: false,
    keep_fnames: false,
    mangle: true,
    compress: {
      drop_console: false, // Let Babel handle this
      drop_debugger: true,
      sequences: true,
      conditionals: true,
      booleans: true,
      unused: true,
    },
  },
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...config.resolver.sourceExts, "svg"],
};

module.exports = wrapWithReanimatedMetroConfig(withNativewind(config));
