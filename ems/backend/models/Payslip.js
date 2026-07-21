const mongoose = require("mongoose");

const payslipSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    period: { type: String, required: true }, // e.g. "January 2026"
    basicSalary: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payslip", payslipSchema);
