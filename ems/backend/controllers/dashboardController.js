const User = require("../models/User");
const Leave = require("../models/Leave");
const Attendance = require("../models/Attendance");

// GET /api/dashboard/admin
exports.adminSummary = async (req, res) => {
  const totalEmployees = await User.countDocuments({ role: "employee" });
  const departments = (await User.distinct("department", { role: "employee" })).filter(Boolean);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaysAttendance = await Attendance.countDocuments({ date: today, checkIn: { $ne: null } });
  const pendingLeaves = await Leave.countDocuments({ status: "Pending" });

  res.json({
    totalEmployees,
    departments: departments.length,
    todaysAttendance,
    pendingLeaves,
  });
};

// GET /api/dashboard/employee
exports.employeeSummary = async (req, res) => {
  const Payslip = require("../models/Payslip");
  const records = await Attendance.find({ employee: req.user._id });
  const daysPresent = records.filter((r) => r.status !== "Absent").length;
  const pendingLeaves = await Leave.countDocuments({ employee: req.user._id, status: "Pending" });
  const latestPayslip = await Payslip.findOne({ employee: req.user._id }).sort("-createdAt");

  res.json({
    daysPresent,
    pendingLeaves,
    latestPayslip: latestPayslip ? latestPayslip.netSalary : 0,
  });
};
