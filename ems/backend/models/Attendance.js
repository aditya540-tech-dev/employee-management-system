const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    checkIn: { type: String }, // "09:05 AM"
    checkOut: { type: String },
    workingHours: { type: Number, default: 0 },
    dayType: { type: String, enum: ["Regular", "Weekend", "Holiday"], default: "Regular" },
    status: { type: String, enum: ["Present", "Late", "Absent"], default: "Present" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
