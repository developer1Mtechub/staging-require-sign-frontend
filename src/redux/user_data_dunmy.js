
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {  postHeaders } from '../apis/api';

// Thunks and slice setup
export const getUser = createAsyncThunk(
  'user/getUserDetails',
  async ({ user_id, token }, { rejectWithValue }) => {
    if (!token) {
      return rejectWithValue('Token is missing');
    }

    try {
      console.log("REDUX")

      console.log(token)
      console.log(user_id)

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      const postData = { user_id };
      const response = await postHeaders('user/getUserById', postData, headers);
console.log(response)
      if (response?.result?.length > 0) {
        const user = response.result[0];

        // if (user.company_id) {
        //   const companyDetails = await post('company/get_company', {
        //     company_id: user.company_id,
        //   });

        //   return {
        //     ...user,
        //     company_logo: companyDetails.data.company_logo || null,
        //   };
        // }

        return user;
      } else {
        return rejectWithValue('User not found');
      }
    } catch (error) {
      console.log("ERROR DUMMY USER ")
      console.error('Error fetching user:', error);
      return rejectWithValue('Error fetching user');
    }
  }
);

const navbarSlice = createSlice({
  name: 'navbar',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = navbarSlice.actions;
export default navbarSlice.reducer;
