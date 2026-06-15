import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const StudentGradeSearchbar = ({ onStudentsFetched }) => {
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

  const handleApply = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8081/api/assignment/getstudents",
        {
          grade: selectedGrade,
          subject: selectedSubject,
          assignmentType: selectedAssignmentType,
        }
      );

      if (response.status === 200) {
        onStudentsFetched(response.data);
      }
    } catch (error) {
      Swal.fire("Error", "Failed to fetch students", "error");
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
      </div>
      <button className="tutor-grade-apply-button" onClick={handleApply}>
        Apply
      </button>
    </div>
  );
};

export default StudentGradeSearchbar;
