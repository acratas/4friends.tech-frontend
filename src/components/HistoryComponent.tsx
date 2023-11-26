import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useApi} from "./ApiProvider";
import CollapsibleCard from "./CollapsibleCard";
import {BigNumber} from "ethers";
import {
    Avatar, Box, Divider,
    List,
    ListItem,
    ListItemAvatar, ListItemText
} from "@mui/material";
import LazyLoadComponent from "./LazyLoadComponent";
import React from "react";
import TimeAgo from "react-timeago";
import EthValue from "./EthValue";
import {useNavigate} from "react-router-dom";

function HistoryComponent() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const {history, user} = useApi();
    const navigate = useNavigate();

    return (
        <CollapsibleCard title="History" opened={false}>
            <List>
                    {history.map((transaction: any, index) => (
                        <LazyLoadComponent
                            placeholderHeight={isSmallScreen ? 70 : 50}
                            render={() => {
                                const trader = transaction.trader === user?.address ? user: transaction.user;
                                const subject = transaction.subject === user?.address ? user: transaction.user;
                                return (<ListItem>
                                    <ListItemAvatar
                                        sx={{
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => navigate(`/${transaction.trader}`)}
                                        >
                                        {trader?.twitterUsername ? <Avatar
                                            src={trader?.twitterPfpUrl}
                                            alt={trader?.twitterName}
                                            />: <span style={{ width: '40px', height: '40px', border: '2px solid red', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{fontSize: '24px'}}>🤖</span></span>}
                                    </ListItemAvatar>
                                    <ListItemAvatar
                                        sx={{
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => navigate(`/${transaction.subject}`)}
                                        style={{
                                        position: 'relative',
                                        left: '-1.25rem',
                                        marginRight: '-1.25rem'
                                    }}>
                                        {subject?.twitterUsername ? <Avatar
                                            src={subject?.twitterPfpUrl}
                                            alt={subject?.twitterName}
                                        />: <span style={{ width: '40px', height: '40px', border: '2px solid red', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{fontSize: '24px'}}>🤖</span></span>}
                                    </ListItemAvatar>
                                    <Box>
                                        <ListItemText sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            justifyContent: 'center',
                                        }}>
                                            <div style={{
                                                fontSize: '0.85rem',
                                                marginBottom: '0.25rem',
                                            }}><b>{trader?.twitterUsername ? trader?.twitterName : '🤖🤖🤖🤖'}</b>&nbsp;{transaction.isBuy ? ' bought ' : ' sold '}&nbsp;{transaction.amount}&nbsp;<b>{subject?.twitterUsername ? subject?.twitterName  : '🤖🤖🤖🤖'}</b>&nbsp;{transaction.amount === 1 ? 'key' : 'keys'}</div>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'flex-start',
                                            }}><EthValue sx={{ color: transaction.isBuy ? 'green': 'red' }}>{BigNumber.from(transaction.value).add(transaction.protocolFee).add(transaction.subjectFee)}</EthValue>,&nbsp;<TimeAgo date={transaction.timestamp}/>, </div>
                                        </ListItemText>

                                    </Box>
                                </ListItem>);
                            }}
                        />
                    ))}
            </List>
        </CollapsibleCard>
    );
}
export default HistoryComponent;
