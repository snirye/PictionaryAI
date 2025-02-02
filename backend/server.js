require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ollama = require('ollama');
const util = require('util');
const fs = require('fs');
const path = require('path');
const app = express();

const imageBasePath = './backend/uploads';
const undefinedSessionPath = path.join(imageBasePath, 'undefined_session');
const SAVE_IMAGES = process.env.SAVE_IMAGES === 'true';

// Ensure uploads directories exist
if (!fs.existsSync(imageBasePath)) {
    fs.mkdirSync(imageBasePath, { recursive: true });
}
if (!fs.existsSync(undefinedSessionPath)) {
    fs.mkdirSync(undefinedSessionPath, { recursive: true });
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/api/guess', async (req, res) => {
    try {
        const base64Image = req.body.drawing.split(',')[1]; // Remove data URL prefix
        const sessionId = req.body.sessionId;
        const imageBuffer = Buffer.from(base64Image, 'base64');
        const timestamp = Date.now();

        // Log session ID
        console.log(`Processing request for session: ${sessionId || 'undefined'}`);

        // Only save images if SAVE_IMAGES is true
        if (SAVE_IMAGES) {
            let targetFolder;
            if (!sessionId) {
                // If session is undefined, save in the undefined_session directory
                targetFolder = undefinedSessionPath;
                console.log('No session ID provided, saving to undefined_session directory');
            } else {
                // Use the session-specific folder
                targetFolder = path.join(imageBasePath, `${sessionId}`);
            }
            fs.mkdirSync(targetFolder, { recursive: true });

            const filePath = path.join(targetFolder, `${timestamp}.png`);
            fs.writeFileSync(filePath, imageBuffer);
        }

        const response = await ollama.default.generate({
            system: ' you are expert in detecting hand drawings',
            model: process.env.OLLAMA_MODEL || 'llava', // Default to llava if not specified
            prompt: 'What is this drawing? Answer with only one English word.',
            images: [imageBuffer],
            options: {
                temperature: 0.8 // For more deterministic responses
            }
        });

        // Clean up the response
        const rawGuess = response.response.trim().toLowerCase();
        const cleanGuess = rawGuess.replace(/[^a-z]/gi, ''); // Remove non-alphabetic characters

        res.json({ guesses: [cleanGuess] });

    } catch (error) {
        console.error('Ollama error:', error);
        res.status(500).json({ error: 'AI processing failed' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
