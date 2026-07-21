# 🏢 Employee Management System

**A full-stack workforce management platform with dual admin/employee portals, attendance tracking, leave management, and payroll.**

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://employee-management-system-2fnj.vercel.app)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.19-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-black?logo=jsonwebtokens)

**[Live App](https://employee-management-system-2fnj.vercel.app)** • **[Features](#-features)** • **[Tech Stack](#-tech-stack)** • **[Quick Start](#-quick-start)** • **[API Reference](#-api-reference)**

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [User Roles](#-user-roles)
- [API Reference](#-api-reference)
- [Data Models](#-data-models)
- [Deployment](#-deployment)
- [Known Limitations](#-known-limitations)
- [License](#-license)

---

## 🔎 Overview

Employee Management System is a MERN-stack application built for small-to-medium teams to manage their workforce end-to-end — from onboarding and daily attendance to leave requests and payroll, all through two purpose-built portals: one for admins, one for employees.

**Why this project:**
- ✅ **Real authentication** — JWT-based sessions with bcrypt password hashing, not a mock login
- ✅ **Role-based portals** — separate, protected admin and employee experiences from a single codebase
- ✅ **Soft-delete safe** — removing an employee preserves their attendance/leave/payslip history instead of deleting it
- ✅ **Deployed serverless** — backend and frontend both run on Vercel's free tier, connected to MongoDB Atlas

---

## ✨ Features

### 🔐 Authentication & Access
- Dual login portals (Admin / Employee) from one landing page
- JWT-based sessions with bcrypt-hashed passwords
- Protected routes on both frontend (React Router guards) and backend (middleware)

### 👥 Employee Management (Admin)
- Searchable, filterable employee directory grouped by department
- Add new employees with position, department, and starting salary
- Edit employee details inline
- **Soft delete**: mark an employee inactive without losing their historical records, with one-click reactivation

### 🗓️ Attendance Tracking (Employee)
- One-click clock in / clock out
- Automatic late-arrival detection and working-hours calculation
- Personal attendance history with days-present and average-hours stats

### 📝 Leave Management
- Employees apply for Sick / Casual / Annual leave with date range and reason
- Admins review, approve, or reject pending requests
- Per-employee leave summary broken down by type

### 💵 Payroll
- Admins generate itemized payslips (basic salary, allowances, deductions, net pay)
- Employees view their payslip history and open a printable payslip detail view

### ⚙️ Account Settings
- Editable public profile (name, position, bio) for both roles
- Secure password change flow

---

## 🛠 Tech Stack

**Frontend**
- React 18 (Vite)
- React Router
- Tailwind CSS
- Axios
- lucide-react (icons)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Multer (file upload middleware, wired for future avatar support)

**Infrastructure**
- MongoDB Atlas (database)
- Vercel (frontend + backend hosting, serverless functions)

---

## 📁 Project Structure

```
ems/
├── backend/
│   ├── api/              # Vercel serverless entry point
│   ├── config/           # Database connection
│   ├── controllers/      # Route handlers
│   ├── middleware/       # Auth, admin guard, file upload
│   ├── models/           # Mongoose schemas (User, Attendance, Leave, Payslip)
│   ├── routes/           # Express route definitions
│   ├── seed.js           # Demo data seeder
│   └── server.js         # Express app
└── frontend/
    ├── src/
    │   ├── api/           # Axios client
    │   ├── components/    # Shared UI (Sidebar, Modal, StatCard, layouts)
    │   ├── context/        # Auth context
    │   └── pages/
    │       ├── admin/      # Dashboard, Employees, Leave, Payslips, Settings
    │       └── employee/   # Dashboard, Attendance, Leave, Payslips, Settings
    └── vite.config.js
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A MongoDB connection string (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Backend
```bash
cd backend
npm install
cp .env.example .env      # then fill in your values
npm run seed                # creates demo admin + employee accounts
npm run dev                 # http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

### Demo Accounts (after seeding)
| Role     | Email               | Password |
|----------|----------------------|----------|
| Admin    | admin@example.com    | password |
| Employee | david@example.com    | password |

---

## 🔑 Environment Variables

**backend/.env**
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**frontend (Vercel only — not needed for local dev)**
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

---

## 👤 User Roles

| Capability | Admin | Employee |
|---|:---:|:---:|
| View own dashboard | ✅ | ✅ |
| Manage employees (add/edit/deactivate) | ✅ | ❌ |
| Approve/reject leave requests | ✅ | ❌ |
| Apply for leave | ❌ | ✅ |
| Clock in/out | ❌ | ✅ |
| Generate payslips | ✅ | ❌ |
| View own payslips | ❌ | ✅ |
| Edit own profile | ✅ | ✅ |

---

## 📡 API Reference

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/login` | Public | Login (email, password, portal) |
| GET | `/api/auth/me` | Auth | Current user profile |
| PUT | `/api/auth/me` | Auth | Update profile |
| PUT | `/api/auth/change-password` | Auth | Change password |
| GET | `/api/employees` | Admin | List employees (search/filter/paginate) |
| POST | `/api/employees` | Admin | Create employee |
| PUT | `/api/employees/:id` | Admin | Update employee |
| DELETE | `/api/employees/:id` | Admin | Soft-delete (mark inactive) |
| PUT | `/api/employees/:id/reactivate` | Admin | Reactivate employee |
| POST | `/api/attendance/clock-in` | Employee | Clock in |
| POST | `/api/attendance/clock-out` | Employee | Clock out |
| GET | `/api/attendance/me` | Employee | Own attendance history |
| GET | `/api/leave` | Both | List leave (own/all) |
| POST | `/api/leave` | Employee | Apply for leave |
| PUT | `/api/leave/:id/status` | Admin | Approve/reject |
| GET | `/api/payslips` | Both | List payslips (own/all) |
| POST | `/api/payslips` | Admin | Generate payslip |
| GET | `/api/dashboard/admin` | Admin | Admin dashboard stats |
| GET | `/api/dashboard/employee` | Employee | Employee dashboard stats |

---

## 🗄️ Data Models

**User** — `name, email, passwordHash, role (admin/employee), position, department, bio, basicSalary, status (active/inactive)`

**Attendance** — `employee, date, checkIn, checkOut, workingHours, dayType, status`

**Leave** — `employee, type, fromDate, toDate, reason, status`

**Payslip** — `employee, period, basicSalary, allowances, deductions, netSalary`

---

## ☁️ Deployment

This project is deployed as two separate Vercel projects sharing one MongoDB Atlas cluster:

- **Frontend** → Vercel (root directory: `frontend`)
- **Backend** → Vercel serverless functions (root directory: `backend`, entry point `api/index.js`)

See [`backend/vercel.json`](backend/vercel.json) for the serverless routing configuration.

---

## ⚠️ Known Limitations

- Payslip "download" currently opens a printable in-app view rather than generating a server-side PDF
- Avatar upload middleware exists on the backend but has no frontend UI yet
- Late-arrival threshold and working-hours calculation are reasonable defaults, not configurable per company policy (yet)

---

## 📄 License

This project is open for personal and educational use.
