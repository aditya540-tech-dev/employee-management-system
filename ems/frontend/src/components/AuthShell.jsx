export default function AuthShell({ children }) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 bg-brand-dark text-white flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl" />
        <h1 className="text-5xl font-bold leading-tight relative z-10">
          Employee
          <br />
          Management System
        </h1>
        <p className="mt-6 text-slate-300 max-w-md relative z-10">
          Streamline your workforce operations, track attendance, manage payroll, and empower
          your team securely.
        </p>
      </div>
      <div className="flex-1 flex items-start justify-center pt-28 px-6">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
