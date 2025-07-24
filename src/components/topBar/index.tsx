import { AppBar, Box, Container, IconButton, Toolbar, useTheme } from "@mui/material";
import type { JSX } from "react";
import Profile from "./profile";
import { Menu } from "@mui/icons-material";


interface TopBarProps {
    colorMode: boolean;
    setColorMode: React.Dispatch<React.SetStateAction<boolean>>;
    openDrawer: boolean;
    setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}
function TopBar(props: TopBarProps): JSX.Element {
    const { colorMode, setColorMode, openDrawer, setOpenDrawer } = props
    const theme = useTheme();

    const styles = {
        appBar: {
            minWidth: "350px",
            width: "100%",
            position: "sticky",
            height: "65px",
            top: 0,
            left: 0,
            bgcolor:
                theme.palette.background.default,
            zIndex: 1000,
        },
        container: { padding: 0, "&.MuiContainer-root": { paddingX: 0 } },
        toolbar: {
            width: "100%",
            padding: 0,
            display: "flex",
            flexDirection: "row",
            justifyContent: { xs: "space-between", md: 'end' },
            paddingX: 1,
        },
        box: {
            display: "flex",
            alignItems: "center",
            gap: "4px",
        },
    };
    return (
        <AppBar
            position="sticky"
            sx={styles.appBar}
            elevation={0}
            variant="outlined"
        >
            <Container sx={styles.container}>
                <Toolbar sx={styles.toolbar} disableGutters>
                    <IconButton sx={{ display: { xs: 'flex', md: 'none' } }} onClick={() => setOpenDrawer(!openDrawer)}><Menu /></IconButton>
                    <Box sx={styles.box}>
                        <Profile
                            colorMode={colorMode}
                            setColorMode={setColorMode}
                        />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
export default TopBar