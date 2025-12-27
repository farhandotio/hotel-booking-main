import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://hotel-booking-main-z6lo.onrender.com/api/room',
  withCredentials: true,
});

// --- Thunks ---

// 1. Create Room
export const createRoom = createAsyncThunk(
  'room/createRoom',
  async (roomData, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/', roomData);
      if (!data.success) return rejectWithValue(data.message);
      return data;
    } catch (err) {
      // Backend crash ba network error handle korbe
      return rejectWithValue(err.response?.data?.message || 'Failed to create room');
    }
  }
);

// 2. Get All Available Rooms (For Home/Search Page)
export const getAllRooms = createAsyncThunk('room/getAllRooms', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/');
    if (!data.success) return rejectWithValue(data.message);
    return data.rooms;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch rooms');
  }
});

// 3. Get Owner Specific Rooms (For Dashboard)
export const getOwnerRooms = createAsyncThunk(
  'room/getOwnerRooms',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/owner');
      if (!data.success) return rejectWithValue(data.message);
      return data.rooms;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch owner rooms');
    }
  }
);

// 4. Toggle Room Availability
export const toggleRoomAvailability = createAsyncThunk(
  'room/toggleRoomAvailability',
  async (roomId, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/toggle-availability', { roomId });
      if (!data.success) return rejectWithValue(data.message);
      return { roomId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

const roomSlice = createSlice({
  name: 'room',
  initialState: {
    rooms: [], // General available rooms
    ownerRooms: [], // Owner specific rooms for dashboard
    loading: false,
    success: false, // Room create successful check
    error: null,
  },
  reducers: {
    clearRoomError: (state) => {
      state.error = null;
    },
    resetRoomStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- CREATE ROOM ---
      .addCase(createRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createRoom.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // --- GET ALL ROOMS ---
      .addCase(getAllRooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(getAllRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- GET OWNER ROOMS ---
      .addCase(getOwnerRooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOwnerRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.ownerRooms = action.payload;
      })
      .addCase(getOwnerRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- TOGGLE AVAILABILITY ---
      .addCase(toggleRoomAvailability.fulfilled, (state, action) => {
        const { roomId } = action.payload;

        // Update in general rooms list
        const roomIndex = state.rooms.findIndex((r) => r._id === roomId);
        if (roomIndex !== -1) {
          state.rooms[roomIndex].isAvailable = !state.rooms[roomIndex].isAvailable;
        }

        // Update in owner dashboard list
        const ownerIndex = state.ownerRooms.findIndex((r) => r._id === roomId);
        if (ownerIndex !== -1) {
          state.ownerRooms[ownerIndex].isAvailable = !state.ownerRooms[ownerIndex].isAvailable;
        }
      });
  },
});

export const { clearRoomError, resetRoomStatus } = roomSlice.actions;
export default roomSlice.reducer;
