import { useEffect, useState } from "react";
import { Thermometer, Umbrella, Palmtree, Plus, Send } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/StatCard";
import Modal from "../../components/Modal";
import client from "../../api/client";

export default function EmployeeLeave() {
  const [leaves, setLeaves] = useState([]);
  const [summary, setSummary] = useState({ "Sick Leave": 0, "Casual Leave": 0, "Annual Leave": 0 });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ type: "Sick Leave", fromDate: "", toDate: "", reason: "" });

  async function load() {
    const [leaveRes, summaryRes] = await Promise.all([
      client.get("/leave"),
      client.get("/leave/summary"),
    ]);
    setLeaves(leaveRes.data.leaves);
    setSummary(summaryRes.data.summary);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await client.post("/leave", form);
    setShowModal(false);
    setForm({ type: "Sick Leave", fromDate: "", toDate: "", reason: "" });
    load();
  }

  return (
    <DashboardLayout variant="employee">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leave Management</h1>
          <p className="text-slate-500 mt-1">Your leave history and requests</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-brand text-white px-4 py-2.5 rounded-lg text-sm font-medium">
          <Plus className="w-4 h-4" /> Apply for Leave
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <StatCard label="Sick Leave" value={`${summary["Sick Leave"] || 0} taken`} icon={Thermometer} />
        <StatCard label="Casual Leave" value={`${summary["Casual Leave"] || 0} taken`} icon={Umbrella} />
        <StatCard label="Annual Leave" value={`${summary["Annual Leave"] || 0} taken`} icon={Palmtree} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-6 py-3">Type</th>
              <th className="text-left px-6 py-3">Dates</th>
              <th className="text-left px-6 py-3">Reason</th>
              <th className="text-left px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((l) => (
              <tr key={l._id} className="border-t border-slate-100">
                <td className="px-6 py-4">{l.type}</td>
                <td className="px-6 py-4">
                  {new Date(l.fromDate).toLocaleDateString()} - {new Date(l.toDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">{l.reason}</td>
                <td className="px-6 py-4">{l.status}</td>
              </tr>
            ))}
            {leaves.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-slate-400 py-10">No leave applications found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Apply for Leave" subtitle="Submit your leave request for approval" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Leave Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2">
                <option>Sick Leave</option>
                <option>Casual Leave</option>
                <option>Annual Leave</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">From</label>
                <input type="date" required value={form.fromDate} onChange={(e) => setForm({ ...form, fromDate: e.target.value })} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium">To</label>
                <input type="date" required value={form.toDate} onChange={(e) => setForm({ ...form, toDate: e.target.value })} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Reason</label>
              <textarea required placeholder="Briefly describe why you need this leave..." value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2" rows={3} />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
              <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg text-sm">
                <Send className="w-4 h-4" /> Submit
              </button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
}
