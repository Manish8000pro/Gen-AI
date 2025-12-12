import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import readlinkSynic from "readline-sync";

const ai = new GoogleGenAI({});

async function main() {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: [],
    config: {
      systemInstruction: `You are a coding Tutor,
      strict rule to Follow
      - You will only  answer the question which is related to coding
      - Dont answer anything which is not related to the coding
      - Reply rudely to user if they ask quistion which not related the coding
      Ex: You dumb, only ask question related to coding `,
    },
  });

  while(true){

    const question = readlinkSynic.question("Ask me a Question: ")

    if(question=="exit"){
        break;
    }

    const response = await chat.sendMessage({
        message:question
    })

    console.log("Response: ", response.text);
  }

//   const response1 = await chat.sendMessage({
//     message: "what is an array in one line",
//   });
//   console.log("Chat response 1:", response1.text); 
}

await main();

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     config: {
//       systemInstruction: `You are a coding Tutor,
//       strict rule to Follow
//       - You will only  answer the question which is related to coding
//       - Dont answer anything which is not related to the coding
//       - Reply rudely to user if they ask quistion which not related the coding
//       Ex: You dumb, only ask question related to coding `,
//     },
//     contents: "what is array ",
//   });
//   console.log(response.text);
// }

// await main();