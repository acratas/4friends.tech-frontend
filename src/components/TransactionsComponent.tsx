import React from 'react';
import {
    Box, Hidden,
    Table,
    TableBody,
    TableCell, TableContainer,
    TableFooter,
    TableHead,
    TableRow, Tooltip
} from "@mui/material";
import {Transaction} from "../lib/Transaction";
import {BigNumber} from "ethers";
import EthValue from "./EthValue";
import {useApi} from "./ApiProvider";
import CollapsibleCard from "./CollapsibleCard";
import {Help} from "@mui/icons-material";
import TransactionRowComponent from "./TransactionRowComponent";
import LazyLoadComponent from "./LazyLoadComponent";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

function TransactionsComponent() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const {transactions} = useApi();
    const [fee, value, total, amount] = transactions
        .reduce((acc, transaction) => [
                acc[0].add(BigNumber.from(transaction.fee || 0)),
                acc[1].add(BigNumber.from(transaction.value || 0)),
                acc[2].add(BigNumber.from(transaction.fee || 0).add(BigNumber.from(transaction.value || 0))),
                acc[3] + transaction.amount
            ],
            [BigNumber.from(0), BigNumber.from(0), BigNumber.from(0), 0]
        );

    return (
        <CollapsibleCard title="User Transactions" opened={false}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell width="100%">Subject</TableCell>
                                <Hidden lgDown>
                                    <TableCell>Transaction</TableCell>
                                </Hidden>
                                <Hidden mdDown>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                </Hidden>
                                <Hidden mdDown>
                                    <TableCell align="right">Value</TableCell>
                                    <TableCell align="right">Gas used</TableCell>
                                </Hidden>
                                <TableCell align="right">Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((transaction: Transaction, index) => (
                                <LazyLoadComponent
                                    render={() => <TransactionRowComponent transaction={transaction} index={index} />}
                                    placeholderHeight={isSmallScreen ? 70 : 50}
                                />
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <Hidden lgDown>
                                    <TableCell></TableCell>
                                </Hidden>
                                <Hidden mdDown>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </Hidden>
                                <TableCell align="right" sx={{fontWeight: 'bold', fontSize: {
                                        xs: '.75rem',
                                        md: '1rem'
                                    }}}>Total</TableCell>
                                <Hidden mdDown>
                                    <TableCell align="right" sx={{
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}><EthValue showUsd={true}>{value}</EthValue></TableCell>
                                    <TableCell align="right" sx={{
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}><Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                        <EthValue showUsd={true}>{fee}</EthValue>
                                        <Tooltip title="Gas fees are still being updated. It might not be the full amount.">
                                            <Help sx={{ml: 1}}/>
                                        </Tooltip>
                                    </Box></TableCell>
                                </Hidden>
                                <TableCell align="right" sx={{
                                    fontWeight: 'bold',
                                    fontSize: {
                                        xs: '.75rem',
                                        md: '1rem'
                                    }
                                }}><EthValue showUsd={true}>{total}</EthValue></TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
        </CollapsibleCard>
    );
}

export default TransactionsComponent;
