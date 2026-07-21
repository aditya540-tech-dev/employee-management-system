import { useEffect, useState } from "react";
import { Download, Plus } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import Modal from "../../components/Modal";
import client from "../../api/client";

export default function AdminPayslips() {
  const [payslips, setPayslips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employeeId: "", period: "", allowances: 0, deductions: 0 });

  async function load() {
    const res = await client.get("/payslips");
    setPayslips(res.data.payslips);
  }

  useEffect(() => {
    load();
    client.get("/employees", { params: { limit: 100 } }).then((res) => setEmployees(res.data.employees));
  }, []);

  async function handleGenerate(e) {
    e.preventDefault();
    await client.post("/payslips", form);
    setShowModal(false);
    setForm({ employeeId: "", period: "", allowances: 0, deductions: 0 });
    load();
  }

  return (
    <DashboardLayout variant="admin">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payslips</h1>
          <p className="text-slate-500 mt-1">Generate and manage employee payslips</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-brand text-white px-4 py-2.5 rounded-lg text-sm font-medium">
          <Plus className="w-4 h-4" /> Generate Payslip
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-6 py-3">Employee</th>
              <th className="text-left px-6 py-3">Period</th>
              <th className="text-left px-6 py-3">Basic Salary</th>
              <th className="text-left px-6 py-3">Net Salary</th>
              <th className="text-left px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payslips.map((p) => (
              <tr key={p._id} className="border-t border-slate-100">
                <td className="px-6 py-4">{p.employee?.name}</td>
                <td className="px-6 py-4 text-slate-500">{p.period}</td>
                <td className="px-6 py-4 text-slate-500">${p.basicSalary}</td>
                <td className="px-6 py-4 font-medium">${p.netSalary}</td>
                <td className="px-6 py-4">
                  <button className="flex items-center gap-1 text-brand text-sm">
                    <Download className="w-4 h-4" /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Generate Payslip" subtitle="Create a payslip for an employee" onClose={() => setShowModal(false)}>
          <form onSubmit={handleGenerate} className="space-y-3">
            <select required value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2">
              <option value="">Select employee</option>
              {employees.map((e) => (
                <option key={e._id} value={e._id}>{e.name}</option>
              ))}
            </select>
            <input required placeholder="Period (e.g. January 2026)" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
            <input type="number" placeholder="Allowances" value={form.allowances} onChange={(e) => setForm({ ...form, allowances: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
            <input type="number" placeholder="Deductions" value={form.deductions} onChange={(e) => setForm({ ...form, deductions: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-brand text-white rounded-lg text-sm">Generate</button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
}
