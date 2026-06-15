import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const TutorGradeSearchbar = ({ onStudentsFetched }) => {
  const [open, setOpen] = useState(false);
  const [assignmentType, setAssignmentType] = useState("");
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignmentTypes, setAssignmentTypes] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedAssignmentType, setSelectedAssignmentType] = useState("");

  useEffect(() => {
    fetchGrades();
    fetchSubjects();
    fetchAssignmentTypes();
  }, []);

  const fetchGrades = async () => {
    const response = await fetch(
      "http://localhost:8081/api/assignment/getgrades"
    );
    const data = await response.json();
    setGrades(data);
  };

  const fetchSubjects = async () => {
    const response = await fetch(
      "http://localhost:8081/api/assignment/getsubjects"
    );
    const data = await response.json();
    setSubjects(data);
  };

  const fetchAssignmentTypes = async () => {
    const response = await fetch(
      "http://localhost:8081/api/assignment/getassignmenttypes"
    );
    const data = await response.json();
    setAssignmentTypes(data);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddAssignmentType = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8081/api/assignment/addassignmenttype",
        {
          assignmentType: assignmentType,
        }
      );

      if (response.status === 200) {
        Swal.fire("Success", response.data, "success");
        fetchAssignmentTypes();
      }
    } catch (error) {
      if (error.response && error.response.data) {
        Swal.fire("Error", error.response.data, "error");
      } else {
        Swal.fire("Error", "An unexpected error occurred", "error");
      }
    }
    setOpen(false);
  };

  const handleApply = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:8081/api/assignment/getstudents",
        {
          grade: selectedGrade,
          subject: selectedSubject,
          assignmentType: selectedAssignmentType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        onStudentsFetched(response.data);
      }
    } catch (error) {
      Swal.fire("Error", "You can only upload grades related to your classes", "error");
    }
  };


  return (
    <div className="grade-upload-header">
      <Select
        id="grade"
        label="Grade"
        variant="outlined"
        value={selectedGrade}
        onChange={(e) => setSelectedGrade(e.target.value)}
        displayEmpty
      >
        <MenuItem key="default" value="" disabled>
          Select Grade
        </MenuItem>
        {grades.map((grade) => (
          <MenuItem key={grade.id} value={grade.Grade}>
            {grade.Grade}
          </MenuItem>
        ))}
      </Select>

      <Select
        id="subject"
        label="Subject"
        variant="outlined"
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
        displayEmpty
      >
        <MenuItem value="" disabled>
          Select Subject
        </MenuItem>
        {subjects.map((subject) => (
          <MenuItem key={subject.id} value={subject.Subject}>
            {subject.Subject}
          </MenuItem>
        ))}
      </Select>

      <div className="assignment-type-container">
        <Select
          id="assignment-type"
          label="Assignment Type"
          variant="outlined"
          value={selectedAssignmentType}
          onChange={(e) => setSelectedAssignmentType(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Select Assignment Type
          </MenuItem>
          {assignmentTypes.map((type) => (
            <MenuItem key={type.id} value={type.type_name}>
              {type.type_name}
            </MenuItem>
          ))}
        </Select>

        <div className="add-assignment-type">
          <Tooltip title="Add Assignment Type">
            <IconButton
              color="primary"
              aria-label="add assignment type"
              onClick={handleClickOpen}
            >
              <AddIcon style={{ color: "#27374d" }} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <button className="tutor-grade-apply-button" onClick={handleApply}>
        Apply
      </button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Assignment Type</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the new assignment type you would like to add.
          </DialogContentText>
          <TextField
            margin="dense"
            id="assignmentType"
            label="Assignment Type"
            type="text"
            fullWidth
            variant="standard"
            value={assignmentType}
            onChange={(e) => setAssignmentType(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddAssignmentType} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TutorGradeSearchbar;
