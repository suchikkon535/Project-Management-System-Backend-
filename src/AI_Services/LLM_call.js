const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const axios = require("axios");
const { buildIntentPrompt, buildEntityPrompt } = require("./prompts/index");
const { extractJSON } = require("../utils/extractJSON");
const { createProjectService } = require("./tools/Project_Tools/index");
const { createTaskService, infoTaskService } = require("./tools/Task_Tools/index");
const { OpenAI } = require("openai");


const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const client = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

async function OpenAi_Original(prompt) {
    try {
        const response = await client.responses.create({
            model: "gpt-5.4-mini",
            input: prompt,
            max_output_tokens: 300
        });

        return response.output_text?.trim() || "";
    } catch (err) {
        console.error("OpenAI Error:", err);
        throw err;
    }
}

async function OpenAi(prompt) {
    const res = await axios.post("http://localhost:11434/api/generate", {
        model: "gemma2:2b",
        prompt,
        stream: false,
    });

    return res.data.response;
}

exports.LLM_Preview = asyncHandler(async (req, res) => {
    const { message } = req.body;

    if (!message) {
        throw new ApiError(400, "Message is required");
    }

    const prompt = buildIntentPrompt(message);
    const raw = await OpenAi(prompt);
    const intent = extractJSON(raw);

    if (!intent) throw new ApiError(400, "Invalid JSON");

    // return res.json(new ApiResponse(200, "Success", intent));

    return res.json(new ApiResponse(200, "Intent identified successfully", intent));
});

exports.LLM_Execute = asyncHandler(async (req, res) => {
    const { action, steps } = req.body;
    const userId = req.user._id;

    if (!action || !steps) {
        throw new ApiError(400, "Missing action or steps");
    }

    const prompt = buildEntityPrompt(action, steps);
    const raw = await OpenAi(prompt);
    const parameters = {
            "name": "loginpage",
        }

    // if (!parameters) {
    //     throw new ApiError(400, "Invalid AI response");
    // }

    let result;

    switch (action) {
        case "create_project":
            result = await createProjectService(userId, parameters);
            break;

        case "create_task":
            result = await createTaskService(userId, parameters);
            break;

        case "info_task":
            result = await infoTaskService(userId, parameters);
            break;

        // case "delete_task":
        //     result = await TaskCtrl.deleteTask(userId, parameters);
        //     break;

        default:
            throw new ApiError(400, "Unknown action");
    }

    return res.json(new ApiResponse(200, "Action executed successfully", { result, parameters }));
});