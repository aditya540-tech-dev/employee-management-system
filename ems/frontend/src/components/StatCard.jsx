export default function StatCard({ label, value, icon: Icon, accent = "text-slate-900" }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 border-l-4 border-l-slate-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className={`text-3xl font-bold mt-2 ${accent}`}>{value}</p>
        </div>
        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
