import React, {useState} from 'react';
import {
    Alert, AlertColor,
    Backdrop, Box, Button,
    createTheme,
    CssBaseline, Dialog, DialogTitle, DialogContent,
    Snackbar,
    Theme,
    ThemeProvider,
    useMediaQuery
} from "@mui/material";
import {
    useAddress,
    useChainId, useNetworkMismatch, useSwitchChain,
} from "@thirdweb-dev/react";
import {TransactionDialogProvider} from "./components/TransactionDialogProvider";
import {Base} from "@thirdweb-dev/chains";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {UserLookupAddressComponent} from "./components/UserLookupAddressComponent";
import {UserLookupParamsComponent} from "./components/UserLookupParamsComponent";
import {AppBarComponent} from "./components/AppBarComponent";
import {SearchBarComponent} from "./components/SearchBarComponent";
import StatsUndervalued2Component from "./components/Stats/Undervalued2";
import BLYCComponent from "./components/BLYCComponent";
import ArmyComponent from "./components/ArmyComponent";
import PanicSellGuardComponent from "./components/PanicSell/PanicSellGuardComponent";
import RecentTransactionsComponent from "./components/RecentTransactions/RecentTransactionsComponent";
import HoldersAreaComponent from "./components/HoldersArea/HoldersAreaComponent";
import GuardComponent from "./components/HoldersArea/GuardComponent";
import ChatComponent from "./components/Chat/ChatComponent";
import {SnackbarProvider} from "notistack";
import TwoDaysModal from "./components/TwoDaysModal";

const commonComponents = {
    MuiTableCell: {
        styleOverrides: {
            root: {
                '@media (max-width:600px)': {
                    padding: '8px 8px', // Dostosuj według potrzeb
                }
            },
        },
    },
    MuiCardHeader: {
        styleOverrides: {
            title: { // Dla tytułu w CardHeader
                '@media (max-width:600px)': {
                    fontSize: '.875rem',
                },
            }
        },
    },
};

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    components: commonComponents,
});
const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
    components: commonComponents,
});


function App() {
    const address = useAddress();
    const chainId = useChainId();
    const isMismatch = useNetworkMismatch();
    const switchChain = useSwitchChain();
    const [toggleSearch, setToggleSearch] = useState<boolean>(false);
    const [showBackdrop, setShowBackdrop] = useState<number>(0);
    const [searchAddress, setSearchAddress] = React.useState<null | string>(address || null);

    const updateSearchAddress = async (address: string) => {
        setSearchAddress(address);
    }

    const handleSearchOpen = () => {
        setToggleSearch(true);
    };

    const handleSearchClose = () => {
        setToggleSearch(false);
    };

    const storedTheme = localStorage.getItem('app-theme');
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const initialTheme = storedTheme ?
        (storedTheme === 'dark' ? darkTheme : lightTheme) :
        (prefersDarkMode ? darkTheme : lightTheme);

    const [theme, setTheme] = React.useState<Theme>(initialTheme);
    const [toast, setToast] = React.useState<{
        open: boolean,
        message: string,
        autohide: number,
        type: AlertColor
    }>({
        open: false,
        message: '',
        autohide: 6000,
        type: 'info'
    });

    const currentTheme = React.useMemo(
        () => theme,
        [theme],
    );


    return (
        <SnackbarProvider maxSnack={3}>
        <ThemeProvider theme={currentTheme}>
            <CssBaseline/>
            <Router>
                <TransactionDialogProvider>
                    <AppBarComponent
                        theme={theme}
                        setTheme={setTheme}
                        currentTheme={currentTheme}
                        lightTheme={lightTheme}
                        darkTheme={darkTheme}
                        toast={toast}
                        setToast={setToast}
                        setToggleSearch={setToggleSearch}
                    ></AppBarComponent>
                    <Box sx={{ pt: 2 }}>
                        <Routes>
                            <Route path="/" element={<UserLookupAddressComponent/>}/>
                            <Route path="/list/users" element={<StatsUndervalued2Component theme={theme}/>}/>
                            <Route path="/:identifier" element={<UserLookupParamsComponent/>}/>
                            <Route path="/list/blyc" element={<BLYCComponent mode={'portfolio'} />}/>
                            <Route path="/army/:identifier" element={<ArmyComponent mode={'portfolio'} />}/>
                            <Route path="/club/:identifier" element={<ArmyComponent mode={'holders'} />}/>
                            <Route path="/util/quick-sell" element={<PanicSellGuardComponent />} />
                            <Route path="/util/holders" element={<HoldersAreaComponent />} />
                            <Route path="/util/recent-transactions" element={<GuardComponent><RecentTransactionsComponent /></GuardComponent>}/>
                            <Route path="/util/chat" element={<GuardComponent><ChatComponent currentTheme={currentTheme} /></GuardComponent>} />
                        </Routes>
                    </Box>
                    <Snackbar
                        open={toast.open}
                        autoHideDuration={6000}
                        onClose={() => setToast({...toast, open: false})}
                    ><Alert
                        onClose={() => setToast({...toast, open: false})}
                        severity={toast.type}>{toast.message}</Alert></Snackbar>
                    <Dialog
                        open={toggleSearch}
                        onClose={handleSearchClose}
                        fullWidth={true}
                        disableRestoreFocus={true}
                    >
                        <DialogTitle>Search</DialogTitle>
                        <DialogContent>
                            <SearchBarComponent setToggleSearch={setToggleSearch} currentTheme={currentTheme}/>
                        </DialogContent>
                    </Dialog>
                </TransactionDialogProvider>
            </Router>

            <Backdrop
                sx={{color: '#fff', zIndex: (c) => c.zIndex.drawer + 1}}
                open={isMismatch}
            >
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Button
                        size="large"
                        variant="contained"
                        color="secondary"
                        onClick={() => switchChain(Base.chainId)}
                        sx={{mb: 2}}
                    >Switch to Base</Button>
                </Box>
            </Backdrop>
            {/*<TwoDaysModal />*/}
        </ThemeProvider>
        </SnackbarProvider>
    )
        ;
}

export default App;
