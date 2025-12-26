import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://hotel-booking-main-z6lo.onrender.com/api/room',
  withCredentials: true,
});

// --- Thunks ---

// 1. Create Room (FormData handle korbe)
export const createRoom = createAsyncThunk(
  'room/createRoom',
  async (roomData, { rejectWithValue }) => {
    try {
      // Backend-e upload.array ("images") use kora hoyeche, tai headers automatic handle hobe
      const { data } = await API.post('/', roomData);
      if (!data.success) return rejectWithValue(data.message);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create room');
    }
  }
);

// 2. Get All Available Rooms
export const getAllRooms = createAsyncThunk('room/getAllRooms', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/');
    if (!data.success) return rejectWithValue(data.message);
    return data.rooms;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch rooms');
  }
});

// 3. Get Owner Specific Rooms
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
      return { roomId }; // Backend successful hole shudhu ID pathiye local state update korbo
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

const roomSlice = createSlice({
  name: 'room',
  initialState: {
    rooms: [], // General users er jonno
    ownerRooms: [], // Dashboard er jonno
    loading: false,
    success: false, // Room create successful check korar jonno
    error: null,
  },
  reducers: {
    clearRoomError: (state) => {
      state.error = null;
    },
    resetRoomStatus: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE ROOM
      .addCase(createRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state) => {
        state.loading = false;
        state.success = true; // AddRoom component-e toast dekhate sahajyo korbe
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL ROOMS
      .addCase(getAllRooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })

      // GET OWNER ROOMS
      .addCase(getOwnerRooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOwnerRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.ownerRooms = action.payload;
      })

      // TOGGLE AVAILABILITY
      .addCase(toggleRoomAvailability.fulfilled, (state, action) => {
        const index = state.ownerRooms.findIndex((r) => r._id === action.payload.roomId);
        if (index !== -1) {
          state.ownerRooms[index].isAisAvailable = !state.ownerRooms[index].isAisAvailable;
        }
      });
  },
});

export const { clearRoomError, resetRoomStatus } = roomSlice.actions;
export default roomSlice.reducer;
