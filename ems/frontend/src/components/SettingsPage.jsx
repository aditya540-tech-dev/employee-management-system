import { useState } from "react";
import { Lock, Save, User as UserIcon } from "lucide-react";
import DashboardLayout from "./DashboardLayout";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function SettingsPage({ variant }) {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", position: user?.position || "", bio: user?.bio || "" });
  const [saved, setSaved] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [pwdForm, setPwdForm] = useState({ currentPassword: "", newPassword: "" });
  const [pwdMsg, setPwdMsg] = useState("");

  async function handleSave(e) {
    e.preventDefault();
    const res = await client.put("/auth/me", form);
    updateUser(res.data.user);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    try {
      await client.put("/auth/change-password", pwdForm);
      setPwdMsg("Password updated");
      setPwdForm({ currentPassword: "", newPassword: "" });
      setTimeout(() => setShowPwd(false), 1000);
    } catch (err) {
      setPwdMsg(err.response?.data?.message || "Failed to update password");
    }
  }

  return (
    <DashboardLayout variant={variant}>
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      <p className="text-slate-500 mt-1 mb-6">Manage your account and preferences</p>

      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
          <UserIcon className="w-4 h-4 text-slate-500" />
          <h2 className="font-semibold">Public Profile</h2>
        </div>
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-slate-700">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input disabled value={user?.email || ""} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-400" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Position</label>
            <input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Bio</label>
            <textarea placeholder="Write a brief bio..." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50" rows={3} />
            <p className="text-xs text-slate-400 mt-1">This will be displayed on your profile.</p>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="flex items-center gap-2 bg-brand text-white px-4 py-2.5 rounded-lg text-sm font-medium">
              <Save className="w-4 h-4" /> {saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-between max-w-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
            <Lock className="w-4 h-4 text-slate-500" />
          </div>
          <div>
            <p className="font-medium">Password</p>
            <p className="text-sm text-slate-500">Update your account password</p>
          </div>
        </div>
        <button onClick={() => setShowPwd((s) => !s)} className="border border-slate-200 rounded-lg px-4 py-2 text-sm">
          Change
        </button>
      </div>

      {showPwd && (
        <form onSubmit={handlePasswordChange} className="bg-white rounded-xl border border-slate-200 p-6 mt-4 max-w-2xl space-y-3">
          <input type="password" required placeholder="Current password" value={pwdForm.currentPassword} onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
          <input type="password" required placeholder="New password" value={pwdForm.newPassword} onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
          {pwdMsg && <p className="text-sm text-slate-500">{pwdMsg}</p>}
          <button type="submit" className="bg-brand text-white px-4 py-2 rounded-lg text-sm">Update Password</button>
        </form>
      )}
    </DashboardLayout>
  );
}
