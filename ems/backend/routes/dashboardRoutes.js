const router = require("express").Router();
const { auth, adminOnly } = require("../middleware/auth");
const ctrl = require("../controllers/dashboardController");

router.get("/admin", auth, adminOnly, ctrl.adminSummary);
router.get("/employee", auth, ctrl.employeeSummary);

module.exports = router;
