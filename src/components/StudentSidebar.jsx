import React, { useState } from "react";
import { BiAlarm, BiCheck, BiHome, BiWallet } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import "../styles/AdminSidebarStyles.css";

const StudentSideBar = () => {
  const location = useLocation();
  const [active, setActive] = useState("");

  React.useEffect(() => {
    switch (location.pathname) {
      case "/student-dashboard":
        setActive("Dashboard");
        break;
      case "/student-class-schedule":
        setActive("Class Schedule");
        break;
      case "/student-courses":
        setActive("Courses");
        break;
      case "/student-grades":
        setActive("Grades");
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
        <Link
          to="/student-dashboard"
          className={`item ${active === "Dashboard" ? "active" : ""}`}
        >
          <BiHome className="icon" />
          Dashboard
        </Link>
        <Link
          to="/student-class-schedule"
          className={`item ${active === "Class Schedule" ? "active" : ""}`}
        >
          <BiAlarm className="icon" />
          Class Schedule
        </Link>
        <Link
          to="/student-courses"
          className={`item ${active === "Courses" ? "active" : ""}`}
        >
          <BiCheck className="icon" />
          My Classes
        </Link>
        <Link
          to="/student-grades"
          className={`item ${active === "Grades" ? "active" : ""}`}
        >
          <BiWallet className="icon" />
          Grades
        </Link>
      </div>
    </div>
  );
};

export default StudentSideBar;
