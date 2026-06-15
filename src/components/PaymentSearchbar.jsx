import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import axios from 'axios';

const PaymentSearchbar = ({ onStudentDataFetched }) => {
  const [studentId, setStudentId] = useState('');

  const handleInputChange = (event) => {
    setStudentId(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/payment/admin/${studentId}`);
      if (response.status >= 200 && response.status < 300) {
        const data = response.data;
        onStudentDataFetched(data);
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      onStudentDataFetched(null);
    }
  };
  

  return (
    <div>
      <Box
        sx={{
          width: 500,
          maxWidth: '100%',
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            fullWidth
            label="Search Student"
            id="searchstudent"
            value={studentId}
            onChange={handleInputChange}
          />
          <Button
            variant="contained"
            sx={{
              bgcolor: '#27374d',
              color: '#ffffff',
              '&:hover': {
                bgcolor: '#1c293b',
              },
            }}
            size="large"
            onClick={handleSearch}
          >
            Search
          </Button>
        </Stack>
      </Box>
    </div>
  );
};

export default PaymentSearchbar;
