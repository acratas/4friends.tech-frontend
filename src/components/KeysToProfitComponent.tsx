import React, {useEffect} from "react";
import {getSellPrice} from "../lib/BuyPrice";
import {BigNumber, ethers} from "ethers";
import {Tooltip} from "@mui/material";

const KeysToProfitComponent = ({supply, amount, buyPrice}) => {

    supply = parseInt(supply);
    amount = parseInt(amount);
    buyPrice = parseFloat(buyPrice instanceof BigNumber ?  ethers.utils.formatEther(buyPrice.sub(buyPrice.mod(1e13))) : buyPrice).toFixed(5);

    const [sellPriceAmount, setSellPriceAmount] = React.useState(supply + amount);

    useEffect(() => {
        if (amount < 1) {
            return;
        }
        let _sellPrice = 0;

        let _sellPriceAmount = Math.max(amount, supply);
        do {
            _sellPrice = 0;
            for (let i = amount; i > 0; i--) {
                _sellPrice += getSellPrice(_sellPriceAmount - i);
            }
            _sellPriceAmount++;
        } while (_sellPrice < buyPrice);
        _sellPriceAmount--;
        setSellPriceAmount(_sellPriceAmount);

    }, [buyPrice, amount, supply]);

    return <Tooltip title={`${sellPriceAmount - supply} 🔑 to profit`}><small>{sellPriceAmount - supply} 🔑</small></Tooltip>;
}

export default React.memo(KeysToProfitComponent);
