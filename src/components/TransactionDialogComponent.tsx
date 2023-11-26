import React, {useEffect} from 'react';
import {
    Alert, AlertTitle,
    Box,
    Button, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    Divider, IconButton,
    TextField,
    Typography
} from "@mui/material";
import UserComponent from "./UserComponent";
import EthValue from "./EthValue";
import {useSDK} from "@thirdweb-dev/react";
import {BigNumber} from "ethers";
import {TransactionDialogProps} from "../lib/TransactionDialogProps";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {Close} from "@mui/icons-material";


function TransactionDialogComponent({open, buy, user, onClose, ...props}: TransactionDialogProps) {

    const [amount, setAmount] = React.useState(1);
    const [value, setValue] = React.useState(BigNumber.from(0));
    const [state, setState] = React.useState<'none' | 'pending' | 'error' | 'success'>('none');
    const [infoVisible, setInfoVisible] = React.useState(localStorage.getItem('infoVisible') !== 'true');
    const max = props.max || 20;
    const sdk = useSDK();
    const checkPriceMethod = buy ? 'getBuyPriceAfterFee' : 'getSellPriceAfterFee';
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const updateAmount = async (amount: number | string) => {
        if (typeof amount === 'string') {
            amount = parseInt(amount);
        }
        if (amount > max) {
            amount = max;
        }
        if (amount < 1) {
            amount = 1;
        }
        setAmount(amount);
    }

    useEffect(() => {
        const _ = async () => {
            const contract = await sdk?.getContract('0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4');
            const res = await contract?.call(checkPriceMethod, [
                user.address,
                amount
            ]);
            setValue(res.mul(buy ? -1 : 1));
        }
        _()
            .catch(console.error);
    }, [amount]);


    const doTransaction = async () => {

        const contract = await sdk?.getContract('0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4');

        setState('pending');
        try {
            await contract?.call(buy ? 'buyShares' : 'sellShares', [
                    user.address.toLowerCase(),
                    amount
                ],
                buy ? {
                    value: value.mul(-1)
                } : {}
            );
            setState('success')
        } catch (e) {
            console.error(e);
            setState('error');
        }

    }

    const handleClose = () => {
        typeof onClose === 'function' && onClose();
        setState('none');
    }

    const handleCloseInfoAlert = () => {
        setInfoVisible(false);
        localStorage.setItem('infoVisible', 'false');
    }

    return (
        <Dialog open={true} onClose={handleClose}>
            <DialogTitle>{`${buy ? 'Buy' : 'Sell'} ${user.twitterName}'s keys`}</DialogTitle>
            <DialogContent>
                <Divider sx={{mb: 1}}/>
                <UserComponent user={user} fulladdress={!isSmallScreen} maxSell={0}></UserComponent>
                <Divider sx={{my: 2}}/>
                {
                    state === 'none' && (<Box>
                        {infoVisible &&
                          <Box>
                            <Alert severity="info" sx={{fontSize: ".9rem"}} onClose={handleCloseInfoAlert}>
                            Here you can {buy ? 'buy' : 'sell'} keys. You can make a transaction for more than one key
                            at
                            a time.
                            The smart contract on friends.tech allows this, and it doesn't require any additional fees.
                            If this raises any concerns for you, that's okay.
                            You can make the transaction within the friend.tech app or on
                            <Button size="small"
                                    href="https://basescan.org/address/0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4#code"
                                    target="_blank">basescan</Button>
                            </Alert>
                            <Divider sx={{my: 2}}/>
                        </Box>}

                        <TextField
                            type="number"
                            label="Amount"
                            variant="outlined"
                            fullWidth
                            autoFocus={true}
                            value={amount}
                            onChange={async (e) => await updateAmount(e.target.value)}
                            inputProps={{
                                min: 1,
                                max: props.max,
                                maxlength: 2,
                            }}
                            sx={{mb: 2}}
                        />
                        <Box display="flex" flex="row" justifyContent="space-between">
                            <Typography variant="h6">PRICE</Typography>
                            <Typography variant="h6"><EthValue showUsd={true}>{value}</EthValue></Typography>
                        </Box>
                    </Box>)
                }
                {
                    state === 'pending' && (<Box textAlign="center">
                        <CircularProgress
                            size={32}
                            thickness={4}
                            color="inherit"/>
                    </Box>)
                }
                {
                    state === 'success' && (<Box>
                        <Alert severity="success">
                            <AlertTitle>Success! 🎉🎉🎉🎉🎉🎉</AlertTitle>
                            Your transaction has been completed successfully.
                            Please close this dialog and click the 'Home' button to view the changes.
                        </Alert>
                    </Box>)
                }
                {
                    state === 'error' && (<Box>
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            Something went wrong. Please try again.
                        </Alert>
                    </Box>)
                }
                <Divider sx={{my: 2}}/>
            </DialogContent>
            {
                state === 'none' && (<DialogActions sx={{px: 3, pb: 3}}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" color={buy ? 'success' : 'warning'}
                            onClick={doTransaction}>{buy ? 'Buy' : 'Sell'}</Button>
                </DialogActions>)
            }
            {
                state === 'error' && (<DialogActions sx={{px: 3, pb: 3}}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="outlined"
                            color="warning"
                            onClick={() => setState('none')}>Retry</Button>
                </DialogActions>)
            }
            {
                state === 'success' && (<DialogActions sx={{px: 3, pb: 3}}>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>)
            }
        </Dialog>
    );
}

export default TransactionDialogComponent;
