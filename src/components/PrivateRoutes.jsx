import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = ({ role }) => {
  const userRole = localStorage.getItem("role");
  return userRole === role ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
