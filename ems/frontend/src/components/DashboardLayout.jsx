import Sidebar from "./Sidebar";

export default function DashboardLayout({ variant, children }) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar variant={variant} />
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
