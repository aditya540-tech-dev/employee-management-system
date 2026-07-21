import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import client from "../../api/client";

function StatusBadge({ status }) {
  const colors = {
    Pending: "bg-amber-100 text-amber-700",
    Approved: "bg-emerald-100 text-emerald-700",
    Rejected: "bg-red-100 text-red-700",
  };
  return <span className={`text-xs px-2 py-1 rounded-full ${colors[status]}`}>{status}</span>;
}

export default function AdminLeave() {
  const [leaves, setLeaves] = useState([]);

  async function load() {
    const res = await client.get("/leave");
    setLeaves(res.data.leaves);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id, status) {
    await client.put(`/leave/${id}/status`, { status });
    load();
  }

  return (
    <DashboardLayout variant="admin">
      <h1 className="text-2xl font-bold text-slate-900">Leave Management</h1>
      <p className="text-slate-500 mt-1 mb-6">Manage leave applications</p>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-6 py-3">Employee</th>
              <th className="text-left px-6 py-3">Type</th>
              <th className="text-left px-6 py-3">Dates</th>
              <th className="text-left px-6 py-3">Reason</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-left px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((l) => (
              <tr key={l._id} className="border-t border-slate-100">
                <td className="px-6 py-4">{l.employee?.name}</td>
                <td className="px-6 py-4">{l.type}</td>
                <td className="px-6 py-4">
                  {new Date(l.fromDate).toLocaleDateString()} - {new Date(l.toDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">{l.reason}</td>
                <td className="px-6 py-4"><StatusBadge status={l.status} /></td>
                <td className="px-6 py-4 space-x-3">
                  {l.status === "Pending" && (
                    <>
                      <button onClick={() => updateStatus(l._id, "Approved")} className="text-emerald-600 text-sm">Approve</button>
                      <button onClick={() => updateStatus(l._id, "Rejected")} className="text-red-600 text-sm">Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {leaves.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-slate-400 py-10">No leave applications found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
