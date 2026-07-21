const bcrypt = require("bcryptjs");
const User = require("../models/User");

// GET /api/employees?search=&department=&page=&limit=&sort=&includeInactive=
exports.list = async (req, res) => {
  try {
    const {
      search = "",
      department = "",
      page = 1,
      limit = 20,
      sort = "-createdAt",
      includeInactive = "false",
    } = req.query;

    const filter = { role: "employee" };
    if (includeInactive !== "true") filter.status = "active";
    if (search) filter.name = { $regex: search, $options: "i" };
    if (department && department !== "All Departments") filter.department = department;

    const skip = (Number(page) - 1) * Number(limit);
    const [employees, total] = await Promise.all([
      User.find(filter).sort(sort).skip(skip).limit(Number(limit)).select("-passwordHash"),
      User.countDocuments(filter),
    ]);

    res.json({
      employees: employees.map((e) => ({ ...e.toObject(), initials: e.initials() })),
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/employees/departments
exports.departments = async (req, res) => {
  const departments = await User.distinct("department", { role: "employee" });
  res.json({ departments: departments.filter(Boolean) });
};

// POST /api/employees  (admin creates employee)
exports.create = async (req, res) => {
  try {
    const { name, email, password, position, department, basicSalary } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password || "changeme123", 10);
    const employee = await User.create({
      name,
      email,
      passwordHash,
      role: "employee",
      position,
      department,
      basicSalary: basicSalary || 1000,
    });

    res.status(201).json({ employee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/employees/:id
exports.getOne = async (req, res) => {
  const employee = await User.findById(req.params.id).select("-passwordHash");
  if (!employee) return res.status(404).json({ message: "Employee not found" });
  res.json({ employee });
};

// PUT /api/employees/:id
exports.update = async (req, res) => {
  const { name, position, department, basicSalary, status } = req.body;
  const employee = await User.findByIdAndUpdate(
    req.params.id,
    { $set: { name, position, department, basicSalary, status } },
    { new: true }
  ).select("-passwordHash");
  res.json({ employee });
};

// DELETE /api/employees/:id  (soft delete: mark inactive, keep history intact)
exports.remove = async (req, res) => {
  const employee = await User.findByIdAndUpdate(
    req.params.id,
    { $set: { status: "inactive" } },
    { new: true }
  ).select("-passwordHash");
  if (!employee) return res.status(404).json({ message: "Employee not found" });
  res.json({ message: "Employee marked inactive", employee });
};

// PUT /api/employees/:id/reactivate  (undo a soft delete)
exports.reactivate = async (req, res) => {
  const employee = await User.findByIdAndUpdate(
    req.params.id,
    { $set: { status: "active" } },
    { new: true }
  ).select("-passwordHash");
  if (!employee) return res.status(404).json({ message: "Employee not found" });
  res.json({ message: "Employee reactivated", employee });
};