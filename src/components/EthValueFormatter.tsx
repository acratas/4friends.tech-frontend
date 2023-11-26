import React, {useCallback} from 'react';
import {Box, Typography} from "@mui/material";
import {useEthPrice} from "./EthPriceProvider";

function EthValueFormatter({children, ...props}: {
    children: number,
    showUsd?: boolean,
    inline?: boolean,
    sx?: any
}) {
    const ethPrice = useEthPrice();
    const sx: any = props?.sx || {};
    if (!sx['color']) {
        if (children > 0) {
            sx['color'] = "green";
        } else if (children < 0) {
            sx['color'] = "red";
        }
    }
    // @ts-ignore
    const usdPrice = useCallback((ethValue: number): string => {
        return (ethValue * ethPrice).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    }, [ethPrice]);

    return props?.inline ? (<Typography sx={{
        display: 'inline',
        fontSize: 'inherit', ...sx
    }}>{children}Ξ{props?.showUsd ? ` (${usdPrice(children)})` : ''}</Typography>) : (
        <Box sx={{textAlign: 'right', ...sx}}>
            <Box>{children}Ξ</Box>
            {props?.showUsd && <Typography
              sx={{fontSize: '80%'}}>{usdPrice(children)}</Typography>}
        </Box>
    );
}


export default React.memo(EthValueFormatter);
