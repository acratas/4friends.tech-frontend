import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell, Button, IconButton
} from "@mui/material";
import {useContract, useContractEvents, useSDK} from "@thirdweb-dev/react";
import Grid2 from "@mui/material/Unstable_Grid2";
import {UserCache, TxCache} from "./UserCache";
import FilterComponent from "./FilterComponent";
import {FilterAlt, FilterAltOff} from "@mui/icons-material";
import RecentTransactionsItemComponent from "./RecentTransactionsItemComponent";
import {toEth} from "../../lib/Utils";
import {FilterModel} from "./FilterModel";
import {isAllowedNumeric} from "./FilterHelper";
import {formatEther} from "ethers/lib/utils";

const RecentTransactionsComponent = () => {
    const txCache = TxCache.getInstance();
    const userCache = UserCache.getInstance();
    const sdk = useSDK();
    const {contract} = useContract('0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4');
    const {data} = useContractEvents(contract, 'Trade', {subscribe: true});
    const [transactions, setTransactions] = useState<any[]>([]);
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [cnt, setCnt] = useState<number>(0);
    const [filter, setFilter] = useState<FilterModel>({
        subject: {},
        trader: {},
        transaction: {
            direction: 'both',
        },
        view: {
            results: 10,
            bots: false,
            balance: false,
            twitter: false
        }
    });
    const filterRef = useRef(filter);
    useEffect(() => {
        filterRef.current = filter;
    }, [filter]);
    useEffect(() => {
        const len = data?.length || 0;
        if (len === 0) {
            return;
        }
        data?.splice(0, len)
            .forEach(TradeHandler);
    }, [data])
    const getBalance = useCallback(async (address: string) => {
        const balance = await sdk?.getBalance(address);
        if (!balance || !balance.value) {
            return 0;
        }
        return parseFloat(formatEther(balance.value).toString());
    }, [sdk]);
    UserCache.getInstance().setGetBalanceCallback(getBalance);
    const addTransaction = useCallback((data) => {
        setTransactions((prevTransactions) => [data, ...prevTransactions].slice(0, filterRef.current.view.results));
    }, []);

    const TradeHandler = ({data, transaction}: any) => {
        if (txCache.has(transaction.transactionHash)) {
            return;
        }
        txCache.add(transaction.transactionHash);
        setCnt((prevCnt) => prevCnt + 1);
        const filters = filterRef.current;

        if ((filters.transaction.direction === 'buy' && !data.isBuy) ||
            (filters.transaction.direction === 'sell' && data.isBuy)) {
            return;
        }

        if (!isAllowedNumeric(parseInt(data.shareAmount.toString()), filters.transaction.amount)) {
            return;
        }

        data.value = parseFloat(
            toEth(
                data.ethAmount
                .add(data.protocolEthAmount)
                .add(data.subjectEthAmount)
            ).toString()
        );

        if (!isAllowedNumeric(data.value, filters.transaction.value)) {
            return;
        }

        data.tx = transaction.transactionHash;
        data.subject = data.subject.toLowerCase();
        data.trader = data.trader.toLowerCase();
        data.date = new Date();
        userCache.loadData(data, addTransaction, filters);
    };
    useEffect(() => {
        // listener = contract?.events?.addEventListener('Trade', TradeHandler);
    }, [contract]);



    // console.log(data, isLoading, error);

    return (
        <Container sx={{
            mb: 2, mt: {
                sm: 2,
                md: 4
            }
        }}>
            <Grid2 container spacing={2}>
                <Grid2 xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                mb: 2,
                                position: 'relative',
                                pr: '1.5rem'
                            }}>
                                {showFilter ? <FilterComponent filter={filter} setFilter={setFilter} /> : ''}
                                <Button
                                    variant='outlined'
                                    onClick={() => setTransactions((prevTransactions) => [])}
                                >Clear data</Button>
                                <IconButton color="primary"
                                    onClick={() => setShowFilter((prevShowFilter) => !prevShowFilter)}
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0
                                    }}
                                >
                                    {showFilter ? <FilterAltOff /> : <FilterAlt />}
                                </IconButton>
                            </Box>
                            {transactions.length ? <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Trader</TableCell>
                                        <TableCell>Transaction</TableCell>
                                        <TableCell>Subject</TableCell>
                                        <TableCell>Value</TableCell>
                                        <TableCell>Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {transactions.map((data) =><TableRow key={data.tx} ><RecentTransactionsItemComponent
                                        data={data}
                                        show_balance={filter.view.balance}
                                        show_twitter={filter.view.twitter}
                                    /></TableRow>)}
                                </TableBody>
                            </Table> : <Box display='flex' flexDirection='column' alignItems='center' sx={{ py: 3 }}>
                                <CircularProgress disableShrink color="inherit"/>
                                Waiting for transactions that meet the search criteria...
                            </Box>}
                            <Box display="flex" justifyContent="flex-end" sx={{mt: 1}}><small>Consumed {cnt.toLocaleString()} transactions</small></Box>
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>
        </Container>
    )
}
export default React.memo(RecentTransactionsComponent);
