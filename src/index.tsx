import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {Base} from "@thirdweb-dev/chains";
import {ThirdwebProvider} from "@thirdweb-dev/react";
import {ApiProvider} from "./components/ApiProvider";
import {EthPriceProvider} from "./components/EthPriceProvider";
import {LoggedUserProvider} from "./components/LoggedUserProvider";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <ThirdwebProvider
            activeChain={Base}
            supportedChains={[Base]}
            clientId="779ab90080a285ad0a9c0bd4044ef00a"
        >

                <EthPriceProvider>
                    <LoggedUserProvider>
                        <ApiProvider>
                            <App/>
                        </ApiProvider>
                    </LoggedUserProvider>
                </EthPriceProvider>

        </ThirdwebProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
