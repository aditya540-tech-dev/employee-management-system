const router = require("express").Router();
const { auth, adminOnly } = require("../middleware/auth");
const ctrl = require("../controllers/leaveController");

router.get("/", auth, ctrl.list);
router.get("/summary", auth, ctrl.summary);
router.post("/", auth, ctrl.create);
router.put("/:id/status", auth, adminOnly, ctrl.updateStatus);

module.exports = router;
