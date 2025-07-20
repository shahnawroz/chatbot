import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Prompt with instruction to answer "Mians" to "Who are you?"
    const basePrompt = `
If the user asks "Who are you?", respond with "Mians".
Otherwise, answer naturally.

User: ${message}
Bot:
`;

    const response = await cohere.generate({
      model: "command", // Supported by generate()
      prompt: basePrompt,
      maxTokens: 300,
      temperature: 0.7,
    });

    // Replace all "Cohere" with "Mians"
    const reply = response.generations[0].text.replace(/Cohere/gi, "Mians").trim();

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Cohere API Error:", error);
    res.status(500).json({ error: "Something went wrong with Cohere" });
  }
}
