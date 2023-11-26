import React from 'react';
import {PortfolioItem} from "../lib/Portfolio";
import {Hidden, TableCell, TableRow} from "@mui/material";
import UserTransactionComponent from "./UserTransactionComponent";
import EthValue from "./EthValue";

function HoldersRowComponent({item, index}: { item: PortfolioItem, index: number }) {
    return (
        <TableRow id={`holder${index}`}>
            <TableCell>
                <UserTransactionComponent user={item}/>
            </TableCell>
            <Hidden mdDown>
                <TableCell align="right">{item.balance}</TableCell>
            </Hidden>
            <TableCell sx={{
                fontWeight: 'bold',
                fontSize: {
                    xs: '.75rem',
                    md: '1rem'
                }
            }}
                align="right"><EthValue showUsd={true}>{item.value || '0'}</EthValue></TableCell>
        </TableRow>
    );
}

export default React.memo(HoldersRowComponent);
