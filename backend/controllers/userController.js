import User from "../models/userModel.js";

export const updateUser = async (req, res) => {
    try {
        const {weight, height, activityLevel, goalType,targetWeight,targetDate, profilePicture,dailyCalorieGoal} = req.body;
        const { userId } = req.params;
        const user = await User.findOne({ _id: userId });
        if(!user) return res.status(400).json({msg: "User not found"});
        await User.findByIdAndUpdate(userId, {
            weight: weight || user.weight,
            height: height || user.height,
            activityLevel: activityLevel || user.activityLevel,
            goals:{
                goalType: goalType || user.goals.goalType,
                targetWeight: targetWeight || user.goals.targetWeight,
                targetDate: targetDate || user.goals.targetDate
            },
            dailyCalorieGoal: dailyCalorieGoal || user.dailyCalorieGoal,
            profilePicture: profilePicture || user.profilePicture

        },{new:true});
        res.status(200).json({msg: "User has been updated"});
    } catch (error) {
        res.status(500).json(error.message);
    }
}