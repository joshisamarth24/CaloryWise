function calculateNetCalorieRequirement(currentWeight, targetWeight, height, age, gender, activityLevel, goal, targetDate) {
    const activityFactors = {
        'Sedentary': 1.2,
        'Lightly Active': 1.375,
        'Moderately Active': 1.55,
        'Very Active': 1.725,
        'Super Active': 1.9
    };

    if (!currentWeight || !targetWeight || !height || !age || !activityLevel || !goal || !targetDate) {
        throw new Error('All input parameters are required');
    }

    if (!activityFactors[activityLevel]) {
        throw new Error('Invalid activity level');
    }

    if (isNaN(Date.parse(targetDate))) {
        throw new Error('Invalid date format. Please use mm/dd/yyyy');
    }

    let BMR;
    if (gender === 'M') {
        BMR = 88.362 + (13.397 * currentWeight) + (4.799 * height) - (5.677 * age);
    } else {
        BMR = 447.593 + (9.247 * currentWeight) + (3.098 * height) - (4.330 * age);
    }

    const TDEE = BMR * activityFactors[activityLevel];
    const dailyCalorieRequirement = TDEE;

    const currentDate = new Date();
    const endDate = new Date(targetDate);
    const daysBetween = Math.floor((endDate - currentDate) / (1000 * 60 * 60 * 24));

    if (daysBetween <= 0) {
        throw new Error('Target date must be in the future');
    }

    const weightChange = Math.abs(targetWeight - currentWeight);
    const totalCaloriesToChange = weightChange * 7700; // 1 kg of body weight is roughly equivalent to 7700 calories
    const dailyCalorieChange = totalCaloriesToChange / daysBetween;


    if (isNaN(dailyCalorieChange)) {
        throw new Error('Daily calorie change calculation resulted in NaN');
    }

    let netCalorieRequirement;
    if (goal === 'weightLoss') {
        netCalorieRequirement = dailyCalorieRequirement - dailyCalorieChange;
    } else if (goal === 'weightGain') {
        netCalorieRequirement = dailyCalorieRequirement + dailyCalorieChange;
    } else {
        netCalorieRequirement = dailyCalorieRequirement;
    }
   
    return Math.round(netCalorieRequirement);
}
export default calculateNetCalorieRequirement;
