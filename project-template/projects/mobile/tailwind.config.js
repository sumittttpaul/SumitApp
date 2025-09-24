module.exports = {
  content: ["./src/**/*.{js,ts,tsx}"],
  presets: [require("nativewind/preset")],
  plugins: [],
  theme: {
    extend: {
      colors: {
        layout: "#0a0a0a",
      },
      fontFamily: {
        thin: ["inter-thin"],
        "thin-italic": ["inter-thin-italic"],
        extralight: ["inter-extralight"],
        "extralight-italic": ["inter-extralight-italic"],
        light: ["inter-light"],
        "light-italic": ["inter-light-italic"],
        regular: ["inter-regular"],
        "regular-italic": ["inter-regular-italic"],
        medium: ["inter-medium"],
        "medium-italic": ["inter-medium-italic"],
        semibold: ["inter-semibold"],
        "semibold-italic": ["inter-semibold-italic"],
        bold: ["inter-bold"],
        "bold-italic": ["inter-bold-italic"],
        extrabold: ["inter-extrabold"],
        "extrabold-italic": ["inter-extrabold-italic"],
        black: ["inter-black"],
        "black-italic": ["inter-black-italic"],
      },
    },
  },
};
