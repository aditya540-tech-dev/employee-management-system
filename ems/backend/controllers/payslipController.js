const Payslip = require("../models/Payslip");
const User = require("../models/User");

// GET /api/payslips (admin: all, employee: own)
exports.list = async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { employee: req.user._id };
  const payslips = await Payslip.find(filter)
    .populate("employee", "name email position")
    .sort("-createdAt");
  res.json({ payslips });
};

// GET /api/payslips/:id
exports.getOne = async (req, res) => {
  const payslip = await Payslip.findById(req.params.id).populate(
    "employee",
    "name email position"
  );
  if (!payslip) return res.status(404).json({ message: "Payslip not found" });
  if (req.user.role !== "admin" && String(payslip.employee._id) !== String(req.user._id)) {
    return res.status(403).json({ message: "Not authorized" });
  }
  res.json({ payslip });
};

// POST /api/payslips (admin generates)
exports.create = async (req, res) => {
  try {
    const { employeeId, period, allowances = 0, deductions = 0 } = req.body;
    const employee = await User.findById(employeeId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const basicSalary = employee.basicSalary;
    const netSalary = basicSalary + Number(allowances) - Number(deductions);

    const payslip = await Payslip.create({
      employee: employeeId,
      period,
      basicSalary,
      allowances,
      deductions,
      netSalary,
    });
    res.status(201).json({ payslip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
