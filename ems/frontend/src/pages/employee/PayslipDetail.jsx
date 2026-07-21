import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../../api/client";

export default function PayslipDetail() {
  const { id } = useParams();
  const [payslip, setPayslip] = useState(null);

  useEffect(() => {
    client.get(`/payslips/${id}`).then((res) => setPayslip(res.data.payslip));
  }, [id]);

  if (!payslip) return <div className="p-10 text-slate-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-white flex items-start justify-center py-16 px-6">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-2xl font-bold">PAYSLIP</h1>
        <p className="text-slate-500 mt-1">{payslip.period}</p>
        <hr className="my-6" />

        <div className="grid grid-cols-2 gap-6 text-left mb-8">
          <div>
            <p className="text-xs uppercase text-slate-400">Employee Name</p>
            <p className="font-semibold">{payslip.employee.name}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-400">Position</p>
            <p className="font-semibold">{payslip.employee.position}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-400">Email</p>
            <p className="font-semibold">{payslip.employee.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-400">Period</p>
            <p className="font-semibold">{payslip.period}</p>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden text-left">
          <div className="grid grid-cols-2 bg-slate-50 px-6 py-3 text-xs uppercase text-slate-500">
            <span>Description</span>
            <span className="text-right">Amount</span>
          </div>
          <div className="grid grid-cols-2 px-6 py-3 border-t border-slate-100">
            <span>Basic Salary</span>
            <span className="text-right">${payslip.basicSalary}</span>
          </div>
          <div className="grid grid-cols-2 px-6 py-3 border-t border-slate-100">
            <span>Allowances</span>
            <span className="text-right">+${payslip.allowances}</span>
          </div>
          <div className="grid grid-cols-2 px-6 py-3 border-t border-slate-100">
            <span>Deductions</span>
            <span className="text-right">-${payslip.deductions}</span>
          </div>
          <div className="grid grid-cols-2 px-6 py-3 border-t border-slate-200 bg-slate-50 font-semibold">
            <span>Net Salary</span>
            <span className="text-right">${payslip.netSalary}</span>
          </div>
        </div>

        <button onClick={() => window.print()} className="mt-8 bg-brand text-white px-6 py-2.5 rounded-lg font-medium">
          Print Payslip
        </button>
      </div>
    </div>
  );
}
