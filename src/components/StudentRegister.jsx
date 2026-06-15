import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "../styles/Register.css";
import axios from "axios";

const StudentRegister = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const gender =
      selectedGender === "" || selectedGender === "Choose..."
        ? ""
        : selectedGender;
    const grade = document.getElementById("grade").value;
    const birthday = document.getElementById("birthday").value;
    const address = document.getElementById("address").value;
    const telephoneNumber = document.getElementById("telephoneNumber").value;
    const homeTelephoneNumber = document.getElementById("homeTelephoneNumber").value;
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;


    axios
      .post("http://localhost:8081/api/registration/student", {
        firstName,
        lastName,
        gender,
        grade,
        birthday,
        address,
        telephoneNumber,
        homeTelephoneNumber,
        email,
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
  };

  const setGender = (event) => {
    const gender = event.target.value;
    console.log(gender);
    setSelectedGender(gender);
    alert(gender);
  };


  return (
    <div>
      <div className="header">
        <h4>Student's Registration Form</h4>
      </div>
      <br />
      <div className="register-form">
        {formSubmitted && (
          <div className="alert alert-success">Registration successful!</div>
        )}
        <Form onSubmit={handleSubmit}>
          <div className="two-col">
            <div>
              <Form.Group>
                <Form.Label htmlFor="firstName">First Name</Form.Label>
                <Form.Control
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder="Enter first name"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="lastName">Last Name</Form.Label>
                <Form.Control
                  id="lastName"
                  type="text"
                  name="lastName"
                  placeholder="Enter last name"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="grade">Grade</Form.Label>
                <Form.Control
                  id="grade"
                  type="text"
                  name="grade"
                  placeholder="Enter Grade"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="birthday">Birthday</Form.Label>
                <Form.Control
                  id="birthday"
                  type="date"
                  name="birthday"
                  placeholder="Enter Birthday"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="telephoneNumber">
                  Telephone Number
                </Form.Label>
                <Form.Control
                  id="telephoneNumber"
                  type="tel"
                  name="telephoneNumber"
                  placeholder="Enter Telephone Number"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="homeTelephoneNumber">
                  Home Telephone
                </Form.Label>
                <Form.Control
                  id="homeTelephoneNumber"
                  type="tel"
                  name="homeTelephoneNumber"
                  placeholder="Enter Home Telephone Number"
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group>
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter Email"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="username">Username</Form.Label>
                <Form.Control
                  id="username"
                  type="text"
                  placeholder="Enter Username"
                  name="username"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control
                  id="password"
                  type="password"
                  placeholder="Enter Password"
                  name="password"
                />

                {/* <Form.Control className="inputRequest formContentElement" name="password" type="password" placeholder="Password"
                onChange={onChange}
                minLength={8}
                ref={register({
                  required: "Required",
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d](!@#$%^&*){8,}$/,
                    message: "Password should include letter and numbers. Cannot include @ Simple, Strong !"
                  }
                })}
                /> */}

              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="gender">Gender</Form.Label>
                <Form.Select
                  id="gender"
                  aria-label="Gender"
                  name="gender"
                  onChange={setGender}
                >
                  <option>Choose...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="address">Address</Form.Label>
                <Form.Control
                  id="address"
                  type="text"
                  placeholder="Enter Address"
                  name="address"
                />
              </Form.Group>
            </div>
          </div>
          <br />
          <div className="text-center">
            <Button variant="primary" type="submit" className="register-btn">
              Register
            </Button>
            <Button variant="primary" type="reset" className="reset-btn">
              Reset
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default StudentRegister;
