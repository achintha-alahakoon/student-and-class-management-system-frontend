import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight, ScanLine } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import navConfig from "../../config/navConfig";

export default function Sidebar() {
  const { role } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const items = navConfig[role] || [];

  return (
    <aside
      className={`relative flex h-screen flex-col border-r border-gray-100 bg-white transition-all duration-300 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-gray-100 px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
          <ScanLine className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold text-gray-900 leading-tight">
            EduManage
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {items.map(({ icon: Icon, label, path, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`h-[18px] w-[18px] shrink-0 ${
                    isActive ? "text-indigo-600" : "text-gray-400"
                  }`}
                />
                {!collapsed && <span className="truncate">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm hover:text-gray-600"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>
    </aside>
  );
}