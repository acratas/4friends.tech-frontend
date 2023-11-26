import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
// import axios from 'axios';
import {
    Alert,
    Avatar,
    Box,
    Container, debounce,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import {isEthAddress} from "../lib/Utils";
import Grid2 from "@mui/material/Unstable_Grid2";
import {ConnectWallet, useAddress, useChainId} from "@thirdweb-dev/react";
import {Base} from "@thirdweb-dev/chains";
import {useApi} from "./ApiProvider";
import {User} from "../lib/User";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// @ts-ignore
export const SearchBarComponent = ({currentTheme, setToggleSearch}) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const {getAutocompleteResults} = useApi()
    const [inputValue, setInputValue] = useState('');
    const [autocompleteResults, setAutocompleteResults] = useState<User[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setInputValue('')
        setAutocompleteResults([])
    }, [location]);

    function handleKeyDown(e: React.KeyboardEvent) {
        switch (e.key) {
            case 'ArrowDown':
                setSelectedIndex(prevIndex => Math.min(prevIndex + 1, autocompleteResults.length - 1));
                break;
            case 'ArrowUp':
                setSelectedIndex(prevIndex => Math.max(prevIndex - 1, 0));
                break;
            case 'Enter':
                if (selectedIndex >= 0 && selectedIndex < autocompleteResults.length) {
                    handleAutocompleteClick(autocompleteResults[selectedIndex].address);
                } else {
                    handleSearch(inputValue);
                }
                break;
            default:
                break;
        }
    }

    async function fetchAutocompleteResults(query: string) {
        try {
            const response = await getAutocompleteResults(query);
            setSelectedIndex(-1)
            setAutocompleteResults(response);
            // try {
            //     const response = await axios.get(`/api/autocomplete?query=${query}`);
            //     setAutocompleteResults(response.data);
        } catch (error) {
            console.error('Error fetching autocomplete results:', error);
        }
    }

    const debounceFetchAutocompleteResults = debounce(fetchAutocompleteResults, 300);

    function handleSearch(value: string) {
        value = value.trim().replace(/^@/g, '').toLowerCase();
        if (isEthAddress(value)) {
            navigate(`/${value}`);
        } else if (!value.startsWith('0x') && value.match(/^[0-9_a-zA-Z]+$/)) {
            navigate(`/${value}`);
        }
        setToggleSearch(false);
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        console.error('handleInputChange', e.target.value, isEthAddress(e.target.value))
        if (isEthAddress(e.target.value)) {
            setToggleSearch(false);
            return navigate(`/${e.target.value}`);
        }
        if (e.target.value.length > 3) {
            debounceFetchAutocompleteResults(e.target.value)
        } else {
            setAutocompleteResults([]);
        }
        setInputValue(e.target.value);
    }

    function handleAutocompleteClick(value: string) {
        setInputValue(value);
        handleSearch(value);
    }

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >

            <TextField
                sx={{
                    mt: 1,
            }}
                fullWidth
                autoFocus
                size={isSmallScreen ? 'small' : 'medium'}
                label="Search by address or username"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            ></TextField>

            {autocompleteResults.length > 0 && (
                <Box sx={{width: '100%'}}>
                    <List>
                        {autocompleteResults.map((user, idx) => (
                            <div>
                                {idx > 0 && <Divider variant="inset" component="li"/>}
                                <ListItem alignItems="flex-start"
                                          sx={{
                                              cursor: 'pointer',
                                              backgroundColor: idx === selectedIndex ? 'rgba(200, 200, 200, 0.7)' : 'transparent'
                                }}
                                          onClick={() => handleAutocompleteClick(user.address)}>
                                    <ListItemAvatar>
                                        <Avatar alt={user.twitterName}
                                                src={user.twitterPfpUrl}/>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={user.twitterName}
                                        secondary={<React.Fragment>
                                            <Typography
                                                fontSize="small">@{user.twitterUsername} (supply: {user.supply})</Typography>
                                        </React.Fragment>}
                                    />
                                </ListItem>
                            </div>
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    );
}
