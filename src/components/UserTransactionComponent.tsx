import React, {useCallback} from 'react';
import {Box, Button, ButtonGroup, Tooltip} from "@mui/material";
import {useTransactionDialog} from "./TransactionDialogProvider";
import {useAddress} from "@thirdweb-dev/react";
import {AddCircleOutline, RemoveCircleOutline, Twitter} from "@mui/icons-material";
import UserComponent from "./UserComponent";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useTheme} from "@mui/material/styles";
import {useLoggedUser} from "./LoggedUserProvider";
import {formatTwitterNumbers} from "../lib/Utils";
import TimeAgo from "react-timeago";
import './UserTransactionComponent.css';

// @ts-ignore
function UserTransactionComponent({user, ...props}) {
    const address = useAddress();
    const {openTransactionDialog} = useTransactionDialog();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const {loggedUser} = useLoggedUser();
    const maxSell = (loggedUser?.portfolio && loggedUser?.portfolio[user.address]) || 0;
    const buttonSettings = props.buttonSettings || {};
    const userComponentSettings = props.userComponentSettings || {};
    delete props.buttonSettings;
    delete props.userComponentSettings;

    const handleSellClick = useCallback(() => {
        openTransactionDialog({
            open: true,
            buy: false,
            user: user,
            max: maxSell,
        });
    }, [openTransactionDialog, user, maxSell]);

    const handleBuyClick = useCallback(() => {
        openTransactionDialog({
            open: true,
            buy: true,
            user: user,
        });
    }, [openTransactionDialog, user]);

    return (
        <Box display='flex' flexDirection='column'>
            <Box display="flex" sx={{
                flexDirection: {
                    xs: 'row',
                    sm: 'row'
                },
                alignItems: {
                    sm: 'center'
                },
            }}>
                {address && (props.isMain || !isSmallScreen) && (<ButtonGroup size="small" {...buttonSettings} sx={{
                    ml: {
                        xs: 1,
                        sm: 2
                    },
                    mt: {
                        xs: 1,
                        sm: 0
                    },
                    order: {
                        xs: 2,
                    }
                }}>
                    <Button color="error"
                            disabled={maxSell <= 0}
                            onClick={handleSellClick}
                    ><Tooltip title="Sell"><RemoveCircleOutline/></Tooltip></Button>
                    <Button color="success"
                            onClick={handleBuyClick}
                    ><Tooltip title="Buy"><AddCircleOutline/></Tooltip></Button>
                </ButtonGroup>)}
                <UserComponent user={user} maxSell={maxSell} {...{
                    isMain: props.isMain || false,
                    ...userComponentSettings
                }} />
            </Box>
            {props.twitterData ? (<div><Box
                className='twitter-data'
                onClick={() => window.open(`https://twitter.com/${user.twitterUsername}`, '_blank')}
                >
                    <Twitter sx={{width: '1rem', height: '1rem', color: '#2ca5ef'}}/>
                    {'twitterName' in user ? <small>
                        <span>{formatTwitterNumbers(user.twitterFriendsCount)} 👀</span>
                        <span>{('followers_count' in user ? formatTwitterNumbers(user.followers_count) : formatTwitterNumbers(user.twitterFollowers))} 👥</span>
                        <span>{formatTwitterNumbers(user.twitterStatusesCount)} <Twitter
                            sx={{width: '.75rem', height: '.75rem', position: 'relative', top: '2px'}}/></span>
                        <span>{formatTwitterNumbers(user.twitterFavoritesCount)} ♡</span>
                        <span><TimeAgo date={user.twitterCreatedAt}/></span>
                    </small> : <small>no data</small>}
            </Box></div>) : ""}
        </Box>);
}

export default React.memo(UserTransactionComponent);
