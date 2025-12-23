import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from './authApi';

const initialState = {
  user: null,
  isAuthenticated: false,
  searchCities: null,
  isHotelOwner: false,
  hotelReg: false, // Hotel registration modal/section toggle state
  loading: false,
  error: null,
};

// --- Helper Function to Check Role ---
const checkIsOwner = (user) => {
  return user && user.role === 'hotelOwner';
};

// --- Thunks ---

export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/register', formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration Failed');
    }
  }
);

export const loginUser = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/login', userData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login Failed');
  }
});

export const getUser = createAsyncThunk('auth/getUser', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/me');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Session Expired');
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Hotel Registration form open/close korar jonno
    toggleHotelReg: (state) => {
      state.hotelReg = !state.hotelReg;
    },
    // State reset korar jonno
    logoutLocal: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isHotelOwner = false;
      state.searchCities = null;
      state.hotelReg = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const userData = action.payload.user;
        state.loading = false;
        state.user = userData;
        state.isAuthenticated = true;
        state.isHotelOwner = checkIsOwner(userData);
        state.searchCities = userData.recentSearchedCities || null;
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
        const userData = action.payload.user;
        state.loading = false;
        state.user = userData;
        state.isAuthenticated = true;
        state.isHotelOwner = checkIsOwner(userData);
        state.searchCities = userData.recentSearchedCities || null;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET USER
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        const userData = action.payload.user;
        state.loading = false;
        state.user = userData;
        state.isAuthenticated = true;
        state.isHotelOwner = checkIsOwner(userData);
        state.searchCities = userData.recentSearchedCities || null;
      })
      .addCase(getUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isHotelOwner = false;
        state.searchCities = null;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isHotelOwner = false;
        state.searchCities = null;
        state.hotelReg = false; // Logout hole form/modal-o off hobe
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError, logoutLocal, toggleHotelReg } = authSlice.actions;
export default authSlice.reducer;
