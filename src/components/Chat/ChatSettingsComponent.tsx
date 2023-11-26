import React, {useEffect} from "react";
import {
    Accordion, AccordionDetails, AccordionSummary,
    Box, Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    IconButton,
    InputAdornment,
    TextField, Typography
} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChatSettingsSwitchComboComponent from "./ChatSettingsSwitchComboComponent";
import ChatSettingsRelayComponent from "./ChatSettingsRelayComponent";
import ChatSettingsBotComponent from "./ChatSettingsBotComponent";

const ChatSettingsComponent = ({
                                   config,
                                   setConfig,
                                   configError,
                                   setConfigError,
                                   sendBroadcastMessage
                               }) => {
    const [values, setValues] = React.useState(config);
    const [showPassword, setShowPassword] = React.useState(false);
    const [broadcastMessage, setBroadcastMessage] = React.useState('');
    useEffect(() => {
        setValues(config);
    }, [config]);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    return (
        <Box>
            {
                values.jwt ? <Card sx={{my: 2}}>
                    <CardHeader title="Broadcast message"/>
                    <CardContent>
                        <FormControl fullWidth variant='standard' sx={{mb: 2}}>
                            <TextField
                                fullWidth
                                variant="standard"
                                label="Message"
                                helperText="This message will be sent to all chatrooms within your network except for yours. You can use the %username% placeholder."
                                multiline
                                maxRows={10}
                                value={broadcastMessage}
                                onChange={(event) => setBroadcastMessage(event.target.value)}
                            />
                        </FormControl>
                        <Box sx={{mt: 2, textAlign: 'right'}}>
                            <Button
                                onClick={() => {
                                    if (!broadcastMessage || broadcastMessage.trim().length === 0) return;
                                    sendBroadcastMessage(broadcastMessage);
                                    setBroadcastMessage('');
                                }}
                                variant="contained">Send Message</Button>
                        </Box>
                    </CardContent>
                </Card> : ''
            }
            <Card sx={{my: 2}}>
                {
                    values.jwt ? <React.Fragment>
                        <CardHeader title="Chat settings"/>
                        <CardContent>
                            <Box>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon/>}
                                        aria-controls="panel1-content"
                                        id="panel1-header">
                                        <Typography>Relay</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            All messages from your users will be made visible to others through
                                            automatic
                                            replies.
                                        </Typography>
                                        <img
                                            src='/images/relay.png'
                                            style={{
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                            }}
                                            alt='relay'
                                        />
                                        <ChatSettingsRelayComponent values={values} setValues={setValues}/>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon/>}
                                        aria-controls="panel2-content"
                                        id="panel2-header">
                                        <Typography>Welcome message to new holder</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <ChatSettingsSwitchComboComponent
                                            values={values}
                                            setValues={setValues}
                                            name='holder'
                                        />
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon/>}
                                        aria-controls="panel3-content"
                                        id="panel3-header">
                                        <Typography>Welcome message to new holding</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <ChatSettingsSwitchComboComponent
                                            values={values}
                                            setValues={setValues}
                                            name='holding'
                                        />
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon/>}
                                        aria-controls="panel4-content"
                                        id="panel4-header">
                                        <Typography>Bot Commands</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <ChatSettingsBotComponent
                                            values={values}
                                            setValues={setValues}
                                        />
                                    </AccordionDetails>
                                </Accordion>
                            </Box>
                        </CardContent>
                    </React.Fragment> : ''
                }
                <CardHeader title="Secrets"/>
                <CardContent>
                    <FormControl fullWidth sx={{mb: 2}}>
                        <TextField
                            fullWidth
                            label='JWT token'
                            id="jwt"
                            variant="standard"
                            type={showPassword ? 'text' : 'password'}
                            value={values.jwt}
                            onChange={(event) => setValues(prev => ({
                                ...prev,
                                jwt: event.target.value?.trim().replace(/(^['"])|(['"]$)/g, '')
                            }))}
                            error={configError?.jwt?.length > 0}
                            helperText={configError?.jwt}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                                    </IconButton>
                                </InputAdornment>
                            }}
                        />
                    </FormControl>
                    <Box sx={{mt: 2, textAlign: 'right'}}>
                        <Button
                            disabled={values.jwt?.length <= 0}
                            variant="contained" onClick={() => setConfig(values)}>Save</Button>
                    </Box>
                </CardContent>
                <CardHeader title="FAQ"/>
                <CardContent>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                            <Typography variant="h6">Security notice</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div>
                                Sharing a JWT token is not secure.<br/>
                                By sharing it, you agree to grant access to your data within the friend.tech
                                application.<br/>
                                You are consenting to read and write actions on your behalf.<br/>
                                The JWT token does not provide access to your funds or wallet-related data.<br/>
                                The JWT token will be stored on the server, which could pose a potential attack
                                vector.<br/>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel2a-header">
                            <Typography variant="h6">Where can I get a JWT token?</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div>
                                <h4>Method 1: Via Console</h4>
                                <ol>
                                    <li>Open the PWA application on your computer.</li>
                                    <li>Press <code>Ctrl + Shift + J</code> (for Windows/Linux) or <code>Cmd + Option +
                                        J</code> (for macOS) to open the developer console.
                                    </li>
                                    <li>Type in the following command: <code>localStorage.getItem('jwt')</code>.</li>
                                    <li>Press <code>Enter</code>. Your JWT token will be displayed.</li>
                                </ol>

                                <h4>Method 2: Via Developer Tools</h4>
                                <ol>
                                    <li>Open the PWA application on your computer.</li>
                                    <li>Press <code>Ctrl + Shift + I</code> (for Windows/Linux) or <code>Cmd + Option +
                                        I</code> (for macOS) to open the developer tools.
                                    </li>
                                    <li>Go to the "Application" tab.</li>
                                    <li>In the left panel, under the "Storage" section, locate and click on "Local
                                        Storage".
                                    </li>
                                    <li>Click on the respective PWA application domain from the list on the left.</li>
                                    <li>On the right side, you'll see a list of keys and their values. Look for the key
                                        named <code>jwt</code>.
                                    </li>
                                    <li>The value next to the <code>jwt</code> key is your JWT token.</li>
                                </ol>

                                <h4>JWT token looks like this</h4>
                                <code style={{
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word'
                                }}>
                                    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
                                </code>
                            </div>
                        </AccordionDetails>
                    </Accordion>

                </CardContent>
            </Card>
        </Box>
    );
}

export default ChatSettingsComponent;
