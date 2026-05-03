const Fuse = require("fuse.js");
const Task = require("../../models/task.model");

exports.resolveTask = async function (userId, taskName) {
    if (!taskName) return null;

    const tasks = await Task.find({ user: userId }).select("title");

    const fuse = new Fuse(tasks, {
        keys: ["title"],
        threshold: 0.4,
    });

    const results = fuse.search(taskName);
    console.log(results[0].item._id);
    

    if (!results.length) return null;

    return results[0].item._id;
}