import React, {useCallback} from "react";
import {
    Box,
    FormControl,
    FormControlLabel,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select, Switch,
    TextField, Typography
} from "@mui/material";
import FilterItemComponent from "./FiterItemComponent";
import {notEmpty} from "../../lib/Utils";

const FilterComponent = ({filter, setFilter}: any) => {
    const _updateFilter = useCallback(
        (cb) => (...keys) => (e) => {
        setFilter((prevFilter) => {
            const newFilter = {...prevFilter};
            let obj = newFilter;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!obj[keys[i]]) {
                    obj[keys[i]] = {};
                }
                obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = cb(e);
            // console.warn('newFilter', newFilter);
            return newFilter;
        });
    },
        [setFilter]);
    const setString = _updateFilter((e) => notEmpty(e.target.value) ? e.target.value : null);
    const setInteger = _updateFilter((e) => notEmpty(e.target.value) ? parseInt(e.target.value) : null);
    const setFloat = _updateFilter((e) => notEmpty(e.target.value) ? parseFloat(e.target.value) : null);
    const setChecked = _updateFilter((e) => e.target.checked);
    return (
        <Box display='flex' flexDirection='column'>
            <Typography variant='h6'>Transaction details</Typography>
            <Box display='flex' sx={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                flexWrap: 'wrap'
            }}>
                <FormControl variant='standard' sx={{mr: 2, mb: 2,}}>
                    <InputLabel id='wa-filter-direction-label'>Direction</InputLabel>
                    <Select
                        labelId='wa-filter-direction-label'
                        label='Direction'
                        value={filter.transaction.direction}
                        onChange={setString('transaction', 'direction')}
                    >
                        <MenuItem value='both'>Both</MenuItem>
                        <MenuItem value='buy'>Buy</MenuItem>
                        <MenuItem value='sell'>Sell</MenuItem>
                    </Select>
                </FormControl>
                <FilterItemComponent
                    label='Value'
                    value={filter.transaction?.value?.value}
                    setValue={setFloat('transaction', 'value', 'value')}
                    conditionValue={filter.transaction?.value?.condition}
                    setConditionValue={setString('transaction', 'value', 'condition')}
                />
                <FilterItemComponent
                    label='Amount'
                    value={filter.transaction?.amount?.value}
                    setValue={setInteger('transaction', 'amount', 'value')}
                    conditionValue={filter.transaction?.amount?.condition}
                    setConditionValue={setString('transaction', 'amount', 'condition')}
                />
            </Box>
            <Typography variant='h6'>Trader</Typography>
            <Box display='flex' sx={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                flexWrap: 'wrap'
            }}>
                <FormControl variant='standard' sx={{mr: 2, mb: 2,}}>
                    <TextField
                        label='Username'
                        value={filter.trader?.username}
                        onChange={setString('trader', 'username')}
                        variant="standard"
                        style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0, width: '100px'}}/>
                </FormControl>
                <FilterItemComponent
                    label='Key value'
                    value={filter.trader?.key?.value}
                    setValue={setFloat('trader', 'key', 'value')}
                    conditionValue={filter.trader?.key?.condition}
                    setConditionValue={setString('trader', 'key', 'condition')}
                />
                <FilterItemComponent
                    label='Balance'
                    value={filter.trader?.balance?.value}
                    setValue={setFloat('trader', 'balance', 'value')}
                    conditionValue={filter.trader?.balance?.condition}
                    setConditionValue={setString('trader', 'balance', 'condition')}
                />
                <FilterItemComponent
                    label='[X] Following'
                    value={filter.trader?.following?.value}
                    setValue={setInteger('trader','following','value')}
                    conditionValue={filter.trader?.following?.condition}
                    setConditionValue={setString('trader','following','condition')}
                />
                <FilterItemComponent
                    label='[X] Followers'
                    value={filter.trader?.followers?.value}
                    setValue={setInteger('trader','followers','value')}
                    conditionValue={filter.trader?.followers?.condition}
                    setConditionValue={setString('trader','followers','condition')}
                />
                <FilterItemComponent
                    label='[X] Posts'
                    value={filter.trader?.posts?.value}
                    setValue={setInteger('trader','posts','value')}
                    conditionValue={filter.trader?.posts?.condition}
                    setConditionValue={setString('trader','posts','condition')}
                />
                <FilterItemComponent
                    label='[X] Likes'
                    value={filter.trader?.likes?.value}
                    setValue={setInteger('trader','likes','value')}
                    conditionValue={filter.trader?.likes?.condition}
                    setConditionValue={setString('trader','likes','condition')}
                />
                <FilterItemComponent
                    label='[X] Age [years]'
                    value={filter.trader?.age?.value}
                    setValue={setInteger('trader','age','value')}
                    conditionValue={filter.trader?.age?.condition}
                    setConditionValue={setString('trader','age','condition')}
                />
            </Box>
            <Typography variant='h6'>Subject</Typography>
            <Box display='flex' sx={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                flexWrap: 'wrap'
            }}>
                <FormControl variant='standard' sx={{mr: 2, mb: 2,}}>
                    <TextField
                        label='Username'
                        value={filter.subject?.username}
                        onChange={setString('subject', 'username')}
                        variant="standard"
                        style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0, width: '100px'}}/>
                </FormControl>
                <FilterItemComponent
                    label='Key value'
                    value={filter.subject?.key?.value}
                    setValue={setFloat('subject', 'key', 'value')}
                    conditionValue={filter.subject?.key?.condition}
                    setConditionValue={setString('subject', 'key', 'condition')}
                />
                <FilterItemComponent
                    label='Balance'
                    value={filter.subject?.balance?.value}
                    setValue={setFloat('subject', 'balance', 'value')}
                    conditionValue={filter.subject?.balance?.condition}
                    setConditionValue={setString('subject', 'balance', 'condition')}
                />
                <FilterItemComponent
                    label='[X] Following'
                    value={filter.subject?.following?.value}
                    setValue={setInteger('subject','following','value')}
                    conditionValue={filter.subject?.following?.condition}
                    setConditionValue={setString('subject','following','condition')}
                />
                <FilterItemComponent
                    label='[X] Followers'
                    value={filter.subject?.followers?.value}
                    setValue={setInteger('subject','followers','value')}
                    conditionValue={filter.subject?.followers?.condition}
                    setConditionValue={setString('subject','followers','condition')}
                />
                <FilterItemComponent
                    label='[X] Posts'
                    value={filter.subject?.posts?.value}
                    setValue={setInteger('subject','posts','value')}
                    conditionValue={filter.subject?.posts?.condition}
                    setConditionValue={setString('subject','posts','condition')}
                />
                <FilterItemComponent
                    label='[X] Likes'
                    value={filter.subject?.likes?.value}
                    setValue={setInteger('subject','likes','value')}
                    conditionValue={filter.subject?.likes?.condition}
                    setConditionValue={setString('subject','likes','condition')}
                />
                <FilterItemComponent
                    label='[X] Age [years]'
                    value={filter.subject?.age?.value}
                    setValue={setInteger('subject','age','value')}
                    conditionValue={filter.subject?.age?.condition}
                    setConditionValue={setString('subject','age','condition')}
                />
            </Box>
            <Typography variant='h6'>View options</Typography>
            <Box display='flex' sx={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                flexWrap: 'wrap'
            }}>
                <FormControl variant='standard' sx={{mr: 2, mb: 2,}}>
                    <InputLabel id='wa-filter-direction-label'>Results</InputLabel>
                    <Select
                        labelId='wa-filter-direction-label'
                        label='Direction'
                        value={filter.view.results}
                        onChange={setString('view', 'results')}
                    >
                        <MenuItem value='5'>&nbsp;&nbsp;&nbsp;&nbsp;5</MenuItem>
                        <MenuItem value='10'>&nbsp;&nbsp;&nbsp;10</MenuItem>
                        <MenuItem value='25'>&nbsp;&nbsp;&nbsp;25</MenuItem>
                        <MenuItem value='50'>&nbsp;&nbsp;&nbsp;50</MenuItem>
                        <MenuItem value='100'>&nbsp;&nbsp;100</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant='standard' sx={{mr: 2, mb: 2,}}>
                    <FormControlLabel control={<Switch
                        inputProps={{'aria-label': 'controlled'}}
                        checked={filter.view.bots}
                        onChange={setChecked('view', 'bots')}
                    />} label='Bots'/>
                </FormControl>
                <FormControl variant='standard' sx={{mr: 2, mb: 2,}}>
                    <FormControlLabel control={<Switch
                        inputProps={{'aria-label': 'controlled'}}
                        checked={filter.view.balance}
                        onChange={setChecked('view', 'balance')}
                    />} label='Balance'/>
                </FormControl>
                <FormControl variant='standard' sx={{mr: 2, mb: 2,}}>
                    <FormControlLabel control={<Switch
                        inputProps={{'aria-label': 'controlled'}}
                        checked={filter.view.twitter}
                        onChange={setChecked('view', 'twitter')}
                    />} label='Twitter/X data'/>
                </FormControl>
            </Box>
        </Box>
    )
}
export default React.memo(FilterComponent);
