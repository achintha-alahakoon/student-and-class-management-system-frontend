import React, { useState, useEffect } from "react";
import "../styles/TutorsList.css";
import user from "../Images/user.png";
import { BiPlus, BiEdit, BiTrash, BiSearch } from "react-icons/bi";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Row, Col, Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import JsBarcode from "jsbarcode";
import jsPDF from "jspdf";

const StudentsList = ({ onSelectUser }) => {
  const [students, setStudents] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    grade: "",
    telephoneNumber: "",
    email: "",
    birthday: "",
    address: "",
    gender: "",
    username: "",
    password: "",
  });

  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    grade: "",
    telephoneNumber: "",
    email: "",
    birthday: "",
    gender: "",
    address: "",
  });

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStudentList();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8081/api/registration/student", formData)
      .then((response) => {
        setOpenAddModal(false);
        fetchStudentList();
        Swal.fire({
          title: "Good job!",
          text: "Student registered successfully!",
          icon: "success",
        });

        const studentId = response.data.StudentID;
        const fullname = response.data.Name;
        const address = response.data.Address;
        downloadBarcode(studentId, fullname, address);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        `http://localhost:8081/api/students/edit/${selectedUserId}`,
        editFormData
      )
      .then((response) => {
        setOpenEditModal(false);
        fetchStudentList();
        Swal.fire({
          title: "Good job!",
          text: "Student details updated successfully!",
          icon: "success",
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchStudentList = () => {
    fetch("http://localhost:8081/api/students/studentslist")
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error("Error fetching student data:", error));
  };

  const deleteRow = (userId) => {
    axios
      .delete(`http://localhost:8081/api/students/${userId}`)
      .then((response) => {
        fetchStudentList();
        console.log("Row deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting row:", error);
      });
  };

  const popup = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRow(userId);
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };

  const handlePopoverOpen = (event, userId) => {
    setPopoverAnchor(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
    setSelectedUserId(null);
  };

  const handleEditClick = () => {
    const student = students.find(
      (student) => student.UserID === selectedUserId
    );
    if (student) {
      setEditFormData({
        firstName: student.FirstName,
        lastName: student.LastName,
        birthday: student.Birthday,
        gender: student.Gender,
        telephoneNumber: student.TelNo,
        email: student.Email,
        grade: student.Grade,
        address: student.Address,
      });
      setOpenEditModal(true);
      handlePopoverClose();
    }
  };

  const openPopover = Boolean(popoverAnchor);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 900,
    bgcolor: "background.paper",
    border: "None",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
  };

  const downloadBarcode = (studentId, fullname, address) => {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, studentId, {
      format: "CODE128",
      displayValue: true,
      text: `Student ID: ${studentId}`,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();

    // Add academy name
    pdf.setFontSize(16);
    pdf.text("Aurora Academy", 10, 10);

    // Add student details
    pdf.setFontSize(12);
    pdf.text(`Student Name: ${fullname}`, 10, 20);
    pdf.text(`Address: ${address}`, 10, 30);

    // Add barcode image
    pdf.addImage(imgData, "PNG", 10, 40, 70, 20);

    pdf.save(`Student_${studentId}_Barcode.pdf`);
  };

  return (
    <div className="tutors-list">
      <div className="list-header">
        <div className="list-header-title">
          <h3>Students</h3>
        </div>
        <div className="list-search-box">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <BiSearch className="icon" />
        </div>
        <div className="edit" onClick={() => setOpenAddModal(true)}>
          <BiPlus className="icon" />
        </div>
      </div>
      <div className="list-container">
        {students
          .filter((student) =>
            student.StudentID.toString().includes(searchQuery.toString())
          )
          .map((student, index) => (
            <div
              className="list"
              key={index}
              onClick={() => onSelectUser(student.UserID)}
            >
              <div className="tutor-details">
                <img src={user} alt="user" />
                <h6>
                  {student.FirstName} {student.LastName}
                </h6>
              </div>
              <div className="grade-container">
                <h6>Grade {student.Grade}</h6>
              </div>
              <span
                className="tutor-todo"
                onClick={(e) => handlePopoverOpen(e, student.UserID)}
              >
                :
              </span>
            </div>
          ))}
      </div>

      <Popover
        open={openPopover}
        anchorEl={popoverAnchor}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleEditClick}
                sx={{ gap: 1, color: "#27374d" }}
              >
                <BiEdit className="edit-icon" />
                <ListItemText primary="Edit" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => popup(selectedUserId)}
                sx={{ gap: 1, color: "red" }}
              >
                <BiTrash className="delete-icon" />
                <ListItemText primary="Delete" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Popover>

      {/* Add Modal */}
      <Modal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h3>Student's Registration</h3>
          <br />
          <Form>
            <Row>
              <Col>
                <Form.Group>
                  <Row>
                    <Col>
                      <Form.Label htmlFor="firstName">First Name</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        id="firstName"
                        type="text"
                        name="firstName"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Row>
                    <Col>
                      <Form.Label>Grade</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        id="grade"
                        type="text"
                        name="grade"
                        placeholder="Enter Grade"
                        value={formData.grade}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <Form.Group>
                  <Row>
                    <Col>
                      <Form.Label>Last Name</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        id="lastName"
                        type="text"
                        name="lastName"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Row>
                    <Col>
                      <Form.Label>Email</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <Form.Group>
                  <Row>
                    <Col>
                      <Form.Label>Birthday</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        id="birthday"
                        type="date"
                        name="birthday"
                        placeholder="Enter Birthday"
                        value={formData.birthday}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Row>
                    <Col>
                      <Form.Label>Telephone Number</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        id="telephoneNumber"
                        type="tel"
                        name="telephoneNumber"
                        placeholder="Enter Telephone Number"
                        value={formData.telephoneNumber}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <Form.Group>
                  <Row>
                    <Col>
                      <Form.Label>Gender</Form.Label>
                    </Col>
                    <Col>
                      <Form.Select
                        id="gender"
                        aria-label="Gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option>Choose...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Row>
                    <Col>
                      <Form.Label>Username</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        id="username"
                        type="text"
                        placeholder="Enter Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <Form.Group>
                  <Row>
                    <Col>
                      <Form.Label>Address</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        id="address"
                        type="text"
                        placeholder="Enter Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Row>
                    <Col>
                      <Form.Label>Password</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        id="password"
                        type="password"
                        placeholder="Enter Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>
            <br />
            <br />
            <Row>
              <Col>
                <div className="text-center">
                  <Button
                    variant="primary"
                    type="submit"
                    className="register-btn"
                    onClick={handleSubmit}
                  >
                    Register
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button variant="primary" type="reset" className="reset-btn">
                    Reset
                  </Button>
                </div>
              </Col>
            </Row>
            <br />
          </Form>
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h3>Edit Student's Details</h3>
          <br />
          <Form>
            <Row>
              <Col>
                <Form.Group>
                  <Row>
                    <Col>
                      <Form.Label htmlFor="firstName">First Name</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        id="firstName"
                        type="text"
                        name="firstName"
                        placeholder="Enter first name"
                        value={editFormData.firstName}
                        onChange={handleEditChange}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Row>
                    <Col>
                      <Form.Label>Telephone Number</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        id="telephoneNumber"
                        type="tel"
                        name="telephoneNumber"
                        placeholder="Enter Telephone Number"
                        value={editFormData.telephoneNumber}
                        onChange={handleEditChange}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <Form.Group>
                  <Row>
                    <Col>
                      <Form.Label>Last Name</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        id="lastName"
                        type="text"
                        name="lastName"
                        placeholder="Enter last name"
                        value={editFormData.lastName}
                        onChange={handleEditChange}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Row>
                    <Col>
                      <Form.Label>Email</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter Email"
                        value={editFormData.email}
                        onChange={handleEditChange}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <Form.Group>
                  <Row>
                    <Col>
                      <Form.Label>Birthday</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        id="birthday"
                        type="date"
                        name="birthday"
                        placeholder="Enter Birthday"
                        value={editFormData.birthday}
                        onChange={handleEditChange}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Row>
                    <Col>
                      <Form.Label>Grade</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        id="grade"
                        type="text"
                        placeholder="Enter Grade"
                        name="grade"
                        value={editFormData.grade}
                        onChange={handleEditChange}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <Form.Group>
                  <Row>
                    <Col>
                      <Form.Label>Gender</Form.Label>
                    </Col>
                    <Col>
                      <Form.Select
                        id="gender"
                        aria-label="Gender"
                        name="gender"
                        value={editFormData.gender}
                        onChange={handleEditChange}
                      >
                        <option>Choose...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Row>
                    <Col>
                      <Form.Label>Address</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        id="address"
                        type="text"
                        placeholder="Enter Address"
                        name="address"
                        value={editFormData.address}
                        onChange={handleEditChange}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>
            <br />
            <br />
            <Row>
              <Col>
                <div className="text-center">
                  <Button
                    variant="primary"
                    type="submit"
                    className="register-btn"
                    onClick={handleEditSubmit}
                  >
                    Update
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button variant="primary" type="reset" className="reset-btn">
                    Reset
                  </Button>
                </div>
              </Col>
            </Row>
            <br />
          </Form>
        </Box>
      </Modal>
    </div>
  );
};

export default StudentsList;
