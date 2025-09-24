import { ConfigPlugin, withMainActivity, withAndroidStyles, createRunOncePlugin } from "@expo/config-plugins";

const sumit_NavigationBar: ConfigPlugin = (config) => {
  config = withMainActivity(config, (mainActivityConfig) => {
    let mainActivity = mainActivityConfig.modResults;

    if (typeof mainActivity === "object" && typeof mainActivity.contents === "string") {
      let content = mainActivity.contents;

      const insertCode = `
      if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.KITKAT) {
        getWindow().setFlags(android.view.WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS, android.view.WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
      }`;

      const onCreateRegex = /super\.onCreate\(\s*(savedInstanceState|null)\s*\)\s*;?/;
      const match = content.match(onCreateRegex);

      if (match && match[0]) {
        content = content.replace(match[0], `${match[0]}\n${insertCode}`);
        mainActivity.contents = content;
      } else {
        console.warn(
          'Could not find target "super.onCreate(savedInstanceState OR null)" in MainActivity. Please check the MainActivity file content.',
        );
      }
    } else {
      console.error("Expected mainActivity to be an object with a 'contents' string property, but got:", mainActivity);
    }
    return mainActivityConfig;
  });

  config = withAndroidStyles(config, (stylesConfig) => {
    const styles = stylesConfig.modResults;
    if (styles && styles.resources && Array.isArray(styles.resources.style)) {
      const theme = styles.resources.style.find((s: any) => s && s.$ && s.$.name === "AppTheme");
      if (theme) {
        theme.item = theme.item || [];
        if (!theme.item.find((item: any) => item && item.$ && item.$.name === "android:enforceNavigationBarContrast")) {
          theme.item.push({
            _: "false",
            $: { name: "android:enforceNavigationBarContrast" },
          });
        }
      } else {
        console.warn("Could not find AppTheme in styles.xml");
      }
    } else {
      console.warn("styles.xml structure is not as expected. styles.resources.style is not an array or is missing.");
    }
    stylesConfig.modResults = styles;
    return stylesConfig;
  });

  return config;
};

export default createRunOncePlugin(sumit_NavigationBar, "sumit-navigation-bar", "1.0.0");
