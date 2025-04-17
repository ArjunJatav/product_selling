import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface userInfoDataState {
  UserInfo: Record<string, any> | null;
  provider: 'google' | 'apple' | 'facebook' | null;
}

const initialState: userInfoDataState = {
  UserInfo: null,
  provider: null,
};

const userInfoDataSlice = createSlice({
  name: 'userInfoData',
  initialState,
  reducers: {
    setUserInfo: (
      state,
      action: PayloadAction<{
        user: Record<string, any>;
        provider: 'google' | 'apple' | 'facebook';
      }>
    ) => {
      state.UserInfo = action.payload.user;
      state.provider = action.payload.provider;
    },
    removeUserInfo: (state) => {
      state.UserInfo = null;
      state.provider = null;
    },
  },
});

export const { setUserInfo, removeUserInfo } = userInfoDataSlice.actions;
export default userInfoDataSlice.reducer;
