const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(bodyParser.json());

console.log("Server started, routes should be mounted...");

// Firestore-Based User Route
app.post('/api/users/preferences', async (req, res) => {
    const { userId, preferences } = req.body;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        await db.collection('users').doc(userId).set({ preferences }, { merge: true });
        res.json({ message: 'Preferences saved successfully!' });
    } catch (error) {
        console.error("Error saving preferences:", error);
        res.status(500).json({ error: 'Failed to save preferences' });
    }
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, './frontend')));

app.get('/', (req, res) => {
    res.send('Welcome to CulinaryCompass API');
});

app.get('/dietary-preferences', (req, res) => res.sendFile(path.join(__dirname, './frontend/dietary_preferences.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, './frontend/login.html')));
app.get('/profile', (req, res) => res.sendFile(path.join(__dirname, './frontend/profile.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, './frontend/signup.html')));
app.get('/account', (req, res) => res.sendFile(path.join(__dirname, './frontend/account.html')));
app.get('/community', (req, res) => res.sendFile(path.join(__dirname, './frontend/community.html')));
app.get('/index', (req, res) => res.sendFile(path.join(__dirname, './frontend/index.html')));
app.get('/nearby-restaurants', (req, res) => res.sendFile(path.join(__dirname, './frontend/nearby-restaurants.html')));

// Export as Firebase Cloud Function
exports.api = functions.https.onRequest(app);