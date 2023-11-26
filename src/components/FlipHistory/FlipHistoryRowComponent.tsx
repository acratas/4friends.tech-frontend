import React, {useCallback} from 'react';
import {Hidden, TableCell, TableRow, Typography} from "@mui/material";
import UserTransactionComponent from "../UserTransactionComponent";
import EthValue from "../EthValue";
import {format} from "date-fns";
import {BigNumber} from "ethers";
import {Transaction} from "../../lib/Transaction";

function FlipHistoryRowComponent({flip, index}: { flip: any, index: number }) {
    return (
        <TableRow id={`flip${index}`}>
            <TableCell>
                <UserTransactionComponent user={flip.sell}/>
            </TableCell>
            <Hidden mdDown>
                <TableCell>
                    <Typography variant="caption" sx={{whiteSpace: 'nowrap'}}>
                        {format(new Date(flip.sell.timestamp), 'dd.MM HH:mm')}
                    </Typography>
                </TableCell>
            </Hidden>
            <TableCell align="right">
                {flip.sell.amount}
            </TableCell>
            <Hidden mdDown>
                <TableCell align="right">
                    <EthValue>{flip.buy.value}</EthValue>
                </TableCell>
                <TableCell align="right">
                    <EthValue>{flip.sell.value}</EthValue>
                </TableCell>
            </Hidden>
            <TableCell align="right"
                       sx={{
                           fontWeight: 'bold',
                           fontSize: {
                               xs: '.75rem',
                               md: '1rem'
                           }
                       }}>
                <EthValue>{BigNumber.from(flip.buy.value || 0).add(BigNumber.from(flip.sell.value || 0))}</EthValue>
            </TableCell>
        </TableRow>
    );
}

export default React.memo(FlipHistoryRowComponent);
