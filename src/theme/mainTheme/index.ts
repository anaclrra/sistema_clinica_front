import { createTheme, type Theme } from "@mui/material";

declare module "@mui/material/styles" {
  interface TypeBackground {
    textField: string;
    card: string;
  }
  interface PaperPropsVariantOverrides {
    default: true;
  }
}
const colors = {
  primary: {
    light: "#13C06A",
    dark: "#1AD866",
  },
  secondary: {
    light: "#039FDD",
    dark: "#039FDD",
  },
};

const mainTheme = (colorMode: boolean): Theme =>
  createTheme({
    typography: {
      fontFamily: `'Lato'`,
    },
    shape: {
      borderRadius: 8,
    },
    palette: {
      mode: colorMode ? "dark" : "light",
      primary: {
        main: colorMode ? colors.primary.dark : colors.primary.light,
      },
      secondary: {
        main: colorMode ? colors.secondary.dark : colors.secondary.light,
      },
      background: {
        default: colorMode ? "#141A21" : "#F4F6F8",
        paper: colorMode ? "#1D242C" : "#FFFFFF",
        textField: colorMode ? "#303C48" : "#DBDBDB",
        card: colorMode ? "#171E27" : "#EEEEF1",
      },
      text: {
        primary: colorMode ? "#FFFFFF" : "#1C252E",
        secondary: colorMode ? "#919EAB" : "#637381",
        disabled: colorMode ? "#637381" : "#919EAB",
      },
      success: {
        main: colorMode ? "#22C55E" : "#04B55D",
      },
      warning: {
        main: colorMode ? "#EE9919" : "#EE9919",
      },
      error: {
        main: colorMode ? "#FF5630" : "#EE3737",
      },
      info: {
        main: colorMode ? "#00B8D9" : "#006C9C",
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  });

export default mainTheme;
