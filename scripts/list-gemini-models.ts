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
  console.log("\n===== GEMINI MODELS AVAILABLE TO THIS API KEY =====\n");

  const response = await ai.models.list();

  for await (const model of response) {
    console.log(model.name);
  }
}

main().catch((error) => {
  console.error("\n===== GEMINI ERROR =====\n");
  console.error(error);
  process.exit(1);
});