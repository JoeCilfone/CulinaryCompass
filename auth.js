const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.registerUser = functions.https.onRequest(async (req, res) => {
    const { email, password, username, dietaryRestrictions } = req.body;
    try {
        // Create user in Firebase Auth
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: username,
        });

        // Store user details in Firestore
        await db.collection('users').doc(userRecord.uid).set({
            email,
            username,
            dietaryRestrictions,
        });

        res.json({ message: 'User registered successfully!', uid: userRecord.uid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

exports.loginUser = functions.https.onRequest(async (req, res) => {
    res.status(501).json({ error: 'Use Firebase Authentication SDK on the frontend for login.' });
});