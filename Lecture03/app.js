import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey:"AIzaSyD2J64nVeb6ECHnIVZ9sRAoxSNO3xrF-wQ"});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: `current user name is Manish,Today date is ${new Date()}`,
    },
    contents: "what is my name ",
  });
  console.log(response.text);
}

await main();