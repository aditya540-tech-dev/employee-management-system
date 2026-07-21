const Leave = require("../models/Leave");

// GET /api/leave (admin: all, employee: own) ?status=&page=&limit=
exports.list = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = req.user.role === "admin" ? {} : { employee: req.user._id };
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [leaves, total] = await Promise.all([
    Leave.find(filter)
      .populate("employee", "name department")
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit)),
    Leave.countDocuments(filter),
  ]);

  res.json({ leaves, total, page: Number(page), pages: Math.ceil(total / limit) });
};

// GET /api/leave/summary (employee's taken-day counts by type)
exports.summary = async (req, res) => {
  const leaves = await Leave.find({ employee: req.user._id, status: "Approved" });
  const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000) + 1;

  const summary = { "Sick Leave": 0, "Casual Leave": 0, "Annual Leave": 0 };
  leaves.forEach((l) => {
    summary[l.type] = (summary[l.type] || 0) + daysBetween(l.fromDate, l.toDate);
  });

  const pending = await Leave.countDocuments({ employee: req.user._id, status: "Pending" });
  res.json({ summary, pending });
};

// POST /api/leave  (employee applies)
exports.create = async (req, res) => {
  try {
    const { type, fromDate, toDate, reason } = req.body;
    const leave = await Leave.create({
      employee: req.user._id,
      type,
      fromDate,
      toDate,
      reason,
    });
    res.status(201).json({ leave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/leave/:id/status (admin approves/rejects)
exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  const leave = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json({ leave });
};
