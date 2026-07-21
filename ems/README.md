# Employee Management System (MERN)

A full-stack Employee Management System recreated from UI screenshots: dual admin/employee
portals, attendance tracking, leave management, and payslip generation.

> **Note:** This was rebuilt purely by inferring behavior from screenshots. Some logic
> (e.g. late-arrival threshold, working-hour calculation) is a reasonable best-guess
> implementation, not a guaranteed match to any original system.

## Stack
- **Frontend:** React (Vite) + React Router + Tailwind CSS + lucide-react
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcrypt password hashing
- **File uploads:** Multer (avatar upload endpoint wired, not yet used in UI)

## Project structure
```
ems/
  backend/     Express API, MongoDB models, JWT auth, seed script
  frontend/    React app (Vite + Tailwind)
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env     # edit MONGO_URI / JWT_SECRET as needed
npm run seed              # optional: creates demo admin + employees
npm run dev                # starts on http://localhost:5000
```

Demo accounts created by `npm run seed` (password for all: `password`):
| Role     | Email                | Portal   |
|----------|-----------------------|----------|
| Admin    | admin@example.com     | Admin    |
| Employee | james@example.com     | Employee |
| Employee | richard@example.com   | Employee |
| Employee | david@example.com     | Employee |
| Employee | alex@example.com      | Employee |
| Employee | john@example.com      | Employee |

## 2. Frontend setup

```bash
cd frontend
npm install
npm run dev                # starts on http://localhost:5173, proxies /api to :5000
```

Open `http://localhost:5173`, pick a portal, and sign in with one of the demo accounts above.

## API summary

| Method | Route                         | Access        | Description                     |
|--------|--------------------------------|---------------|----------------------------------|
| POST   | /api/auth/register             | public        | Create a user                    |
| POST   | /api/auth/login                | public        | Login (email, password, portal)  |
| GET    | /api/auth/me                   | authenticated | Current user profile              |
| PUT    | /api/auth/me                   | authenticated | Update profile (name/position/bio)|
| PUT    | /api/auth/change-password      | authenticated | Change password                   |
| GET    | /api/employees                 | admin         | List employees (search/filter/paginate) |
| GET    | /api/employees/departments     | admin         | Distinct department list          |
| POST   | /api/employees                 | admin         | Create employee                   |
| GET/PUT/DELETE | /api/employees/:id      | admin         | Read/update/remove employee        |
| POST   | /api/attendance/clock-in        | employee      | Clock in for today                |
| POST   | /api/attendance/clock-out       | employee      | Clock out for today               |
| GET    | /api/attendance/me              | employee      | Own attendance history + stats    |
| GET    | /api/attendance/today-count     | admin         | Count of employees checked in today|
| GET    | /api/leave                      | both          | List leave (own for employee, all for admin) |
| GET    | /api/leave/summary              | employee      | Leave-taken totals by type        |
| POST   | /api/leave                      | employee      | Apply for leave                   |
| PUT    | /api/leave/:id/status            | admin         | Approve/reject leave              |
| GET    | /api/payslips                   | both          | List payslips (own/all)           |
| GET    | /api/payslips/:id                | both          | Payslip detail                    |
| POST   | /api/payslips                    | admin         | Generate a payslip                |
| GET    | /api/dashboard/admin             | admin         | Admin dashboard stats              |
| GET    | /api/dashboard/employee          | employee      | Employee dashboard stats           |

## Known inferences / gaps (labeled)
- **Late-arrival rule** (after 9:15am counts as "Late") — inferred, not shown in screenshots.
- **Working hours calculation** from check-in/check-out — inferred formula.
- **Payslip PDF download** — currently opens a printable in-app view (`window.print()`) rather
  than generating a server-side PDF; swap in a library like `pdfkit` or `puppeteer` for true PDF export.
- **Avatar upload** — Multer middleware is wired on the backend but no UI control was visible
  in the screenshots to trigger it, so it isn't hooked up in the frontend yet.
- **Employee edit/delete UI** — backend routes exist, but no edit/delete buttons were visible
  in the Employees screenshot, so the frontend only supports add + view for now.
