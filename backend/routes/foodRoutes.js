import express from 'express';
import { createFood, getFoods, logFood, getUserFoodLogs, searchFoods, deleteUserFoodLog, getFoodsbyRange } from '../controllers/foodController.js';

const router = express.Router();


router.post('/food', createFood);
router.get('/searchFoods', searchFoods);
router.get('/:userId',getFoodsbyRange)
router.get('/allFoods', getFoods);
router.post('/log/:userId', logFood);
router.get('/logs/:userId/:date', getUserFoodLogs);
router.delete('/logs/:logId', deleteUserFoodLog);

export default router;
