import React from "react";
import {
    FormControl,
    FormControlLabel,
    FormGroup,
    Switch,
    TextField
} from "@mui/material";

const ChatSettingsRelayComponent = ({values, setValues}) => {
    return (<FormGroup sx={{}}>
        <FormControlLabel control={<Switch
            checked={values.relay?.enabled}
            onChange={(event) => setValues(prev => ({
                ...prev,
                relay: {
                    ...prev.relay || {},
                    enabled: event.target.checked
                }
            }))}
        />} label="Enable"/>
        <FormControl variant='standard' sx={{my:2}}>
            <TextField
                fullWidth
                variant="standard"
                label="Message"
                multiline
                maxRows={4}
                value={values.relay?.message}
                onChange={(event) => setValues(prev => ({
                    ...prev,
                    relay: {
                        ...prev.relay || {},
                        message: event.target.value
                    }
                }))}
            />
        </FormControl>
        <FormControl sx={{my:2}}>
            <TextField
                fullWidth
                variant="standard"
                label="Blacklist"
                helperText="Comma-separated list of X usernames: @user1,@user2"
                value={values.relay?.blacklist}
                onChange={(event) => setValues(prev => ({
                    ...prev,
                    relay: {
                        ...prev.relay || {},
                        blacklist: event.target.value
                    }
                }))}
            />
        </FormControl>
    </FormGroup>);
}

export default ChatSettingsRelayComponent;
