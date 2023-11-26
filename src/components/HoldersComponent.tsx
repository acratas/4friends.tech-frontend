import React from 'react';
import {
    Alert,
    Box, Button, Dialog, DialogActions, DialogContent,
    Hidden,
    Table,
    TableBody,
    TableCell, TableFooter,
    TableHead,
    TableRow, Tooltip
} from "@mui/material";
import {PortfolioItem} from "../lib/Portfolio";
import {BigNumber} from "ethers";
import EthValue from "./EthValue";
import UserComponent from "./UserComponent";
import UserTransactionComponent from "./UserTransactionComponent";
import {useApi} from "./ApiProvider";
import CollapsibleCard from "./CollapsibleCard";
import {Help, InfoOutlined} from "@mui/icons-material";
import {FriendTech} from "../lib/FriendTech";
import HoldersRowComponent from "./HoldersRowComponent";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import TransactionRowComponent from "./TransactionRowComponent";
import LazyLoadComponent from "./LazyLoadComponent";

function HoldersComponent() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [isOpen, setIsOpen] = React.useState(false);
    const {holders: portfolio} = useApi();
    const balance = portfolio.reduce((acc, item) => acc + item.balance, 0);
    const value = portfolio.reduce((acc, item) => acc.add(BigNumber.from(item.value || '0')), BigNumber.from(0));
    const friendTech = new FriendTech();

    return (
        <div>
            <CollapsibleCard title="Holders" opened={false}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width="100%">User</TableCell>
                            <Hidden mdDown>
                                <TableCell align="right">Holdings</TableCell>
                            </Hidden>
                            <TableCell align="right">Real value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {portfolio.map((item: PortfolioItem, index) => (
                            <LazyLoadComponent
                                render={() => <HoldersRowComponent item={item} index={index} />}
                                placeholderHeight={isSmallScreen ? 70 : 50}
                            />
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow >
                            <TableCell  sx={{
                                fontWeight: 'bold',
                                fontSize: {
                                    xs: '.75rem',
                                    md: '1rem'
                                }
                            }} align="right">Total</TableCell>
                            <Hidden mdDown>
                                <TableCell align="right"
                                           sx={{fontWeight: 'bold', fontSize: '1rem'}}>{balance}</TableCell>
                            </Hidden>
                            <TableCell align="right"  sx={{
                                fontWeight: 'bold',
                                fontSize: {
                                    xs: '.75rem',
                                    md: '1rem'
                                }
                            }}>
                                <Box sx={{display: 'flex', justifyContent: 'flex-end'}} onClick={() => setIsOpen(true)}>
                                    <EthValue
                                        showUsd={true}>{friendTech.getSellPriceAfterFee(balance, balance)}</EthValue>
                                    <Help sx={{ml: 2}}/>
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </CollapsibleCard>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogContent>
                    <Alert severity="info">
                        <strong>Info:</strong> The true value isn't merely the sum, which is:
                        &nbsp;<EthValue inline={true} showUsd={true}>{value}</EthValue>.
                        <p>This represents the amount users would receive if they sold all their keys:
                            &nbsp;<EthValue inline={true}
                                            showUsd={true}>{friendTech.getSellPriceAfterFee(balance, balance)}</EthValue>.
                        </p>
                        <p>The difference is... <EthValue inline={true}
                                                          showUsd={true}>{value.sub(friendTech.getSellPriceAfterFee(balance, balance))}</EthValue>.
                        </p>
                        <p>Surprising, isn't it?</p>
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    )

}

export default HoldersComponent;
