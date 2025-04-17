import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Friend {
  id: number;
  full_name: string;
  avatar: string;
  status: string;
}

interface FriendState {
  friend: Friend | null;
}

const initialState: FriendState = {
  friend: null,
};

const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {
    setFriend: (state, action: PayloadAction<Friend>) => {
      state.friend = action.payload;
    },
    resetFriend: (state) => {
      state.friend = null;
    },
  },
});

export const { setFriend, resetFriend } = friendSlice.actions;
export default friendSlice.reducer;
