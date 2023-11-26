import React from 'react';
import {AppBar, Avatar, Box, Button, ButtonGroup, IconButton, Toolbar, Typography} from "@mui/material";
import {Favorite} from "@mui/icons-material";
import EthValue from "./EthValue";
import {formatEther} from "ethers/lib/utils";
import {BigNumber} from "ethers";
import {User} from "../lib/User";
import {useAddress, useSDK} from "@thirdweb-dev/react";
import {useTransactionDialog} from "./TransactionDialogProvider";
import {useNavigate} from "react-router-dom";


// @ts-ignore
export const MyAppBarComponent = ({setToast, toast, ...props}) => {

    const sdk = useSDK();
    const address = useAddress();
    const navigate = useNavigate();
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
    return (
        <AppBar position="fixed" color="primary" sx={{top: 'auto', bottom: 0}}>
            <Toolbar>
                <Box flexGrow="1">
                <Button variant="text" color="secondary" size="small"
                        onClick={() => {
                            if (!address) {
                                return navigate(`/${alojzy.address}`)
                            }
                            openTransactionDialog({
                                open: true,
                                buy: true,
                                user: alojzy,
                            })
                        }}
                        sx={{mx: 'auto', textTransform: "none"}}>
                    <Avatar sx={{mr: 1}}
                            src="https://pbs.twimg.com/profile_images/1458786043612868624/z90f8Zfk.jpg"/>
                    {/*<Typography sx={{color: '#fff'}}>*/}
                    {/*    To the moon 🌕*/}
                    {/*</Typography>*/}
                </Button>
                </Box>
                <Favorite color="error"/>
                <Typography sx={{color: '#fff', mx: 1,
                    fontSize: {
                        xs: '.75rem',
                        md: '1rem'
                    }}}>
                    Donate
                </Typography>
                <ButtonGroup variant="outlined" size="small" sx={{borderColor: '#fff'}}>
                    <Button onClick={transfer("100000000000000000")}><EthValue
                        sx={{color: '#fff'}}>100000000000000000</EthValue></Button>
                    <Button onClick={transfer("10000000000000000")}><EthValue
                        sx={{color: '#fff'}}>10000000000000000</EthValue></Button>
                    <Button onClick={transfer("1000000000000000")}><EthValue
                        sx={{color: '#fff'}}>1000000000000000</EthValue></Button>
                </ButtonGroup>
            </Toolbar>
        </AppBar>
    );
};
