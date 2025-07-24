import { Alert, Snackbar, type AlertProps } from "@mui/material";
import type { JSX } from "react";

interface SnackBarProps {
    snackbar: AlertProps | null;
    setSnackbar: (value: AlertProps | null) => void;
}
function SnackBar(props: SnackBarProps): JSX.Element {
    const { snackbar, setSnackbar } = props
    return (
        <>
            {" "}
            {!!snackbar && (
                <Snackbar
                    open
                    onClose={() => setSnackbar(null)}
                    autoHideDuration={2000}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert {...snackbar} onClose={() => setSnackbar(null)} />
                </Snackbar>
            )}
        </>
    );
}
export default SnackBar;