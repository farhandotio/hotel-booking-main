import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://hotel-booking-main-z6lo.onrender.com/api/hotel',
  withCredentials: true,
});

// --- Thunk for Hotel Registration ---
export const registerHotel = createAsyncThunk(
  'hotel/registerHotel',
  async (hotelData, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/register', hotelData); // Route-ti ensure hoye nin

      // Backend logic: success spelling check (apnar code e 'succes' chilo)
      if (data.succes === false || data.success === false) {
        return rejectWithValue(data.message);
      }

      return data; // success message ebong hotel data thakle action.payload-e jabe
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Hotel Registration Failed');
    }
  }
);

const hotelSlice = createSlice({
  name: 'hotel',
  initialState: {
    hotelInfo: null, // State name 'hotelInfo' dile aro clear hoy
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    clearHotelError: (state) => {
      state.error = null;
    },
    resetHotelStatus: (state) => {
      state.success = false;
      state.error = null;
    },
    // Manual logout hole hotel state clean korar jonno
    clearHotelState: (state) => {
      state.hotelInfo = null;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerHotel.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        // Backend jodi 'hotel' object pathay tobe set korbe
        state.hotelInfo = action.payload.hotel || action.payload;
      })
      .addCase(registerHotel.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { clearHotelError, resetHotelStatus, clearHotelState } = hotelSlice.actions;
export default hotelSlice.reducer;
