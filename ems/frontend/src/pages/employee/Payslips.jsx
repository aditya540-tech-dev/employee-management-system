import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import client from "../../api/client";

export default function EmployeePayslips() {
  const [payslips, setPayslips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    client.get("/payslips").then((res) => setPayslips(res.data.payslips));
  }, []);

  return (
    <DashboardLayout variant="employee">
      <h1 className="text-2xl font-bold text-slate-900">Payslips</h1>
      <p className="text-slate-500 mt-1 mb-6">Your payslip history</p>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-6 py-3">Period</th>
              <th className="text-left px-6 py-3">Basic Salary</th>
              <th className="text-left px-6 py-3">Net Salary</th>
              <th className="text-left px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payslips.map((p) => (
              <tr key={p._id} className="border-t border-slate-100">
                <td className="px-6 py-4">{p.period}</td>
                <td className="px-6 py-4 text-slate-500">${p.basicSalary}</td>
                <td className="px-6 py-4 font-medium">${p.netSalary}</td>
                <td className="px-6 py-4">
                  <button onClick={() => navigate(`/employee/payslips/${p._id}`)} className="flex items-center gap-1 text-brand text-sm">
                    <Download className="w-4 h-4" /> Download
                  </button>
                </td>
              </tr>
            ))}
            {payslips.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-slate-400 py-10">No payslips found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
