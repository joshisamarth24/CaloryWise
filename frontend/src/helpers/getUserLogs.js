import { backendUrl } from "@/Constants";

export const getUserFoods = async (userId,date) => {
    try {
        const res = await fetch(`${backendUrl}/foods/logs/${userId}/${date}`)
        const data = await res.json()
        return data
    } catch (error) {
        console.log(error)
    }
}

export const getUserWorkouts = async (userId,date) => {
    try {
        const res = await fetch(`${backendUrl}/workouts/logs/${userId}/${date}`)
        const data = await res.json()
        return data
    } catch (error) {
        console.log(error)
    }
}


export const getFoodsByDateRange = async (startDate, endDate,userId) => {
    try {
      const response = await fetch(`${backendUrl}/foods/${userId}?startDate=${startDate}&endDate=${endDate}`);
      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching foods by date range:', error);
      return [];
    }
  };
  
  // Function to fetch workouts by date range
  export const getWorkoutsByDateRange = async (startDate, endDate,userId) => {
    try {
      const response = await fetch(`${backendUrl}/workouts/${userId}?startDate=${startDate}&endDate=${endDate}`);
      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching workouts by date range:', error);
      return [];
    }
  };

  export const getWorkoutDifference = async (userId) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
  
    const todayWorkouts = await getUserWorkouts(userId,today);
    const yesterdayWorkouts = await getUserWorkouts(userId,yesterday);
    
  
    const todayWorkoutCount = todayWorkouts.length;
    const yesterdayWorkoutCount = yesterdayWorkouts.length;
  
    return todayWorkoutCount - yesterdayWorkoutCount;
  }