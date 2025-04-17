const path = require('path');
const fs = require('fs');
require("dotenv").config();

async function fetchPlant(image, coords) {
  return JSON.parse(readPlantIdFile());
  const data = {
    images: [image],
    latitude: coords[0], // Add latitude
    longitude: coords[1] // Add longitude
  };

  try {
    const response = await fetch("https://plant.id/api/v3/identification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": process.env.PLANT_ID // Replace 'hi' with your actual API key
      },
      body: JSON.stringify(data)
    });

    // Log the raw response for debugging
    const contentType = response.headers.get("Content-Type");

    const rawResponse = await response.text();

    // Check if the response is JSON
    if (contentType && contentType.includes("application/json")) {
      const result = JSON.parse(rawResponse);
      return result; // Return the parsed JSON
    } else {
      throw new Error(`Unexpected response format: ${rawResponse}`);
    }
  } catch (error) {
    console.error("Error identifying plant:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}

function readPlantIdFile() {
  const filePath = path.join(__dirname, '../../txt/plantid.txt'); // Adjust the path as necessary
  try {
    const data = fs.readFileSync(filePath, 'utf8'); // Read the file synchronously
    return data; // Return the file content
  } catch (error) {
    console.error("Error reading the file:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}

module.exports = {
  fetchPlant
};

