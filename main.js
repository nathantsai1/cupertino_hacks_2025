const cors = require('cors'); // Import the cors package
const express = require('express');
const path = require('path');
const { fetchPlant } = require('./src/backend/plantid'); // Adjust the path as necessary
const app = express();
const bodyParser = require('body-parser');
const { getDescription } = require('./src/backend/gemini'); // Adjust the path as necessary
const fs = require('fs');

const PORT = 3000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json({ limit: '10mb' })); // Increase limit to 10MB
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // For URL-encoded data
app.use(cors());

// Route to serve index.html on the home screen
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './templates/slideshow.html'));
});
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, './templates/slideshow.html'));
});

app.get('/process.html', (req, res) => {
    res.sendFile(path.join(__dirname, './templates/result.html'));
});

app.get('/projects.html', (req, res) => {
    res.sendFile(path.join(__dirname, './templates/projects.html'));
});

app.post('/identify', express.json(), async (req, res) => {
    console.log("Received request to identify plant");
    const image = req.body.image; // Assuming the image is sent in the request body
    const coords = req.body.coords; // Assuming the image is sent in the request body
    try {
        const plantDetails = await fetchPlant(image, coords);
        res.json(plantDetails); // Send back the plant identification details
    } catch (error) {
        console.error('Error identifying plant:', error);
        res.status(500).json({ error: 'Error identifying plant' });
    }
});

app.get('/temp', (req, res) => {
    const filePath = path.join(__dirname, './txt/index.txt');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Wrap the text content in basic HTML structure
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Index</title>
            </head>
            <body>
                <pre>${data}</pre>
            </body>
            </html>
        `;

        res.send(htmlContent);
    });
})

app.post('/ai_it', express.json(), async (req, res) => {
    const input = req.body.input; // Assuming the input is sent in the request body
    if (!input && input.length != 3) {
        const errorText = await result.text();
        console.error(`Error from /ai_it: ${result.status} - ${errorText}`);
        throw new Error(`Error from /ai_it: ${result.status}`);
    }
    try {
        const result = await getDescription(input);
        res.json(result); // Send back the AI description
        
    } catch (error) {
        console.error('Error getting AI description:', error);
        res.status(500).json({ error: 'Error getting AI description' });
    }
});

app.get('/results', (req, res) => {
    res.sendFile(path.join(__dirname, '/templates/result.html'));
});
app.get('/initialize', (req, res) => {
    res.sendFile(path.join(__dirname, '/templates/initialize.html'));
});

app.get('/:nothing', (req, res) => {
    res.sendFile(path.join(__dirname, '/templates/404.html'));
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});