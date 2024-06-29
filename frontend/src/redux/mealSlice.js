import { createSlice } from "@reduxjs/toolkit";

const mealSlice = createSlice({
    name:'meals',
    initialState:{
        userFoods:JSON.parse(localStorage.getItem("userFoods")) || [],
    },
    reducers:{
        setMeals:(state,action)=> {
            state.userFoods=action.payload
            localStorage.setItem("userFoods",JSON.stringify(state.userFoods));
        },
        addMeal:(state,action)=> {
            state.userFoods=[...state.userFoods,action.payload]
            localStorage.setItem("userFoods",JSON.stringify(state.userFoods));
        },
        removeMeal:(state,action)=> {
            state.userFoods=state.userFoods.filter((meal)=>meal._id!==action.payload)
            localStorage.setItem("userFoods",JSON.stringify(state.userFoods));
        },
        updateMeal:(state,action)=> {
            const index=state.userFoods.findIndex((meal)=>meal._id===action.payload._id)
            state.userFoods[index]=action.payload
            localStorage.setItem("userFoods",JSON.stringify(state.userFoods));
        },
        clearMeals:(state)=> {
            state.userFoods=[]
            localStorage.removeItem("userFoods");
        }
    }
});

export const {addMeal,removeMeal,updateMeal,setMeals,clearMeals}=mealSlice.actions;
export default mealSlice.reducer;