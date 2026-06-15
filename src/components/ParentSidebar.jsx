import React, { useState } from 'react';
import { BiAlarm, BiCheck, BiHome, BiWallet } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import "../styles/AdminSidebarStyles.css";

const ParentSideBar = () => {

    const location = useLocation();
  const [active, setActive] = useState("");

  React.useEffect(() => {
    switch (location.pathname) {
      case "/parent-dashboard":
        setActive("Dashboard");
        break;
      case "/parent-class-schedule":
        setActive("Class Schedule");
        break;
      case "/parent-grades":
        setActive("Grades");
        break;
      case "/parent-payment":
        setActive("Payment");
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
        <Link to="/parent-dashboard" className={`item ${active === "Dashboard" ? "active" : ""}`}>
          <BiHome className="icon"/>
          Dashboard
        </Link>
        <Link to="/parent-class-schedule" className={`item ${active === "Class Schedule" ? "active" : ""}`}>
          <BiAlarm className="icon" />
          Class Schedule
        </Link>
        <Link to="/parent-grades" className={`item ${active === "Grades" ? "active" : ""}`}>
          <BiCheck className="icon" />
          Gardes
        </Link>
        <Link to="/parent-payment" className={`item ${active === "Payment" ? "active" : ""}`}>
          <BiWallet className="icon" />
          Payment
        </Link>
      </div>
    </div>
  )
}

export default ParentSideBar
