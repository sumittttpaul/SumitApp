import { ConfigPlugin, withDangerousMod, withAndroidStyles, createRunOncePlugin } from "@expo/config-plugins";
import * as path from "path";
import * as fs from "fs";

const sumit_MaterialTheme: ConfigPlugin = (config) => {
  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const { projectRoot } = config.modRequest;

      const colorsXmlPath = path.join(projectRoot, "android/app/src/main/res/values/colors.xml");
      const colorsXmlContent = `
        <resources>
            <color name="picker_background">#252525</color>
            <color name="picker_text_primary">#FFFFFF</color>
            <color name="picker_selected_bg">#4D4D4D</color>
        </resources>
        `;
      fs.mkdirSync(path.dirname(colorsXmlPath), { recursive: true });
      fs.writeFileSync(colorsXmlPath, colorsXmlContent.trim());
      return config;
    },
  ]);

  config = withAndroidStyles(config, (stylesConfig) => {
    const styles = stylesConfig.modResults;
    if (!styles.resources.style) styles.resources.style = [];

    styles.resources.style = styles.resources.style.filter((s: any) => s.$.name !== "App.Picker.Button");
    styles.resources.style.push({
      $: { name: "App.Picker.Button", parent: "Widget.Material3.Button.TextButton.Dialog" },
      item: [{ $: { name: "android:textColor" }, _: "@color/picker_text_primary" }],
    });

    styles.resources.style = styles.resources.style.filter((s: any) => s.$.name !== "App.DatePicker.Theme");
    styles.resources.style.push({
      $: { name: "App.DatePicker.Theme", parent: "ThemeOverlay.Material3.MaterialCalendar" },
      item: [
        { $: { name: "colorSurface" }, _: "@color/picker_background" },
        { $: { name: "colorSurfaceContainerHigh" }, _: "@color/picker_background" },
        { $: { name: "colorOnSurface" }, _: "@color/picker_text_primary" },
        { $: { name: "colorPrimary" }, _: "@color/picker_selected_bg" },
        { $: { name: "colorOnPrimary" }, _: "@color/picker_text_primary" },
        { $: { name: "colorOnSurfaceVariant" }, _: "@color/picker_text_primary" },
        { $: { name: "buttonBarPositiveButtonStyle" }, _: "@style/App.Picker.Button" },
        { $: { name: "buttonBarNegativeButtonStyle" }, _: "@style/App.Picker.Button" },
        // The value is a float from 0.0 (transparent) to 1.0 (opaque).
        { $: { name: "android:backgroundDimAmount" }, _: "0.7" },
      ],
    });

    const appTheme = styles.resources.style.find((style: any) => style.$.name === "AppTheme");
    if (appTheme) {
      appTheme.$.parent = "Theme.Material3.DayNight.NoActionBar";
      if (!appTheme.item) appTheme.item = [];
      appTheme.item = appTheme.item.filter((item: any) => item.$.name !== "materialCalendarTheme");
      appTheme.item.push({ $: { name: "materialCalendarTheme" }, _: "@style/App.DatePicker.Theme" });
    }
    stylesConfig.modResults = styles;
    return stylesConfig;
  });

  return config;
};

export default createRunOncePlugin(sumit_MaterialTheme, "sumit-material-theme", "1.0.0");
