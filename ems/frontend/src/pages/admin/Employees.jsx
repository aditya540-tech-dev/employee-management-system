import { useEffect, useState } from "react";
import { Plus, Search, Pencil, UserX, UserCheck } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import Modal from "../../components/Modal";
import client from "../../api/client";

const emptyForm = { name: "", email: "", position: "", department: "", password: "", basicSalary: 1000 };

export default function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [showInactive, setShowInactive] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);

  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  async function load() {
    const res = await client.get("/employees", {
      params: { search, department, includeInactive: showInactive ? "true" : "false", limit: 100 },
    });
    setEmployees(res.data.employees);
  }

  useEffect(() => {
    client.get("/employees/departments").then((res) => setDepartments(res.data.departments));
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [search, department, showInactive]);

  async function handleAdd(e) {
    e.preventDefault();
    await client.post("/employees", addForm);
    setShowAddModal(false);
    setAddForm(emptyForm);
    load();
  }

  function openEdit(emp) {
    setEditTarget(emp);
    setEditForm({
      name: emp.name,
      position: emp.position,
      department: emp.department,
      basicSalary: emp.basicSalary,
    });
  }

  async function handleEditSave(e) {
    e.preventDefault();
    await client.put(`/employees/${editTarget._id}`, editForm);
    setEditTarget(null);
    load();
  }

  async function handleRemove(emp) {
    const confirmed = window.confirm(
      `Mark ${emp.name} as inactive? Their attendance, leave, and payslip history will be kept — you can reactivate them anytime.`
    );
    if (!confirmed) return;
    await client.delete(`/employees/${emp._id}`);
    load();
  }

  async function handleReactivate(emp) {
    await client.put(`/employees/${emp._id}/reactivate`);
    load();
  }

  return (
    <DashboardLayout variant="admin">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          <p className="text-slate-500 mt-1">Manage your team members</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-brand text-white px-4 py-2.5 rounded-lg text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employees..."
            className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 bg-white"
          />
        </div>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="border border-slate-200 rounded-lg px-4 py-2.5 bg-white"
        >
          <option>All Departments</option>
          {departments.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} />
          Show inactive employees
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {employees.map((emp) => (
          <div
            key={emp._id}
            className={`bg-white rounded-xl border overflow-hidden ${
              emp.status === "inactive" ? "border-slate-200 opacity-60" : "border-slate-200"
            }`}
          >
            <div className="p-4 flex items-center justify-between">
              <span className="text-xs bg-slate-100 px-2 py-1 rounded">{emp.department}</span>
              {emp.status === "inactive" && (
                <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded">Inactive</span>
              )}
            </div>
            <div className="flex justify-center py-6">
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-brand flex items-center justify-center font-semibold text-lg">
                {emp.initials}
              </div>
            </div>
            <div className="px-4 pb-4">
              <p className="font-semibold text-slate-900">{emp.name}</p>
              <p className="text-sm text-brand">{emp.position}</p>
            </div>
            <div className="flex border-t border-slate-100">
              <button
                onClick={() => openEdit(emp)}
                className="flex-1 flex items-center justify-center gap-1 text-sm text-slate-600 py-2.5 hover:bg-slate-50"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              {emp.status === "inactive" ? (
                <button
                  onClick={() => handleReactivate(emp)}
                  className="flex-1 flex items-center justify-center gap-1 text-sm text-emerald-600 py-2.5 hover:bg-slate-50 border-l border-slate-100"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Reactivate
                </button>
              ) : (
                <button
                  onClick={() => handleRemove(emp)}
                  className="flex-1 flex items-center justify-center gap-1 text-sm text-red-500 py-2.5 hover:bg-slate-50 border-l border-slate-100"
                >
                  <UserX className="w-3.5 h-3.5" /> Remove
                </button>
              )}
            </div>
          </div>
        ))}
        {employees.length === 0 && (
          <p className="text-slate-400 col-span-full">No employees found.</p>
        )}
      </div>

      {showAddModal && (
        <Modal title="Add Employee" subtitle="Create a new team member account" onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleAdd} className="space-y-3">
            <input required placeholder="Full name" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
            <input required type="email" placeholder="Email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
            <input required placeholder="Position" value={addForm.position} onChange={(e) => setAddForm({ ...addForm, position: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
            <input required placeholder="Department" value={addForm.department} onChange={(e) => setAddForm({ ...addForm, department: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
            <input required type="password" placeholder="Temporary password" value={addForm.password} onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-brand text-white rounded-lg text-sm">Add</button>
            </div>
          </form>
        </Modal>
      )}

      {editTarget && (
        <Modal title="Edit Employee" subtitle={editTarget.name} onClose={() => setEditTarget(null)}>
          <form onSubmit={handleEditSave} className="space-y-3">
            <input required placeholder="Full name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
            <input required placeholder="Position" value={editForm.position} onChange={(e) => setEditForm({ ...editForm, position: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
            <input required placeholder="Department" value={editForm.department} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
            <input required type="number" placeholder="Basic salary" value={editForm.basicSalary} onChange={(e) => setEditForm({ ...editForm, basicSalary: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditTarget(null)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-brand text-white rounded-lg text-sm">Save Changes</button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
}