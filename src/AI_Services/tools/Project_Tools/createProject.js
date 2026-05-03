const Project = require("../../../models/project.model");
const ApiError = require("../../../utils/ApiError");

exports.createProjectService = async (userId, data) => {

    if (!data.name || !data.description || !data.color || !data.dueDate || !data.visibility) {
        throw new ApiError(400, "Missing required fields");
    }

    const { name, description, color, dueDate, visibility } = data;

    const project = await Project.create({
        name,
        description,
        color,
        dueDate,
        visibility,
        user: userId,
        createdBy: userId,
        members: [
            {
                user: userId,
                role: "owner",
            },
        ],
    });

    return project;
};

// AIzaSyDOwakP33uVl6Qli6-VAFMvMOdNmN-Wd1c