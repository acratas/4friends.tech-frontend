import React, {useEffect} from "react";
import {
    Alert,
    AlertTitle,
    Box,
    ButtonGroup,
    CircularProgress,
    Container,
    debounce,
    IconButton,
    Paper
} from "@mui/material";
import {useApi} from "../ApiProvider";
import {UserItem} from "../../lib/Responses";
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
    getGridNumericOperators,
    GridFilterModel
} from '@mui/x-data-grid';
import UserTransactionComponent from "../UserTransactionComponent";
import {Share, Sync, Twitter} from "@mui/icons-material";
import {getBuyPrice} from "../../lib/BuyPrice";
import EthValueFormatter from "../EthValueFormatter";


const columns: GridColDef[] = [
    {
        field: 'twitterName',
        headerName: 'User',
        sortable: false,
        flex: 1,
        minWidth: 250,
        renderCell: (params: GridRenderCellParams<UserItem>) => (
            <UserTransactionComponent user={params.row}/>
        ),
    },
    {
        field: 'price',
        headerName: 'Price',
        width: 100,
        sortable: true,
        type: 'number',
        renderCell: (params: GridRenderCellParams<UserItem>) => {
            const user = params.row;
            return (<EthValueFormatter>{getBuyPrice(user.supply)}</EthValueFormatter>);
        },
    },
    {
        field: 'supply',
        headerName: 'Supply',
        width: 100,
        sortable: true,
        type: 'number',
        filterOperators: getGridNumericOperators().filter((operator) => operator.value !== 'isNegative'),
    },
    {
        field: 'twitterFollowers',
        headerName: 'Followers',
        width: 100,
        sortable: true,
        type: 'number'
    },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams<UserItem>) => {
            const user = params.row;
            return (
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
            )
        }
    }
]


const StatsUndervaluedComponent = () => {

    const {getUndervaluedUsers} = useApi();
    const [loading, setLoading] = React.useState<boolean>(true);
    const [users, setUsers] = React.useState<UserItem[]>([]);
    const [error, setError] = React.useState<string>('');
    const [queryOptions, setQueryOptions] = React.useState({});

    const onFilterChange = React.useCallback((filterModel: GridFilterModel) => {
        // Here you save the data you need from the filter model
        setQueryOptions({filterModel: {...filterModel}});
    }, []);

    useEffect(() => {
        const _ = async () => {
            console.log(queryOptions);
            setLoading(true);
            const data = await getUndervaluedUsers();
            if (data && data.error) {
                setError(data.error);
            } else if (data && data.items) {
                setUsers(data?.items.map(item => ({
                    ...item,
                    price: getBuyPrice(item.supply)
                })) || []);
            }
            setLoading(false);
        };
        const debouncedFetchData = debounce(_, 500);
        debouncedFetchData();
        return () => {
            debouncedFetchData.clear();
        };
    }, [queryOptions]);



    return (
        <Container sx={{
            mb: 15, mt: {
                sm: 2,
                md: 4
            }
        }}>
            <Paper sx={{p: 0}}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    pageSizeOptions={[10]}
                    disableRowSelectionOnClick
                    getRowId={(row) => row.address}
                    filterMode={'server'}
                    onFilterModelChange={onFilterChange}
                    loading={loading}
                />
            </Paper>
        </Container>
    )
}

export default StatsUndervaluedComponent;
