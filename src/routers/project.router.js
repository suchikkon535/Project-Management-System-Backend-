const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const ProjectCtrl = require("../controllers/project.ctrl");

router.use(auth);

router.post("/CreateProject", ProjectCtrl.CreateProject)
router.get("/GetAllProjects", ProjectCtrl.GetProjects)
router.post("/addMember", ProjectCtrl.addMember)

module.exports = router;