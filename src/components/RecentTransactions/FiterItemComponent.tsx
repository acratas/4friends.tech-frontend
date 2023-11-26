import React from "react";
import {FormControl, InputAdornment, MenuItem, Select, TextField} from "@mui/material";

const FilterItemComponent = ({label, value, setValue, conditionValue, setConditionValue}) => {
    return (<FormControl variant='standard' size='small' sx={{
        display: 'flex', flexDirection: 'row', alignItems: 'center', mr: 2, mb: 2, maxWidth:
            '100px'
    }}>
        <TextField
            label={label}
            type='number'
            value={value}
            onChange={setValue}
            variant="standard"
            style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start" style={{backgroundColor: 'transparent'}}>
                        <Select
                            value={conditionValue}
                            onChange={setConditionValue}
                            style={{paddingRight: 0}}
                            variant='standard'
                            disableUnderline
                        >
                            <MenuItem value={'lte'}>&le;</MenuItem>
                            <MenuItem value={'gte'}>&ge;</MenuItem>
                        </Select>
                    </InputAdornment>
                ),
            }}
        />
    </FormControl>);
}

export default React.memo(FilterItemComponent);
