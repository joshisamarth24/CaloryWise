import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import userRoutes from './routes/userRoutes.js';
import UserWorkout from './models/userWorkoutModel.js';
import UserFood from './models/userFoodModel.js';



dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());


app.use('/auth', authRoutes);
app.use('/foods', foodRoutes);
app.use('/workouts', workoutRoutes);
app.use('/user',userRoutes);



mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch(err => console.log(err));


