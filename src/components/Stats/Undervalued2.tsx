import React, {useCallback, useEffect, useState} from "react";
import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/index.css'
import {Box, Button, ButtonGroup, Container, IconButton, Paper, Tooltip} from "@mui/material";
import {useApi} from "../ApiProvider";
import EthValueFormatter from "../EthValueFormatter";
import {AddCircleOutline, ClearAll, RemoveCircleOutline, Twitter} from "@mui/icons-material";
import NumberFilter from '@inovua/reactdatagrid-community/NumberFilter'
import StringFilter from '@inovua/reactdatagrid-community/SelectFilter'
import {useTransactionDialog} from "../TransactionDialogProvider";
import {UserItem} from "../../lib/Responses";
import {useAddress} from "@thirdweb-dev/react";
import {useNavigate} from "react-router-dom";
import TimeAgo from "react-timeago";
import getTier from "../../lib/Tier";

import '@inovua/reactdatagrid-community/base.css'
import '@inovua/reactdatagrid-community/theme/default-light.css'
import '@inovua/reactdatagrid-community/theme/default-dark.css'
import useMediaQuery from "@mui/material/useMediaQuery";
import {useLoggedUser} from "../LoggedUserProvider";
import {LocalCache} from "../../lib/LocalCache";
import BoolEditor from "@inovua/reactdatagrid-community/BoolEditor";

ReactDataGrid.defaultProps.filterTypes.number.operators =
    ReactDataGrid.defaultProps.filterTypes.number.operators.filter(
        operator => ['gte', 'lte'].indexOf(operator.name) !== -1
    );
ReactDataGrid.defaultProps.filterTypes.string.operators =
    ReactDataGrid.defaultProps.filterTypes.string.operators.filter(
        operator => ['contains', 'startsWith', 'endsWith'].indexOf(operator.name) !== -1
    );


const defaultSortInfo: { dir: -1 | 0 | 1, name: string } = {dir: -1, name: 'supply'};

const defaultFilterValue = [
    {name: 'twitterName', operator: 'startsWith', type: 'string', value: ''},
    {name: 'supply', operator: 'gte', type: 'number', value: 0},
    {name: 'price', operator: 'gte', type: 'number', value: 0},
    {name: 'twitterFollowers', operator: 'gte', type: 'number', value: 0},
    {name: 'twitterFriendsCount', operator: 'gte', type: 'number', value: 0},
    {name: 'twitterFavoritesCount', operator: 'gte', type: 'number', value: 0},
    {name: 'twitterStatusesCount', operator: 'gte', type: 'number', value: 0},
    {name: 'selfHoldings', operator: 'gte', type: 'number', value: 0},
    {name: 'watchlistCount', operator: 'gte', type: 'number', value: 0},
    {name: 'holdingCount', operator: 'gte', type: 'number', value: 0},
    {name: 'holderCount', operator: 'gte', type: 'number', value: 0},
    {name: 'walletBalance', operator: 'gte', type: 'number', value: 0.0001},
    {name: 'actions', operator: 'eq', type: 'bool', value: false},
];

const defaultColumnVisibility = {
    'twitterPfpUrl' : true,
    'twitterName': true,
    'twitterFollowers': true,
    'twitterFriendsCount': false,
    'twitterFavoritesCount': false,
    'twitterStatusesCount': false,
    'twitterCreatedAt': false,
    'selfHoldings': true,
    'supply': true,
    'watchlistCount': true,
    'holdingCount': true,
    'holderCount': true,
    'price': true,
    'walletBalance': true,
    'lastMessageTime': false,
    'actions': true
}

const defaultColumnOrder = [
    'twitterPfpUrl',
    'twitterName',
    'twitterFollowers',
    'twitterFriendsCount',
    'twitterFavoritesCount',
    'twitterStatusesCount',
    'twitterCreatedAt',
    'selfHoldings',
    'supply',
    'watchlistCount',
    'holdingCount',
    'holderCount',
    'price',
    'walletBalance',
    'lastMessageTime',
    'actions'
    ];

LocalCache.create('sortInfo', 0, defaultSortInfo);
// @ts-ignore
LocalCache.create('filterValue', 0,defaultFilterValue);

LocalCache.create('columnVisibility', 0, defaultColumnVisibility);

LocalCache.create('columnOrder', 0, defaultColumnOrder);

const gridStyle = {
    minHeight: 550,
    height: 'calc(100vh - 6rem)'
}

class Buttons extends React.Component {
    render() {
        return (<Box className='InovuaReactDataGrid__column-header__filter-wrapper'>
            {
                // @ts-ignore
                this.props.onReset && <ButtonGroup size={'small'}><Button onClick={this.props.onReset}>Reset filters</Button></ButtonGroup>
            }
        </Box>);
    }
}

const StatsUndervalued2Component = ({theme}: { theme: any }) => {
    const address = useAddress();
    const {getUndervaluedUsers} = useApi();
    const {loggedUser} = useLoggedUser();
    const {openTransactionDialog} = useTransactionDialog();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const mainPortfolio = loggedUser?.portfolio || {};
    const dataSource = useCallback(async ({skip, limit, sortInfo, filterValue}: any) => {
        const response = await getUndervaluedUsers({
            skip: skip || 0,
            limit: limit || 20,
            sortInfo: sortInfo || [],
            filterValue: filterValue || [],
        });
        return {
            data: response?.items || [],
            count: response?.paginator?.count || 0
        }
    }, [])
    const [filterValue, setFilterValue] = useState(LocalCache.get('filterValue'));
    const [sortInfo, setSortInfo] = useState(LocalCache.get('sortInfo'));
    const [columnOrder, setColumnOrder] = useState(LocalCache.get('columnOrder'));
    const [state, setState] = useState(true);

    const handleSellClick = useCallback((user: UserItem) => () => {
        openTransactionDialog({
            open: true,
            buy: false,
            user: user,
            max: mainPortfolio[user.address] || 0,
        });
    }, [openTransactionDialog]);

    const handleBuyClick = useCallback((user: UserItem) => () => {
        openTransactionDialog({
            open: true,
            buy: true,
            user: user,
        });
    }, [openTransactionDialog]);

    const handleFilterValueChange = useCallback((filterValue: any) => {
        LocalCache.set('filterValue', filterValue);
        setFilterValue(filterValue);
    }, []);

    const handleSortInfoChange = useCallback((sortInfo: any) => {
        LocalCache.set('sortInfo', sortInfo);
        setSortInfo(sortInfo);
    }, []);

    const handleColumnOrderChange = useCallback((columnOrder: any) => {
        LocalCache.set('columnOrder', columnOrder);
        setColumnOrder(columnOrder);
    }, []);

    const handleColumnVisibleChange = useCallback(({column, visible}: {column: any, visible: any}) => {
        const columnVisibility = LocalCache.get('columnVisibility') || defaultColumnVisibility;
        columnVisibility[column] = visible;
        LocalCache.set('columnVisibility', columnVisibility);
    }, []);

    useEffect(() => {
        if (!state) {
            setState(true);
            return;
        }
    }, [state]);

    const handleResetFilters = useCallback(() => {
        LocalCache.remove('filterValue');
        LocalCache.remove('sortInfo');
        LocalCache.remove('columnOrder');
        LocalCache.remove('columnVisibility');
        setState(false);
    }, []);

    const columns = [
        {
            name: 'twitterPfpUrl', header: 'Avatar', minWidth: 50, maxWidth: 50, defaultFlex: 1,
            sortable: false, filterable: false,
            render: ({value, data}: { value: string, data: any }) => {
                return <IconButton sx={{p: 0}}
                                   onClick={() => window.open(`/${data.twitterUsername || data.address}`, '_blank')}>
                    {data.twitterUsername ? <img
                    src={value} style={{width: 32, height: 32, borderRadius: '50%'}}/> : '🤖'}</IconButton>
            },
            defaultVisible: LocalCache.get('columnVisibility')?.twitterPfpUrl ?? true,
        },
        {
            name: 'twitterName', header: 'Name', minWidth: 150, defaultFlex: 2, type: 'string',
            render: ({value, data}: { value: string, data: any }) => {
                return <Button
                    onClick={() => window.open(`/${data.twitterUsername || data.address}`, '_blank')}
                    variant={'text'}
                    sx={{
                        p: 0,
                        textTransform: 'none',
                        fontWeight: 'normal',
                        color: 'inherit',
                    }}
                >{value || '🤖🤖🤖🤖'}</Button>
            },
            defaultVisible: LocalCache.get('columnVisibility')?.twitterName ?? true,
        },
        {
            name: 'twitterFollowers',
            header: 'Followers',
            type: 'number',
            filterEditor: NumberFilter,
            maxWidth: 130,
            defaultVisible: LocalCache.get('columnVisibility')?.twitterFollowers ?? true,
        },
        {
            name: 'twitterFriendsCount',
            header: 'Following',
            type: 'number',
            filterEditor: NumberFilter,
            maxWidth: 130,
            defaultVisible: LocalCache.get('columnVisibility')?.twitterFriendsCount ?? false,
        },
        {
            name: 'twitterFavoritesCount',
            header: 'Likes',
            type: 'number',
            filterEditor: NumberFilter,
            defaultVisible: LocalCache.get('columnVisibility')?.twitterFavoritesCount ?? false,
            maxWidth: 130
        },
        {
            name: 'twitterStatusesCount',
            header: 'Tweets',
            type: 'number',
            filterEditor: NumberFilter,
            defaultVisible: LocalCache.get('columnVisibility')?.twitterStatusesCount ?? false,
            maxWidth: 130
        },
        {
            name: 'twitterCreatedAt',
            header: 'Joined Twitter',
            render: ({value}: { value: number }) => value ? (<Box>~<TimeAgo date={value}/></Box>) : '',
            defaultVisible: LocalCache.get('columnVisibility')?.twitterCreatedAt ?? false,
        },
        {
            name: 'selfHoldings',
            header: 'Self Keys',
            type: 'number',
            filterEditor: NumberFilter,
            maxWidth: 100,
            defaultVisible: LocalCache.get('columnVisibility')?.selfHoldings ?? !isSmallScreen,
        },
        {
            name: 'watchlistCount',
            header: 'Watchlists',
            type: 'number',
            filterEditor: NumberFilter,
            maxWidth: 100,
            defaultVisible: LocalCache.get('columnVisibility')?.watchlistCount ?? true,
        },
        {
            name: 'holderCount',
            header: 'Holders',
            type: 'number',
            filterEditor: NumberFilter,
            maxWidth: 100,
            defaultVisible: LocalCache.get('columnVisibility')?.holderCount ?? !isSmallScreen,
        },
        {
            name: 'holdingCount',
            header: 'Holdings',
            type: 'number',
            filterEditor: NumberFilter,
            maxWidth: 100,
            defaultVisible: LocalCache.get('columnVisibility')?.holdingCount ?? !isSmallScreen,
        },
        {
            name: 'lastMessageTime',
            header: 'Last Message',
            type: 'number',
            render: ({value}: { value: number }) => value ? (<Box>~<TimeAgo date={value}/></Box>) : '',
            defaultVisible: LocalCache.get('columnVisibility')?.lastMessageTime ?? false,
        },
        {
            name: 'price', header: 'Price',
            minWidth: 100,type: 'number', filterEditor: NumberFilter,
            render: ({value}: { value: number }) => <EthValueFormatter
                sx={{color: theme.palette.mode == 'dark' ? 'white' : 'green'}}>{value}</EthValueFormatter>,
            defaultVisible: LocalCache.get('columnVisibility')?.price ?? true,
        },
        {
            name: 'walletBalance', header: 'Balance',
            minWidth: 100,type: 'number', filterEditor: NumberFilter,
            render: ({value}: { value: number }) => {
                return(value >= 0.1 && <EthValueFormatter
                    sx={{color: theme.palette.mode == 'dark' ? 'white' : 'green'}}>{value}</EthValueFormatter>)
            },
            defaultVisible: LocalCache.get('columnVisibility')?.walletBalance ?? true,
        },
        {name: 'supply', header: 'Supply', maxWidth: 100, type: 'number', filterEditor: NumberFilter},
        {
            name: 'actions',
            header: 'Actions',
            minWidth: address ? 240 : 150,
            defaultFlex: 1,
            sortable: false,
            type: 'boolean',
            filterEditor: Buttons,
            filterEditorProps: {
                onReset: handleResetFilters
            },
            render: ({data}: { data: any }) => {
                const user = data;
                const maxSell = mainPortfolio[user.address] || 0;
                return (<Box>
                    <ButtonGroup size="small" sx={{
                        ml: {
                            xs: 1,
                            sm: 2
                        },
                        mt: {
                            xs: 1,
                            sm: 0
                        },
                        order: {
                            xs: 2,
                        }
                    }}>
                        {address && <Button color="error"
                                            disabled={maxSell <= 0}
                                            onClick={handleSellClick(user)}
                        ><Tooltip title="Sell"><RemoveCircleOutline/></Tooltip></Button>}
                        {address && <Button color="success"
                                            onClick={handleBuyClick(user)}
                        ><Tooltip title="Buy"><AddCircleOutline/></Tooltip></Button>}
                    </ButtonGroup>
                    <ButtonGroup variant="text" aria-label="group">
                        <IconButton aria-label="friend.tech" target="_blank"
                                    sx={{
                                        '&:hover': {
                                            opacity: [0.9, 0.8, 0.7],
                                        }
                                    }}
                                    href={`https://www.friend.tech/rooms/${user.address}`}>
                                <span style={{
                                    display: 'inline-block',
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: '#00bbfa',
                                    overflow: 'hidden',
                                    padding: '2px',
                                    backgroundImage: 'url(/friendtechlogowhite.png)',
                                    backgroundSize: '18px 18px',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                }}></span>
                        </IconButton>
                        <IconButton aria-label="Social BLADE" target="_blank"
                                    sx={{
                                        '&:hover': {
                                            opacity: [0.9, 0.8, 0.7],
                                        }
                                    }}
                                    href={`https://socialblade.com/twitter/user/${user.twitterUsername}`}>
                            <img src="/socialblade.png" alt="Social BLADE" height="24px" style={{
                                borderRadius: '50%',
                            }}/>
                        </IconButton>
                        <IconButton aria-label="twitter" target="_blank"

                                    href={`https://twitter.com/${user.twitterUsername}`}>
                            <Twitter sx={{color: "#00bbfa"}}/>
                        </IconButton>
                    </ButtonGroup>
                </Box>)
            },
            defaultVisible: LocalCache.get('columnVisibility')?.actions ?? true,
        }
    ]

    return (<Container maxWidth={"xl"} sx={{

    }}>
        {state && <Paper sx={{p: 0}}>
             <ReactDataGrid
                idProperty="address"

                columns={columns}
                dataSource={dataSource}
                style={gridStyle}
                pagination="remote"

                showColumnMenuLockOptions={false}

                reorderColumns={true}
                columnOrder={columnOrder}
                onColumnOrderChange={handleColumnOrderChange}
                onColumnVisibleChange={handleColumnVisibleChange}

                enableFiltering
                defaultFilterValue={filterValue}
                onFilterValueChange={handleFilterValueChange}

                defaultSortInfo={sortInfo}
                onSortInfoChange={handleSortInfoChange}

                theme={theme.palette.mode === 'dark' ? 'default-dark' : 'default-light'}
            />
        </Paper>
        }
    </Container>);
}

export default StatsUndervalued2Component;
