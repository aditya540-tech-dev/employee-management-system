import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";

export default function PortalSelect() {
  const navigate = useNavigate();

  return (
    <AuthShell>
      <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
      <p className="text-sm text-slate-500 mt-1 mb-6">
        Select your portal to securely access the system.
      </p>

      <button
        onClick={() => navigate("/login/admin")}
        className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-5 py-4 mb-4 transition"
      >
        <span className="font-medium text-slate-900">Admin Portal</span>
        <ArrowRight className="w-4 h-4 text-slate-400" />
      </button>

      <button
        onClick={() => navigate("/login/employee")}
        className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-5 py-4 transition"
      >
        <span className="font-medium text-slate-900">Employee Portal</span>
        <ArrowRight className="w-4 h-4 text-slate-400" />
      </button>
    </AuthShell>
  );
}
