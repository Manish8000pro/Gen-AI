import { GoogleGenAI, Type } from '@google/genai';
import { type } from 'os';
import readlineSync from "readline-sync"
import 'dotenv/config'
// Configure the client
const ai = new GoogleGenAI({});

// Cripto Currency tool 

async function cryptoCurrency({coin}) {

  const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${coin}`)
  const data = await response.json();

  return data;
}

// Weather app tool

async function weatherInformation({city}) {
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=76422ad95fb2481bb8180728251812&q=${city}&aqi=no`)
    const data = await response.json();

    return data;
}

// criptoCurrency wale ki information 

const cryptoInfo = {
    name:"cryptoCurrency",
    description:"We can give the current prize or other information related to  cryptocurrency like bitcoin and ethereum etc",
    parameters:{
        type: Type.OBJECT,
        properties:{
            coin:{
                type:Type.STRING,
                description: "It will be the name of cryptocurrency like bitcoin,ethereum,etc"
            },
        },
        required:['coin']
    }
}

// weather info

const weatherInfo = {
    name:"weatherInformation",
    description:"You will get the weather information of any city like london,goa,etc",
    parameters:{
        type:Type.OBJECT,
        properties:{
            city:{
                type:Type.STRING,
                description:"Name of the city for which I have to fetch like london, goa etc"
            }
        },
        required:['city']
    }
}

const tools = [{
    functionDeclarations:[cryptoInfo,weatherInfo]
}];

const toolFunctions = {
    "cryptoCurrency":cryptoCurrency,
    "weatherInformation":weatherInformation
}

const History = [];

async function runAgent() {
    

    while(true){
        const result = await ai.models.generateContent({
            model:"gemini-2.5-flash",
            contents:History,
            config:{tools},
        });

        if (result.functionCalls && result.functionCalls.length > 0){

            const functionCall = result.functionCalls[0];
            const {name,args} = functionCall;

            // if(name = "cryptoCurrency"){
            //     const response = await cryptoCurrency(args);
            // }
            // else if(name=="weaterInformation"){
            //     const response = await weaterInformation(args);
            // }

            const response = await toolFunctions[name](args);

            const functionResponsePart = {
                name: functionCall.name,
                response: {
                    result: response,
                },
            };

            // Send the function response back to the model.
            History.push({
            role: "model",
            parts: [{functionCall: functionCall,},],
            });

            History.push({
                role:'user',
                parts: [{functionResponse: functionResponsePart}]
            })
        }
        else{
         History.push({
                role:'model',
                parts:[{text:result.text}]
            });
            console.log(result.text);
            break; 
        }
    }

}



while(true){

    const question = readlineSync.question('Ask me anything: ');

    if(question=='exit'){
        break;
    }

    History.push({
        role:'user',
        parts:[{text:question}]
    })

    await runAgent();
}