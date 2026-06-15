import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import Swal from 'sweetalert2';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#dde6ed',
    color: '#27374d',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: '#27374d',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const GradeUploadContent = () => {
  const [grades, setGrades] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]); // State to manage filtered grades
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state
  const [searchTerm, setSearchTerm] = useState(''); // State to manage search input

  useEffect(() => {
    const fetchGrades = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire('Error', 'No token found', 'error');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8081/api/grade/getgrades', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('API Response:', response.data);

        if (response.data.success) {
          setGrades(response.data.data);
          setFilteredGrades(response.data.data); // Initialize filtered grades with all grades
        } else {
          setError(response.data.message); // Set error message from response
        }
      } catch (error) {
        if (error.response) {
          setError(`Server error: ${error.response.data.message}`);
          console.error('Server error:', error.response.data);
        } else if (error.request) {
          setError('No response received from server');
          console.error('Network error:', error.request);
        } else {
          setError(`An unexpected error occurred: ${error.message}`);
          console.error('Error', error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    const filtered = grades.filter((grade) =>
      grade.Subject.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredGrades(filtered);
  };

  return (
    <div>
      <div className="parent-student-grades-search">
        <Box
          sx={{
            width: 500,
            maxWidth: "100%",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              fullWidth
              label="Search by Subject"
              id="searchsubject"
              value={searchTerm}
              onChange={handleInputChange}
            />
          </Stack>
        </Box>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Student ID</StyledTableCell>
              <StyledTableCell>Subject</StyledTableCell>
              <StyledTableCell>Assignment Name</StyledTableCell>
              <StyledTableCell align="right">Held On</StyledTableCell>
              <StyledTableCell align="right">Score</StyledTableCell>
              <StyledTableCell align="right">Out Of</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <StyledTableRow>
                <StyledTableCell colSpan={6} align="center">
                  Loading...
                </StyledTableCell>
              </StyledTableRow>
            ) : error ? (
              <StyledTableRow>
                <StyledTableCell colSpan={6} align="center">
                  {error}
                </StyledTableCell>
              </StyledTableRow>
            ) : filteredGrades.length > 0 ? (
              filteredGrades.map((row) => (
                <StyledTableRow key={row.GradeID}>
                  <StyledTableCell component="th" scope="row">
                    {row.StudentID}
                  </StyledTableCell>
                  <StyledTableCell>{row.Subject}</StyledTableCell>
                  <StyledTableCell>{row.assignment_name}</StyledTableCell>
                  <StyledTableCell align="right">{row.UploadDate}</StyledTableCell>
                  <StyledTableCell align="right">{row.Grade}</StyledTableCell>
                  <StyledTableCell align="right">100</StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={6} align="center">
                  No rows
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default GradeUploadContent;
