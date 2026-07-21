import { useEffect, useState } from "react";
import { CalendarDays, AlertCircle, Clock, LogIn } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/StatCard";
import client from "../../api/client";

export default function EmployeeAttendance() {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({ daysPresent: 0, lateArrivals: 0, avgWorkHours: 0 });

  async function load() {
    const res = await client.get("/attendance/me");
    setRecords(res.data.records);
    setStats(res.data.stats);
  }

  useEffect(() => {
    load();
  }, []);

  async function clockIn() {
    await client.post("/attendance/clock-in");
    load();
  }

  return (
    <DashboardLayout variant="employee">
      <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
      <p className="text-slate-500 mt-1 mb-6">Track your work hours and daily check-ins</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <StatCard label="Days Present" value={stats.daysPresent} icon={CalendarDays} />
        <StatCard label="Late Arrivals" value={stats.lateArrivals} icon={AlertCircle} />
        <StatCard label="Avg. Work Hrs" value={`${stats.avgWorkHours} Hrs`} icon={Clock} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 font-semibold border-b border-slate-100">Recent Activity</div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-6 py-3">Date</th>
              <th className="text-left px-6 py-3">Check In</th>
              <th className="text-left px-6 py-3">Check Out</th>
              <th className="text-left px-6 py-3">Working Hours</th>
              <th className="text-left px-6 py-3">Day Type</th>
              <th className="text-left px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id} className="border-t border-slate-100">
                <td className="px-6 py-4">{new Date(r.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">{r.checkIn || "-"}</td>
                <td className="px-6 py-4">{r.checkOut || "-"}</td>
                <td className="px-6 py-4">{r.workingHours || 0} hrs</td>
                <td className="px-6 py-4">{r.dayType}</td>
                <td className="px-6 py-4">{r.status}</td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-slate-400 py-10">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button
        onClick={clockIn}
        className="fixed bottom-8 right-8 flex items-center gap-3 bg-brand text-white px-5 py-4 rounded-xl shadow-lg"
      >
        <LogIn className="w-5 h-5" />
        <span className="text-left leading-tight">
          <span className="block font-semibold">Clock In</span>
          <span className="block text-xs text-indigo-100">start your work day</span>
        </span>
      </button>
    </DashboardLayout>
  );
}
