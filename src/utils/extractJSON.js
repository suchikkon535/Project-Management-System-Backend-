export function extractJSON(raw) {
    try {
        // Remove markdown code blocks and whitespace
        const cleaned = raw.replace(/```json|```/gi, "").trim();

        // Locate the object boundaries
        const start = cleaned.indexOf("{");
        const end = cleaned.lastIndexOf("}");

        if (start === -1 || end === -1) return null;

        // Extract and parse
        const jsonString = cleaned.slice(start, end + 1);
        return JSON.parse(jsonString);

    } catch (err) {
        console.error("Extraction failed:", err);
        return null;
    }
}