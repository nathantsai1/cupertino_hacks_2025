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
    res.sendFile(path.join(__dirname, './txt/index.txt'));
});

app.post('/identify', express.json(), async (req, res) => {
    console.log("Received request to identify plant");
    const image = req.body.image; // Assuming the image is sent in the request body
    const coords = req.body.coords; // Assuming the image is sent in the request body
    try {
        const plantDetails = await fetchPlant(image, coords);
        const filtered = res.json(plantDetails); // Send back the plant identification details
        console.log('Plant details:', plantDetails); // Debug the response here
        return filtered;
    } catch (error) {
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
    if (!req.body.input) {
        return res.status(400).json({ error: 'No input provided' });
    } 
    console.log(req.body.input);
    const result = await getDescription(req.body.input);
    console.log('Result from getDescription:', result);
    res.json(result);
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