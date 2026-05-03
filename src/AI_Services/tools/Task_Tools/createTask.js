const Task = require("../../../models/task.model");
const ApiError = require("../../../utils/ApiError");
const { resolveProject } = require("../../Match_Fuse/Project_matching");
const { resolveUsers } = require("../../Match_Fuse/User_matching");

exports.createTaskService = async (userId, data) => {

    if (!data.project || !data.title || !data.description || !data.priority || !data.startDate || !data.dueDate) {
        throw new ApiError(400, "Missing required fields");
    }

    const projectId = await resolveProject(userId, data.project);
    if (!projectId) {
        throw new ApiError(404, "Project not found");
    }

    const userIds = await resolveUsers(data.assignedTo);

    const {
        title,
        description,
        priority,
        startDate,
        dueDate
    } = data;

    const task = await Task.create(
        [
            {
                user: userId,
                createdBy: userId,
                project: projectId,
                title,
                description,
                assignedTo: userIds,
                priority,
                startDate: "2026/04/30",
                dueDate,
                activityLog: [
                    {
                        action: "created",
                        user: userId
                    }
                ]
            }
        ],
    );
     
    return;
};

// {
//   title: 'login page',
//   description: 'Task related to the development of the login page.',description
//   assignedTo: [ 'Suchikkon Naskar', 'deepanite' ],
//   priority: null,
//   project: 'Todo',
//   startDate: '2026/05/01',
//   dueDate: '2026/05/02'
// }
