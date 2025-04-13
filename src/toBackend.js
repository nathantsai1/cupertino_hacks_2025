async function plant_backend(imageData, coords) {
    try {
        console.log('Sending data to backend...');
        const response = await fetch('/identify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageData, coords: coords }),
        });
        const temp = await response.json();
        const result1 = await understand(temp); // Assuming the server returns JSON data
        const result = await fetch('/ai_it', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input: result1 }),
        });
        return result;
    } catch (error) {
        console.error('Error sending data to backend:', error);
    }
}

async function understand(jsonify) {
    console.log('Understanding the result...');
    
    // Directly use the result object
    const plantDetails = JSON.parse(jsonify);; // No need to stringify or parse

    let run_through = plantDetails.result.classification.suggestions; // Should log 'object'
    console.log(run_through); // Log the suggestions array
        console.log('Plant identified:', run_through[0].plant_name);
        console.log('Probability:', run_through[0].probability);
        console.log('Plant details:', plantDetails.result.classification.suggestions[0]);
        return plantDetails.result.classification.suggestions; // Return the first suggestion
}