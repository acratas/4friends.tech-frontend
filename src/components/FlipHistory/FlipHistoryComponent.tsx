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
import {BigNumber} from "ethers";
import EthValue from "../EthValue";
import {useApi} from "../ApiProvider";
import CollapsibleCard from "../CollapsibleCard";
import {Help} from "@mui/icons-material";
import LazyLoadComponent from "../LazyLoadComponent";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import FlipHistoryRowComponent from "./FlipHistoryRowComponent";

function FlipHistoryComponent() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMdScreen = useMediaQuery(theme.breakpoints.down('md'));
    const {flipHistory} = useApi();
    const [buyValue, sellValue, total, amount] = flipHistory
        .reduce((acc, item) => [
                acc[0].add(BigNumber.from(item.buy.value || 0)),
                acc[1].add(BigNumber.from(item.sell.value || 0)),
                acc[2].add(BigNumber.from(item.buy.value || 0)).add(BigNumber.from(item.sell.value || 0)),
                acc[3] + item.sell.amount
            ],
            [BigNumber.from(0), BigNumber.from(0), BigNumber.from(0), 0]
        );

    return (
        <CollapsibleCard title="Flip History aka Realized PNL" opened={false}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell width="100%">Subject</TableCell>
                                <Hidden mdDown>
                                    <TableCell>Sell data</TableCell>
                                </Hidden>
                                <TableCell align="right">Amount</TableCell>
                                <Hidden mdDown>
                                    <TableCell align="right">Buy value</TableCell>
                                    <TableCell align="right">Sell value</TableCell>
                                </Hidden>
                                <TableCell align="right">PNL</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {flipHistory.map((flipItem: any, index) => (
                                <LazyLoadComponent
                                    render={() => <FlipHistoryRowComponent flip={flipItem} index={index} />}
                                    placeholderHeight={isSmallScreen ? 70 : 50}
                                />
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={isMdScreen ? 1 : 2} align="right" sx={{fontWeight: 'bold', fontSize: {
                                        xs: '.75rem',
                                        md: '1rem'
                                    }}}>Total</TableCell>
                                <TableCell align="right" sx={{
                                    fontWeight: 'bold',
                                    fontSize: '1rem'
                                }}>{amount}</TableCell>
                                <Hidden mdDown>
                                    <TableCell align="right" sx={{
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}><EthValue showUsd={true}>{buyValue}</EthValue></TableCell>
                                    <TableCell align="right" sx={{
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}><Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                                        <EthValue showUsd={true}>{sellValue}</EthValue>
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

export default FlipHistoryComponent;
