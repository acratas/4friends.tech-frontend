import React, {useCallback, useEffect} from 'react';
import {ConnectWallet, useAddress, useSDK} from "@thirdweb-dev/react";
import {
    Alert,
    AlertTitle,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Typography
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import {useTheme} from "@mui/material/styles";
import EthValue from "../EthValue";
import {BigNumber} from "ethers";
import PanicSellComponent from "./PanicSellComponent";
import {useApi} from "../ApiProvider";

class InsufficientBalanceError extends Error {
    constructor() {
        super('Insufficient balance');
    }
}

const PanicSellGuardComponent = () => {
    const address = useAddress();
    const sdk = useSDK();
    const theme = useTheme();
    const {loadData} = useApi();
    const [isAllowed, setIsAllowed] = React.useState<boolean>(true);
    const [paymentState, setPaymentState] = React.useState<'none' | 'error' | 'success'>('none');
    const [requiredPayment, setRequiredPayment] = React.useState<string>('0');
    const [alert, setAlert] = React.useState<string>('');
    const payForPanicSell = useCallback(async () => {
        if (!address || !sdk) {
            return;
        }
        try {
            const balance = BigNumber.from((await sdk.getBalance(address))?.value || '0');
            const elCommendantePanicSell = await sdk.getContract('0xD134ddA4a116bf95392a7b3015186163B187b616');
            const requiredPayment = await elCommendantePanicSell.call('requiredPayment');
            if (balance.lt(requiredPayment)) {
                throw new InsufficientBalanceError();
            }
            await elCommendantePanicSell.call('pay', [], {
                value: requiredPayment
            });
            setPaymentState('success');
            const isAllowed = await elCommendantePanicSell.call('isAllowed', [address]);
            setIsAllowed(isAllowed);
            setAlert('Payment successful 🎉🎉🎉🎉🎉🎉');
        } catch (e) {
            if (e instanceof InsufficientBalanceError) {
                setAlert('Insufficient balance');
            } else {
                setAlert('Transaction error');
            }
            setPaymentState('error');
        }
    }, [address, sdk, requiredPayment]);

    // useEffect(() => {
    //     if (!address || !sdk) {
    //         return;
    //     }
    //     const _ = async () => {
    //         const elCommendantePanicSell = await sdk.getContract('0xD134ddA4a116bf95392a7b3015186163B187b616');
    //         const isAllowed = await elCommendantePanicSell.call('isAllowed', [address]);
    //         setIsAllowed(isAllowed);
    //         if (isAllowed) {
    //             setPaymentState('none');
    //         }
    //     }
    //     _();
    // }, [address, sdk]);
    useEffect(() => {
        if (!sdk) {
            return;
        }
        const _ = async () => {
            const elCommendantePanicSell = await sdk.getContract('0xD134ddA4a116bf95392a7b3015186163B187b616');
            const requiredPayment = await elCommendantePanicSell.call('requiredPayment');
            setRequiredPayment(requiredPayment);
        }
        _();
    }, [sdk]);
    useEffect(() => {
        if (address === undefined) {
            return;
        }
        const _ = async () => {
            await loadData(address, (i: number) => {});
        }
        _();
    }, [address]);

    return (
        <Container sx={{
            mb: 2, mt: {
                sm: 2,
                md: 4
            }
        }}>
            <Grid2 container spacing={2}>
                <Grid2 xs={12}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">Quick Sell</Typography>
                            {paymentState !== 'none' ? <Alert severity={paymentState}>
                                <AlertTitle sx={{textTransform: 'capitalize'}}>{paymentState}</AlertTitle>
                                {alert}
                            </Alert> : ''}
                            {address ? (
                                isAllowed ? (
                                    <PanicSellComponent />
                                ) : (
                                    <Box display='flex' justifyContent='center' alignItems='center' sx={{p: 3}}>
                                        <Button
                                            variant="contained"
                                            onClick={payForPanicSell}
                                        >
                                            Purchase Quick Sell access for&nbsp;<EthValue inline={true} showUsd={false}
                                                                                          sx={{color: 'inherit'}}>{requiredPayment}</EthValue>
                                        </Button>
                                    </Box>
                                )
                            ) : (
                                <Box display='flex' justifyContent='center' alignItems='center' sx={{p: 3}}>
                                    <ConnectWallet
                                        switchToActiveChain={true}
                                        theme={theme.palette.mode}
                                        btnTitle="CONNECT WALLET"/>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>
        </Container>
    )
}

export default React.memo(PanicSellGuardComponent);
