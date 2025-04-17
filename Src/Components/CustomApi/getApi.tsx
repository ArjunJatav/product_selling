import axios from "axios";
import { baseUrlV1 } from "../../Constants/ApiUrls";

const apiClient = axios.create({
    baseURL: baseUrlV1,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  
 export const getRequest = async (endpoint: string, params: any = {}) => {
  try {
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};
  
export const authenticatedGetRequest = async (endpoint: any, params = {}) => {
  try {
    const token = globalThis.token; // Ensure the latest token is used
    const response = await axios.get(`${baseUrlV1}${endpoint}`, {
      params,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Set token dynamically
      },
    });

    return response.data;
  } catch (error) {
    console.log("Authenticated GET request error:", error);
    throw error;
  }
};