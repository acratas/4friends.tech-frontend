import React, { createContext, useContext, useState } from 'react';
import TransactionDialogComponent from "./TransactionDialogComponent";
import {TransactionDialogProps} from "../lib/TransactionDialogProps";

interface TransactionDialogContextProps {
    transactionDialogData: TransactionDialogProps|false,
    openTransactionDialog: (newDialogData: TransactionDialogProps) => any,
    closeTransactionDialog: () => any
}

const defaultTransactionDialogContext: TransactionDialogContextProps = {
    transactionDialogData: false,
    openTransactionDialog: (newDialogData: TransactionDialogProps) => {},
    closeTransactionDialog: () => {}
}

const TransactionDialogContext = createContext<TransactionDialogContextProps>(defaultTransactionDialogContext);

export const useTransactionDialog = () => {
    return useContext(TransactionDialogContext);
};

// @ts-ignore
export const TransactionDialogProvider = ({ children }) => {
    const [transactionDialogData, setTransactionDialogData] = useState<TransactionDialogProps|false>(false);

    const openTransactionDialog = (newDialogData: TransactionDialogProps) => setTransactionDialogData(newDialogData);
    const closeTransactionDialog = () => setTransactionDialogData(false);

    // @ts-ignore
    return (
        <TransactionDialogContext.Provider value={{
            transactionDialogData,
            openTransactionDialog,
            closeTransactionDialog
        }}>
            {children}
            {transactionDialogData && <TransactionDialogComponent
              onClose={closeTransactionDialog}
              {...transactionDialogData}
            />}
        </TransactionDialogContext.Provider>
    );
};
