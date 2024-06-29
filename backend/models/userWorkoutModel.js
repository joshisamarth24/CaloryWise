import mongoose from "mongoose";

const userWorkoutSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workout: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout', required: true },
    durationInMinutes: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    caloriesBurned: { type: Number, required: true },
}, { timestamps: true });

userWorkoutSchema.index({ user: 1, date: 1 });

const UserWorkout = mongoose.model('UserWorkout', userWorkoutSchema);

export default UserWorkout;
