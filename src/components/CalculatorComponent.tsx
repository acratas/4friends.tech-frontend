import React, {useEffect} from "react";
import {Box, Table, TableHead, TableRow, TableCell, TextField, TableBody, Divider, Hidden} from "@mui/material";
import {getBuyPrice, getSellPrice} from "../lib/BuyPrice";
import EthValueFormatter from "./EthValueFormatter";

const calcPLN = (a, b) => {
    return (a - b).toFixed(5);
}
const CalculatorComponent = ({supply}) => {
    const [amount, setAmount] = React.useState<number | null>(1);
    const [buyPrice, setBuyPrice] = React.useState(getBuyPrice(supply));
    const [sellPriceAmount, setSellPriceAmount] = React.useState(supply + amount);
    const [sellPrice, setSellPrice] = React.useState(getSellPrice(supply));
    const [profitDetails, setProfitDetails] = React.useState<any[]>([]);

    useEffect(() => {
        if (amount === null || amount < 1) {
            return;
        }
        let _buyPrice = 0;
        for (let i = 0; i < amount; i++) {
            _buyPrice += getBuyPrice(supply + i);
        }
        //@ts-ignore
        setBuyPrice(_buyPrice.toFixed(5));
    }, [amount]);

    useEffect(() => {
        if (amount === null || amount < 1) {
            return;
        }
        const profitDetails: any[] = [];
        let _sellPrice = 0;
        let _sellPriceAmount = Math.max(amount, supply + amount - 5);
        do {
            _sellPrice = 0;
            for (let i = amount; i > 0; i--) {
                _sellPrice += getSellPrice(_sellPriceAmount - i);
            }
            profitDetails.push({
                supply: _sellPriceAmount,
                sellPrice: _sellPrice.toFixed(5),
                pnl: (_sellPrice - buyPrice).toFixed(5),
            });
            _sellPriceAmount++;
        } while (_sellPrice < buyPrice);
        _sellPriceAmount--;

        for (let j = 1; j < 10; j++) {
            let _sellPrice1 = 0;
            for (let i = amount; i > 0; i--) {
                _sellPrice1 += getSellPrice(_sellPriceAmount + j - i);
            }
            profitDetails.push({
                supply: _sellPriceAmount + j,
                sellPrice: _sellPrice1.toFixed(5),
                pnl: (_sellPrice1 - buyPrice).toFixed(5),
            });
        }
        //@ts-ignore
        setSellPrice(_sellPrice.toFixed(5));
        setSellPriceAmount(_sellPriceAmount);
        setProfitDetails(profitDetails);

    }, [buyPrice, amount, supply]);

    return (
        <Box>
            <div>Current Supply: <b>{supply}</b></div>
            <TextField
                label="Amount"
                size="small"
                value={amount}
                sx={{my: 2}}
                fullWidth
                onChange={(e: any) => {
                    let val = e.target.value;
                    if (val === '') {
                        return setAmount(null);
                    }
                    val = parseInt(val);
                    return setAmount(Math.min(val, 100));
                }}
                inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}/>
            <div>Buy price: <EthValueFormatter inline={true}>{-buyPrice}</EthValueFormatter></div>
            <div style={{
                marginTop: '.5rem',
                marginBottom: '.5rem',
            }}>Sell price amount: {sellPriceAmount} ({sellPriceAmount - supply} 🔑 to profit)
            </div>
            <div>Sell price: <EthValueFormatter inline={true}>{sellPrice}</EthValueFormatter></div>
            <Hidden mdDown>
                <Box sx={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    marginTop: '1rem',
                    overflowX: 'hidden',
                    minHeight: '300px'
                }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Supply</TableCell>
                                <TableCell>Sell price</TableCell>
                                <TableCell>PNL</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {profitDetails.map((profitDetail, i) => (
                                <TableRow key={i}>
                                    <TableCell>{profitDetail.supply}</TableCell>
                                    <TableCell><EthValueFormatter
                                        inline={true}>{profitDetail.sellPrice}</EthValueFormatter></TableCell>
                                    <TableCell><EthValueFormatter
                                        inline={true}>{profitDetail.pnl}</EthValueFormatter></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Hidden>
        </Box>
    );
}

export default React.memo(CalculatorComponent);
