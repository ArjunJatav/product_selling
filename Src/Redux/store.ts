import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist/es/constants";
import userInfoDataReducer from "./SocialLoginSlice"; 
import fcmToken from "./fcmToken";
const persistConfig = {
  key: "root",
  storage: AsyncStorage, 
};

const rootReducer = combineReducers({
  user: persistReducer(persistConfig, userReducer), 
  userInfoData: persistReducer(persistConfig, userInfoDataReducer),
fcmToken: persistReducer(persistConfig,fcmToken)
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
