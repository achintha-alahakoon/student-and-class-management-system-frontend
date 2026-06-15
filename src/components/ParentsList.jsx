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

const ParentsList = ({ onSelectUser }) => {
  const [parents, setParents] = useState([]);
  const [open, setOpen] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    telephoneNumber: "",
    email: "",
    nicNumber: "",
    studentNumber: "",
    gender: "",
    username: "",
    address: "",
    password: "",
  });
  const [selectedParentId, setSelectedParentId] = useState(null);

  useEffect(() => {
    console.log(parents);
  }, [parents]);

  useEffect(() => {
    fetchParentList();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8081/api/registration/parent", formData)
      .then((response) => {
        console.log(response.data);
        setOpen(false);
        fetchParentList();
        Swal.fire({
          title: "Good job!",
          text: "Parent registered successfully!",
          icon: "success",
        });
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.message) {
          Swal.fire({
            title: "Error!",
            text: error.response.data.message,
            icon: "error",
          });
        } else {
          console.log(error);
        }
      });
  };

  const fetchParentList = () => {
    fetch("http://localhost:8081/api/parents/parentslist")
      .then((response) => {
        return response.json();
      })
      .then((data) => setParents(data))
      .catch((error) => console.error("Error fetching parent data:", error));
  };

  const deleteRow = (userId) => {
    console.log(userId);
    axios
      .delete(`http://localhost:8081/api/parents/${userId}`)
      .then((response) => {
        console.log("Row deleted successfully");
        fetchParentList(); // Refresh the parent list after deletion
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
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRow(userId);
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
  };

  const handlePopoverOpen = (event, userId) => {
    setPopoverAnchor(event.currentTarget);
    setSelectedParentId(userId);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
    setSelectedParentId(null);
  };

  const openPopover = Boolean(popoverAnchor);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 900,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className="tutors-list">
      <div className="list-header">
      <div className="list-header-title">
          <h3>Parents</h3>
        </div>
        <div className="list-search-box">
          <input type="text" placeholder="Search" />
          <BiSearch className="icon" />
        </div>
        <div className="edit" onClick={() => setOpen(true)}>
          <BiPlus className="icon" />
        </div>
      </div>
      <div className="list-container">
        {parents.map((parent, index) => (
          <div className="list" key={index} onClick={() => onSelectUser(parent.UserID)}>
            <div className="tutor-details">
              <img src={user} alt="user" />
              <h6>{parent.FirstName} {parent.LastName}</h6>
            </div>
            <span className="tutor-todo" onClick={(e) => handlePopoverOpen(e, parent.UserID)}>:</span>
          </div>
        ))}
      </div>

      <Popover
        open={openPopover}
        anchorEl={popoverAnchor}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton sx={{ gap: 1, color: '#27374d' }}>
                <BiEdit className="edit-icon" />
                <ListItemText primary="Edit" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => popup(selectedParentId)} sx={{ gap: 1, color: 'red' }}>
                <BiTrash className="delete-icon" />
                <ListItemText primary="Delete" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Popover>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="custom-modal"
      >
        <Box sx={style}>
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
                      <Form.Label>NIC Number</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        id="nicNumber"
                        type="text"
                        name="nicNumber"
                        placeholder="Enter NIC Number"
                        value={formData.nicNumber}
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
                      <Form.Label>Student's Number</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        id="studentNumber"
                        type="text"
                        placeholder="Enter Student's Number"
                        name="studentNumber"
                        value={formData.studentNumber}
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
                  </Button>&nbsp;&nbsp;&nbsp;

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

export default ParentsList;
