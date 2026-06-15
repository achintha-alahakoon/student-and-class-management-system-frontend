import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "../styles/Register.css";
import axios from "axios";

const ParentRegister = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");

  const handleSubmit = () => {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    let gender = "";
    if (selectedGender === "" || selectedGender === "Choose...") {
      gender = "";
    } else {
      gender = selectedGender;
    }
    const address = document.getElementById("address").value;
    const telephoneNumber = document.getElementById("telephoneNumber").value;
    const email = document.getElementById("email").value;
    const nicNumber = document.getElementById("nicNumber").value;
    const studentNumber = document.getElementById("studentNumber").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    console.log(
      firstName,
      lastName,
      gender,
      address,
      telephoneNumber,
      email,
      nicNumber,
      studentNumber,
      username,
      password
    );

    axios
      .post("http://localhost:8081/api/registration/parent", {
        firstName,
        lastName,
        gender,
        address,
        telephoneNumber,
        email,
        nicNumber,
        studentNumber,
        username,
        password,
      })
      .then((response) => {
        console.log(response.data);
        setFormSubmitted(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const setGender = (event) => {
    const gender = event.target.value;
    console.log(gender);
    setSelectedGender(gender);
    alert(gender);
  };
  return (
    <div>
      <div className="header">
        <h4>Parent's Registration Form</h4>
      </div>
      <br />
      <div className="register-form">
        <Container>
          <Row>
            <Col>
            {formSubmitted && (
                <div className="alert alert-success">
                  Registration successful!
                </div>
              )}
              <Form>
                <Row>
                  <Col>
                    <Form.Group>
                      <Row>
                        <Col>
                          <Form.Label htmlFor="firstName">
                            First Name
                          </Form.Label>
                        </Col>
                        <Col>
                          <Form.Control
                            id="firstName"
                            type="text"
                            name="firstName"
                            placeholder="Enter first name"
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
                            onChange={setGender}
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

                      <Button
                        variant="primary"
                        type="reset"
                        className="reset-btn"
                      >
                        Reset
                      </Button>
                    </div>
                  </Col>
                </Row>
                <br />
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default ParentRegister;
