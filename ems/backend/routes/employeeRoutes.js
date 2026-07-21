const router = require("express").Router();
const { auth, adminOnly } = require("../middleware/auth");
const ctrl = require("../controllers/employeeController");

router.use(auth, adminOnly);

router.get("/", ctrl.list);
router.get("/departments", ctrl.departments);
router.post("/", ctrl.create);
router.get("/:id", ctrl.getOne);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);
router.put("/:id/reactivate", ctrl.reactivate);

module.exports = router;