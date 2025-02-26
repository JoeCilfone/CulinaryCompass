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

        const mealRef = await db.collection('meals').add(newMeal);
        res.status(201).json({ id: mealRef.id, ...newMeal });
    } catch (error) {
        res.status(500).json({ error: 'Error saving meal' });
    }
});

exports.getMeals = functions.https.onRequest(async (req, res) => {
    try {
        const snapshot = await db.collection('meals').get();
        const meals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(meals);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching meals' });
    }
});