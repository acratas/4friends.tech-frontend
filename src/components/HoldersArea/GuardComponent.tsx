import React, {useCallback, useEffect} from "react";
import {ConnectWallet, useAddress, useSDK} from "@thirdweb-dev/react";
import {
    Box,
    Alert,
    AlertTitle,
    Typography,
    CircularProgress,
    Button
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import SimpleCardComponent from "./SimpleCardComponent";
import {useApi} from "../ApiProvider";
import Auth from "../../lib/Auth";
import {SocketProvider} from "../Socket/SocketProvider";

const GuardComponent = ({children}) => {
    const address = useAddress();
    const sdk = useSDK();
    const theme = useTheme();
    const {login: loginCall, refreshToken} = useApi();
    const [isAllowed, setIsAllowed] = React.useState<null | false | true>(
        Auth.isAuthenticated() && !Auth.isExpired() ? true : null
    );
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        if (!address || !sdk || !Auth.isAuthenticated()) {
            return;
        }

        const _ = async () => {
            if (Auth.isExpired()) {
                setIsAllowed(await refreshToken());
            }
        }
        _();
    }, [address, sdk]);

    const login = useCallback(async () => {
        setLoading(true);
        const signature = await sdk?.wallet.sign('4friends.tech');
        if (!signature) {
            return;
        }
        try {
            const {token} = await loginCall(signature);
            Auth.setToken(token);
            setIsAllowed(true);
        } catch (e) {
            console.error(e);
            setIsAllowed(false);
        }
    }, [sdk]);

    if (isAllowed) {
        return <SocketProvider>{children}</SocketProvider>
    }

    if (isAllowed === false) {
        return <SimpleCardComponent>
            <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'
                 sx={{p: 3}}>
                <Alert severity="warning" sx={{mb: 3}}>
                    <AlertTitle>Access denied</AlertTitle>
                    <Typography>To access this resource, you must
                        have <strong>Alojzy's</strong> key.</Typography>
                    <Typography>You can buy it here: <a href='https://friend.tech/alojzy20829086'
                                                        target='_blank'>friend.tech/alojzy20829086</a></Typography>
                </Alert>
            </Box>
        </SimpleCardComponent>
    }

    if (loading) {
        return <SimpleCardComponent>
            <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'
                 sx={{p: 3}}>
                <CircularProgress disableShrink color="inherit"/>
                Loading, please wait...
            </Box>
        </SimpleCardComponent>
    }


    return <SimpleCardComponent>
        <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'
             sx={{p: 3}}>
            <Alert severity="info" sx={{mb: 3, minWidth: '100%'}}>
                <AlertTitle>Access restricted</AlertTitle>
                <Typography>To access this resource, you must
                    have <strong>Alojzy's</strong> key.</Typography>
                <Typography>You can buy it here: <a href='https://friend.tech/alojzy20829086'
                                                    target='_blank'>friend.tech/alojzy20829086</a></Typography>
            </Alert>
            {   address ?
                <Button
                    onClick={login}
                    variant="contained"
                    color="primary"
                >
                    Login
                </Button>:
                <ConnectWallet
                    switchToActiveChain={true}
                    theme={theme.palette.mode}
                    btnTitle="CONNECT WALLET" />
            }
        </Box>
    </SimpleCardComponent>
}

export default React.memo(GuardComponent);
