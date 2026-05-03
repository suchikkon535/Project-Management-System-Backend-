export function buildEntityPrompt(action, steps) {
  if (action === "create_task") {
    return `
You are a backend entity extractor for TASK creation.

Return ONLY a valid JSON object.
No markdown, no explanations, no extra text.

Context:
action = ${action}
steps = "${steps}"

Extract:

{
  "title": "give a good task name",
  "description": "Neutral explanation of the task topic",
  "assignedTo": ["name1", "name2"..."nameN"],
  "priority": One of: "low", "medium", "high",
  "project": "project called X",(Importent : You have to return this field)
  "startDate": "YYYY/MM/DD",(Importent : You have to return this field)
  "dueDate": "YYYY/MM/DD"(Importent : You have to return this field)
}

Constraints:
- Use ONLY the steps
- Output must match structure exactly
- Do not add extra fields
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
  "name": "",
  "description": "",
  "color": "",
  "dueDate": "",
  "visibility": ""
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
  // fallback
  return `
Return {"error":"unsupported_action"}
`;
}