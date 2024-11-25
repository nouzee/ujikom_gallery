import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const LoginUser = createAsyncThunk("user/LoginUser", async(user, thunkAPI) => {
    try {
        const response = await axios.post('http://localhost:5000/api/login', {
            email: user.email,
            password: user.password
        });
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const getMe = createAsyncThunk("user/getMe", async(_, thunkAPI) => {
    try {
        const response = await axios.get('http://localhost:5000/api/me');
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const LogOut = createAsyncThunk("user/LogOut", async() => {
    await axios.delete('http://localhost:5000/api/logout');
});

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        }
    },
    extraReducers:(builder) => {
        builder.addCase(LoginUser.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
        });
        builder.addCase(LoginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.user = action.payload;
        });
        builder.addCase(LoginUser.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload;
            state.user = null;
        });

        // get user login
        builder.addCase(getMe.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        });
        builder.addCase(getMe.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.user = action.payload;
        });
        builder.addCase(getMe.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            state.user = null;
        });

        // Logout
        builder.addCase(LogOut.fulfilled, (state) => {
            state.user = null;
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
        });
    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;