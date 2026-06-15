import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import Swal from 'sweetalert2';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const AddStudentModal = ({ open, handleClose, handleAddStudent }) => {
  const [ParentID, setParentID] = useState("");
  const [StudentID, setStudentID] = useState("");

  const handleAddStudentClick = () => {
    const token = localStorage.getItem('token');

    axios.get(`http://localhost:8081/api/name/student/${ParentID}/${StudentID}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        const data = response.data;
        console.log('Added student data:', data); // Log the added student data
        handleAddStudent(data); // Update the student list in PDContent
        Swal.fire({
          icon: 'success',
          title: 'Student Added',
          text: 'Student details have been successfully retrieved and added.',
        });
        handleClose(); // Close the modal after adding the student
      })
      .catch(error => {
        console.error("Error fetching student details:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response ? error.response.data.error : 'An error occurred while fetching student details.',
        });
      });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className="custom-modal"
    >
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <h2 id="modal-title">Add Student</h2>
        <TextField
          id="parent-number"
          label="Parent Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={ParentID}
          onChange={(e) => setParentID(e.target.value)}
        />
        <TextField
          id="student-number"
          label="Student Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={StudentID}
          onChange={(e) => setStudentID(e.target.value)}
        />
        <button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAddStudentClick}
          className="parent-add-student-button"
          style={{ marginTop: 16 }}
        >
          Add Student
        </button>
      </Box>
    </Modal>
  );
};

export default AddStudentModal;
