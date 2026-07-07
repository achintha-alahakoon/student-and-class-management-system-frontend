import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, LogOut, UserCircle, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const roleColors = {
  Admin:   "bg-purple-100 text-purple-700",
  Tutor:   "bg-teal-100 text-teal-700",
  Student: "bg-blue-100 text-blue-700",
  Parent:  "bg-amber-100 text-amber-700",
};

export default function Topbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "??";

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6">
      {/* Left: page title slot — pages can use a context or portal to set this */}
      <div>
        <h1 className="text-sm font-semibold text-gray-900">
          Welcome back, {user?.username ?? "User"}
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Right: notifications + profile */}
      <div className="flex items-center gap-3">

        {/* Role badge */}
        <span className={`hidden sm:inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColors[role] ?? "bg-gray-100 text-gray-600"}`}>
          {role}
        </span>

        {/* Notification bell */}
        <button className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
          <Bell className="h-5 w-5" />
          {/* Unread dot */}
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-500" />
        </button>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-gray-50"
          >
            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
              {initials}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">
              {user?.username ?? "User"}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
              <button
                onClick={() => { navigate("/dashboard/profile"); setDropdownOpen(false); }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                <UserCircle className="h-4 w-4 text-gray-400" />
                Profile
              </button>
              <button
                onClick={() => { navigate("/dashboard/settings"); setDropdownOpen(false); }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                <Settings className="h-4 w-4 text-gray-400" />
                Settings
              </button>
              <div className="my-1 border-t border-gray-100" />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}