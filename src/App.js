import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/layout/Layout";

// Auth pages
import Login from "./pages/auth/Login";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/Students";
import AdminRegisterStudent from "./pages/admin/RegisterStudent";
import StudentProfile from "./pages/admin/StudentProfile";
import AdminTutors from "./pages/admin/Tutors";
import AdminRegisterTutor from "./pages/admin/RegisterTutor";
import TutorProfile from "./pages/admin/TutorProfile";
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


// Redirects /dashboard to the correct role home — uses AuthContext, not localStorage
function RoleIndex() {
  const { role, loading } = useAuth();

  if (loading) return null; // wait for JWT decode

  const roleHome = {
    Admin:   "/dashboard/admin",
    Tutor:   "/dashboard/tutor",
    Student: "/dashboard/student",
    Parent:  "/dashboard/parent",
  };

  return <Navigate to={roleHome[role] || "/login"} replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Protected shell — all roles share Layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Index — redirect to role home */}
            <Route index element={<RoleIndex />} />

            {/* ── Admin ── */}
            <Route path="admin" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="admin/students" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminStudents /></ProtectedRoute>} />
            <Route path="admin/register-student" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminRegisterStudent /></ProtectedRoute>} />
            <Route path="admin/students/:id" element={<ProtectedRoute allowedRoles={["Admin"]}><StudentProfile /></ProtectedRoute>} />
            <Route path="admin/tutors" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminTutors /></ProtectedRoute>} />
            <Route path="admin/register-tutor" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminRegisterTutor /></ProtectedRoute>} />
            <Route path="admin/tutors/:id" element={<ProtectedRoute allowedRoles={["Admin"]}><TutorProfile /></ProtectedRoute>} />
            <Route path="admin/attendance" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminAttendance /></ProtectedRoute>} />
            <Route path="admin/payments" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminPayment /></ProtectedRoute>} />
            <Route path="admin/reports" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminReport /></ProtectedRoute>} />
            <Route path="admin/class-management" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminClassSchedule /></ProtectedRoute>} />

            {/* ── Tutor ── */}
            <Route path="tutor" element={<ProtectedRoute allowedRoles={["Tutor"]}><TutorDashboard /></ProtectedRoute>} />
            <Route path="tutor/class-schedule" element={<ProtectedRoute allowedRoles={["Tutor"]}><TutorClassSchedule /></ProtectedRoute>} />
            <Route path="tutor/classes" element={<ProtectedRoute allowedRoles={["Tutor"]}><TutorClass /></ProtectedRoute>} />
            <Route path="tutor/grades" element={<ProtectedRoute allowedRoles={["Tutor"]}><TutorGrade /></ProtectedRoute>} />

            {/* ── Student ── */}
            <Route path="student" element={<ProtectedRoute allowedRoles={["Student"]}><StudentDashboard /></ProtectedRoute>} />
            <Route path="student/class-schedule" element={<ProtectedRoute allowedRoles={["Student"]}><StudentClassSchedule /></ProtectedRoute>} />
            <Route path="student/classes" element={<ProtectedRoute allowedRoles={["Student"]}><StudentClass /></ProtectedRoute>} />
            <Route path="student/grades" element={<ProtectedRoute allowedRoles={["Student"]}><StudentGrade /></ProtectedRoute>} />

            {/* ── Parent ── */}
            <Route path="parent" element={<ProtectedRoute allowedRoles={["Parent"]}><ParentDashboard /></ProtectedRoute>} />
            <Route path="parent/class-schedule" element={<ProtectedRoute allowedRoles={["Parent"]}><ParentClassSchedule /></ProtectedRoute>} />
            <Route path="parent/grades" element={<ProtectedRoute allowedRoles={["Parent"]}><ParentGrade /></ProtectedRoute>} />
            <Route path="parent/payments" element={<ProtectedRoute allowedRoles={["Parent"]}><ParentPayment /></ProtectedRoute>} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
