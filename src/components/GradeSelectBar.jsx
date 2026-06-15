import React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const GradeSelectBar = ({ label, options }) => {
  const theme = useTheme();
  const [selectedOptions, setSelectedOptions] = React.useState([]);

  const handleChange = (event) => {
    const { value } = event.target;
    setSelectedOptions(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 250 }}>
        <InputLabel id={`select-${label}-label`}>{label}</InputLabel>
        <Select
          labelId={`select-${label}-label`}
          id={`select-${label}`}
          multiple
          value={selectedOptions}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          MenuProps={MenuProps}
        >
          {options.map((option) => (
            <MenuItem
              key={option}
              value={option}
              style={{
                fontWeight: selectedOptions.indexOf(option) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
              }}
            >
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default GradeSelectBar;