const Attendance = require("../models/Attendance");

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

// POST /api/attendance/clock-in
exports.clockIn = async (req, res) => {
  try {
    const today = startOfDay(new Date());
    let record = await Attendance.findOne({ employee: req.user._id, date: today });
    if (record && record.checkIn) {
      return res.status(400).json({ message: "Already clocked in today" });
    }
    const now = new Date();
    const checkInStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 15);

    if (!record) {
      record = await Attendance.create({
        employee: req.user._id,
        date: today,
        checkIn: checkInStr,
        status: isLate ? "Late" : "Present",
        dayType: [0, 6].includes(now.getDay()) ? "Weekend" : "Regular",
      });
    } else {
      record.checkIn = checkInStr;
      record.status = isLate ? "Late" : "Present";
      await record.save();
    }
    res.status(201).json({ record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/attendance/clock-out
exports.clockOut = async (req, res) => {
  try {
    const today = startOfDay(new Date());
    const record = await Attendance.findOne({ employee: req.user._id, date: today });
    if (!record || !record.checkIn) {
      return res.status(400).json({ message: "You must clock in first" });
    }
    const now = new Date();
    record.checkOut = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const [inH, inM] = parseTime(record.checkIn);
    const [outH, outM] = parseTime(record.checkOut);
    record.workingHours = Math.max(0, (outH * 60 + outM - (inH * 60 + inM)) / 60);
    await record.save();
    res.json({ record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

function parseTime(str) {
  const [time, period] = str.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return [h, m];
}

// GET /api/attendance/me
exports.myAttendance = async (req, res) => {
  const records = await Attendance.find({ employee: req.user._id }).sort("-date");
  const daysPresent = records.filter((r) => r.status !== "Absent").length;
  const lateArrivals = records.filter((r) => r.status === "Late").length;
  const avg =
    records.length > 0
      ? (records.reduce((s, r) => s + (r.workingHours || 0), 0) / records.length).toFixed(1)
      : 0;

  res.json({ records, stats: { daysPresent, lateArrivals, avgWorkHours: Number(avg) } });
};

// GET /api/attendance/today-count  (admin dashboard)
exports.todayCount = async (req, res) => {
  const today = startOfDay(new Date());
  const count = await Attendance.countDocuments({ date: today, checkIn: { $ne: null } });
  res.json({ count });
};
