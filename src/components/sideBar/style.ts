import type { Theme } from "@mui/material";

const useStyles = (theme: Theme, colorMode: string) => ({
  paper: {
    //height: "100vh",
    // overflowX: "auto",

    height: "100%",
    position: "sticky",
    top: 0,
    left: 0,
    zIndex: 1,
    display: { xs: "none", lg: "flex" },
    // borderTop: "none",
    // borderLeft: "none",
    // borderBottom: "none",
    borderRadius: 0,
    backgroundColor: theme.palette.background.paper,
  },
  boxTreeView: {
    height: "fit-content",
    overflow: "auto",
  },
  drawer: {
    display: { xs: "inline", lg: "none" },
    zIndex: 11000,
  },
  icons: {
    color:
      colorMode === "light"
        ? "rgba(20, 19, 19, 0.6)"
        : "rgba(255, 255, 255, 0.7)",
  },
  containerOutlet: { flexGrow: 1, paddingTop: 5, paddingInline: 3 },
  buttonMenuDawer: {
    //color: "white",
  },
  boxMenuAndLogo: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginY: 2,
    marginX: 1,
    paddingX: 2,
    paddingY: "5px",
    width: "270px",
  },
  iconLogo: {
    width: "fit-content",
    height: "fit-content",
    // display: "flex",
    // alignItems: "center",
    // justifyContent: "flex-start",
  },
  imgIcon: {
    width: 170,
    height: "60px",
  },
});

export default useStyles;
