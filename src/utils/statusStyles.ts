import type { Theme } from "@mui/material";

export const getStatusColor = (status: string, theme: Theme) => {
  switch (status) {
    case "AGENDADA":
      return theme.palette.primary.main as "primary";
    case "CANCELADA":
      return theme.palette.error.main as "error";
    case "CONCLUIDA":
      return theme.palette.success.main as "success";
    default:
      return theme.palette.primary.main as "default";
  }
};
