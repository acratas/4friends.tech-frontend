import React, {useEffect} from 'react';
import {useApi} from "./ApiProvider";
import {
    Avatar,
    Box, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider, IconButton
} from "@mui/material";
import UserTransactionComponent from "./UserTransactionComponent";
import {ArrowBack, ArrowForward, ArrowLeft, ArrowRight} from "@mui/icons-material";
import {getBuyPrice} from "./../lib/BuyPrice";
import EthValueFormatter from "./EthValueFormatter";
import {useParams} from "react-router-dom";
import IsotopeComponent from "./IsotopeComponent";
import './ArmyComponent.css'

const packeryOptions = {
    itemSelector: '.grid-item',
    gutter: 10
};

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

const BLYCComponent = ({mode}) => {
    const identifier = '0xf9b7cf4be6f4cde37dd1a5b75187d431d94a4fcc';
    const [circles, setCircles] = React.useState<any[]>([]);
    const {fetchUserData} = useApi();
    const [open, setOpen] = React.useState(false);
    const [idx, setIdx] = React.useState(0);
    const [user, setUser] = React.useState<any>(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const showUser = (user, idx) => {
        return () => {
            setUser(user);
            setIdx(idx);
            handleClickOpen();
        }
    }
    useEffect(() => {
        if (!identifier) return;
        const fetchData = async () => {
            const data = await fetchUserData(identifier);
            setCircles(shuffle(data[mode === 'portfolio' ? 'portfolio' : 'holders']));
        }
        fetchData();
    }, [identifier]);

    const handleNext = () => {
        if (idx < circles.length - 1) {
            setUser(circles[idx + 1]);
            setIdx(idx + 1);
        }
    }

    const handlePrev = () => {
        if (idx > 0) {
            setUser(circles[idx - 1]);
            setIdx(idx - 1);
        }
    }

    return <Box>
        {circles.length ? <IsotopeComponent>
            {circles.map((item, idx) => <div className={'grid-item'} style={{
                width: 48 * Math.ceil(item.balance/2),
                height: 48 * Math.ceil(item.balance/2),
                maxWidth: '96vw',
                maxHeight: '96vw',
            }}>{item.twitterUsername ? <Avatar
                onClick={showUser(item, idx)}
                src={item.balance > 2 ? item.twitterPfpUrl?.replace(/_normal/, '_400x400') : item.twitterPfpUrl}
                alt={item.twitterUsername}
                sx={{cursor: 'pointer',
                    width: 48 * Math.ceil(item.balance/2),
                    height: 48 * Math.ceil(item.balance/2),
                    maxWidth: '96vw',
                    maxHeight: '96vw',
                }}
            /> : <span className='bot'><span style={{fontSize: (24 * Math.ceil(item.balance/2)) + 'px'}}>🤖</span></span>}</div>)}
        </IsotopeComponent>: <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'
            , height: '90vh', width: '100vw'
        }}>
            <CircularProgress disableShrink color="inherit"/>
        </div>}
        <Dialog open={open}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description">
            {user && <DialogTitle sx={{minWidth: '300px'}}>
              <UserTransactionComponent user={user}/>
            </DialogTitle>}
            {user && <DialogContent>
              <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                <span>Balance:</span><strong>{user?.balance}</strong>
              </Box>
              <Divider sx={{my: 1}}/>
              <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                <span>Supply:</span><strong>{user?.supply}</strong>
              </Box>
              <Divider sx={{my: 1}}/>
              <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                <span>Price:</span><strong><EthValueFormatter>{getBuyPrice(user?.supply)}</EthValueFormatter></strong>
              </Box>
            </DialogContent>}
            <Divider sx={{my: 1}}/>
            <DialogActions sx={{justifyContent: 'space-between'}}>
                <IconButton onClick={handlePrev}>
                    <ArrowBack/>
                </IconButton>
                <span>
                    {idx + 1} / {circles.length}
                </span>
                <IconButton onClick={handleNext}>
                    <ArrowForward/>
                </IconButton>
            </DialogActions>
        </Dialog>
    </Box>;
}


export default React.memo(BLYCComponent);
