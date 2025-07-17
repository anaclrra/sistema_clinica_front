import { Box, Drawer, Icon, IconButton, Paper, useTheme } from "@mui/material";
import { useState, type JSX } from "react";
import useStyles from "./style";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { useNavigate } from "react-router-dom";
import { Menu } from "@mui/icons-material";
import logo from "../../assets/react.svg"

interface SideBarProps {
    items: {
        itemId: string,
        label: string,
        hideTitle: boolean,
        link: string,
    }[]
}
function SideBar(props: SideBarProps): JSX.Element {
    const { items } = props;
    //const [openRightBar, setOpenRightBar] = useState<boolean>(true);
    const [openDrawer, setOpenDrawer] = useState<boolean>(true);
    const theme = useTheme();
    const colorMode = theme.palette.mode;
    const styles = useStyles(theme, colorMode);
    const navigate = useNavigate()

    const handleDrawerToggle = () => {
        setOpenDrawer((prevState) => !prevState);
    };
    const handleItemClick = (item: SideBarProps['items'][0]) => {
        if (item.link) {
            navigate(item.link);
        } console.log(openDrawer);

    }
    return (
        <>
            <Drawer
                variant="temporary"
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                sx={styles.drawer}
            >
                <>
                    <Box sx={styles.boxMenuAndLogo}>
                        <IconButton
                            sx={styles.buttonMenuDawer}
                            onClick={handleDrawerToggle}
                        >
                            <Menu />
                        </IconButton>
                        <Icon sx={styles.iconLogo}>
                            <img
                                src={logo}
                                style={styles.imgIcon}
                            />
                        </Icon>                    </Box>
                    <SimpleTreeView
                        sx={{
                            width: 270,
                            paddingX: 1,
                            paddingY: "5px",
                        }}
                    >{Array.isArray(items)
                        ? items.map((item) => (
                            <TreeItem key={item.itemId}
                                itemId={`table-${item.itemId}`}
                                label={item.label}
                                onClick={() => handleItemClick(item)} />
                        )) : null}</SimpleTreeView>
                </>
            </Drawer>
            <Paper
                sx={styles.paper}
                variant="outlined"

            >

                <Box sx={{ height: "calc( 100vh - 65px)", overflow: "auto" }}>
                    <Box sx={styles.boxMenuAndLogo}>
                        <Icon sx={styles.iconLogo}>
                            <img
                                src={logo}
                                style={styles.imgIcon}
                            />
                        </Icon>
                    </Box>
                    <SimpleTreeView
                        sx={{
                            width: 270,
                            paddingX: 1,
                            paddingY: "5px",
                        }}
                    >{Array.isArray(items)
                        ? items.map((item) => (
                            <TreeItem key={item.itemId}
                                itemId={`table-${item.itemId}`}
                                label={item.label}
                                onClick={() => handleItemClick(item)} />
                        )) : null}</SimpleTreeView>
                </Box>
            </Paper></>
    )
}

export default SideBar