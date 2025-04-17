import axios from "axios";
import { baseUrlV1 } from "../../Constants/ApiUrls";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "../CustomToast/Action";
import { tokenClear } from "../TokenClearFunction";

// 🔹 Base API Client (No Auth)
const apiClient = axios.create({
  baseURL: baseUrlV1,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Function to create Authenticated API Client (Sets Token Dynamically)
const apiClientWithToken = async () => {
  const token =
    globalThis.token || (await AsyncStorage.getItem("userToken")); // Get latest token
console.log("token >>>",token)

  return axios.create({
    baseURL: baseUrlV1,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};



// 🔹 Axios Interceptor to Ensure Every Request Has a Token
apiClient.interceptors.request.use(async (config) => {
  const token = globalThis.token || (await AsyncStorage.getItem("userToken"));


  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ **POST Request (No Auth)**
export const postRequest = async (endpoint: string, data: any) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("POST request error:", error);
    throw error;
  }
};

// ✅ **POST Request (With Auth)**
export const postRequestWithToken = async (endpoint: string, data: any,dispatch : any) => {

  try {
 
    const client = await apiClientWithToken(); // Get client with latest token
    const response = await client.post(endpoint, data);
    
    if (response.data.status === "error") {
   
      throw new Error(response.data.message || "Something went wrong!");
    }
  
    return response.data;
  } catch (error) {
    console.log("in catch::",error.response)
  //  console.error("POST request error:", error);
    if (error.response?.status === 401) {
      showToast("Session expired. Please log in again.");
      
   tokenClear(dispatch)
      // Optionally, you can log the user out or redirect to the login page
    }else{
      throw error;
    }
   
  }
};

// ✅ **Multipart POST Request**
export const postMultipartRequest = async (endpoint: string, formData: any) => {
  try {
    const token = globalThis.token || (await AsyncStorage.getItem("userToken"));
    

    console.log("Final token being sent >>>", token);
console.log("endpoint",endpoint)
console.log("foorm dat ::",formData)
    const response = await axios.post(`${baseUrlV1}${endpoint}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // Attach correctly
      },
    });

    if (response.data.status === "error") {
      throw new Error(response.data.message || "Something went wrong!");
    }

    return response.data;
  } catch (error) {
    console.error("Multipart POST request error:", error);
    throw error;
  }
};
