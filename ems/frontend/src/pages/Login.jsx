import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { portal } = useParams(); // "admin" | "employee"
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState(portal === "admin" ? "admin@example.com" : "david@example.com");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdmin = portal === "admin";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password, portal);
      navigate(isAdmin ? "/admin/dashboard" : "/employee/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to portals
      </button>

      <h2 className="text-2xl font-bold text-slate-900">{isAdmin ? "Admin Portal" : "Employee Portal"}</h2>
      <p className="text-sm text-slate-500 mt-1 mb-6">
        {isAdmin ? "Sign in to manage the organization" : "Sign in to access your account"}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand/40"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Password</label>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand/40"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-brand to-indigo-400 text-white font-medium rounded-lg py-3 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}
