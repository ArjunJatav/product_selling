import { setAuthToken, setUser } from "../Redux/UserSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "./NavigationService";

export const tokenClear = async (dispatch: any) => {
  globalThis.token = "";
  dispatch(setAuthToken(null));
  dispatch(setUser(""));
  await AsyncStorage.removeItem("userToken");

  navigate("LoginStack"); // Navigate to login screen
};