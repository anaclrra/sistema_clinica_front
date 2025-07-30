import { alpha, createTheme, lighten, type Theme } from "@mui/material";

declare module "@mui/material/styles" {
  interface TypeBackground {
    textField: string;
    card: string;
  }
  interface TypeText {
    inverted: string;
  }
  interface PaperPropsVariantOverrides {
    default: true;
  }
}
const colors = {
  primary: {
    light: "#00B1D9",
    dark: "#00B1D9",
  },
  secondary: {
    light: "#FF8732",
    dark: "#FF8732",
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
        inverted: !colorMode ? "#FFFFFF" : "#1C252E",
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
    components: {
      MuiButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            textTransform: "capitalize",
            boxShadow: "none",
            borderRadius: 5,
            color: theme.palette.primary.main,
            "&:hover": {
              boxShadow: "none",
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }),
        },
        variants: [
          {
            props: { variant: "contained" },
            style: ({ theme }) => ({
              backgroundColor: alpha(theme.palette.primary.light, 0.1),
              color: theme.palette.primary.light,
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.dark, 0.2),
              },
            }),
          },
          {
            props: { variant: "text" },
            style: ({ theme }) => ({
              color: theme.palette.text.primary,
              "&:hover": {
                backgroundColor: alpha(theme.palette.background.textField, 0.1),
              },
            }),
          },
        ],
      },
      MuiTextField: {
        styleOverrides: {
          root: ({ theme }) => ({
            width: "100%",

            "& .MuiFilledInput-root": {
              backgroundColor: theme.palette.background.textField,
              borderRadius: "10px",
              fontSize: "0.875rem",
              "&:hover": {
                backgroundColor: lighten(
                  theme.palette.background.textField,
                  0.1
                ),
              },

              "& input:-webkit-autofill": {
                boxShadow: `0 0 0 1000px transparent inset`,
                transition: "background-color 5000s ease-in-out 0s",
                border: "none",
                lineHeight: "1.5",
                fontSize: "0.875rem",
              },
              //remove a linha
              "&:before, &:hover:before, &:after": {
                borderBottom: "none !important",
              },
            },
          }),
        },
      },
    },
  });

export default mainTheme;
