const path = require('path');
const fs = require("fs");
require("dotenv").config();

const { fetchPhotos } = require("./photos");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getPlantInfo(plant, model) {
const prompt = `
  Give me the following information about the plant "${plant.name}":
  1. A short paragraph describing the plant.
  2. A paragraph on how to make sure it does not die by itself (care instructions).
  Respond clearly and concisely in the following JSON format. DO NOT RETURN ANYTHING ELSE. DO NOT ADD 'json' BEFORE THE JSON OBJECT. DO NOT ADD ANYTHING ELSE.:
  {
    "name": "${plant.name}",
    "probability": "xx.xx%",
    "description": {
      "Common Name": "text",
      "Type": "text",
      "Native to": "text",
      "Height": "text",
      "Distinctive Features": "text",
      "Flowers": "text",
      "Fruits": "text"
    },
    "howToKeepAlive": {
      "Soil": "well/medium/badly drained",
      "Sunlight": "Needs full/medium/little sunlight",
      "Watering": "is/isn't Drought-tolerant, needs/doesn't need minimal watering once established",
      "Pruning": "Regular pruning needed/not needed to maintain shape and encourage growth"
  }}
  `;
  
    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    console.log(text, typeof text)
    console.log(text.slice(7, text.length - 4));
    const parsedText = JSON.parse(text.slice(7, text.length - 4));
    console.log('Generated text:', typeof parsedText); // Debug the response text
  
    if (!parsedText.description || !parsedText.howToKeepAlive) {
      console.error('Invalid response format:', text);
      throw new Error('Invalid response format: Missing description or care instructions');
    }
    return {
      id: plant.id,
      name: plant.name,
      probability_percent: (plant.probability * 100).toFixed(2) + "%",
      description: parsedText.description,
      how_to_keep_alive: parsedText.careInstructions,
    };
  }

async function getDescription(PLANTS) {
  // remembver to uncomment the other plantinfos
  let plantInfos = JSON.parse(readGeminiIdFile());
  plantInfos = await fetchPhotos(plantInfos)
  return await plantInfos;
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  // const plantInfos = [];
  for (const plant of PLANTS) {
    console.log(`Processing: ${plant.name}`);
    const info = await getPlantInfo(plant, model);
    plantInfos.push(info);
  }
  const final = await fetchPhotos(plantInfos);
  fs.writeFileSync("plants_info.json", JSON.stringify(final, null, 2));
  console.log("✅ File 'plants_info.json' has been created.");
  return final;
}

function readGeminiIdFile() {
  const filePath = path.join(__dirname, '../../txt/gemini.txt'); 
  try {
    const data = fs.readFileSync(filePath, 'utf8'); // Read the file synchronously
    return data; // Return the file content
  } catch (error) {
    console.error("Error reading the file:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}

module.exports = {
    getDescription
}
