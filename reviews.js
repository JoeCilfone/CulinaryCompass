exports.createReview = functions.https.onRequest(async (req, res) => {
    const { mealId, userId, rating, comment } = req.body;

    if (!mealId || !userId || !rating) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const review = {
            mealId,
            userId,
            rating,
            comment,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const reviewRef = await db.collection('reviews').add(review);
        res.status(201).json({ id: reviewRef.id, ...review });
    } catch (error) {
        res.status(500).json({ error: 'Error saving review' });
    }
});

exports.getMealReviews = functions.https.onRequest(async (req, res) => {
    const mealId = req.query.mealId;
    if (!mealId) return res.status(400).json({ error: 'Meal ID is required' });

    try {
        const snapshot = await db.collection('reviews').where('mealId', '==', mealId).get();
        const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reviews' });
    }
});