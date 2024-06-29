import { configureStore } from '@reduxjs/toolkit'
import user from './userSlice'
import meals from './mealSlice'
import workouts from './workoutSlice'

const preloadedState = {
  user:{
    user: JSON.parse(localStorage.getItem("user")) || null,
  isFetching: false,
  error: false
},
meals:{
  userFoods:JSON.parse(localStorage.getItem("userFoods")) || [],
},
workouts:{
  userWorkouts:JSON.parse(localStorage.getItem("userWorkouts")) || [],
},
}

export default configureStore({
  reducer: {
    user: user,
    meals: meals,
    workouts: workouts,
  },
    preloadedState,
})