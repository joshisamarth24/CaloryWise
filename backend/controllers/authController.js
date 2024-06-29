import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const registerUser = async (req, res) => {
    const { username, email, password, age, gender, weight, height, activityLevel, goals,dailyCalorieGoal,profilePicture } = req.body;
    
    try {
        // Check if user with the same email already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user object
        const newUser = new User({ 
            username,
            email,
            password: hashedPassword,
            age,
            gender,
            weight,
            height,
            activityLevel,
            goals,
            dailyCalorieGoal: dailyCalorieGoal || 2000,
            profilePicture
        });

        // Save the new user to the database
        await newUser.save();

        // Create JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        // Return the token as a response
        res.status(201).json({ newUser,token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        // Return the token as a response
        res.status(201).json({ user,token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};