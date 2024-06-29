import Food from '../models/foodModel.js';
import UserFood from '../models/userFoodModel.js';

// Create a new food item
export const createFood = async (req, res) => {
    const { name, quantity, calories, protein, carbs, fats } = req.body;
    try {
        const newFood = new Food({ name, quantity, calories, protein, carbs, fats });
        await newFood.save();
        res.status(201).json(newFood);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all food items
export const getFoods = async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Log a food item for a user
export const logFood = async (req, res) => {
    const { userId } = req.params;
    let {  foodId, quantity, type,name,calories } = req.body;
    try {
        if(!foodId){ // if foodId is not provided, create a new food item
            const newFood = new Food({ name, quantity, calories });
            await newFood.save();
            foodId = newFood._id;
        }

        const userFood = new UserFood({
            user: userId,
            food: foodId,
            quantity,
            mealType:type,
            calories,
        });

        await userFood.save();
        await userFood.populate('food');
        res.status(201).json(userFood);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
};

// Get a user's food logs for a specific date
export const getUserFoodLogs = async (req, res) => {
    const { userId, date } = req.params;
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    try {
        const foodLogs = await UserFood.find({
            user: userId,
            date: { $gte: startDate, $lt: endDate }
        }).populate('food');

        res.status(200).json(foodLogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const searchFoods = async (req, res) => {
    const { query } = req.query;
    try {
        const foods = await Food.find({ name: { $regex: query, $options: 'i' } });
        res.json(foods);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
};

export const deleteUserFoodLog = async (req, res) => {
    const { logId } = req.params;
    try {
        await UserFood.findByIdAndDelete({_id:logId});
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const getFoodsbyRange = async (req, res) => {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    try {
        const foods = await UserFood.find({
            user: userId,
            date: { $gte: startDate, $lt: endDate }
        }).populate('food');
        res.status(200).json(foods);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}