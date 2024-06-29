import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { 
        type: String, 
        required: true 
    },
    age: { 
        type: Number, 
        required: true,
        min: 18
    },
    gender: { 
        type: String,
        enum: ['M', 'F', 'O'],
        required: true
    },
    weight: { 
        type: Number, 
        required: true,
        min: 1
    },
    height: { 
        type: Number, 
        required: true,
        min: 1
    },
    activityLevel: { 
        type: String,
        enum: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Super Active'],
        required: true
    },
    goals: {
        type: {
            goalType: {
                type: String,
                enum: ['weightLoss', 'weightGain', 'maintainWeight'],
                required: true
            },
            targetWeight: {
                type: Number,
                default: null
            },
            targetDate: {
                type: String,
                default: null
            }
        },
        required: true
    },
    dailyCalorieGoal: {
        type: Number,
        required: true
    },
    profilePicture: {
        type: String,
        default: null
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
