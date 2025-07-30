import { Box, CssBaseline } from "@mui/material";
import { useState, type JSX } from "react";
import SideBar from "../../components/sideBar";
import { Outlet } from "react-router-dom";
import TopBar from "../../components/topBar";
import { Description, MedicalInformation, Person } from "@mui/icons-material";

export interface LayoutProps {
    colorMode: boolean;
    setColorMode: React.Dispatch<React.SetStateAction<boolean>>;
}

function Layout(params: LayoutProps): JSX.Element {
    const { colorMode, setColorMode } = params;
    const [openDrawer, setOpenDrawer] = useState<boolean>(true);

    const styles = {
        containerLayout: {
            display: "flex",
            width: "100vw",
            height: "100vh",
            overflowY: "auto",
            overflowX: "hidden",
        },
        containerBody: {
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "fit-content",
            minWidth: "350px",
        },
        containerOutlet: {
            flexGrow: 1,
            padding: 3,
            height: "fit-content",
            width: "100%",
            gap: 2,
            minWidth: "calc(100vw - 31a0px)",
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
            link: "/patients",
            icon: <Person />,
        }, {
            itemId: "2",
            label: "Médico",
            hideTitle: true,
            link: "/doctors",
            icon: <MedicalInformation />,
        }, {
            itemId: "3",
            label: "Consulta",
            hideTitle: true,
            link: "/appointments",
            icon: <Description />,
        },]

    return (
        <Box display={"flex"}>
            <CssBaseline />
            <Box sx={styles.containerLayout}>
                <SideBar
                    items={sideBarPages} setOpenDrawer={setOpenDrawer} openDrawer={openDrawer} />
                <Box sx={styles.containerBody}>
                    <TopBar colorMode={colorMode} setColorMode={setColorMode} setOpenDrawer={setOpenDrawer} openDrawer={openDrawer} />
                    <Box component="main" sx={styles.containerOutlet}>
                        <Outlet />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
export default Layout;