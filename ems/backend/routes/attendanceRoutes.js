const router = require("express").Router();
const { auth, adminOnly } = require("../middleware/auth");
const ctrl = require("../controllers/attendanceController");

router.post("/clock-in", auth, ctrl.clockIn);
router.post("/clock-out", auth, ctrl.clockOut);
router.get("/me", auth, ctrl.myAttendance);
router.get("/today-count", auth, adminOnly, ctrl.todayCount);

module.exports = router;
