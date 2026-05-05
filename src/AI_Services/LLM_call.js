const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const axios = require("axios");
const { buildIntentPrompt, buildEntityPrompt } = require("./prompts/index");
const { extractJSON } = require("../utils/extractJSON");
const { createProjectService, infoProjectService, allinfoProjectService } = require("./tools/Project_Tools/index");
const { createTaskService, infoTaskService } = require("./tools/Task_Tools/index");
const { OpenAI } = require("openai");
const { json } = require("express");


const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const client = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const models = [
    "openai/gpt-4o-mini",
    // "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
    // "anthropic/claude-opus-4.7",
    // "meta-llama/llama-3.1-8b-instruct"
];

async function OpenRouter(prompt) {
    for (const model of models) {
        try {
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model,
                    messages: [{ role: "user", content: prompt }]
                })
            });

            const data = await res.json();

            if (!data.error) {
                console.log("✅ Success with:", model);

                const content = data.choices[0].message.content;
                console.log(content);

                // ✅ Token logging
                if (data.usage) {
                    console.log("🧮 Token Usage:");
                    console.log(data.usage);
                } else {
                    console.log("⚠️ No usage data from model");
                }

                return content;
            } else {
                console.log("❌ Model failed:", model, data.error.message);
            }

        } catch (err) {
            console.error("⚠️ Request error:", err.message);
        }
    }

    console.log("🚫 All models failed");
}

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

async function LocalAi(prompt) {
    const res = await axios.post("http://localhost:11434/api/generate", {
        model: "gemma2:2b",
        prompt,
        stream: false,
    });

    return res.data.response;
}

async function handleAction(action, userId, steps) {

    if (!action || !steps) {
        throw new ApiError(400, "Missing action or steps");
    }

    let raw;

    if (
        action === "create_task" ||
        action === "create_project" ||
        action === "info_task" ||
        action === "project_info"
    ) {
        const prompt = buildEntityPrompt(action, steps);
        raw = await OpenRouter(prompt);
    }

    let parsed;
    if (raw) {
        try {
            parsed = JSON.parse(raw);
        } catch (err) {
            throw new ApiError(500, "Invalid JSON from model");
        }
    }

    let result;

    switch (action) {
        case "create_project":
            result = await createProjectService(userId, parsed);
            break;

        case "project_info":
            result = await infoProjectService(userId, parsed);
            break;

        case "create_task":
            result = await createTaskService(userId, parsed);
            break;

        case "info_task":
            result = await infoTaskService(userId, parsed);
            break;

        case "all_projects_info":
            result = await allinfoProjectService(userId);
            break;

        default:
            throw new ApiError(400, "Unknown action");
    }

    return result;
}

async function executePlan(plan, userId, sendUpdate) {
    const results = [];

    for (let i = 0; i < plan.length; i++) {
        const { action, steps } = plan[i];

        try {
            sendUpdate({
                type: "progress",
                step: i + 1,
                total: plan.length,
                action,
                status: "started"
            });

            const result = await handleAction(action, userId, steps);

            results.push({ action, success: true, result });

            // ✅ Send result immediately after each action completes
            sendUpdate({
                type: "step_result",        // changed type to be more specific
                step: i + 1,
                total: plan.length,
                action,
                status: "completed",
                result,
                isLast: i === plan.length - 1   // let frontend know if its the last one
            });

        } catch (err) {
            const errorData = { action, success: false, error: err.message };
            results.push(errorData);

            sendUpdate({
                type: "step_result",
                step: i + 1,
                total: plan.length,
                action,
                status: "failed",
                error: err.message
            });

            break;
        }
    }

    return results;
}

exports.LLM_Preview = asyncHandler(async (req, res) => {
    const { message } = req.body;

    if (!message) {
        throw new ApiError(400, "Message is required");
    }

    // SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const sendUpdate = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    try {
        sendUpdate({ type: "status", message: "Planning..." });

        const prompt = buildIntentPrompt(message);
        const raw = await OpenRouter(prompt);
        const intent = JSON.parse(raw);

        if (!intent || !intent.plan) {
            throw new Error("Invalid plan");
        }

        sendUpdate({
            type: "plan",
            plan: intent.plan
        });

        const userId = req.user._id;

        const results = await executePlan(intent.plan, userId, sendUpdate);

        sendUpdate({
            type: "done",
            results
        });

        res.end();

    } catch (err) {
        sendUpdate({
            type: "error",
            message: err.message
        });
        res.end();
    }
});

