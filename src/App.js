// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useLocation,
// } from "react-router-dom";

// import Login from "./pages/Login";
// import Register from "./pages/Register";

// import AdminSidebar from "./components/AdminSidebar";
// import TutorSidebar from "./components/TutorSidebar";
// import ParentSidebar from "./components/ParentSidebar";
// import StudentSidebar from "./components/StudentSidebar";

// import AdminDashboard from "./pages/AdminDashboard";
// import AdminClassSchedule from "./pages/AdminClassSchedule";
// import AdminAttendance from "./pages/AdminAttendance";
// import AdminPayment from "./pages/AdminPayment";
// import AdminReport from "./pages/AdminReport";

// import TutorDashboard from "./pages/TutorDashboard";
// import TutorClassSchedule from "./pages/TutorClassSchedule";
// import TutorClass from "./pages/TutorClass";
// import TutorGrade from "./pages/TutorGrade";

// import ParentDashboard from "./pages/ParentDashboard";
// import ParentClassSchedule from "./pages/ParentClassSchedule";
// import ParentGrade from "./pages/ParentGrade";
// import ParentPayment from "./pages/ParentPayment";

// import StudentDashboard from "./pages/StudentDashboard";
// import StudentClassSchedule from "./pages/StudentClassSchedule";
// import StudentClass from "./pages/StudentClass";
// import StudentGrade from "./pages/StudentGrade";

// import ProtectedRoutes from "./routes/ProtectedRoutes";

// function ConditionalSideBar({ role }) {
//   const location = useLocation();
//   const sidebarComponents = {
//     Admin: <AdminSidebar />,
//     Tutor: <TutorSidebar />,
//     Parent: <ParentSidebar />,
//     Student: <StudentSidebar />,
//   };

//   if (
//     location.pathname !== "/" &&
//     location.pathname !== "/register" &&
//     role !== ""
//   ) {
//     const SidebarComponent = sidebarComponents[role];
//     if (SidebarComponent) {
//       return SidebarComponent;
//     }
//   }
//   return null;
// }

// function App() {
//   const [role, setRole] = useState("");

//   useEffect(() => {
//     // Fetch the user role from local storage
//     const userRole = localStorage.getItem("role");
//     if (userRole) {
//       setRole(userRole);
//     }
//   }, []);

//   return (
//     <Router>
//       <div className="d-flex h-100">
//         <ConditionalSideBar role={role} />
//         <div className="flex-grow-1 d-flex">
//           <div className="flex-grow-1">
//             <Routes>
//               <Route path="/" element={<Login />} />
//               <Route path="/register" element={<Register />} />

//               <Route element={<ProtectedRoutes role="Admin" />}>
//                 <Route path="/admin-dashboard" element={<AdminDashboard />} />
//                 <Route path="/admin-attendance" element={<AdminAttendance />} />
//                 <Route path="/admin-payment" element={<AdminPayment />} />
//                 <Route path="/admin-report" element={<AdminReport />} />
//                 <Route
//                   path="/admin-class-schedule"
//                   element={<AdminClassSchedule />}
//                 />
//               </Route>

//               <Route element={<ProtectedRoutes role="Tutor" />}>
//                 <Route path="/tutor-dashboard" element={<TutorDashboard />} />
//                 <Route
//                   path="/tutor-class-schedule"
//                   element={<TutorClassSchedule />}
//                 />
//                 <Route path="/tutor-classes" element={<TutorClass />} />
//                 <Route path="/tutor-grades" element={<TutorGrade />} />
//               </Route>

//               <Route element={<ProtectedRoutes role="Student" />}>
//                 <Route
//                   path="/student-dashboard"
//                   element={<StudentDashboard />}
//                 />
//                 <Route
//                   path="/student-class-schedule"
//                   element={<StudentClassSchedule />}
//                 />
//                 <Route path="/student-courses" element={<StudentClass />} />
//                 <Route path="/student-grades" element={<StudentGrade />} />
//               </Route>

//               <Route element={<ProtectedRoutes role="Parent" />}>
//                 <Route path="/parent-dashboard" element={<ParentDashboard />} />
//                 <Route
//                   path="/parent-class-schedule"
//                   element={<ParentClassSchedule />}
//                 />
//                 <Route path="/parent-grades" element={<ParentGrade />} />
//                 <Route path="/parent-payment" element={<ParentPayment />} />
//               </Route>
//             </Routes>
//           </div>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;












import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/layout/Layout";

// Auth pages
import Login from "./pages/auth/Login";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminClassSchedule from "./pages/admin/AdminClassSchedule";
import AdminAttendance from "./pages/admin/AdminAttendance";
import AdminPayment from "./pages/admin/AdminPayment";
import AdminReport from "./pages/admin/AdminReport";

// Tutor pages
import TutorDashboard from "./pages/tutor/TutorDashboard";
import TutorClassSchedule from "./pages/tutor/TutorClassSchedule";
import TutorClass from "./pages/tutor/TutorClass";
import TutorGrade from "./pages/tutor/TutorGrade";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentClassSchedule from "./pages/student/StudentClassSchedule";
import StudentClass from "./pages/student/StudentClass";
import StudentGrade from "./pages/student/StudentGrade";

// Parent pages
import ParentDashboard from "./pages/parent/ParentDashboard";
import ParentClassSchedule from "./pages/parent/ParentClassSchedule";
import ParentGrade from "./pages/parent/ParentGrade";
import ParentPayment from "./pages/parent/ParentPayment";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Protected: all roles — Layout renders Sidebar + Topbar + Outlet */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* ── Admin ── */}
            <Route
              index
              element={
                <ProtectedRoute allowedRoles={["Admin", "Tutor", "Student", "Parent"]}>
                  <RoleIndex />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/attendance"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <AdminAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/payments"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <AdminPayment />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/reports"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <AdminReport />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/class-schedule"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <AdminClassSchedule />
                </ProtectedRoute>
              }
            />

            {/* ── Tutor ── */}
            <Route
              path="tutor"
              element={
                <ProtectedRoute allowedRoles={["Tutor"]}>
                  <TutorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="tutor/class-schedule"
              element={
                <ProtectedRoute allowedRoles={["Tutor"]}>
                  <TutorClassSchedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="tutor/classes"
              element={
                <ProtectedRoute allowedRoles={["Tutor"]}>
                  <TutorClass />
                </ProtectedRoute>
              }
            />
            <Route
              path="tutor/grades"
              element={
                <ProtectedRoute allowedRoles={["Tutor"]}>
                  <TutorGrade />
                </ProtectedRoute>
              }
            />

            {/* ── Student ── */}
            <Route
              path="student"
              element={
                <ProtectedRoute allowedRoles={["Student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="student/class-schedule"
              element={
                <ProtectedRoute allowedRoles={["Student"]}>
                  <StudentClassSchedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="student/classes"
              element={
                <ProtectedRoute allowedRoles={["Student"]}>
                  <StudentClass />
                </ProtectedRoute>
              }
            />
            <Route
              path="student/grades"
              element={
                <ProtectedRoute allowedRoles={["Student"]}>
                  <StudentGrade />
                </ProtectedRoute>
              }
            />

            {/* ── Parent ── */}
            <Route
              path="parent"
              element={
                <ProtectedRoute allowedRoles={["Parent"]}>
                  <ParentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="parent/class-schedule"
              element={
                <ProtectedRoute allowedRoles={["Parent"]}>
                  <ParentClassSchedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="parent/grades"
              element={
                <ProtectedRoute allowedRoles={["Parent"]}>
                  <ParentGrade />
                </ProtectedRoute>
              }
            />
            <Route
              path="parent/payments"
              element={
                <ProtectedRoute allowedRoles={["Parent"]}>
                  <ParentPayment />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all — redirect unknown URLs to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Redirects /dashboard index to the correct role home page
function RoleIndex() {
  const role = localStorage.getItem("role");
  const roleHome = {
    Admin:   "/dashboard/admin",
    Tutor:   "/dashboard/tutor",
    Student: "/dashboard/student",
    Parent:  "/dashboard/parent",
  };
  return <Navigate to={roleHome[role] || "/login"} replace />;
}

export default App;
