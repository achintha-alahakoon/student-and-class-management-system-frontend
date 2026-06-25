import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// allowedRoles is optional — if omitted, any authenticated user can access
export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, role, loading } = useAuth();
  const location = useLocation();

  // Still decoding JWT on first mount — show nothing to avoid flash
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  // Not logged in — send to login, remember where they were going
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but wrong role for this route
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}