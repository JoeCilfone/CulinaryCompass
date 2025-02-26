const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.getUser = functions.https.onRequest(async (req, res) => {
    const userId = req.query.id;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(userDoc.data());
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});