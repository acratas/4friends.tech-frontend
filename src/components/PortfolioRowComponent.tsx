import React from 'react';
import {PortfolioItem} from "../lib/Portfolio";
import {Hidden, TableCell, TableRow} from "@mui/material";
import UserTransactionComponent from "./UserTransactionComponent";
import EthValue from "./EthValue";
import {ArrowDownward, ArrowUpward} from "@mui/icons-material";
import KeysToProfitComponent from "./KeysToProfitComponent";
import {BigNumber} from "ethers";

function PortfolioRowComponent({item, index}: { item: PortfolioItem, index: number }) {
    return (
        <TableRow id={`portfolio${index}`}>
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
                       align="right">
                <EthValue showUsd={true}>{item.value || '0'}</EthValue>
            </TableCell>
            <Hidden smDown>
                <TableCell
                    align="right">
                    <EthValue showUsd={true}>{item.pnl?.value || '0'}</EthValue>
                </TableCell>
            </Hidden>
            <TableCell
                sx={{
                    fontSize: {
                        xs: '.75rem',
                        md: '1rem'
                    }
                }}
                align="right">
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                    <span
                        style={{color: (item.pnl?.percentage || 0) >= 0 ? 'green' : 'red'}}
                    >{Math.abs(item.pnl?.percentage || 0)}%</span>
                    {(item.pnl?.percentage || 0) > 0 && <ArrowUpward sx={{color: 'green'}} fontSize={"small"}/>}
                    {(item.pnl?.percentage || 0) < 0 && <ArrowDownward sx={{color: 'red'}} fontSize={"small"}/>}
                </div>
                {(item.pnl?.percentage || 0) < 0 ? <KeysToProfitComponent
                    supply={item.supply}
                    amount={item.balance}
                    buyPrice={item.buys?.reduce((a: BigNumber, b: BigNumber) => a.add(b), BigNumber.from(0)).mul(-1) || 0}
                /> : ''}
            </TableCell>

        </TableRow>
    );
}

export default React.memo(PortfolioRowComponent);
