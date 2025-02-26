const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    mealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 10 },
    comment: { type: String }
});

module.exports = mongoose.model('Review', ReviewSchema);
