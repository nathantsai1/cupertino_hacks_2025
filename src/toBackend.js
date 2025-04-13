async function plant_backend(imageData, coords) {
    try {
        console.log('Sending data to backend...');

        const response = await fetch('http://localhost:3000/identify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageData, coords: coords }),
        });

        if (!response.ok) {
            throw new Error(`Error from /identify: ${response.status}`);
        }

        const temp = await response.json();
        console.log('Response from /identify:', temp); // Debug the response here

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

        const finalResult = await result.json();
        console.log('Response from /ai_it:', finalResult);

        return finalResult;
    } catch (error) {
        console.error('Error sending data to backend:', error);
        throw error;
    }
}

async function understand(jsonify) {
    console.log('Understanding the result...');
    console.log('Input to understand:', jsonify); // Debug the input
    const temp = JSON.parse(jsonify); // Assuming jsonify is a string, parse it to JSON
    // Check if the result and classification exist
    if (!temp.result || !temp.result.classification || !temp.result.classification.suggestions) {
        throw new Error('Invalid response structure: Missing classification or suggestions');
    }

    const suggestions = temp.result.classification.suggestions;

    if (suggestions.length > 0) {
            return suggestions; // Return the suggestions array
    } else {
        throw new Error('No suggestions found in the response');
    }
}