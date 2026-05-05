export function buildIntentPrompt(userInput) {
  const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  return `
You are an AI planner. Break the user request into a sequence of actions.

Context:
currentDate="${currentDate}"

Available Actions:
TASK: create_task, update_task, delete_task, info_task  
PROJECT: create_project, update_project, delete_project, project_info  

Instructions:
- If the request involves multiple steps, return multiple actions in order.
- Each action must include "action" and "steps".
- Steps must clearly describe what to do.
- For create_task and create_project:
  - ALWAYS include start date
  - ALWAYS include a due date (generate one if missing)
  - Format: YYYY/MM/DD

Output format (STRICT JSON ONLY):
{
  "plan": [
    {
      "action": "action_name",
      "steps": "detailed steps..."
    }
  ]
}

Rules:
- No extra text
- No markdown
- Always return an array (even for single action)
- Always add project name and assigned user in create_task, update_task, delete_task.

User request:
"${userInput}"
`;
}