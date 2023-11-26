import {
    AppBar, Avatar,
    Box, Button, ButtonGroup, Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Divider, Hidden,
    IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, SwipeableDrawer,
    Toolbar,
    Typography
} from "@mui/material";
import {
    Delete,
    Favorite,
    Home,
    Info,
    Key,
    Menu as MenuIcon,
    People,
    Person,
    Search,
    Sell,
    Twitter
} from "@mui/icons-material";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import React from "react";
import {useNavigate} from "react-router-dom";
import {useApi} from "./ApiProvider";
import EthValue from "./EthValue";
import {ConnectWallet, useAddress, useLogin, useSDK} from "@thirdweb-dev/react";
import {useTransactionDialog} from "./TransactionDialogProvider";
import {User} from "../lib/User";
import {formatEther} from "ethers/lib/utils";
import {BigNumber} from "ethers";
import './AppBarComponent.css';
import {useLoggedUser} from "./LoggedUserProvider";

export const AppBarComponent = (
    {
        theme,
        setTheme,
        lightTheme,
        darkTheme,
        currentTheme,
        setToast,
        toast,
        setToggleSearch
    }: any
) => {
    const {loggedUser} = useLoggedUser();
    const navigate = useNavigate();
    const [infoOpen, setInfoOpen] = React.useState(false);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const toggleInfo = () => setInfoOpen(!infoOpen);
    const toggleTheme = () => {
        localStorage.setItem('app-theme', theme.palette.mode === 'dark' ? 'light' : 'dark');
        setTheme(theme.palette.mode === 'dark' ? lightTheme : darkTheme);
    }
    const goHome = () => {
        navigate('/');
    }

    const toggleDrawer =
        (open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event &&
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }
                setDrawerOpen(open);
            };
    const sdk = useSDK();
    const address = useAddress();
    const {openTransactionDialog} = useTransactionDialog();
    const alojzy: User = {
        address: "0xe4b2e46ca1feada536868cd65bffa1f49983fe9e",
        twitterName: "alojzy",
        twitterPfpUrl: "https://pbs.twimg.com/profile_images/1458786043612868624/z90f8Zfk.jpg",
        twitterUsername: "alojzy20829086",
        supply: 0,
    };
    const transfer = (amount: string) => async () => {
        try {
            await sdk?.wallet.transfer(alojzy.address, formatEther(BigNumber.from(amount)));
        } catch (e: any) {
            setToast({
                ...toast,
                open: true,
                message: 'Transaction rejected',
                type: 'warning'
            })
        }
    }
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };


    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        onClick={toggleDrawer(true)}
                        color="inherit"
                    ><MenuIcon/></IconButton>

                    <Typography
                        onClick={goHome}
                        variant="h6"
                        sx={{
                            py: 2,
                            px: 2,
                            cursor: 'pointer',
                            display: {
                                xs: 'none',
                                md: 'block'
                            }
                        }}>
                        4friends.tech
                    </Typography>

                    <Box flexGrow={1}>

                    </Box>

                    <Button variant="outlined" color="inherit" size="large"
                            onClick={() => setToggleSearch(true)}
                            sx={{mr: 2}}
                            startIcon={<Search width={64} height={64}/>}>
                        Search...
                    </Button>

                    <ConnectWallet
                        switchToActiveChain={true}
                        theme={currentTheme.palette.mode}
                        btnTitle="CONNECT"/>

                </Toolbar>
            </AppBar>
            <Dialog
                open={infoOpen}
                onClose={toggleInfo}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"About"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Introducing the genuine friend.tech portfolio viewer!
                    </DialogContentText>
                    <DialogContentText sx={{my: 2}}>
                        While the friend.tech app might display inflated values by calculating the current
                        purchase
                        price of a user's key and multiplying it by the number of keys owned, we pride ourselves
                        in
                        showcasing the truth. Dive deep into the honest waters of the friend.tech universe with
                        our
                        platform that offers:
                    </DialogContentText>
                    <DialogContentText sx={{my: 2}}>
                        <ul>
                            <li><strong>True Value Display:</strong> Unlike the main app, connect via your
                                wallet (e.g., Metamask)
                                and
                                instantly access your portfolio with real values, free from any inflation.
                            </li>
                            <li><strong>Transaction History:</strong> View a detailed list of your transactions
                                for a comprehensive
                                understanding of your friend.tech journey.
                            </li>
                            <li><strong>Bulk Key Purchases:</strong> Tired of purchasing one key at a time? Buy
                                and sell keys in bulk
                                from a
                                single user, streamlining your interactions.
                            </li>
                            <li><strong>Real-Time Data:</strong>
                                Engage with the official smart contracts of the friend.tech app
                                ensuring
                                all
                                data remains accurate and up-to-date.
                            </li>
                            <li><strong>Explore Others:</strong> Simply input another user's wallet address to
                                view
                                their authentic
                                portfolio
                                values.
                            </li>
                        </ul>
                    </DialogContentText>
                    <DialogContentText sx={{my: 2}}>
                        Experience the unadulterated truth of friend.tech
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleInfo} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <SwipeableDrawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
            >
                <Typography
                    onClick={goHome}
                    variant="h6" sx={{py: 2, px: 2, cursor: 'pointer'}}>
                    4friends.tech
                </Typography>
                <Divider/>
                <List sx={{ flexGrow: 1 }}>
                    {loggedUser && <ListItem>
                      <ListItemButton onClick={() => {
                          setDrawerOpen(false)
                          navigate(`/${loggedUser?.address}`)
                      }}>
                        <ListItemIcon>{loggedUser.twitterUsername ? <Avatar sx={{mr: 1}}
                            src={loggedUser.twitterPfpUrl || ''}
                            alt={loggedUser.twitterName || 'You'}
                          />: '🤖'}</ListItemIcon>
                        <ListItemText primary={loggedUser.twitterUsername || 'You'} />
                      </ListItemButton>
                    </ListItem>}
                    <ListItem>
                        <ListItemButton onClick={() => {
                            setDrawerOpen(false);
                            navigate('/list/users');
                        }}>
                            <ListItemIcon><People/></ListItemIcon>
                            <ListItemText primary="User list"/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton onClick={() => {
                            window.open("https://t.me/FTWhaleAlert");
                        }}>
                            <ListItemIcon><Avatar sx={{mr: 1}}
                                                  src="https://pbs.twimg.com/profile_images/1708285816387117056/gFKXe1ha_normal.jpg"/></ListItemIcon>
                            <ListItemText primary="Whale alert"/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton onClick={() => {
                            setDrawerOpen(false);
                            navigate('/list/blyc');
                        }}>
                            <ListItemIcon>💎⚡️</ListItemIcon>
                            <ListItemText primary="BLYC"/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton onClick={() => {
                            setDrawerOpen(false);
                            navigate('/util/holders');
                        }}>
                            <ListItemIcon><Key/></ListItemIcon>
                            <ListItemText primary="Holders area"/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton onClick={() => {
                            setDrawerOpen(false);
                            navigate('/util/quick-sell');
                        }}>
                            <ListItemIcon><Delete/></ListItemIcon>
                            <ListItemText primary="Quick sell"/>
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider/>
                <List>
                    <ListItem>
                        <ListItemButton onClick={() => window.open("https://twitter.com/alojzy20829086")}>
                            <ListItemIcon><img
                                src={currentTheme.palette.mode === 'dark' ? '/x.dark.png' : '/x.light.png'}
                                style={{
                                    width: '1.5rem',
                                    height: '1.5rem',
                                }}
                            /></ListItemIcon>
                            <ListItemText primary="X/Twitter"/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton onClick={toggleTheme}>
                            <ListItemIcon>{currentTheme.palette.mode === 'dark' ? <Brightness7Icon/> :
                                <Brightness4Icon/>}</ListItemIcon>
                            <ListItemText primary="Toggle mode"/>
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider/>
                <List>
                    <ListItem>
                        <ListItemButton onClick={() => {
                            if (!address) {
                                setDrawerOpen(false)
                                return navigate(`/${alojzy.address}`)
                            }
                            openTransactionDialog({
                                open: true,
                                buy: true,
                                user: alojzy,
                            })
                        }}>
                            <ListItemIcon><Avatar sx={{mr: 1}}
                                                  src="https://pbs.twimg.com/profile_images/1458786043612868624/z90f8Zfk.jpg"/></ListItemIcon>
                            <ListItemText primary="Buy me"/>
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider/>
                <List>
                    <ListItem>
                        <Favorite color="error"/>
                        <Typography sx={{
                            mx: 1,
                            fontSize: {
                                xs: '.75rem',
                                md: '1rem'
                            }
                        }}>
                            Donate
                        </Typography>
                        <ButtonGroup variant="outlined" size="small" sx={{borderColor: '#fff'}}>
                            <Button onClick={transfer("100000000000000000")}><EthValue
                                sx={{color: 'inherit'}}>100000000000000000</EthValue></Button>
                            <Button onClick={transfer("10000000000000000")}><EthValue
                                sx={{color: 'inherit'}}>10000000000000000</EthValue></Button>
                            <Button onClick={transfer("1000000000000000")}><EthValue
                                sx={{color: 'inherit'}}>1000000000000000</EthValue></Button>
                        </ButtonGroup>
                    </ListItem>
                </List>
            </SwipeableDrawer>
        </div>
    )
}
