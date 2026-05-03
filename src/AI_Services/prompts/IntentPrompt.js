export function buildIntentPrompt(userInput) {
  const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  return `
Identify the user's intent and return ONLY a valid JSON object.

Context:
currentDate="${currentDate}"

Actions:
TASK: create_task, update_task, delete_task, info_task  
PROJECT: create_project, update_project, delete_project, project_info  
OTHER: none

Steps: 
- Describe the user's request in two sentences.
- Allways mentioned date in the steps (e.g.,"YYYY/MM/DD"):
  → Convert it into EXACT format: YYYY/MM/DD
  → Use currentDate as reference  

Output format:
{"action":"selected_action","steps":"Steps..."}

Rules:
- Select ONLY one action
- No extra text, no markdown
- Output must be valid JSON

User request:
"${userInput}"
`;
}