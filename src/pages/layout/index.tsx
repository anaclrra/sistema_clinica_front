import { Box, CssBaseline } from "@mui/material";
import { type JSX } from "react";
import SideBar from "../../components/sideBar";
import { Outlet } from "react-router-dom";
import TopBar from "../../components/topBar";

export interface LayoutProps {
    colorMode: boolean;
    setColorMode: React.Dispatch<React.SetStateAction<boolean>>;
}

function Layout(params: LayoutProps): JSX.Element {
    const { colorMode, setColorMode } = params;

    const styles = {
        containerLayout: {
            display: "flex",
            width: "100%",
            height: "fit-content",
            flexDirection: "column",
        },
        containerBody: {
            display: "flex",
            width: "100%",
            height: "100%",
            minWidth: "350px",
        },
        containerOutlet: {
            flexGrow: 1,
            padding: 3,
            // paddingTop: 5,
            width: "100%",
            gap: 2,
            minWidth: "calc(100vw - 300px)",
        },
        titleAndLinkPage: {
            flexGrow: 1,
            fontWeight: 400,
            fontSize: "1.25rem",
            marginX: 1,
            mt: 1,
            mb: 2,
        },
    };

    const sideBarPages = [
        {
            itemId: "1",
            label: "Paciente",
            hideTitle: true,
            link: "/",
            //icon: <Person />,
        }, {
            itemId: "2",
            label: "Medico",
            hideTitle: true,
            link: "/doctors",
            //icon: <Person />,
        }, {
            itemId: "3",
            label: "Consulta",
            hideTitle: true,
            link: "/appointment",
            //icon: <Person />,
        },]

    return (
        <Box display={"flex"}>
            <CssBaseline />
            <Box sx={styles.containerLayout}>
                <TopBar colorMode={colorMode} setColorMode={setColorMode} />
                <Box sx={styles.containerBody}>
                    <SideBar
                        items={sideBarPages} />
                    <Box component="main" sx={styles.containerOutlet}>

                        <Outlet />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
export default Layout;