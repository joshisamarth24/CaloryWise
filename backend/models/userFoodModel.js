import mongoose from "mongoose";

const userFoodSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    food: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Food', 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true 
    },
    mealType: { 
        type: String, 
        enum: ['breakfast', 'lunch', 'dinner', 'snack'], 
        required: true 
    },
    calories: {
        type: Number,
        required: true
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
});


userFoodSchema.index({ user: 1, date: 1 });

const UserFood = mongoose.model('UserFood', userFoodSchema);

export default UserFood;
