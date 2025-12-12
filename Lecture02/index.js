import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey:"AIzaSyD2J64nVeb6ECHnIVZ9sRAoxSNO3xrF-wQ"});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
        {
            role:'user',
            parts:[{text:"what is my name"}]
        },
        {
            role:'model',
            parts:[{text:"As an AI, I don't have access to any personal information about you"}]
        },
        {
            role:'user',
            parts:[{text:"My name is Manish kumar"}]
        },
        {
            role:'model',
            parts:[{text:"Okay, thank you for telling me, Manish Kumar! It's good to know."}]
        },
        {
            role:'user',
            parts:[{text:"what is my name"}]
        },
    ]
  });
  console.log(response.text);
}

await main();