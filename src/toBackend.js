async function plant_backend(imageData, coords) {
    try {
        console.log('Sending data to backend...');

        const response = await fetch('/identify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageData, coords: coords }), // Stringify the body
        });
        console.log('Response status from /identify:', response.status); // Log status

        if (!response.ok) {
            throw new Error(`Error from /identify: ${response.status}`);
        }

        const temp = await response.json();
        console.log('Response from /identify:', temp); // Log parsed response

        const result1 = await understand(temp); // Pass the response to understand
        console.log('Processed result:', result1);

        const result = await fetch('http://localhost:3000/ai_it', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input: result1 }),
        });
        if (!result.ok) {
            throw new Error(`Error from /ai_it: ${result.status}`);
        }
        return result;
    } catch (error) {
        console.error('Error sending data to backend:', error);
        throw error;
    }
}

async function understand(jsonify) {
    console.log('Understanding the result...');
    console.log('Input to understand:', jsonify); // Debug the input
    try {
        // Work directly with jsonify (already an object)
        if (!jsonify.result || !jsonify.result.classification || !jsonify.result.classification.suggestions) {
            throw new Error('Invalid response structure: Missing classification or suggestions');
        }
        const suggestions = jsonify.result.classification.suggestions;
        if (suggestions.length > 0) {
            return suggestions; // Return the suggestions array
        } else {
            throw new Error('No suggestions found in the response');
        }
    } catch (error) {
        console.error('Error in understand function:', error);
        throw error;
    }
}