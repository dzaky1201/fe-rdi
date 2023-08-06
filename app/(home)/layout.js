"use client";
import {styled, useTheme} from "@mui/material/styles";
import nookies, {destroyCookie, parseCookies} from "nookies";
import {redirect, useRouter} from "next/navigation";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import {AccountBalance, CalendarToday, EventNote, Logout, Paid, People, Summarize} from "@mui/icons-material";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import * as React from "react";
import AppBarStyle from "@/app/(home)/_style/AppBarStyle";
import DrawerStyle from "@/app/(home)/_style/DrawerStyle";
import DrawerHeaderStyle from "@/app/(home)/_style/DrawerHeaderStyle";


export default function DashboardLayout({children}) {
    const theme = useTheme();
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState();

    const [openDialog, setOpenDialog] = React.useState(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const logoutAction = () => {
        setOpenDialog(false);
        destroyCookie(null, 'token')
        onClickNav('/')
    }

    const onClickNav = (event) => {
        router.replace(event)
    }


    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBarStyle position="fixed" open={open}>
                <Toolbar className="tx-bg-orange-500">
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && {display: 'none'}),
                        }}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {selectedIndex === 0 && "Ringkasan kas"}
                        {selectedIndex === 1 && "Operasional"}
                        {selectedIndex === 2 && "Invest"}
                        {selectedIndex === 3 && "Keuangan"}
                        {selectedIndex === 4 && "Akun"}
                        {selectedIndex === 5 && "Periode"}
                    </Typography>
                </Toolbar>
            </AppBarStyle>
            <DrawerStyle variant="permanent" open={open}>
                <DrawerHeaderStyle>
                    <Image width={200} height={70} src="/logo-fix.png" alt={"logo-rdi"} className="tx-p-2"></Image>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                    </IconButton>
                </DrawerHeaderStyle>
                <Divider/>
                <Typography className={`tx-text-black tx-font-[500] tx-p-2 tx-text-[21px] ${open ? 'tx-visible' : 'tx-hidden'}`}>
                    Sistem Arus Kas
                </Typography>
                <List>
                    <ListItem key="summary" disablePadding sx={{display: 'block'}}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            selected={selectedIndex === 0}
                            onClick={() => {
                                setSelectedIndex(0)
                                onClickNav('/summary')
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <Summarize/>
                            </ListItemIcon>
                            <ListItemText primary="Ringkasan" sx={{opacity: open ? 1 : 0}}/>
                        </ListItemButton>
                    </ListItem>

                </List>
                <Divider/>
                <Typography className={`tx-text-black tx-font-[500] tx-p-2 tx-text-[21px] ${open ? 'tx-visible' : 'tx-hidden'}`}>
                    Aktivitas
                </Typography>
                <List>
                    <ListItem key="operational" disablePadding sx={{display: 'block'}}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            selected={selectedIndex === 1}
                            onClick={() => {
                                setSelectedIndex(1)
                                onClickNav('/operasional')
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <EventNote/>
                            </ListItemIcon>
                            <ListItemText primary="Operasional" sx={{opacity: open ? 1 : 0}}/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key="invests" disablePadding sx={{display: 'block'}}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            selected={selectedIndex === 2}
                            onClick={() => {
                                setSelectedIndex(2)
                                onClickNav('/invest')
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <AccountBalance/>
                            </ListItemIcon>
                            <ListItemText primary="Invest" sx={{opacity: open ? 1 : 0}}/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key="funding" disablePadding sx={{display: 'block'}}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            selected={selectedIndex === 3}
                            onClick={(event) => {
                                setSelectedIndex(3)
                                onClickNav('/funding')
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <Paid/>
                            </ListItemIcon>
                            <ListItemText primary="Keuangan" sx={{opacity: open ? 1 : 0}}/>
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider/>
                <Typography className={`tx-text-black tx-font-[500] tx-p-2 tx-text-[21px] ${open ? 'tx-visible' : 'tx-hidden'}`}>
                    User
                </Typography>
                <List>
                    <ListItem key="account" disablePadding sx={{display: 'block'}}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            selected={selectedIndex === 4}
                            onClick={(event) => {
                                setSelectedIndex(4)
                                onClickNav('/account')
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <People/>
                            </ListItemIcon>
                            <ListItemText primary="Akun" sx={{opacity: open ? 1 : 0}}/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key="period" disablePadding sx={{display: 'block'}}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            selected={selectedIndex === 5}
                            onClick={(event) => {
                                setSelectedIndex(5)
                                onClickNav('/period')
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <CalendarToday/>
                            </ListItemIcon>
                            <ListItemText primary="Periode" sx={{opacity: open ? 1 : 0}}/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key="logout" disablePadding sx={{display: 'block'}}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            selected={selectedIndex === 6}
                            onClick={handleOpenDialog}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <Logout/>
                            </ListItemIcon>
                            <ListItemText primary="Keluar" sx={{opacity: open ? 1 : 0}}/>
                        </ListItemButton>
                    </ListItem>
                </List>
            </DrawerStyle>
            <Box component="main" sx={{flexGrow: 1, p: 3}}>
                <DrawerHeaderStyle/>
                {children}
            </Box>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Apakah anda yakin ingin keluar ?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Jika sudah yakin silahkan klik keluar
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Batal</Button>
                    <Button onClick={logoutAction} autoFocus>
                        Keluar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}