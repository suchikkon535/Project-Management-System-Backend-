const Project = require("../../../models/project.model");
const ApiError = require("../../../utils/ApiError");
const { resolveProject } = require("../../Match_Fuse/Project_matching");

exports.infoProjectService = async (userId, data) => {

    if (!data.name) {
        throw new ApiError(400, "Missing name fields");
    }

    const projectId = await resolveProject(userId, data.name);

    if (!projectId) {
        throw new ApiError(404, "Project not found");
    }

    const project = await Project.findById({ user: userId, _id: projectId }).select("name description status dueDate taskCount completedTaskCount visibility createdAt -_id").populate("members.user", "fullname email -_id").lean();

    return project;
}