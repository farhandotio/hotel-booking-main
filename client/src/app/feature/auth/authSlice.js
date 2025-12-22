import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from './authApi';

const initialState = {
  user: null, // Ekhane user details save thakbe
  isAuthenticated: false, // User login kina seta bujha jabe
  loading: false, // API call chola kalin true thakbe
  error: null, // Error message save thakbe
};

// --- Thunks ---
export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/register', formData);
      return data; // Backend should return { success: true, user: {...} }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration Failed');
    }
  }
);

export const loginUser = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/login', userData);
    return data; // Backend should return { success: true, user: {...} }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login Failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/logout');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Logout Failed');
  }
});

export const getUser = createAsyncThunk('auth/getUser', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/me');
    return data; // Backend should return { success: true, user: {...} }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Session Expired');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Manual logout er jonno
    logoutLocal: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // User data state e set hochhe
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // User data state e set hochhe
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET USER (Page Refresh korle user k phire pawa)
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // User state e thakbe
        state.isAuthenticated = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});

export const { clearError, logoutLocal } = authSlice.actions;
export default authSlice.reducer;
