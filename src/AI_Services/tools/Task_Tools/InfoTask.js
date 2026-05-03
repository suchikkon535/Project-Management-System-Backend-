const Task = require("../../../models/task.model");
const ApiError = require("../../../utils/ApiError");
const { resolveTask } = require("../../Match_Fuse/Task_matching");

exports.infoTaskService = async (userId, data) => {

    if (!data.name) {
        throw new ApiError(400, "Missing name fields");
    }

    const taskId = await resolveTask(userId, data.name);
    console.log("taskId:", taskId);

    if (!taskId) {
        throw new ApiError(404, "Task not found");
    }

    const task = await Task.findById({ user: userId, _id: taskId });
    console.log("task:", task);

    return task;
}
