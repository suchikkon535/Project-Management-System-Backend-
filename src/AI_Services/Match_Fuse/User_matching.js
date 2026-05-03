const Fuse = require("fuse.js");
const User = require("../../models/user.model");

exports.resolveUsers = async function (userNames = []) {
    console.log("userNames", userNames);

    if (!Array.isArray(userNames) || userNames.length === 0) {
        return [];
    }

    const users = await User.find({}).select("fullname");

    const fuse = new Fuse(users, {
        keys: ["fullname"],
        threshold: 0.4,
        includeScore: true,
    });

    const matchedIdsSet = new Set();

    for (const name of userNames) {
        if (!name || typeof name !== "string") continue;

        const query = name.trim();

        const results = fuse.search(query);

        if (results.length) {
            matchedIdsSet.add(results[0].item._id.toString());
        }
    }

    return Array.from(matchedIdsSet);
};