import React, { useState, useEffect } from "react";
import "../styles/profile.css";
import user from "../Images/user.png";
import { BiBook, BiEdit } from "react-icons/bi";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Swal from "sweetalert2";

const Profile = ({ userId }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [tutor, setTutor] = useState("");
  const [fees, setFees] = useState("");
  const [allOptions, setAllOptions] = useState({
    tutors: [],
    grades: [],
    subjects: [],
  });

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:8081/api/auth/${userId}`)
        .then((response) => {
          setUserDetails(response.data.user);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
      axios
        .get(`http://localhost:8081/api/count/getAll`)
        .then((response) => {
          setAllOptions(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
  }, [userId]);

  const handleAssign = () => {
    if (userDetails.userrole === "Student") {
      axios
        .post('http://localhost:8081/api/assign/assignStudent', {
          studentID: userDetails.StudentID,
          grade,
          subject,
          tutor,
        })
        .then((response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Student assigned to class successfully',
          });
          // Update the userDetails state with the new class
          const newClass = {
            ClassID: response.data.classID,
            Subject: subject,
            Tutor: tutor,
          };
          setUserDetails({
            ...userDetails,
            classes: [...userDetails.classes, newClass],
          });
          setOpenModal(false);
        })
        .catch((error) => {
          console.error('Error assigning class:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error assigning student to class',
          });
        });
    } else if (userDetails.userrole === "Tutor") {
      axios
        .post('http://localhost:8081/api/assign/assignTutor', {
          tutorID: userDetails.TutorID,
          grade,
          subject,
          fees,
        })
        .then((response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Tutor added to class successfully',
          });
          // Update the userDetails state with the new class
          const newClass = {
            ClassID: response.data.classID,
            Subject: subject,
            Grade: grade,
          };
          setUserDetails({
            ...userDetails,
            classes: [...userDetails.classes, newClass],
          });
          setOpenModal(false);
        })
        .catch((error) => {
          console.error('Error adding class:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error adding tutor to class',
          });
        });
    }
  };

  if (!userId) {
    return (
      <div className="before-select">Select a user to see their profile.</div>
    );
  }

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile">
      <div className="user-profile">
        <div className="user-details">
          <BiEdit className="assign-class" onClick={() => setOpenModal(true)} />
          <img src={user} alt="user" />
          <h4 className="username">
            {userDetails.FirstName} {userDetails.LastName}
          </h4>
          <span className="profession">{userDetails.userrole}</span>
        </div>

        {userDetails.userrole === "Student" && (
          <div className="student-details">
            <p>Student ID: {userDetails.StudentID}</p>
            <p>Gender: {userDetails.Gender}</p>
            <p>Grade: {userDetails.Grade}</p>
            <p>Birthday: {userDetails.Birthday}</p>
            <p>Address: {userDetails.Address}</p>
            <p>Telephone: {userDetails.TelNo}</p>
            <p>Email: {userDetails.Email}</p>

            <div className="user-courses">
              {userDetails.classes.map((classItem) => (
                <div className="course" key={classItem.ClassID}>
                  <div className="course-details">
                    <div className="course-cover">
                      <BiBook size={24} />
                    </div>
                    <div className="course-name">
                      <h6 className="title">{classItem.Subject}</h6>
                      <span className="tutor">{classItem.Tutor}</span>
                    </div>
                  </div>
                  <div className="action">:</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {userDetails.userrole === "Tutor" && (
          <div className="student-details">
            <p>Tutor ID: {userDetails.TutorID}</p>
            <p>Gender: {userDetails.Gender}</p>
            <p>NIC No: {userDetails.NICNo}</p>
            <p>Subject: {userDetails.Subject}</p>
            <p>Address: {userDetails.Address}</p>
            <p>Telephone: {userDetails.TelNo}</p>
            <p>Email: {userDetails.Email}</p>

            <div className="user-courses">
              {userDetails.classes.map((classItem) => (
                <div className="course" key={classItem.ClassID}>
                  <div className="course-details">
                    <div className="course-cover">
                      <BiBook size={24} />
                    </div>
                    <div className="course-name">
                      <h6 className="title">{classItem.Subject}</h6>
                      <span className="tutor">{classItem.Grade}</span>
                    </div>
                  </div>
                  <div className="action">:</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {userDetails.userrole === "Parent" && (
          <div className="student-details">
            <p>Parent ID: {userDetails.ParentID}</p>
            <p>Gender: {userDetails.Gender}</p>
            <p>NIC No: {userDetails.NICNo}</p>
            <p>Address: {userDetails.Address}</p>
            <p>Their Students: {userDetails.StudentNo}</p>
            <p>Telephone: {userDetails.TelNo}</p>
            <p>Email: {userDetails.Email}</p>
          </div>
        )}
      </div>

      {/* Assign Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {userDetails.userrole === "Student"
              ? "Assign for Classes"
              : userDetails.userrole === "Tutor"
              ? "Add Class"
              : ""}
          </Typography>
          {userDetails.userrole === "Student" && (
            <>
              <p>Student ID: {userDetails.StudentID}</p>
              <TextField
                select
                label="Select Grade"
                variant="outlined"
                fullWidth
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                sx={{ mb: 2 }}
              >
                {allOptions.grades.map((grade, index) => (
                  <MenuItem key={index} value={grade}>
                    {grade}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Select Subject"
                variant="outlined"
                fullWidth
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                sx={{ mb: 2 }}
              >
                {allOptions.subjects.map((subject, index) => (
                  <MenuItem key={index} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Select Tutor"
                variant="outlined"
                fullWidth
                value={tutor}
                onChange={(e) => setTutor(e.target.value)}
                sx={{ mb: 2 }}
              >
                {allOptions.tutors.map((tutor, index) => (
                  <MenuItem key={index} value={tutor}>
                    {tutor}
                  </MenuItem>
                ))}
              </TextField>
            </>
          )}
          {userDetails.userrole === "Tutor" && (
            <>
              <p>Tutor ID: {userDetails.TutorID}</p>
              <TextField
                label="Grade"
                variant="outlined"
                fullWidth
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Subject"
                variant="outlined"
                fullWidth
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Fees"
                variant="outlined"
                fullWidth
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                sx={{ mb: 2 }}
              />
            </>
          )}
          <button variant="contained" className="assign-btn" onClick={handleAssign}>
            {userDetails.userrole === "Student"
              ? "Assign"
              : userDetails.userrole === "Tutor"
              ? "Add"
              : ""}
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default Profile;

