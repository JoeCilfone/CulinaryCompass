const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: String, required: true },
    instructions: { type: String, required: true },
    imageUrl: { type: String },
    dietaryRestrictions: { type: String }, // For filtering
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to User
});

module.exports = mongoose.model('Meal', MealSchema);
