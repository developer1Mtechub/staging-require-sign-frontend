// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { post } from '../apis/api';

// Async thunk to log in user
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }) => {
    // Replace with your API endpoint
    const response = await post('user/login', { email, password });
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    user_type: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.user_type = null;
      localStorage.removeItem('user_data');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.data;  // Assuming user details are in data field
        state.token = action.payload.token;
        state.user_type = action.payload.user_type;
        localStorage.setItem(
          '@UserLoginRS',
          JSON.stringify({
            token: action.payload.token,
            user_type: action.payload.user_type,
            password: action.payload.password,
            user: action.payload.data,  // Store user details
          })
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
