import { useEffect, useState } from "react";
import { CalendarDays, FileText, DollarSign, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/StatCard";
import client from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ daysPresent: 0, pendingLeaves: 0, latestPayslip: 0 });

  useEffect(() => {
    client.get("/dashboard/employee").then((res) => setStats(res.data));
  }, []);

  return (
    <DashboardLayout variant="employee">
      <h1 className="text-2xl font-bold text-slate-900">Welcome, {user?.name?.split(" ")[0]}!</h1>
      <p className="text-slate-500 mt-1 mb-6">{user?.position} - {user?.department}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <StatCard label="Days Present" value={stats.daysPresent} icon={CalendarDays} />
        <StatCard label="Pending Leaves" value={stats.pendingLeaves} icon={FileText} />
        <StatCard label="Latest Payslip" value={`$${stats.latestPayslip}`} icon={DollarSign} />
      </div>

      <div className="flex gap-4">
        <button onClick={() => navigate("/employee/attendance")} className="flex items-center gap-2 bg-brand text-white px-5 py-3 rounded-lg text-sm font-medium">
          Mark Attendance <ArrowRight className="w-4 h-4" />
        </button>
        <button onClick={() => navigate("/employee/leave")} className="border border-slate-200 bg-white px-5 py-3 rounded-lg text-sm font-medium">
          Apply for Leave
        </button>
      </div>
    </DashboardLayout>
  );
}
