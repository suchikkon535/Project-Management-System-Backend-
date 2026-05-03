const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const Project = require("../models/project.model");

exports.CreateProject = asyncHandler(async (req, res) => {

    const userId = req.user._id;
    const { name, description, color, dueDate, visibility } = req.body;
    console.log(req.body)

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
                role: "owner"
            }
        ]
    });

    res.json(new ApiResponse(201, "project Created Successfuly", project))
});

exports.addMember = asyncHandler(async (req, res) => {
    const { projectId, memberId } = req.body;
    const ownerId = req.user._id;
    console.log(ownerId);


    const projectCheck = await Project.findById(projectId)
    if (!projectCheck) {
        throw new ApiError(404, "Project not found")
    }

    if (projectCheck.createdBy.toString() !== ownerId.toString()) {
        throw new ApiError(403, "Only owner can add members")
    }

    const checkMember = await Project.findOne({ _id: projectId, "members.user": memberId })
    if (checkMember) {
        throw new ApiError(400, "Member already exists")
    }
    const project = await Project.findByIdAndUpdate(projectId, { $push: { members: { user: memberId, role: "member" } } })
    res.json(new ApiResponse(201, "Member added successfully", project))
})

exports.GetProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({ user: req.user._id })
    res.json(new ApiResponse(200, "Projects retrieved successfully", projects))
})
