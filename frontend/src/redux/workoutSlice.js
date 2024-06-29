import { createSlice } from "@reduxjs/toolkit";


const workoutSlice = createSlice({
    name:'workouts',
    initialState:{
        userWorkouts:JSON.parse(localStorage.getItem("userWorkouts")) || [],
    },
    reducers:{
        setWorkouts:(state,action)=> {
            state.userWorkouts=action.payload
            localStorage.setItem("userWorkouts",JSON.stringify(state.userWorkouts));
        },
        addWorkout:(state,action)=> {
            state.userWorkouts=[...state.userWorkouts,action.payload]
            localStorage.setItem("userWorkouts",JSON.stringify(state.userWorkouts));
        },
        removeWorkout:(state,action)=> {
            state.userWorkouts=state.userWorkouts.filter((workout)=>workout._id!==action.payload)
            localStorage.setItem("userWorkouts",JSON.stringify(state.userWorkouts));
        },
        updateWorkout:(state,action)=> {
            const index=state.userWorkouts.findIndex((workout)=>workout._id===action.payload._id)
            state.userWorkouts[index]=action.payload
            localStorage.setItem("userWorkouts",JSON.stringify(state.userWorkouts));
        },
        clearWorkouts:(state)=> {
            state.userWorkouts=[]
            localStorage.removeItem("userWorkouts");
        }

    }
});

export const {addWorkout,removeWorkout,updateWorkout,setWorkouts,clearWorkouts}=workoutSlice.actions;
export default workoutSlice.reducer;