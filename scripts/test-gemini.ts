import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

const ai = new GoogleGenAI({
  apiKey,
});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Reply with exactly: Gemini connection successful.",
  });

  console.log("\n===== GEMINI TEST =====\n");
  console.log(response.text);
}

main().catch((error) => {
  console.error("\n===== GEMINI ERROR =====\n");
  console.error(error);
  process.exit(1);
});