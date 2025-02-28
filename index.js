/* eslint-disable indent */
/* eslint-disable object-curly-spacing */
/* eslint-disable no-trailing-spaces */
/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

const OPENAI_API_KEY = "Your API Key";

// 1. Register User with Firebase Authentication & Firestore
exports.registerUser = functions.https.onRequest(async (req, res) => {
    const { email, password, username, dietaryRestrictions } = req.body;
    
    try {
        const userRecord = await admin.auth().createUser({ email, password, displayName: username });

        await db.collection("users").doc(userRecord.uid).set({
            email,
            username,
            dietaryRestrictions,
        });

        res.json({ message: "User registered successfully!", uid: userRecord.uid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Save User Dietary Preferences
exports.savePreferences = functions.https.onRequest(async (req, res) => {
    const { userId, preferences } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    try {
        await db.collection("users").doc(userId).set({ preferences }, { merge: true });
        res.json({ message: "Preferences saved successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to save preferences" });
    }
});

// 3. Create a Meal Entry
exports.createMeal = functions.https.onRequest(async (req, res) => {
    const { name, description, ingredients, instructions, imageUrl, dietaryRestrictions, userId } = req.body;

    try {
        const newMeal = {
            name,
            description,
            ingredients,
            instructions,
            imageUrl,
            dietaryRestrictions,
            userId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const mealRef = await db.collection("meals").add(newMeal);
        res.status(201).json({ id: mealRef.id, ...newMeal });
    } catch (error) {
        res.status(500).json({ error: "Error saving meal" });
    }
});

// 4. Get All Meals
exports.getMeals = functions.https.onRequest(async (req, res) => {
    try {
        const snapshot = await db.collection("meals").get();
        const meals = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        res.json(meals);
    } catch (error) {
        res.status(500).json({ error: "Error fetching meals" });
    }
});

// 5. Submit a Meal Review
exports.createReview = functions.https.onRequest(async (req, res) => {
    const { mealId, userId, rating, comment } = req.body;

    if (!mealId || !userId || !rating) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const review = {
            mealId,
            userId,
            rating,
            comment,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const reviewRef = await db.collection("reviews").add(review);
        res.status(201).json({ id: reviewRef.id, ...review });
    } catch (error) {
        res.status(500).json({ error: "Error saving review" });
    }
});

// 6. Get Reviews for a Meal
exports.getMealReviews = functions.https.onRequest(async (req, res) => {
    const mealId = req.query.mealId;
    if (!mealId) return res.status(400).json({ error: "Meal ID is required" });

    try {
        const snapshot = await db.collection("reviews").where("mealId", "==", mealId).get();
        const reviews = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: "Error fetching reviews" });
    }
});

// 7. AI Chat Assistant with OpenAI
exports.chatWithAI = functions.https.onRequest(async (req, res) => {
    try {
        const { userMessage } = req.body;

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o",
                messages: [{ role: "user", content: userMessage }],
                max_tokens: 100,
            },
            {
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            },
        );

        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Error calling AI model:", error);
        res.status(500).json({ error: "AI chat failed" });
    }
});
