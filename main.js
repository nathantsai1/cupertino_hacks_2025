const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const { check_users, encrypt_password, } = require('./src/backend/login');
const { fetchPlant } = require('./src/backend/plantid'); 
const { fetchPhotos } = require('./src/backend/photos'); 
const { getDescription } = require('./src/backend/gemini'); 

const PORT = 3000;

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

// POST REQUESTS
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

app.post('/ai_it', express.json(), async (req, res) => {
    const input = req.body.input; // Assuming the input is sent in the request body
    if (!input && input.length != 3) {
        const errorText = await result.text();
        console.error(`Error from /ai_it: ${result.status} - ${errorText}`);
        throw new Error(`Error from /ai_it: ${result.status}`);
    }
    try {
        const result = await getDescription(input);
        console.log('ai_it', await result)
        res.json(result); // Send back the AI description
        
    } catch (error) {
        console.error('Error getting AI description:', error);
        res.status(500).json({ error: 'Error getting AI description' });
    }
});

app.post('/photos', express.json(), async (req, res) => {
    const plantData = req.body.plantData; // Assuming the plant data is sent in the request body
    try {
        const updatedPlantData = await fetchPhotos(plantData); // Fetch photo links
        console.log('main.js', updatedPlantData.json())
        res.json(updatedPlantData); // Send back the updated plant data with photo links
    } catch (error) {
        console.error('Error fetching photo links:', error);
        res.status(500).json({ error: 'Error fetching photo links' });
    }
});

app.post('/signup', async (req, res) => {
    // TODO idK?
    const { email, password, confirm_pw, date, security_q, check } = req.body;
    // s1: check if email and password are valid
    // 1=success, 2=pw not secure, 3=username not valid, 4=pw errror 5=somethng wriong 6=check not clicked 7=pw not same
    if (!check) {
        res.send(6);
        return;
    }
    if(!email || !password || !confirm_pw || !date || !security_q) {
        res.send(5);
        return;
    } else if (password !== confirm_pw) {
        console.log(password, confirm_pw)
        res.send(7);
        return;
    }
    const is_valid = await check_users(email, password);
    if (!is_valid) res.send(is_valid);
    
    // s2: encrypt pw
    // 8=error encrypting pw/question - system err
    const hashedPassword = await encrypt_password(password);
    const hashedQuestion = await encrypt_password(security_q);
    if (hashedPassword === 0 || hashedQuestion === 0) {
        res.send(8);
    }
    console.log('Hashed Password:', hashedPassword);
    return true;
    // Here you would typically handle the signup logic (e.g., save to database)
});
app.post('/login', express.json(), async (req, res) => {
    // TODO idK?
    const { email, password } = req.body;
    
    // s1: find username pw
    // check email/pw requirements
    
    // Here you would typically handle the signup logic (e.g., save to database)
});

// GET REQUESTS
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './templates/slideshow.html'));
});

app.get('/projects.html', (req, res) => {
    res.sendFile(path.join(__dirname, './templates/projects.html'));
});

app.get('/results', (req, res) => {
    res.sendFile(path.join(__dirname, '/templates/result.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/templates/login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '/templates/signup.html'));
});

app.get('/terms-conditions' , (req, res) => {
    const redirect = req.query.redirect;
    console.log('Redirect:', redirect);
    if (!redirect) {
        res.sendFile(path.join(__dirname, '/templates/toc.html'));
        return;
    }
    const tocPath = path.join(__dirname, '/templates/toc.html');

    // Read the HTML file and inject the redirect value
    fs.readFile(tocPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading toc.html:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Inject the redirect value into the script tag
        const updatedHtml = data.replace(
            '<button class="button" style="display:none" id="redirect">Redirect back</button>',
            `<button style="display:inline-block" class="button" onclick="window.location.href='/${redirect}'" id="redirect">Redirect back</button>`
        );

        res.send(updatedHtml);
    });
});
// DON'T TOUCH ANYTHING BELOW THIS LINE
// ------------------------------------
app.get('/:nothing', (req, res) => {
    res.sendFile(path.join(__dirname, '/templates/404.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});