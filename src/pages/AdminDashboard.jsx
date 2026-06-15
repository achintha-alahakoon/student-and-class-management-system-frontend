import React from "react";
import Content from "../components/Content";
import "../styles/Admin.css";

const AdminDashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <Content />
      </div>
    </div>
  );
};

export default AdminDashboard;
