import { configureStore } from '@reduxjs/toolkit';
import authReducer from './feature/authSlice';
import hotelReducer from './feature/hotelSlice';
import roomReducer from './feature/roomSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hotel: hotelReducer,
    room: roomReducer,
  },
});

export default store;
