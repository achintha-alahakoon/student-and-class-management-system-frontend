import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import "../styles/Register.css";
import StudentRegister from "../components/StudentRegister";

const Register = () => {
  const [activeButton, setActiveButton] = useState("student");

  const handleChange = (event, newValue) => {
    setActiveButton(newValue);
  };

  return (
    <div className="register-container">
      <h1>Hello! Register to get started</h1>
      <h6>Create your account</h6>
      <br />
      <div className="role-btn">
        <Box sx={{ maxWidth: "500px" }}>
          <Tabs
            className="custom-tabs"
            value={activeButton}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab value="student" label="Student" />
          </Tabs>
        </Box>
      </div>
      <br />

      <div className="form-container">
        {activeButton === "student" && <StudentRegister />}
      </div>
    </div>
  );
};

export default Register;
