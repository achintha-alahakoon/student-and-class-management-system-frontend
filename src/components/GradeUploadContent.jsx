import React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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

const GradeUploadContent = ({ students, setStudents }) => {

  const handleGradeChange = (studentID, value) => {
    const updatedStudents = students.map((student) =>
      student.StudentID === studentID ? { ...student, grade: value } : student
    );
    setStudents(updatedStudents);
  };

  const handleFeedbackChange = (studentID, value) => {
    const updatedStudents = students.map((student) =>
      student.StudentID === studentID ? { ...student, feedback: value } : student
    );
    setStudents(updatedStudents);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Student ID</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell align="right">Range</StyledTableCell>
              <StyledTableCell align="right">Grade</StyledTableCell>
              <StyledTableCell align="right">Feedback</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <StyledTableRow key={student.StudentID}>
                <StyledTableCell component="th" scope="row">
                  {student.StudentID}
                </StyledTableCell>
                <StyledTableCell>{student.FirstName} {student.LastName}</StyledTableCell>
                <StyledTableCell align="right">0.00 - 100.00</StyledTableCell>
                <StyledTableCell align="right">
                  <input
                    style={{ width: '100px', height: '30px', borderRadius: '5px', border: '1px solid #27374d' }}
                    onChange={(e) => handleGradeChange(student.StudentID, e.target.value)}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <input
                    style={{ width: '200px', height: '30px', borderRadius: '5px', border: '1px solid #27374d' }}
                    onChange={(e) => handleFeedbackChange(student.StudentID, e.target.value)}
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default GradeUploadContent;

