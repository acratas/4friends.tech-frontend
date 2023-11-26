import React from "react";
import {
    Box,
    FormControl,
    FormControlLabel,
    FormGroup,
    Switch,
    TextField, Typography
} from "@mui/material";

const ChatSettingsBotComponent = ({values, setValues}) => {
    return <Box>
        <fieldset style={{marginBottom: '1rem'}}>
            <legend>!help</legend>
            <FormGroup sx={{}}>
                <FormControlLabel control={<Switch
                    checked={values.bot?.help?.enabled}
                    onChange={(event) => setValues(prev => ({
                        ...prev,
                        bot: {
                            ...prev.bot || {},
                            help: {
                                ...prev.bot?.help || {},
                                enabled: event.target.checked
                            }
                        }
                    }))}
                />} label="Enable"/>
                <FormControl sx={{my:2}}>
                    <TextField
                        fullWidth
                        variant="standard"
                        label="Blacklist"
                        helperText="Comma-separated list of X usernames: @user1,@user2"
                        value={values.bot?.help?.blacklist}
                        onChange={(event) => setValues(prev => ({
                            ...prev,
                            bot: {
                                ...prev.bot || {},
                                help: {
                                    ...prev.bot?.help || {},
                                    blacklist: event.target.value
                                }
                            }
                        }))}
                    />
                </FormControl>
                <FormControl sx={{my:2}} variant='standard'>
                    <TextField
                        fullWidth
                        variant="standard"
                        label="Custom message"
                        multiline
                        maxRows={4}
                        value={values.bot?.help?.message}
                        onChange={(event) => setValues(prev => ({
                            ...prev,
                            bot: {
                                ...prev.bot || {},
                                help: {
                                    ...prev.bot?.help || {},
                                    message: event.target.value
                                }
                            }
                        }))}
                    />
                </FormControl>
            </FormGroup>
            {values.bot?.help?.enabled ? <Box sx={{my:2}}>
                <div><strong>Default message:</strong></div>
                <Typography variant='body2'>
                <div>Available commands:</div>
                <div>!help - displays this message</div>
                {values.bot?.wall?.enabled ? <div>!wall - sends a message visible to all chatroom users</div> : ""}
                {values.bot?.forward?.enabled ? <div>!forward - sends a message as the owner</div> : ""}
                </Typography>
            </Box> : ''}
        </fieldset>
        <fieldset style={{marginBottom: '1rem'}}>
            <legend>!wall</legend>
            <p>!wall works like a relay, but not all messages are relayed. Don't use both.</p>
            <FormGroup sx={{}}>
                <FormControlLabel control={<Switch
                    checked={values.bot?.wall?.enabled}
                    onChange={(event) => setValues(prev => ({
                        ...prev,
                        bot: {
                            ...prev.bot || {},
                            wall: {
                                ...prev.bot?.wall || {},
                                enabled: event.target.checked
                            }
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
                        value={values.bot?.wall?.message}
                        onChange={(event) => setValues(prev => ({
                            ...prev,
                            bot: {
                                ...prev.bot || {},
                                wall: {
                                    ...prev.bot?.wall || {},
                                    message: event.target.value
                                }
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
                        value={values.bot?.wall?.blacklist}
                        onChange={(event) => setValues(prev => ({
                            ...prev,
                            bot: {
                                ...prev.bot || {},
                                wall: {
                                    ...prev.bot?.wall || {},
                                    blacklist: event.target.value
                                }
                            }
                        }))}
                    />
                </FormControl>
            </FormGroup>
        </fieldset>
        <fieldset>
            <legend>!forward</legend>
            <p>With !forward you can allow trusted users to write on your behalf</p>
            <FormGroup sx={{}}>
                <FormControlLabel control={<Switch
                    checked={values.bot?.forward?.enabled}
                    onChange={(event) => setValues(prev => ({
                        ...prev,
                        bot: {
                            ...prev.bot || {},
                            forward: {
                                ...prev.forward?.forward || {},
                                enabled: event.target.checked
                            }
                        }
                    }))}
                />} label="Enable"/>
                <FormControl sx={{my:2}}>
                    <TextField
                        fullWidth
                        variant="standard"
                        label="Whitelist"
                        helperText="Comma-separated list of X usernames: @user1,@user2 or * for all users"
                        value={values.bot?.forward?.whitelist}
                        onChange={(event) => setValues(prev => ({
                            ...prev,
                            bot: {
                                ...prev.bot || {},
                                forward: {
                                    ...prev.bot?.forward || {},
                                    whitelist: event.target.value
                                }
                            }
                        }))}
                    />
                </FormControl>
            </FormGroup>
        </fieldset>
    </Box>
}

export default ChatSettingsBotComponent;
