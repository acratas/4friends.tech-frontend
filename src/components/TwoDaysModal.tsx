import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import {Alert, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";

const TwoDaysModal = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
        localStorage.setItem('lastShown', Date.now().toString());
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const lastShown = localStorage.getItem('lastShown');
        const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000;

        if (!lastShown || Date.now() - parseInt(lastShown) > twoDaysInMilliseconds) {
            handleOpen();
        }
    }, []);


    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <DialogTitle>Information</DialogTitle>
                <DialogContent>
                    <Alert severity="warning">
                    <p>On November 8, 2023, I decided to discontinue the development of 4friends.tech.</p>
                    <p>Above all, I have completely lost faith in friend.tech and believe that the airdrop will turn out to be a huge scam. I have no evidence to support my claims, but I also can't find a single argument to refute them.</p>
                    <p>If you have used 4friends.tech and found it valuable in any way, I thank you for being part of what has been an unforgettable journey for me.</p>
                    <p>4friends.tech will remain operational until November 30.</p>
                    <p>If you are interested in its further maintenance, please contact me.</p>
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default TwoDaysModal;
