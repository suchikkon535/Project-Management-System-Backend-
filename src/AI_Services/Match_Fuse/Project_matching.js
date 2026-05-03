const Fuse = require("fuse.js");
const Project = require("../../models/project.model");

exports.resolveProject = async function (userId, projectName) {
    if (!projectName) return null;

    const projects = await Project.find({ user: userId }).select("name");

    const fuse = new Fuse(projects, {
        keys: ["name"],
        threshold: 0.4,
    });

    const results = fuse.search(projectName);

    if (!results.length) return null;

    return results[0].item._id;
}