export function buildEntityPrompt(action, steps) {
  if (action === "create_task") {
    return `
You are a backend entity extractor for TASK creation.

Return ONLY a valid JSON object.
No markdown, no explanations, no extra text.

Context:
action = ${action}
steps = "${steps}"

Your job:
- Analyze the steps
- Extract ONLY ONE task (the most relevant or primary task if multiple exist)

Output format:
{
  "title": "clear and concise task name",
  "description": "neutral explanation of the task",
  "assignedTo": ["name1", "name2"],
  "priority": "low" | "medium" | "high",
  "project": "project name",
  "startDate": "YYYY/MM/DD",
  "dueDate": "YYYY/MM/DD"
}

Constraints:
- ALWAYS return a single JSON object
- All fields are required in the output, but values can be empty strings or defaults if not found 
- Extract ONLY from the provided steps
- Do NOT invent data unless necessary
- If assignedTo is missing, return []
- If priority is unclear, default to "medium"
- If project is missing, return ""
- Ensure valid JSON (no trailing commas, correct quotes)
`;
  }
  if (action === "create_project") {
    return `
You are a backend entity extractor for PROJECT creation.

Return ONLY a valid JSON object.
No markdown, no explanations, no extra text.

Context:
action = ${action}
steps = "${steps}"

Extract:

{
  "name": "", (required)
  "description": "", (required)
  "color": "", (required)
  "dueDate": "", (required)
  "visibility": "", (required)
}

Rules:

- name:
  Extract from steps (e.g., "project called X").
  If not found, generate a short meaningful title (2–4 words).

- description:
  Neutral explanation of the project topic.
  Do NOT describe the action.
  20–30 words.

- color:
  simple color (e.g., "blue")

- visibility:
  "public" or "private" (default: "private")

- dueDate:
  extract if mentioned, else ""

Constraints:
- Use ONLY the steps
- Output must match structure exactly
- Do not add extra fields
`;
  }
  if (action === "info_task") {
    return `
You are a backend entity extractor for TASK information retrieval.

Return ONLY a valid JSON object.
No markdown, no explanations, no extra text.

Context:
action = ${action}
steps = "${steps}"

Extract:

{
  "name": "The name of the task to retrieve"
}

Constraints:
- Use ONLY the steps
- Output must match structure exactly
- Do not add extra fields
`;
  }
  if (action === "project_info") {
    return `
You are a backend entity extractor for PROJECT information retrieval.

Return ONLY a valid JSON object.
No markdown, no explanations, no extra text.

Context:
action = ${action}
steps = "${steps}"

Extract:

{
  "name": "The name of the project to retrieve"
}

Constraints:
- Use ONLY the steps
- Output must match structure exactly
- Do not add extra fields
`;
  }
  return `
Return {"error":"unsupported_action"}
`;
}