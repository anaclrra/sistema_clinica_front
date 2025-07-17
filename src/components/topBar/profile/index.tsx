import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import { Avatar, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from "@mui/material";
import { useState, type JSX, type MouseEvent } from "react";

interface ProfileProps {
    colorMode: boolean;
    setColorMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Profile({
    colorMode,
    setColorMode,
}: ProfileProps): JSX.Element {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: MouseEvent<HTMLElement>): void => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (): void => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <Tooltip title="Abrir Opções">
                <IconButton onClick={handleClick}>
                    <Avatar />
                </IconButton>
            </Tooltip>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
                disableScrollLock={true}
                sx={{ marginLeft: "-5px" }}
            >
                <MenuItem
                    onClick={() => {
                        setColorMode((prev) => {
                            const newValue = !prev;
                            localStorage.setItem(
                                "theme",
                                JSON.stringify({ colorMode: newValue })
                            );
                            return newValue;
                        });
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        {!colorMode ? <DarkModeOutlined /> : <LightModeOutlined />}
                    </ListItemIcon>
                    <ListItemText>
                        {!colorMode ? "Modo Noturno" : "Modo Claro"}
                    </ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
}