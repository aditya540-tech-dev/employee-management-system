import { NavLink, useNavigate } from "react-router-dom";
import { LayoutGrid, User, FileText, DollarSign, Settings, LogOut, CalendarDays, UserCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ADMIN_LINKS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/admin/employees", label: "Employees", icon: User },
  { to: "/admin/leave", label: "Leave", icon: FileText },
  { to: "/admin/payslips", label: "Payslips", icon: DollarSign },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const EMPLOYEE_LINKS = [
  { to: "/employee/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/employee/attendance", label: "Attendance", icon: CalendarDays },
  { to: "/employee/leave", label: "Leave", icon: FileText },
  { to: "/employee/payslips", label: "Payslips", icon: DollarSign },
  { to: "/employee/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ variant }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = variant === "admin" ? ADMIN_LINKS : EMPLOYEE_LINKS;

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <aside className="w-[260px] shrink-0 bg-[#0B0B1A] text-white flex flex-col min-h-screen">
      <div className="flex items-center gap-3 px-6 py-6">
        <UserCircle2 className="w-8 h-8 text-white" />
        <div>
          <p className="font-semibold leading-tight">Employee MS</p>
          <p className="text-xs text-slate-400">Management System</p>
        </div>
      </div>

      <div className="mx-4 mb-6 flex items-center gap-3 bg-white/5 rounded-lg px-3 py-3">
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold">
          {user?.name?.[0] || "?"}
        </div>
        <div>
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
        </div>
      </div>

      <p className="px-6 text-[11px] tracking-wider text-slate-500 mb-2">NAVIGATION</p>
      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                isActive
                  ? "bg-brand/20 text-brand border-l-2 border-brand -ml-[2px] pl-[14px]"
                  : "text-slate-300 hover:bg-white/5"
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-6 py-4 text-sm text-slate-300 hover:text-white border-t border-white/10"
      >
        <LogOut className="w-4 h-4" />
        Log out
      </button>
    </aside>
  );
}
