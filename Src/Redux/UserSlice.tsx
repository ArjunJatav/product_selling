import { createSlice } from "@reduxjs/toolkit";

// Define User Type
interface User {
  id: number;
  full_name: string;
  email: string;
  location: number; // 👈 Add location field
  notification: number;
  imageLoc: string;
  phoneNumber: string;
  profileType: string;
  userType: number;
  is_profile_completed: number;
}

// Define the Redux State Type
interface UserState {
  user: User | null;
  authToken: string | null;
}


const initialState: UserState = {
  user: null, 
  authToken: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAuthToken: (state, action) => {
      state.authToken = action.payload;
    },
    updateUserLocation: (state, action) => {
      if (state.user) {
        state.user.location = action.payload; // ✅ Update only the location field
      }
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

// Export actions
export const { setUser,setAuthToken,updateUserLocation, clearUser } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
