const express = require("express");
const router = express.Router();
const TaskCtrl = require("../controllers/task.ctrl");
const auth = require("../middlewares/auth.middleware");

// router.use(auth);

router.post("/CreateTask", TaskCtrl.CreateTask);
router.get("/GetTasks", TaskCtrl.GetTasks);
router.put("/UpdateTask/:id", TaskCtrl.UpdateTask);
router.get("/TaskAI", TaskCtrl.TaskAI);

module.exports = router;