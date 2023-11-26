import React, {useCallback} from 'react';
import {BigNumber, ethers} from "ethers";
import {Box, Typography} from "@mui/material";
import {useEthPrice} from "./EthPriceProvider";

function EthValue(props: {
    children: string|BigNumber|undefined,
    sx?: any,
    showUsd?: boolean,
    showUsdPosition?: 'right'|'bottom',
    showUsdColor?: string,
    inline?: boolean,
}) {
    const ethPrice = useEthPrice();
    let value: BigNumber;
    try {
        value = BigNumber.from(props.children);
    } catch (e) {
        value = BigNumber.from(0);
    }
    const sx: any = props.sx || {};
    if (!sx['color']) {
        if (value.gt(BigNumber.from(0))) {
            sx['color'] = "green";
        } else if (value.lt(BigNumber.from(0))) {
            sx['color'] = "red";
        }
    }
    // @ts-ignore
    const usdPrice = useCallback((ethValue: string): string => {
        return (parseFloat(ethValue) * ethPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }, [ethPrice]);

    return props.inline ? (<Typography sx={{display:'inline', fontSize: 'inherit', ...sx}}>{ethers.utils.formatEther(value.sub(value.mod(1e13)))}Ξ{props.showUsd?` (${usdPrice(ethers.utils.formatEther(value.sub(value.mod(1e13))))})`:''}</Typography>) : (
        <Box sx={{ textAlign: 'right', ...sx}}>
            <Box>{ethers.utils.formatEther(value.sub(value.mod(1e13)))}Ξ</Box>
            {props.showUsd && <Typography sx={{ fontSize: '80%' }}>{usdPrice(ethers.utils.formatEther(value.sub(value.mod(1e13))))}</Typography>}
        </Box>
    );
}


export default React.memo(EthValue);
