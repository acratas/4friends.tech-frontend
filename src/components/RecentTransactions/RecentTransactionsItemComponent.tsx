import React from "react";
import {TableCell} from "@mui/material";
import UserTransactionComponent from "../UserTransactionComponent";
import EthValueFormatter from "../EthValueFormatter";

const RecentTransactionsItemComponent = ({data, key, show_balance, show_twitter}: any) => {
    return (
        <React.Fragment>
            <TableCell><UserTransactionComponent user={data.trader} userComponentSettings={{target: '_blank', balance: show_balance}} twitterData={show_twitter} /></TableCell>
            <TableCell sx={{fontSize: '.75rem'}} >{data.isBuy ? 'BOUGHT' : 'SOLD'} {data.shareAmount.toString()}🔑</TableCell>
            <TableCell><UserTransactionComponent user={data.subject} userComponentSettings={{target: '_blank', balance: show_balance}} twitterData={show_twitter} /></TableCell>
            <TableCell sx={{fontSize: '.75rem'}}>
                <EthValueFormatter showUsd={true}
                          inline={false}>{data.value}</EthValueFormatter>
            </TableCell>
            <TableCell sx={{fontSize: '.75rem'}}>
                {data.date.toLocaleString()}
            </TableCell>
        </React.Fragment>
    )
};

export default React.memo(RecentTransactionsItemComponent);
