import React, {useEffect} from 'react';
import {
    Box,
    Hidden,
    Table,
    TableBody,
    TableCell, TableFooter,
    TableHead,
    TableRow
} from "@mui/material";
import {PortfolioItem} from "../lib/Portfolio";
import {BigNumber} from "ethers";
import EthValue from "./EthValue";
import {useApi} from "./ApiProvider";
import CollapsibleCard from "./CollapsibleCard";
import PortfolioRowComponent from "./PortfolioRowComponent";
import {ArrowDownward, ArrowUpward} from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useTheme} from "@mui/material/styles";
import LazyLoadComponent from "./LazyLoadComponent";


function PortfolioComponent() {
    const theme = useTheme();
    const {portfolio} = useApi();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const balance = portfolio.reduce((acc, item) => acc + item.balance, 0);
    const value = portfolio.reduce((acc, item) => acc.add(BigNumber.from(item.value || '0')), BigNumber.from(0));
    const pnlValue = portfolio.reduce((acc, item) => acc.add(BigNumber.from(item.pnl?.value || '0')), BigNumber.from(0));
    let pnlPercentage;
    try {
        pnlPercentage = pnlValue.mul(BigNumber.from("100")).div(value.sub(pnlValue)).toNumber();
        if ((pnlValue.gt(0) && pnlPercentage < 0) || (pnlValue.lt(0) && pnlPercentage > 0)) {
            pnlPercentage *= -1;
        }
    } catch (e) {
        pnlPercentage = 0;
    }


    return (
        <CollapsibleCard title="Portfolio" opened={false}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell width="100%">User</TableCell>
                        <Hidden mdDown>
                            <TableCell align="right">Holdings</TableCell>
                        </Hidden>
                        <TableCell align="right"><Hidden mdDown>Real value</Hidden><Hidden mdUp>Value</Hidden></TableCell>
                        <TableCell align="center" colSpan={2}>PNL</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {portfolio.map((item: PortfolioItem, index) => (
                        <LazyLoadComponent
                            render={() => <PortfolioRowComponent item={item} index={index} />}
                            placeholderHeight={isSmallScreen ? 70 : 50}
                        />
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell align="right"
                                   sx={{fontWeight: 'bold', fontSize: {
                                           xs: '.75rem',
                                           md: '1rem'
                                       }}}>Total</TableCell>
                        <Hidden mdDown>
                            <TableCell align="right"
                                       sx={{fontWeight: 'bold', fontSize: '1rem'}}>{balance}</TableCell>
                        </Hidden>
                        <TableCell align="right" sx={{
                            fontWeight: 'bold',
                            fontSize: {
                                xs: '.75rem',
                                md: '1rem'
                            }
                        }}><EthValue showUsd={true}>{value}</EthValue></TableCell>
                        <Hidden smDown>
                            <TableCell align="right">
                                <EthValue showUsd={true}>{pnlValue}</EthValue>
                            </TableCell>
                        </Hidden>
                        <TableCell sx={{
                            fontSize: {
                                xs: '.75rem',
                                md: '1rem'
                            }
                        }}
                                   align="right">
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                    <span
                        style={{color: pnlPercentage >= 0 ? 'green' : 'red'}}
                    >{Math.abs(pnlPercentage || 0)}%</span>
                                {(pnlPercentage || 0) > 0 && <ArrowUpward sx={{color: 'green'}} fontSize={"small"}/>}
                                {(pnlPercentage || 0) < 0 && <ArrowDownward sx={{color: 'red'}} fontSize={"small"}/>}
                            </div>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </CollapsibleCard>
    )

}

export default PortfolioComponent;
