require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");
const Payslip = require("./models/Payslip");

async function seed() {
  await connectDB();
  await User.deleteMany({});
  await Payslip.deleteMany({});

  const pass = await bcrypt.hash("password", 10);

  const admin = await User.create({
    name: "Admin",
    email: "admin@example.com",
    passwordHash: pass,
    role: "admin",
  });

  const employees = await User.insertMany([
    { name: "Deepanshu Sharma", email: "sharma@example.com", passwordHash: pass, role: "employee", department: "Marketing", position: "Marketing", basicSalary: 1000 },
    { name: "Ritik Rana", email: "rana@example.com", passwordHash: pass, role: "employee", department: "Engineering", position: "Software Developer", basicSalary: 1000 },
    { name: "Ankush Jindal", email: "ankush@example.com", passwordHash: pass, role: "employee", department: "Engineering", position: "Software Developer", basicSalary: 1000 },
    { name: "Adarsh Rai", email: "adarsh@example.com", passwordHash: pass, role: "employee", department: "Marketing", position: "Associate Business Support", basicSalary: 1000 },
    { name: "Lalit Solanki", email: "solanki@example.com", passwordHash: pass, role: "employee", department: "Engineering", position: "Senior Software Developer", basicSalary: 900 },
  ]);

  const Ankush = employees.find((e) => e.name === "Ankush Jindal");
  await Payslip.create({
    employee: Ankush._id,
    period: "January 2026",
    basicSalary: 1000,
    allowances: 100,
    deductions: 100,
    netSalary: 1000,
  });

  console.log("Seed complete. Admin login: admin@example.com / password");
  process.exit(0);
}

seed();
