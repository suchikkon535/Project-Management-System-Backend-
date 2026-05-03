const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const Task = require("../models/task.model");
const Project = require("../models/project.model");
const { extractJSON } = require("../utils/extractJSON");

exports.CreateTask = asyncHandler(async (req, res) => {

    const userId = req.user._id;
    const {
        title,
        description,
        project,
        assignedTo,
        priority,
        startDate,
        dueDate
    } = req.body;

    const projectDoc = await Project.findById(project)

    if (!projectDoc) {
        throw new ApiError(404, "Project not found");
    }

    if (!projectDoc.members.some(
        (member) => member.user.toString() === req.user._id.toString()
    )) {
        throw new ApiError(401, "Unauthorized: Not a project member");
    }

    const task = await Task.create(
        [
            {
                user: userId,
                createdBy: userId,
                project,
                title,
                description,
                assignedTo,
                priority,
                startDate,
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

    await Project.findByIdAndUpdate(
        project,
        {
            $inc: { taskCount: 1 }
        },
    );

    res.json(new ApiResponse(201, "Task created successfully", task));
});

exports.GetTasks = asyncHandler(async (req, res) => {
    const user = req.user._id;
    const tasks = await Task.find({ user });
    res.json(new ApiResponse(200, "Tasks retrieved successfully", tasks));
});

exports.UpdateTask = asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    const user = req.user._id;
    const data = req.body;

    const task = await Task.findOne({ _id: taskId, user });
    if (!task) {
        throw new ApiError("Task not found", 404);
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, {
        completed: data.completed,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
        file: data.file,
        title: data.title,
        description: data.description
    }, { returnDocument: 'after' });
    res.json(new ApiResponse(200, "Task updated successfully", updatedTask));
});

exports.TaskAI = asyncHandler(async (req, res) => {
    const data = { "response": "```json\n{\"action\": \"create_task\"}\n``` \n" };
    const extractedData = extractJSON(data.response);
    res.json(new ApiResponse(200, "Task AI", extractedData.action));
});