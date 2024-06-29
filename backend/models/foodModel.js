import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },//grams
    calories: { type: Number, required: true },
});


foodSchema.index({ name: 1 });

const Food = mongoose.model('Food', foodSchema);

export default Food;
