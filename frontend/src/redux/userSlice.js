import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:'user',
    initialState:{
        user:JSON.parse(localStorage.getItem("user")) || null,
        token:JSON.parse(localStorage.getItem("token")) || null,
        isFetching:false,
        error:false
    },
    reducers:{
        loginStart:(state)=> {
            state.isFetching=true;
            state.error=false;
        },
        loginSuccess:(state,action)=> {
            state.user=action.payload.user;
            state.token=action.payload.token;
            state.isFetching=false;
            state.error=false;
            localStorage.setItem("user",JSON.stringify(action.payload.user));
        },
        loginFailure:(state)=> {
            state.user=null;
            state.token=null;
            state.isFetching=false;
            state.error=true;
        },
        logout:(state)=> {
            state.user=null;
            state.token=null;
            localStorage.removeItem("user");
            localStorage.clear();
        },
        updateUser:(state,action)=> {
            state.user={...state.user,...action.payload}
            localStorage.removeItem("user");
            localStorage.setItem("user",JSON.stringify(state.user));
        }
    }
});

export const {loginStart,loginSuccess,loginFailure,logout,updateUser}=userSlice.actions;
export default userSlice.reducer;