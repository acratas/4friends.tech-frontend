import React, {useCallback} from 'react';
import {Hidden, TableCell, TableRow, Typography} from "@mui/material";
import UserTransactionComponent from "./UserTransactionComponent";
import EthValue from "./EthValue";
import {format} from "date-fns";
import {BigNumber} from "ethers";
import {Transaction} from "../lib/Transaction";

function TransactionRowComponent({transaction, index}: { transaction: Transaction, index: number }) {
    const goToBasescan = useCallback((txHash: string) => {
        window.open(`https://basescan.org/tx/${txHash}`, '_blank');
    }, []);

    return (
        <TableRow id={`transaction${index}`}>
            <TableCell>
                <UserTransactionComponent user={transaction}/>
            </TableCell>
            <Hidden lgDown>
                <TableCell
                    sx={{cursor: 'pointer'}}
                    onClick={() => goToBasescan(transaction.hash)}
                >{transaction.isBuy ? "Buy" : "Sell"}</TableCell>
            </Hidden>
            <Hidden mdDown>
                <TableCell
                    sx={{cursor: 'pointer'}}
                    onClick={() => goToBasescan(transaction.hash)}
                >
                    <Typography variant="caption" sx={{whiteSpace: 'nowrap'}}>
                        {format(new Date(transaction.timestamp), 'dd.MM HH:mm')}
                    </Typography>
                </TableCell>
                <TableCell align="right"
                           sx={{cursor: 'pointer'}}
                           onClick={() => goToBasescan(transaction.hash)}
                ><Hidden lgUp>{transaction.isBuy ? '+' : '-'}</Hidden>{transaction.amount}
                </TableCell>
            </Hidden>
            <Hidden mdDown>
                <TableCell align="right"
                           sx={{cursor: 'pointer'}}
                           onClick={() => goToBasescan(transaction.hash)}
                ><EthValue>{transaction.value}</EthValue></TableCell>
                <TableCell align="right"
                           sx={{cursor: 'pointer'}}
                           onClick={() => goToBasescan(transaction.hash)}
                >{transaction.fee.eq(0) ? (<span>...</span>) :  (<EthValue>{transaction.fee}</EthValue>)}</TableCell>
            </Hidden>
            <TableCell align="right"
                       sx={{
                           cursor: 'pointer',
                           fontWeight: 'bold',
                           fontSize: {
                               xs: '.75rem',
                               md: '1rem'
                           }
                       }}
                       onClick={() => goToBasescan(transaction.hash)}
            ><EthValue>{BigNumber.from(transaction.fee || 0).add(BigNumber.from(transaction.value || 0))}</EthValue></TableCell>
        </TableRow>
    );
}

export default React.memo(TransactionRowComponent);
