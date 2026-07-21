const router = require("express").Router();
const { auth, adminOnly } = require("../middleware/auth");
const ctrl = require("../controllers/payslipController");

router.get("/", auth, ctrl.list);
router.get("/:id", auth, ctrl.getOne);
router.post("/", auth, adminOnly, ctrl.create);

module.exports = router;
