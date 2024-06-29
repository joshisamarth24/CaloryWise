import express from 'express';
import { createWorkout, getWorkouts, logWorkout, getUserWorkoutLogs, searchWorkouts, deleteWorkoutLog, getWorkoutsByRange } from '../controllers/workoutController.js';

const router = express.Router();

router.post('/workout', createWorkout);
router.get('/search',searchWorkouts);
router.get('/workouts', getWorkouts);
router.get('/:userId',getWorkoutsByRange)
router.post('/log/:userId', logWorkout);
router.get('/logs/:userId/:date', getUserWorkoutLogs);
router.delete('/logs/:id',deleteWorkoutLog)

export default router;
