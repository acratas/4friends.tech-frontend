import React, {createContext, useContext, useEffect, useRef, useState} from 'react';

const EthPriceContext = createContext<number>(0);

export const useEthPrice = () => {
    return useContext(EthPriceContext);
}

// @ts-ignore
export const EthPriceProvider = ({ children }) => {
    const [value, setValue] = useState<number>(0);
    useEffect(() => {
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
            .then(res => res.json())
            .then(json => {
                setValue(json.ethereum.usd);
            })
    }, []);

    return (
        <EthPriceContext.Provider value={value}>
            {children}
        </EthPriceContext.Provider>
    );
};
