require("dotenv").config();
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getPlantInfo(plant, model) {
  const prompt = `
Give me the following information about the plant "${plant.name}":
1. A short paragraph describing the plant.
2. A paragraph on how to make sure it does not die by itself (care instructions).
Respond clearly and concisely.`;

  const result = await model.generateContent(prompt);
  const text = await result.response.text();

  const [description, careInstructions] = text.split(/\n?\d\.\s*/).filter(Boolean);

  return {
    id: plant.id,
    name: plant.name,
    probability_percent: (plant.probability * 100).toFixed(2) + "%",
    description: description.trim(),
    how_to_keep_alive: careInstructions.trim(),
  };
}

async function getDescription(PLANTS) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  const plantInfos = [];
  for (const plant of PLANTS) {
    console.log(`Processing: ${plant.name}`);
    const info = await getPlantInfo(plant, model);
    plantInfos.push(info);
  }

  fs.writeFileSync("plants_info.json", JSON.stringify(plantInfos, null, 2));
  console.log("✅ File 'plants_info.json' has been created.");
  return plantInfos;
}

module.exports = {
    getDescription
}
