import Workout from '../models/workoutModel.js';
import UserWorkout from '../models/userWorkoutModel.js';

// Create a new workout
export const createWorkout = async (req, res) => {
    const { name, category, duration, caloriesBurnedPerMinute, description, intensity, equipment } = req.body;
    try {
        const newWorkout = new Workout({ name, category, duration, caloriesBurnedPerMinute, description, intensity, equipment });
        await newWorkout.save();
        res.status(201).json(newWorkout);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all workouts
export const getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find();
        res.json(workouts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Log a workout for a user
export const logWorkout = async (req, res) => {
    const { userId } = req.params;
    let {workoutId, durationInMinutes, caloriesBurned ,name} = req.body;
    try {
        if(!workoutId) {
            const newWorkout = new Workout({
                name,
                caloriesBurnedPerMinute: caloriesBurned / durationInMinutes,
            });
            await newWorkout.save();
            workoutId = newWorkout._id;
        }


        const userWorkout = new UserWorkout({
            user: userId,
            workout: workoutId,
            durationInMinutes,
            caloriesBurned,
        });

        await userWorkout.save();
        await userWorkout.populate('workout');
        res.status(201).json(userWorkout);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a user's workout logs for a specific date
export const getUserWorkoutLogs = async (req, res) => {
    const { userId, date } = req.params;
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    try {
        const workoutLogs = await UserWorkout.find({
            user: userId,
            date: { $gte: startDate, $lt: endDate }
        }).populate('workout');

        res.json(workoutLogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const searchWorkouts = async (req,res) => {
    const {query} = req.query;
    try {
        const workouts = await Workout.find({ name: { $regex: query, $options: 'i' } });
        res.json(workouts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const deleteWorkoutLog = async (req,res) => {
    const {id} = req.params;
    try {
        await UserWorkout.findByIdAndDelete(id);
        res.status(204).json({message:"Workout log deleted successfully"});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const getWorkoutsByRange = async (req,res) => {
    const {userId} = req.params;
    let {startDate,endDate} = req.query;
    try {
        const workouts = await UserWorkout.find({
            user: userId,
            date: { $gte: startDate, $lt: endDate }
        }).populate('workout');
        res.status(200).json(workouts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }   
}