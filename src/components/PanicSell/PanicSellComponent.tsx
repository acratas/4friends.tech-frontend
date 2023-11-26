import React, {useCallback, useEffect} from 'react';
import {
    Alert,
    Box,
    Button,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Stack,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField,
    Typography
} from "@mui/material";
import {TableVirtuoso, TableComponents} from "react-virtuoso";
import {useApi} from "../ApiProvider";
import UserComponent from "../UserComponent";
import {useTheme} from "@mui/material/styles";
import EthValue from "../EthValue";
import {BigNumber} from "ethers";
import {FriendTech} from "../../lib/FriendTech";
import {useChainId, useContract, useContractWrite} from "@thirdweb-dev/react";

interface ToSell {
    [address: string]: {
        checked: boolean;
        amount: number;
        value: string|BigNumber;
    }
}

const VirtuosoTableComponents: TableComponents<any> = {
    Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
        <TableContainer component={Box} {...props} ref={ref}/>
    )),
    Table: (props) => (
        <Table {...props} sx={{borderCollapse: 'separate', tableLayout: 'fixed'}}/>
    ),
    TableHead,
    TableRow: ({item: _item, ...props}) => <TableRow {...props} />,
    TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
        <TableBody {...props} ref={ref}/>
    )),
};
const ft = new FriendTech();
const PanicSellComponent = () => {
    const {portfolio: portfolioArr} = useApi();
    const chainId = useChainId();
    const { contract } = useContract('0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4');
    const { mutateAsync } = useContractWrite(contract, "sellShares");
    const theme = useTheme();
    const [checkAll, setCheckAll] = React.useState<boolean>(false);
    const [toSell, setToSell] = React.useState<ToSell>({});
    const [portfolio, setPortfolio] = React.useState<{ [address: string]: any }>({});
    const [totalSellValue, setTotalSellValue] = React.useState<BigNumber>(BigNumber.from(0));
    const [totalSellKeys, setTotalSellKeys] = React.useState<number>(0);
    const [open, setOpen] = React.useState(false);
    useEffect(() => {
        const toSell: ToSell = {};
        portfolioArr.forEach((user) => {
            toSell[user.address] = {
                checked: false,
                amount: 0,
                value: '0',
            }
            portfolio[user.address] = user;
        });
        setToSell(toSell);
        setPortfolio(portfolio);
    }, [portfolioArr]);
    useEffect(() => {
        setCheckAll(
            Object.keys(toSell)
                .every((address) => toSell[address].checked && toSell[address].amount === portfolio[address].balance)
        );
        const {totalSellValue, totalSellKeys} = Object.values(toSell).reduce((total, user) => {
            return {
                totalSellValue: total.totalSellValue.add(user.value),
                totalSellKeys: total.totalSellKeys + user.amount,
            };
        }, {totalSellValue: BigNumber.from(0), totalSellKeys: 0});
        setTotalSellValue(totalSellValue);
        setTotalSellKeys(totalSellKeys);
    }, [toSell]);
    const getBuyPrice = useCallback(
        (buys: BigNumber[]) => buys.reduce((carry: BigNumber, buy: BigNumber) => carry.add(buy), BigNumber.from(0)),
        []);
    const handleCheckAll = useCallback(async () => {
        if (!checkAll) {
            const _toSell: ToSell = {};
            Object.keys(toSell).forEach((address) => {
                _toSell[address] = {
                    checked: true,
                    amount: portfolio[address].balance,
                    value: portfolio[address].value,
                }
            });
            setToSell(_toSell);
        }
        setCheckAll(!checkAll);
    }, [checkAll, portfolioArr]);
    const handleToSelect = useCallback((address: string) => () => {
        const checked = !toSell[address].checked;
        const amount = checked ? portfolio[address].balance : 0;
        const value = checked ? portfolio[address].value : '0';
        const _toSell = {
            ...toSell,
            [address]: {
                checked,
                amount,
                value,
            }
        };
        setToSell(_toSell);
    }, [toSell]);
    const updateToSellValue = useCallback((address: string, value: any) => {
        const max = portfolio[address].balance;
        value = typeof value === 'string' ? parseInt(value) : value;
        value = Math.min(max, Math.max(!isNaN(value) ? value : 0, 0));
        const _toSell = {
            ...toSell,
            [address]: {
                ...toSell[address],
                amount: value,
                value: value === 0 ? '0' : (value === max ? portfolio[address].value : ft.getSellPriceAfterFee(portfolio[address].supply, value)),
            }
        };
        setToSell(_toSell);
    }, [toSell]);
    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);
    const handlePanicSell = useCallback(async () => {
        try {
            Object.keys(toSell)
                .filter((address) => toSell[address].checked)
                .forEach((address) => {
                    try {
                        // @ts-ignore
                        mutateAsync({args: [address, toSell[address].amount]});
                    } catch (e) {
                        console.log(e);
                    }
                });
        } catch (e) {
            console.log(e);
        }
    }, [chainId, toSell]);
    return (
        <div>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                        sx={{cursor: 'pointer'}}
                        onClick={() => checkAll && handleCheckAll()}
                    >Selected</Typography>
                    <Switch
                        checked={checkAll}
                        onChange={handleCheckAll}
                    />
                    <Typography
                        sx={{cursor: 'pointer'}}
                        onClick={() => !checkAll && handleCheckAll()}
                    >All</Typography>
                </Stack>
                <Button
                    onClick={() => (totalSellKeys > 0 && setOpen(true))}
                    size='large'
                    color='error'
                    variant='contained'>SELL {totalSellKeys}🔑 for ~<EthValue showUsd={false} inline={true} sx={{color: 'inherit'}}>{totalSellValue}</EthValue></Button>
            </Box>
            <Box
                sx={{
                    minHeight: '400px',
                    height: 'calc(100vh - 350px)',
                    width: '100%',
                    mt: 2,
                    mb: 3
                }}
            >
                <TableVirtuoso
                    data={portfolioArr}
                    components={VirtuosoTableComponents}
                    fixedHeaderContent={() => <TableRow
                        sx={{
                            backgroundColor: theme.palette.background.default,
                        }}
                    >
                        <TableCell sx={{width: '100px'}} key='checkbox'></TableCell>
                        <TableCell align="left" key='user'>User</TableCell>
                        <TableCell align="right">PNL</TableCell>
                        <TableCell sx={{width: '300px'}} key='tosell' colSpan={2}>To Sell</TableCell>
                    </TableRow>}
                    itemContent={(index: number, data: any) =>
                        <React.Fragment>
                            <TableCell key='checkbox'>
                                <Switch
                                    checked={toSell[data.address]?.checked}
                                    onClick={handleToSelect(data.address)}
                                />
                            </TableCell>
                            <TableCell key='user'>
                                <UserComponent user={data} maxSell={data.balance}/>
                            </TableCell>
                            <TableCell align="right">
                                <EthValue showUsd={true}>{getBuyPrice(data.buys).add(data.value)}</EthValue>
                            </TableCell>
                            <TableCell sx={{width: '200px'}} key='tosell'>
                                <Box display='flex' alignItems='center'>
                                <TextField
                                    size='small'
                                    type='number'
                                    variant='standard'
                                    value={toSell[data.address]?.amount}
                                    sx={{width: '50px', textAlign: 'right'}}
                                    onChange={(e) => updateToSellValue(data.address, e.target.value)}
                                /><Typography variant='h6'>/{data.balance}</Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box display='flex' alignItems='center' justifyContent='flex-end'>
                                    <EthValue showUsd={true}>{toSell[data.address]?.value}</EthValue>
                                    <Typography variant='h4'>/</Typography>
                                    <EthValue showUsd={true}>{data.value || '0'}</EthValue>
                                </Box>
                            </TableCell>
                        </React.Fragment>
                    }
                />
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirm Quick Sell</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Alert severity='warning'>
                            Are you sure you want to quick sell {totalSellKeys}🔑 for ~<EthValue showUsd={false} inline={true} sx={{color: 'inherit'}}>{totalSellValue}</EthValue>?
                        </Alert>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handlePanicSell} color='error' variant='contained'>Quick Sell</Button>
                </DialogActions>
            </Dialog>
        </div>
    )

}

export default React.memo(PanicSellComponent);
