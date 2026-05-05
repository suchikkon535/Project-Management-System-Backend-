const Project = require("../../../models/project.model");
const ApiError = require("../../../utils/ApiError");

exports.allinfoProjectService = async (userId) => {

    const All_projects = await Project.find({ user: userId }).select("name description status dueDate taskCount completedTaskCount visibility createdAt -_id").populate("members.user", "fullname email -_id").lean();

    return All_projects;
}