import { Dimensions } from "react-native";
import DeviceInfo from "react-native-device-info";



export const windowHeight = Dimensions.get("window").height;
export const windowWidth = Dimensions.get("window").width;

export const Emailreg =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const passwordReg = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])(?=.{8,})/;

export const getDeviceId = async (): Promise<string> => {
  try {
    const id = await DeviceInfo.getUniqueId(); 
    return id;
  } catch (error) {
    console.error("Failed to get device ID:", error);
    return "";
  }
};