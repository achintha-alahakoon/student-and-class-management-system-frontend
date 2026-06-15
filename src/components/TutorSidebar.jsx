import React, { useState } from "react";
import { BiAlarm, BiCheck, BiHome, BiWallet } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import "../styles/AdminSidebarStyles.css";

const TutorSidebar = () => {

  const location = useLocation();
  const [active, setActive] = useState("");

  React.useEffect(() => {
    switch (location.pathname) {
      case "/tutor-dashboard":
        setActive("Dashboard");
        break;
      case "/tutor-class-schedule":
        setActive("Class Schedule");
        break;
      case "/tutor-classes":
        setActive("Classes");
        break;
      case "/tutor-grades":
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
        <Link to="/tutor-dashboard" className={`item ${active === "Dashboard" ? "active" : ""}`}>
          <BiHome className="icon"/>
          Dashboard
        </Link>
        <Link to="/tutor-class-schedule" className={`item ${active === "Class Schedule" ? "active" : ""}`}>
          <BiAlarm className="icon" />
          Class Schedule
        </Link>
        <Link to="/tutor-classes" className={`item ${active === "Classes" ? "active" : ""}`}>
          <BiCheck className="icon" />
          My Classes
        </Link>
        <Link to="/tutor-grades" className={`item ${active === "Grades" ? "active" : ""}`}>
          <BiWallet className="icon" />
          Grades
        </Link>
      </div>
    </div>
  );
};

export default TutorSidebar;
