import { Box, Drawer, Icon, IconButton, Paper, useTheme } from "@mui/material";
import { useEffect, useState, type JSX } from "react";
import useStyles from "./style";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { useNavigate } from "react-router-dom";
import { Menu } from "@mui/icons-material";
import logo from "../../assets/teste.svg"

interface SideBarProps {
    items: {
        itemId: string,
        label: string,
        hideTitle: boolean,
        link: string,
        icon?: JSX.Element
    }[]
    openDrawer: boolean;
    setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

function SideBar(props: SideBarProps): JSX.Element {
    const { items, openDrawer, setOpenDrawer } = props;
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const theme = useTheme();
    const colorMode = theme.palette.mode;
    const styles = useStyles(theme, colorMode);
    const navigate = useNavigate()
    useEffect(() => {
        const pageName = window.location.pathname;

        const matchedItem = items.find(item => item.link === pageName);
        console.log(pageName, matchedItem);
        if (matchedItem) {
            setSelectedItemId(matchedItem.itemId);
        }
    }, [window.location.pathname, items]);
    const handleDrawerToggle = () => {
        setOpenDrawer((prevState) => !prevState);
    };
    const handleItemClick = (item: SideBarProps['items'][0]) => {
        if (item.link) {
            navigate(item.link);
            setSelectedItemId(item.itemId)
        }
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
                        selectedItems={selectedItemId}
                        sx={{
                            width: 270,
                            paddingX: 1,
                            paddingY: "5px",
                        }}
                    >{Array.isArray(items)
                        ? items.map((item) => (
                            <TreeItem key={item.itemId}
                                itemId={item.itemId}
                                label={
                                    <Box sx={{ display: "flex", alignItems: "center", gap: openDrawer ? 1 : 0 }}>
                                        {item.icon && (
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                {item.icon}
                                            </Box>
                                        )}
                                        {openDrawer && <Box>{item.label}</Box>}
                                    </Box>
                                }
                                onClick={() => handleItemClick(item)}

                            />
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
                        selectedItems={selectedItemId}
                        sx={{
                            width: 270,
                            paddingX: 1,
                            paddingY: "5px",
                        }}
                    >{Array.isArray(items)
                        ? items.map((item) => (
                            <TreeItem key={item.itemId}
                                itemId={item.itemId}
                                label={
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {item.icon}
                                        </Box>

                                        <Box>{item.label}</Box>
                                    </Box>
                                }
                                onClick={() => handleItemClick(item)} />
                        )) : null}</SimpleTreeView>
                </Box>
            </Paper></>
    )
}

export default SideBar