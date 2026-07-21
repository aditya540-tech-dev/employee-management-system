import { useEffect, useState } from "react";
import { Users, Building2, CalendarCheck, FileText } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/StatCard";
import client from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    departments: 0,
    todaysAttendance: 0,
    pendingLeaves: 0,
  });

  useEffect(() => {
    client.get("/dashboard/admin").then((res) => setStats(res.data));
  }, []);

  return (
    <DashboardLayout variant="admin">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="text-slate-500 mt-1 mb-6">Welcome back, {user?.name} — here's your overview</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total Employees" value={stats.totalEmployees} icon={Users} />
        <StatCard label="Departments" value={stats.departments} icon={Building2} />
        <StatCard label="Today's Attendance" value={stats.todaysAttendance} icon={CalendarCheck} />
        <StatCard label="Pending Leaves" value={stats.pendingLeaves} icon={FileText} />
      </div>
    </DashboardLayout>
  );
}
