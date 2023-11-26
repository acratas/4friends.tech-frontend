import React from "react";
import {
    FormControl,
    FormControlLabel,
    FormGroup,
    Switch,
    TextField
} from "@mui/material";

const ChatSettingsSwitchComboComponent = ({values, setValues, name}) => {
    return (<FormGroup sx={{}}>
        <FormControlLabel control={<Switch
            checked={values[name]?.enabled}
            onChange={(event) => setValues(prev => ({
                ...prev,
                [name]: {
                    ...prev[name] || {},
                    enabled: event.target.checked
                }
            }))}
        />} label="Enable"/>
        <FormControl variant='standard' sx={{my:2}}>
            <TextField
                fullWidth
                variant="standard"
                label="Message"
                helperText="You can use %username% placeholder"
                multiline
                maxRows={4}
                value={values[name]?.message}
                onChange={(event) => setValues(prev => ({
                    ...prev,
                    [name]: {
                        ...prev[name] || {},
                        message: event.target.value
                    }
                }))}
            />
        </FormControl>
    </FormGroup>);
}

export default ChatSettingsSwitchComboComponent;
