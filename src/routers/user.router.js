const express = require("express");
const router = express.Router();
const UserCtrl = require("../controllers/user.ctrl");
const LLM_Call = require("../AI_Services/LLM_call");
const auth = require("../middlewares/auth.middleware")

router.post("/CreateUser", UserCtrl.CreateUser);
router.get("/allusers", UserCtrl.AllUsers);
router.post("/login", UserCtrl.LoginUser);
router.post("/logout", UserCtrl.logoutUser);
router.post("/refresh-token", UserCtrl.refreshToken);

router.post("/ai/task/preview", auth, LLM_Call.LLM_Preview);
// router.post("/ai/task/execute", auth, LLM_Call.LLM_Execute);

module.exports = router;