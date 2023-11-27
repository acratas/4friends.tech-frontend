import {Box, CircularProgress, Container, debounce, Paper} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import MainUserComponent from "./MainUserComponent";
import PortfolioComponent from "./PortfolioComponent";
import TransactionsComponent from "./TransactionsComponent";
import React, {useEffect} from "react";
import {useApi} from "./ApiProvider";
import {useAddress} from "@thirdweb-dev/react";
import HoldersComponent from "./HoldersComponent";
import {isEthAddress} from "../lib/Utils";
import HistoryComponent from "./HistoryComponent";
import FlipHistoryComponent from "./FlipHistory/FlipHistoryComponent";

export const UserLookupComponent = ({address, ...props}: any) => {
    const loggedInAddress = useAddress();
    const {user, loadData} = useApi();
    const [loading, setLoading] = React.useState(0);

    useEffect(() => {
        const _ = async () => {
            if (isEthAddress(address || '') || address.match(/^[0-9_a-zA-Z]+$/)) {
                setLoading(1);
                await loadData(address || '', setLoading);
            } else if (address === 'random-holder') {
                setLoading(1);
                await loadData(address, setLoading);
            }
        };
        const debouncedFetchData = debounce(_, 500);
        debouncedFetchData();
        return () => {
            debouncedFetchData.clear();
        };
    }, [address]);

    return loading > 0 ? (
        <Container sx={{mb: 15, mt: {
            sm: 2,
            md: 4
            }
        }}>
            <Paper sx={{p: 4}}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <CircularProgress disableShrink color="inherit"/>
                </Box>
            </Paper>
        </Container>
    ) : (user ? (
        <Container sx={{mb: 15, mt: {
                sm: 2,
                md: 4
            }}}>
            <Grid2 container spacing={2}>
                <Grid2 xs={12}>
                    <MainUserComponent/>
                </Grid2>
                <Grid2 xs={12}>
                    <PortfolioComponent/>
                </Grid2>
                <Grid2 xs={12}>
                    <HoldersComponent/>
                </Grid2>
                <Grid2 xs={12}>
                    <TransactionsComponent/>
                </Grid2>
                <Grid2 xs={12}>
                    <FlipHistoryComponent/>
                </Grid2>
                <Grid2 xs={12}>
                    <HistoryComponent/>
                </Grid2>
            </Grid2>
        </Container>
    ) : (
        <Container sx={{mb: 15, mt: 4}}>
            <Paper sx={{p: 4}}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <h3>User not found</h3>
                    <p>
                        The address is not registered on friend.tech.
                    </p>
                    {loggedInAddress === address && (<p>
                        You can sign up at your own risk here: <a href="https://friend.tech">https://friend.tech</a>
                    </p>)}
                </Box>
            </Paper>
        </Container>
    ));
}
