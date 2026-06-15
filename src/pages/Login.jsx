import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import loginpic from "../Images/loginpic.png";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import axios from "axios";
import Validation from "../pages/LoginValidation";

function Login() {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors(Validation(values));
    axios
      .post("http://localhost:8081/api/auth/login", values)
      .then((res) => {
        const { status, role, token } = res.data;
        if (status === "success" && token) {
          localStorage.setItem("token", token);
          localStorage.setItem("role", role);
          if (role === "Admin") {
            navigate("/admin-dashboard");
          } else if (role === "Tutor") {
            navigate("/tutor-dashboard");
          } else if (role === "Student") {
            navigate("/student-dashboard");
          } else if (role === "Parent") {
            navigate("/parent-dashboard");
          }
          window.location.reload();
        } else {
          alert("Invalid credentials");
        }
      })
      .catch((err) => console.log(err));
  };
  

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 login-container">
      <Container fluid className="login-container">
        <Row>
          <Col md={6} className="login-form">
            <h1>Login</h1>
            <h5>Please login to your account</h5>
            <br />
            <br />
            <Form onSubmit={handleSubmit}>
              <Form.Group
                controlId="username"
                style={{ marginLeft: "20px", marginRight: "20px" }}
              >
                <Form.Label>Username</Form.Label>
                <Form.Label style={{ color: "#FF0000" }}>*</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={values.username}
                  onChange={e => setValues({ ...values, username: e.target.value })}
                />
                {errors.username && (
                  <span className="text-danger">{errors.username}</span>
                )}
              </Form.Group>
              <br />
              <Form.Group
                controlId="password"
                style={{ marginLeft: "20px", marginRight: "20px" }}
              >
                <Form.Label>Password</Form.Label>
                <Form.Label style={{ color: "#FF0000" }}>*</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={values.password}
                  onChange={e => setValues({ ...values, password: e.target.value })}
                />

                {errors.password && (
                  <span className="text-danger">{errors.password}</span>
                )}
              </Form.Group>
              <br />
              <Row
                className="align-items-center"
                style={{ marginLeft: "10px", marginRight: "10px" }}
              >
                <Col>
                  <Form.Group controlId="rememberMe" className="mb-0">
                    <Form.Check type="checkbox" label="Remember me" />
                  </Form.Group>
                </Col>
                <Col className="text-end">
                  <Form.Group controlId="forgotPassword" className="mb-0">
                    <Form.Text className="text-muted">
                      <Link to="#" className="login-form-link">
                        Forgot password?
                      </Link>
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
              <br />
              <br />
              <div className="text-center">
                <Button variant="primary" type="submit" className="login-btn">
                    Login
                  </Button>
                <br />
                <br />
                <br />
                <Form.Text className="text-muted mt-3">
                  New to the system? Create an account by{" "}
                  <Link to="/register" className="login-form-link">
                    Registering Here
                  </Link>
                </Form.Text>
              </div>
              <br />
            </Form>
          </Col>
          <Col md={6} className="login-image">
            <img src={loginpic} alt="Login" />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
