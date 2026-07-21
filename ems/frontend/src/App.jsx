import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import PortalSelect from "./pages/PortalSelect";
import Login from "./pages/Login";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminEmployees from "./pages/admin/Employees";
import AdminLeave from "./pages/admin/Leave";
import AdminPayslips from "./pages/admin/Payslips";
import AdminSettings from "./pages/admin/Settings";

import EmployeeDashboard from "./pages/employee/Dashboard";
import EmployeeAttendance from "./pages/employee/Attendance";
import EmployeeLeave from "./pages/employee/Leave";
import EmployeePayslips from "./pages/employee/Payslips";
import PayslipDetail from "./pages/employee/PayslipDetail";
import EmployeeSettings from "./pages/employee/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PortalSelect />} />
          <Route path="/login/:portal" element={<Login />} />

          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/employees" element={<ProtectedRoute role="admin"><AdminEmployees /></ProtectedRoute>} />
          <Route path="/admin/leave" element={<ProtectedRoute role="admin"><AdminLeave /></ProtectedRoute>} />
          <Route path="/admin/payslips" element={<ProtectedRoute role="admin"><AdminPayslips /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>} />

          <Route path="/employee/dashboard" element={<ProtectedRoute role="employee"><EmployeeDashboard /></ProtectedRoute>} />
          <Route path="/employee/attendance" element={<ProtectedRoute role="employee"><EmployeeAttendance /></ProtectedRoute>} />
          <Route path="/employee/leave" element={<ProtectedRoute role="employee"><EmployeeLeave /></ProtectedRoute>} />
          <Route path="/employee/payslips" element={<ProtectedRoute role="employee"><EmployeePayslips /></ProtectedRoute>} />
          <Route path="/employee/payslips/:id" element={<ProtectedRoute role="employee"><PayslipDetail /></ProtectedRoute>} />
          <Route path="/employee/settings" element={<ProtectedRoute role="employee"><EmployeeSettings /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
