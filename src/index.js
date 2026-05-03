const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const errorhandler = require("./utils/errorHandler");

const UserRouter = require("./routers/user.router")
const TaskRouter = require("./routers/task.router")
const ProjectRouter = require("./routers/project.router")

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => { res.send("Welcome to the Todo API"); });
app.use("/api/auth", UserRouter)
app.use("/api/tasks", TaskRouter)
app.use("/api/projects", ProjectRouter)

app.use(errorhandler);

module.exports = app;