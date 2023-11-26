import React, {useState} from 'react';
import {
    Box,
    Card,
    CardContent, Dialog, DialogContent, DialogTitle,
    Divider, Hidden,
    IconButton, Menu, MenuItem,
    Table,
    TableBody, TableCell, TableRow, Tooltip
} from "@mui/material";
import {Twitter, Link, Help, ContentCopy, Share, MoreVert, Calculate, Close} from "@mui/icons-material";
import EthValue from "./EthValue";
import {BigNumber} from "ethers";
import {useApi} from "./ApiProvider";
import UserComponent from "./UserComponent";
import UserTransactionComponent from "./UserTransactionComponent";
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useBalance} from "@thirdweb-dev/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import TimeAgo from "react-timeago";
import getTier from "../lib/Tier";
import CalculatorComponent from "./CalculatorComponent";

function MainUserComponent() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const {user} = useApi();
    const [isBodyVisible, setBodyVisibility] = useState(true);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const handleClickDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const sx = {
        fontWeight: {
            xs: 'bold',
            md: 'normal'
        },
        fontSize: {
            xs: '.75rem',
            md: '1rem'
        }
    };

    const handleToggleVisibility = () => {
        setBodyVisibility(!isBodyVisible);
    };
    return user ? (
        <div>
            <Card>
                <Box sx={{
                    p: {
                        xs: 1,
                        sm: 2,
                    }
                }} display="flex" alignItems="start">
                    <Box flexGrow="1" display="flex" justifyContent="space-between">
                        <UserTransactionComponent user={user}
                                                  buttonSettings={{sx: {marginLeft: 2}}}
                                                  userComponentSettings={{fulladdress: !isSmallScreen}}
                                                  isMain={true}
                        />
                        <Box>
                            <Hidden smUp>
                                <IconButton
                                    aria-label="more"
                                    id="long-button"
                                    aria-controls={open ? 'long-menu' : undefined}
                                    aria-expanded={open ? 'true' : undefined}
                                    aria-haspopup="true"
                                    onClick={handleClick}
                                >
                                    <MoreVert/>
                                </IconButton>
                                <Menu
                                    id="long-menu"
                                    MenuListProps={{
                                        'aria-labelledby': 'long-button',
                                    }}
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    PaperProps={{
                                        style: {
                                            width: '20ch',
                                        },
                                    }}
                                >
                                    <MenuItem
                                        onClick={handleClickDialogOpen}
                                    ><Calculate />&nbsp;&nbsp;&nbsp;profit calculator</MenuItem>
                                    <MenuItem
                                        onClick={() => window.open(`https://twitter.com/intent/tweet?url=https://4friends.tech/${user.twitterUsername ?? user.address}&text=${user.twitterName ?? user.address}%27s%20Portfolio%20at%204friends.tech`, '_blank')}
                                    >
                                        <Share/>&nbsp;&nbsp;&nbsp;share
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => window.open(`https://www.friend.tech/rooms/${user.address}`, '_blank')}>
                                    <span style={{
                                        display: 'inline-block',
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        backgroundColor: '#00bbfa',
                                        overflow: 'hidden',
                                        padding: '2px',
                                        backgroundImage: 'url(/friendtechlogowhite.png)',
                                        backgroundSize: '18px 18px',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center',
                                    }}></span>&nbsp;&nbsp;&nbsp;firend.tech
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => window.open(`https://twitter.com/${user.twitterUsername}`, '_blank')}>
                                        <Twitter sx={{color: "#00bbfa"}}/>&nbsp;&nbsp;&nbsp;twitter/X
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => window.open(`https://socialblade.com/twitter/user/${user.twitterUsername}`, '_blank')}>
                                    <span

                                        style={{
                                            padding: '2px', borderRadius: '50%',
                                            width: '24px', height: '24px'
                                        }}>
                                    <img src="/socialblade.png" alt="Socialblade" height="24px"
                                         style={{
                                             borderRadius: '50%',
                                         }}
                                    /></span>&nbsp;&nbsp;&nbsp;SOCIAL <b>BLADE</b>
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => window.open(`https://basescan.org/address/${user.address}`, '_blank')}>
                                        <img src="https://basescan.org/images/favicon.ico?v=23.08.04.1" alt="debank"
                                             height="24px"/>&nbsp;&nbsp;&nbsp;basescan</MenuItem>
                                </Menu>
                            </Hidden>
                            <Hidden smDown>
                                <IconButton aria-label="calculate" onClick={handleClickDialogOpen}>
                                    <Calculate/>
                                </IconButton>
                                <IconButton aria-label="friend.tech" target="_blank"
                                            sx={{
                                                '&:hover': {
                                                    opacity: [0.9, 0.8, 0.7],
                                                }
                                            }}
                                            href={`https://www.friend.tech/rooms/${user.address}`}>
                                <span style={{
                                    display: 'inline-block',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: '#00bbfa',
                                    overflow: 'hidden',
                                    padding: '2px',
                                    backgroundImage: 'url(/friendtechlogowhite.png)',
                                    backgroundSize: '18px 18px',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                }}></span>
                                </IconButton>
                                <IconButton aria-label="Social BLADE" target="_blank"
                                            sx={{
                                                '&:hover': {
                                                    opacity: [0.9, 0.8, 0.7],
                                                }
                                            }}
                                            href={`https://socialblade.com/twitter/user/${user.twitterUsername}`}>
                                    <img src="/socialblade.png" alt="Social BLADE" height="24px" style={{
                                        borderRadius: '50%',
                                    }}/>
                                </IconButton>
                                <IconButton aria-label="twitter" target="_blank"

                                            href={`https://twitter.com/${user.twitterUsername}`}>
                                    <Twitter sx={{color: "#00bbfa"}}/>
                                </IconButton>

                                <IconButton aria-label="Basescan" target="_blank"
                                            href={`https://basescan.org/address/${user.address}`}>
                                    <img src="https://basescan.org/images/favicon.ico?v=23.08.04.1" alt="Basescan"
                                         height="24px"/>
                                </IconButton>

                                <IconButton
                                    href={`https://twitter.com/intent/tweet?url=https://4friends.tech/${user.twitterUsername ?? user.address}&text=${user.twitterName ?? user.address}%27s%20Portfolio%20at%204friends.tech`}
                                >
                                    <Share/>
                                </IconButton>
                            </Hidden>
                        </Box>
                    </Box>
                    <IconButton onClick={handleToggleVisibility} sx={{marginInlineStart: 2}}>
                        <ExpandMoreIcon style={{
                            transform: isBodyVisible ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s'
                        }}/>
                    </IconButton>
                </Box>
                <Collapse in={isBodyVisible}>
                    <Divider/>
                    <CardContent sx={{
                        px: {
                            xs: 0,
                            sm: 2,
                        },
                        py: {
                            xs: 0,
                            sm: 1,
                        }
                    }}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            fontWeight: {
                                                xs: 'bold',
                                                md: 'normal'
                                            },
                                            fontSize: {
                                                xs: '.75rem',
                                                md: '1rem'
                                            }
                                        }}
                                    >Address:</TableCell>
                                    <TableCell align="right" sx={{
                                        overflowWrap: "anywhere", fontWeight: {
                                            xs: 'bold',
                                            md: 'normal'
                                        },
                                        fontSize: {
                                            xs: '.75rem',
                                            md: '1rem'
                                        }
                                    }}>
                                        <Hidden mdDown>{user.address}</Hidden>
                                        <Hidden mdUp>{user.address.replace(/^(0x.{3}).*?(.{4})$/, '$1...$2')}</Hidden>
                                        <IconButton
                                            onClick={async () => await navigator.clipboard.writeText(user.address)}
                                            size="small">
                                            <ContentCopy sx={{fontSize: 'inherit'}}/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{
                                        fontWeight: {
                                            xs: 'bold',
                                            md: 'normal'
                                        },
                                        fontSize: {
                                            xs: '.75rem',
                                            md: '1rem'
                                        }
                                    }}>Holdings:</TableCell>
                                    <TableCell sx={{
                                        fontWeight: {
                                            xs: 'bold',
                                            md: 'normal'
                                        },
                                        fontSize: {
                                            xs: '.75rem',
                                            md: '1rem'
                                        }
                                    }}
                                               align="right">{user.holdingCount.users} ({user.holdingCount.keys} keys)</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{
                                        fontWeight: {
                                            xs: 'bold',
                                            md: 'normal'
                                        },
                                        fontSize: {
                                            xs: '.75rem',
                                            md: '1rem'
                                        }
                                    }}>Holders:</TableCell>
                                    <TableCell sx={{
                                        fontWeight: {
                                            xs: 'bold',
                                            md: 'normal'
                                        },
                                        fontSize: {
                                            xs: '.75rem',
                                            md: '1rem'
                                        }
                                    }} align="right">{user.holdersCount} ({user.supply || 0} keys)</TableCell>
                                </TableRow>
                                {user.watchlistCount ? (
                                    <TableRow><TableCell sx={sx}>Watchlists</TableCell><TableCell sx={sx}
                                                                                                  align="right">{user.watchlistCount}</TableCell></TableRow>) : ''}
                                {user.twitterFollowers ? (
                                    <TableRow>
                                        <TableCell sx={{
                                            fontWeight: {
                                                xs: 'bold',
                                                md: 'normal'
                                            },
                                            fontSize: {
                                                xs: '.75rem',
                                                md: '1rem'
                                            }
                                        }}>[X] Followers:</TableCell>
                                        <TableCell align="right" sx={{
                                            fontWeight: {
                                                xs: 'bold',
                                                md: 'normal'
                                            },
                                            fontSize: {
                                                xs: '.75rem',
                                                md: '1rem'
                                            }
                                        }}>{user.twitterFollowers}</TableCell>
                                    </TableRow>
                                ) : ''}
                                <TableRow>
                                    <TableCell sx={{
                                        fontWeight: {
                                            xs: 'bold',
                                            md: 'normal'
                                        },
                                        fontSize: {
                                            xs: '.75rem',
                                            md: '1rem'
                                        }
                                    }}>Key price:</TableCell>
                                    <TableCell sx={{
                                        fontWeight: {
                                            xs: 'bold',
                                            md: 'normal'
                                        },
                                        fontSize: {
                                            xs: '.75rem',
                                            md: '1rem'
                                        }
                                    }} align="right"><EthValue
                                        showUsd={true}>{user.displayPrice}</EthValue></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{
                                        fontWeight: {
                                            xs: 'bold',
                                            md: 'normal'
                                        },
                                        fontSize: {
                                            xs: '.75rem',
                                            md: '1rem'
                                        }
                                    }}>Balance:</TableCell>
                                    <TableCell sx={{
                                        fontWeight: {
                                            xs: 'bold',
                                            md: 'normal'
                                        },
                                        fontSize: {
                                            xs: '.75rem',
                                            md: '1rem'
                                        }
                                    }} align="right"><EthValue showUsd={true}>{user.balance}</EthValue></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{
                                        fontWeight: {
                                            xs: 'bold',
                                            md: 'normal'
                                        },
                                        fontSize: {
                                            xs: '.75rem',
                                            md: '1rem'
                                        }
                                    }}>Real portfolio value:</TableCell>
                                    <TableCell sx={{
                                        fontWeight: {
                                            xs: 'bold',
                                            md: 'normal'
                                        },
                                        fontSize: {
                                            xs: '.75rem',
                                            md: '1rem'
                                        }
                                    }}><EthValue showUsd={true}>{user.portfolioValue}</EthValue></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{
                                        fontWeight: {
                                            xs: 'bold',
                                            md: 'normal'
                                        },
                                        fontSize: {
                                            xs: '.75rem',
                                            md: '1rem'
                                        }
                                    }}>Total bought value:</TableCell>
                                    <TableCell sx={{
                                        fontWeight: {
                                            xs: 'bold',
                                            md: 'normal'
                                        },
                                        fontSize: {
                                            xs: '.75rem',
                                            md: '1rem'
                                        }
                                    }}><EthValue showUsd={true}>{user.totalBuyValue}</EthValue></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{
                                        fontWeight: {
                                            xs: 'bold',
                                            md: 'normal'
                                        },
                                        fontSize: {
                                            xs: '.75rem',
                                            md: '1rem'
                                        }
                                    }}>Total sold value:</TableCell>
                                    <TableCell sx={{
                                        fontWeight: {
                                            xs: 'bold',
                                            md: 'normal'
                                        },
                                        fontSize: {
                                            xs: '.75rem',
                                            md: '1rem'
                                        }
                                    }}><EthValue showUsd={true}>{user.totalSellValue}</EthValue></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{
                                        fontWeight: {
                                            xs: 'bold',
                                            md: 'normal'
                                        },
                                        fontSize: {
                                            xs: '.75rem',
                                            md: '1rem'
                                        }
                                    }}>Gas fees:</TableCell>
                                    <TableCell sx={{
                                        fontWeight: {
                                            xs: 'bold',
                                            md: 'normal'
                                        },
                                        fontSize: {
                                            xs: '.75rem',
                                            md: '1rem'
                                        }
                                    }}>
                                        <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                            <EthValue showUsd={true}>{user.gasFees}</EthValue>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{
                                        fontWeight: {
                                            xs: 'bold',
                                            md: 'normal'
                                        },
                                        fontSize: {
                                            xs: '.75rem',
                                            md: '1rem'
                                        }
                                    }}>Trading fees earned:</TableCell>
                                    <TableCell sx={{
                                        fontWeight: {
                                            xs: 'bold',
                                            md: 'normal'
                                        },
                                        fontSize: {
                                            xs: '.75rem',
                                            md: '1rem'
                                        }
                                    }}><EthValue showUsd={true}>{user.tradingFeesEarned}</EthValue></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{
                                        fontWeight: {
                                            xs: 'bold',
                                            md: 'bold'
                                        },
                                        fontSize: {
                                            xs: '.75rem',
                                            md: '1rem'
                                        }
                                    }}>ROI <Hidden mdDown>(Sell + Portfolio + Trading fees
                                        - Buy - Gas
                                        fees)</Hidden>:</TableCell>
                                    <TableCell sx={{
                                        fontWeight: {
                                            xs: 'bold',
                                            md: 'bold'
                                        },
                                        fontSize: {
                                            xs: '.75rem',
                                            md: '1rem'
                                        }
                                    }}>
                                        <EthValue showUsd={true}>{
                                            BigNumber.from("0")
                                                .add(user.totalSellValue || "0")
                                                .add(user.portfolioValue || "0")
                                                .add(user.tradingFeesEarned || "0")
                                                .add(user.totalBuyValue || "0")
                                                .add(user.gasFees || "0")
                                        }</EthValue>
                                    </TableCell>
                                </TableRow>
                                {/*{user.twitterFriendsCount && (<TableRow><TableCell sx={sx}>[X] Following</TableCell><TableCell sx={sx} align="right">{user.twitterFriendsCount}</TableCell></TableRow>)}*/}
                                {/*{user.twitterFavoritesCount && (<TableRow><TableCell sx={sx}>[X] Likes</TableCell><TableCell sx={sx} align="right">{user.twitterFavoritesCount}</TableCell></TableRow>)}*/}
                                {/*{user.twitterStatusesCount && (<TableRow><TableCell sx={sx}>[X] Posts</TableCell><TableCell sx={sx} align="right">{user.twitterStatusesCount}</TableCell></TableRow>)}*/}
                                {/*{user.twitterCreatedAt && (<TableRow><TableCell sx={sx}>[X] Joined</TableCell><TableCell sx={sx} align="right"><TimeAgo date={user.twitterCreatedAt} /></TableCell></TableRow>)}*/}


                            </TableBody>
                        </Table>
                    </CardContent>
                </Collapse>
            </Card>
            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
            >
                <DialogTitle display={'flex'} justifyContent={'space-between'}>
                    Profit Calculator
                    <IconButton onClick={handleDialogClose}><Close /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <CalculatorComponent supply={user.supply}/>
                </DialogContent>
            </Dialog>
        </div>
    ) : (
        <div></div>
    );
}

export default MainUserComponent;
