import React, { useState } from "react";
import GradeUploadContent from "../components/GradeUploadContent";
import TutorGradeSearchbar from "../components/TutorGradeSearchbar";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "@mui/material/Modal";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#dde6ed",
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const GradeUpload = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gradeHistory, setGradeHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStudentsFetched = (fetchedData) => {
    const { students, classID, assignmentTypeID } = fetchedData;
    const studentsWithAdditionalInfo = students.map((student) => ({
      ...student,
      classID,
      assignmentTypeID,
    }));
    setStudents(studentsWithAdditionalInfo);
  };

  const handleSubmit = async () => {
    try {
      for (const student of students) {
        const grade = student.grade || "";
        const feedback = student.feedback || "";

        await axios.post("http://localhost:8081/api/grade/addgrade", {
          StudentID: student.StudentID,
          assignmentTypeID: student.assignmentTypeID,
          classID: student.classID,
          grade,
          feedback,
        });
      }
      Swal.fire("Success", "Grades submitted successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to submit grades", "error");
    }
  };

  const fetchGradeHistory = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8081/api/grade/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGradeHistory(response.data);
    } catch (error) {
      setError("Failed to fetch grade history");
      Swal.fire("Error", "Failed to fetch grade history", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewGradeHistory = () => {
    fetchGradeHistory();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="grade-upload-container">
      <div className="grade-upload-header">
        <TutorGradeSearchbar onStudentsFetched={handleStudentsFetched} />
      </div>

      <div className="grade-upload-content">
        <GradeUploadContent students={students} setStudents={setStudents} />
      </div>

      <div className="grade-upload-button">
        <button
          className="grade-history-btn"
          variant="contained"
          color="primary"
          onClick={handleViewGradeHistory}
        >
          View Grade History
        </button>
        <button
          className="upload-btn"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Upload
        </button>
      </div>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-labelledby="grade-history-title"
        aria-describedby="grade-history-description"
      >
        <div className="modal-content">
          <h2 id="grade-history-title">Grade History</h2><br />
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
              label="Search Student"
              id="searchstudent"
            />
            <Button
              variant="contained"
              sx={{
                bgcolor: "#27374d",
                color: "#ffffff",
                "&:hover": {
                  bgcolor: "#1c293b",
                },
              }}
              size="large"
            >
              Search
            </Button>
          </Stack>
        </Box>
      </div>
          
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Student ID</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Grade</StyledTableCell>
                  <StyledTableCell>Assignment Name</StyledTableCell>
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
                ) : gradeHistory.length > 0 ? (
                  gradeHistory.map((row) => (
                    <StyledTableRow key={row.AssignmentsID}>
                      <StyledTableCell component="th" scope="row">
                        {row.StudentID}
                      </StyledTableCell>
                      <StyledTableCell>{`${row.FirstName} ${row.LastName}`}</StyledTableCell>
                      <StyledTableCell>{row.GradeLevel}</StyledTableCell>
                      <StyledTableCell>{row.assignment_name}</StyledTableCell>
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
          </TableContainer><br />
          <button onClick={closeModal}>Close</button>
        </div>
      </Modal>
    </div>
  );
};

export default GradeUpload;



