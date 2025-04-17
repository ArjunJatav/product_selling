import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FcmTokenState {
  fcmToken: string | null;
}

const initialState: FcmTokenState = {
    fcmToken: null,
};

const fcmTokenSlice = createSlice({
  name: 'fcmToken',
  initialState,
  reducers: {
    setFcmToken(state, action: PayloadAction<string>) {
      state.fcmToken = action.payload;
    },
    clearFcmToken(state) {
      state.fcmToken = null;
    },
  },
});

export const { setFcmToken, clearFcmToken } = fcmTokenSlice.actions;
export default fcmTokenSlice.reducer;
