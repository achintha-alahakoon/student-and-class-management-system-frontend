import React, { useState } from "react";
import { BiAlarm, BiCheck, BiHome, BiStats, BiWallet } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import "../styles/AdminSidebarStyles.css";


const AdminSidebar = () => {

  const location = useLocation();
  const [active, setActive] = useState("");

  React.useEffect(() => {
    switch (location.pathname) {
      case "/admin-dashboard":
        setActive("Dashboard");
        break;
      case "/admin-class-schedule":
        setActive("Class Schedule");
        break;
      case "/admin-attendance":
        setActive("Attendance");
        break;
      case "/admin-payment":
        setActive("Payment");
        break;
      case "/admin-report":
        setActive("Report");
        break;
      default:
        setActive("Dashboard");
        break;
    }
  }, [location]);

  return (
    <div className="menu">
      <div className="logo">
        <h2>Aurora Academy</h2>
      </div>
      <div className="menu-list">
        <Link to="/admin-dashboard" className={`item ${active === "Dashboard" ? "active" : ""}`}>
          <BiHome className="icon"/>
          Dashboard
        </Link>
        <Link to="/admin-class-schedule" className={`item ${active === "Class Schedule" ? "active" : ""}`}>
          <BiAlarm className="icon" />
          Class Schedule
        </Link>
        <Link to="/admin-attendance" className={`item ${active === "Attendance" ? "active" : ""}`}>
          <BiCheck className="icon" />
          Attendance
        </Link>
        <Link to="/admin-payment" className={`item ${active === "Payment" ? "active" : ""}`}>
          <BiWallet className="icon" />
          Payment
        </Link>
        <Link to="/admin-report" className={`item ${active === "Report" ? "active" : ""}`}>
          <BiStats className="icon" />
          Report
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
