import { alpha, type Theme } from "@mui/material";

const useStyles = (theme: Theme) => ({
  containerColumnVerificado: {
    height: "100%",
    gap: "8px",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
  },
  containerColumnCreatedAt: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    height: "100%",
    justifyContent: "start",
    alignItems: "center",
  },
  containerColumnLastLogin: {
    display: "flex",
    justifyContent: "start",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 0.5,
    height: "fit-content",
  },
  textDate: {
    color: "text.secondary",
    fontWeight: 500,
    lineHeight: 1.5,
  },
  subTextDate: {
    color: "text.secondary",
    fontWeight: 400,
    lineHeight: 1.5,
  },
  containerColumnPermissao: {
    display: "flex",
    flexWrap: "wrap",
    height: "100%",
    width: "100%",
    fontWeight: "bold",
    justifyContent: { xs: "end", md: "center" },
    alignItems: "center",
    flexDirection: "row",
    gap: 0.5,
    padding: { xs: 0, md: 1 },
  },

  foto: {
    width: "30px",
    height: "30px",
  },
  stack: {
    padding: "0px",
    width: "100%",
    height: "100%",
  },

  buttonMobile: {
    color: "primary.main",
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    display: "flex",
    p: 1.3,
    minWidth: 0,
  },
  buttonModal: {
    color: "#FFFFFF",
    backgroundColor: "primary.main",
    fontSize: "11px",
  },
  boxDataGrid: { display: { xs: "none", sm: "flex" }, width: "100%" },
  dataGrid: {
    borderLeft: "none",
    borderRight: "none",
    borderBottom: "none",
    width: "100%",
    height: "calc(100vh - 400px)",
    border: 0,
    backgroundColor: "transparent",

    "& .MuiDataGrid-columnHeader": {
      backgroundColor: theme.palette.background.paper, // Altera cor do cabeçalho
      borderTop: `1px solid ${theme.palette.background.textField}`,
    },
    "&. .MuiDataGrid-cell": {
      borderTop: `1px solid ${theme.palette.background.textField}`,
      borderColor: theme.palette.background.textField,
    },
    "& .even-row": { backgroundColor: "table" },
    "& .odd-row": { backgroundColor: "background.paper" },
  },
  boxHeader: {
    width: "100%",
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
    alignItems: "center",
  },
  boxSearchAndFilter: {
    width: { xs: "100%", md: "100%" },
    flexWrap: { xs: "nowrap", md: "wrap" },
    gap: { xs: 1, md: 2 },
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  containerBox: {
    padding: 3,

    minWidth: "320px",
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  paper: {
    padding: 2,
    gap: 2,
    width: "100%",
    flexDirection: "column",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    minWidth: "320px",
    //borderRadius: "0px 5px 5px 5px",
  },
  searchInput: {
    width: { xs: "100%", md: "400px" },
  },
  iconVerified: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  boxNoRowsOverlay: {
    p: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  iconUserNotFound: { fill: theme.palette.text.disabled },
  stackBtns: {
    display: "flex",
    flexDirection: "row",
  },
});

export default useStyles;
