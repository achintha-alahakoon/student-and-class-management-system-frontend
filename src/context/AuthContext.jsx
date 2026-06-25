import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    user: null,
    role: null,
    tenantId: null,
    token: null,
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Check if token is expired
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setAuth({ user: null, role: null, tenantId: null, token: null, loading: false });
          return;
        }

        setAuth({
          user: {
            UserID: decoded.UserID,
            Name: decoded.Name || null,
            TenantID: decoded.TenantID,
          },
          role: decoded.Role,
          tenantId: decoded.TenantID,
          token,
          loading: false,
        });
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setAuth({ user: null, role: null, tenantId: null, token: null, loading: false });
      }
    } else {
      setAuth((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const login = (token, userData = null) => {
  try {
    console.log("Token received:", token); // <-- Add this
    const decoded = jwtDecode(token);
    console.log("Decoded JWT:", decoded); // <-- Add this
    console.log("Role in JWT:", decoded.Role); // <-- Add this

    localStorage.setItem("token", token);
    localStorage.setItem("role", decoded.Role);
    setAuth({ user: userData || { UserID: decoded.UserID, Name: decoded.Name, TenantID: decoded.TenantID }, role: decoded.Role, tenantId: decoded.TenantID, token, loading: false });
  } catch (e) {
    console.error("JWT Decode Error:", e); // <-- Add this
  }
};

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setAuth({ user: null, role: null, tenantId: null, token: null, loading: false });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}