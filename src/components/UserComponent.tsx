import React, {useEffect} from 'react';
import {Avatar, Badge, Box, Hidden, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {getBuyPrice} from "../lib/BuyPrice";
import {useSDK} from "@thirdweb-dev/react";
import {BigNumber, ethers} from "ethers";

// @ts-ignore
function UserComponent({user, maxSell, ...props}) {

    const navigate = useNavigate();

    const userBlockParams: any = {};

    const [balance, setBalance] = React.useState(BigNumber.from(0));

    const sdk = useSDK();

    useEffect(() => {
        if (sdk && props.balance) {
            sdk.getBalance(user.address).then((balance: any) => {
                setBalance(balance.value);
            });
        }
    }, [sdk])


    if (!props.noclick) {
        userBlockParams['style'] = {cursor: 'pointer'};
        userBlockParams['onClick'] = () => (props.target || 'self') === '_blank' ?
            window.open('/' + (user.twitterUsername || user.address), '_blank') :
            navigate('/' + (user.twitterUsername || user.address));
    }
    //
    // console.log(user)

    return (
        <Box display="flex" flexDirection="row" alignItems="center" maxWidth={600}>
            <Box display="flex"
                 flexShrink={1}
                 flexDirection="row"
                 alignItems="center">
                <Badge color="success" badgeContent={maxSell} overlap="circular" anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}>
                    {/*<Badge color="info" badgeContent={user.selfHoldings ? Math.max(user.selfHoldings, 0) : 0} overlap="circular" anchorOrigin={{*/}
                    {/*    vertical: 'top',*/}
                    {/*    horizontal: 'left',*/}
                    {/*}}>*/}
                    {user?.twitterUsername ? <Avatar src={user.twitterPfpUrl}
                                                     alt={user.twitterUsername || '🤖'}
                                                     sx={{
                                                         mr: 1,
                                                         width: {
                                                             xs: 32,
                                                             md: 40
                                                         },
                                                         height: {
                                                             xs: 32,
                                                             md: 40
                                                         }
                                                     }}
                                                     {...userBlockParams}
                    ></Avatar> : '🤖'}
                    {/*</Badge>*/}
                </Badge>
                <Box flexDirection="column" flexGrow={1}>
                    <Box {...userBlockParams}>
                        <Typography sx={{
                            fontSize: {
                                xs: props.isMain ? '1rem' : '.75rem',
                                md: '1rem'
                            }
                        }}>{user?.twitterUsername ? user.twitterName : '🤖🤖🤖🤖'}</Typography>
                        {user?.twitterUsername && <Hidden smDown><Typography
                          sx={{fontSize: 12}}
                        >@{user.twitterUsername} {user.supply ? ` | 🔑${getBuyPrice(user.supply)}Ξ` : ''}</Typography></Hidden>}
                    </Box>
                    {(props.balance && balance) ? (
                        <small>💰 {ethers.utils.formatEther(balance.sub(balance.mod(1e13)))}Ξ</small>) : ""}


                    {/*<Typography sx={{fontSize:12}}>{props.fulladdress ? user.address : user.address.replace(/^(0x.{3}).*?(.{4})$/, '$1...$2')}*/}

                    {/*</Typography>*/}

                </Box>
            </Box>
        </Box>
    );
}

export default React.memo(UserComponent);
