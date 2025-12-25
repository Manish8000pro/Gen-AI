import { GoogleGenAI, Type } from "@google/genai";
import { exec } from "child_process";
import util from "util"
import readlineSync from "readline-sync"
import os from "os";
import { text } from "stream/consumers";

const plateform = os.platform();

const execute = util.promisify(exec)
// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});


// tool 

async function executeCommand({command}){

    try{
        const {stdout, stderr} = await execute(command);

        if(stderr){
            return `Error: ${stderr}`
        }
        return `Success:${stdout}`
    }
    catch(err){
        return `Error: #${err}`
    }
}

const commandExecuter = {
    name:"executeCommand",
    description:"It take any shell/terminal command and execute it. It will help us to create,write,read,update,delete any file and folder",
    parameters:{
        type:Type.OBJECT,
        properties:{
            command:{
                type:Type.STRING,
                description:"It is the terminal/shell command.Ex mkdir calulator etc"
            }
        },
        required:['command']
    }
}

const History = [];

async function buildWebsite() {
    

    const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents:History,
    config: { 
    systemInstruction:`You are a websiteBuilder, which will create the frontend part of website using terminal shell/command 
    You will give shell/terminal one by one and over tool will execute it .
    
    Give the command according to the operating system we are using.
    My current user operating system is:${plateform}.

    Your job
    1:Analyse the user query
    2:Take the necessary action after analysig the query by giving proper shell/command according to the user operating system.
    
    step By step Guide
    1:First You have to create the folder for the website which have to create ex: mkdir calculator 
    2 Give shell/terminal command to create html file ex: touch calculator index.html.
    3:Give shell/terminal command to create CSS file 
    `,
    tools:[
        {
            functionDeclarations:[commandExecuter]
        }
    ]

    },
});

if(result.functionCalls&&result.functionCalls.length>0){

    const functionCall = result.functionCalls[0];

    const { name, args } = functionCall;

    const toolResponse = await executeCommand(args);

    const functionResponsePart = {
            name: functionCall.name,
            response: {
                result: toolResponse,
            },
        };

    // Send the function response back to the model.
    History.push({
      role: "model",
      parts: [
        {
          functionCall: functionCall,
        },
      ],
    });

    History.push({
      role: "user",
      parts: [
        {
          functionResponse: functionResponsePart,
        },
      ],

    })
}
else{
    console.log(result.text);
    History.push({
        role:'model',
        parts:[{text:result.text}]
    })
}

}



while(true){
    const question = readlineSync.question("Ask me Anything--> ");

    if(question == 'exit'){
        break;
    }

    History.push({
        role:'user',
        parts:[{text:question}]
    })

    buildWebsite();
}