import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminSidebar from "./components/AdminSidebar";
import TutorSidebar from "./components/TutorSidebar";
import ParentSidebar from "./components/ParentSidebar";
import StudentSidebar from "./components/StudentSidebar";

import AdminDashboard from "./pages/AdminDashboard";
import AdminClassSchedule from "./pages/AdminClassSchedule";
import AdminAttendance from "./pages/AdminAttendance";
import AdminPayment from "./pages/AdminPayment";
import AdminReport from "./pages/AdminReport";

import TutorDashboard from "./pages/TutorDashboard";
import TutorClassSchedule from "./pages/TutorClassSchedule";
import TutorClass from "./pages/TutorClass";
import TutorGrade from "./pages/TutorGrade";

import ParentDashboard from "./pages/ParentDashboard";
import ParentClassSchedule from "./pages/ParentClassSchedule";
import ParentGrade from "./pages/ParentGrade";
import ParentPayment from "./pages/ParentPayment";

import StudentDashboard from "./pages/StudentDashboard";
import StudentClassSchedule from "./pages/StudentClassSchedule";
import StudentClass from "./pages/StudentClass";
import StudentGrade from "./pages/StudentGrade";

import PrivateRoutes from "./components/PrivateRoutes";


function ConditionalSideBar({ role }) {
  const location = useLocation();
  const sidebarComponents = {
    Admin: <AdminSidebar />,
    Tutor: <TutorSidebar />,
    Parent: <ParentSidebar />,
    Student: <StudentSidebar />,
  };

  if (
    location.pathname !== "/" &&
    location.pathname !== "/register" &&
    role !== ""
  ) {
    const SidebarComponent = sidebarComponents[role];
    if (SidebarComponent) {
      return SidebarComponent;
    }
  }
  return null;
}

function App() {
  const [role, setRole] = useState("");

  useEffect(() => {
    // Fetch the user role from local storage
    const userRole = localStorage.getItem("role");
    if (userRole) {
      setRole(userRole);
    }
  }, []);

  return (
    <Router>
      <div className="d-flex h-100">
        <ConditionalSideBar role={role} />
        <div className="flex-grow-1 d-flex">
          <div className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<PrivateRoutes role="Admin" />}>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin-attendance" element={<AdminAttendance />} />
                <Route path="/admin-payment" element={<AdminPayment />} />
                <Route path="/admin-report" element={<AdminReport />} />
                <Route
                  path="/admin-class-schedule"
                  element={<AdminClassSchedule />}
                />
              </Route>

              <Route element={<PrivateRoutes role="Tutor" />}>
                <Route path="/tutor-dashboard" element={<TutorDashboard />} />
                <Route
                  path="/tutor-class-schedule"
                  element={<TutorClassSchedule />}
                />
                <Route path="/tutor-classes" element={<TutorClass />} />
                <Route path="/tutor-grades" element={<TutorGrade />} />
              </Route>

              <Route element={<PrivateRoutes role="Student" />}>
                <Route
                  path="/student-dashboard"
                  element={<StudentDashboard />}
                />
                <Route
                  path="/student-class-schedule"
                  element={<StudentClassSchedule />}
                />
                <Route path="/student-courses" element={<StudentClass />} />
                <Route path="/student-grades" element={<StudentGrade />} />
              </Route>

              <Route element={<PrivateRoutes role="Parent" />}>
                <Route path="/parent-dashboard" element={<ParentDashboard />} />
                <Route
                  path="/parent-class-schedule"
                  element={<ParentClassSchedule />}
                />
                <Route path="/parent-grades" element={<ParentGrade />} />
                <Route path="/parent-payment" element={<ParentPayment />} />
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
