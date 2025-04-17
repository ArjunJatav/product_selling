import axios from "axios";
import { chatBaseUrl } from "../../Constants/ApiUrls";

export const chatGetRequest = async (url: string, extraHeaders = {}) => {
  try {
    // Define fixed headers
    const defaultHeaders = {
      Authorization: `Bearer ${globalThis.token}`, // Fixed Token Header
      "Content-Type": "application/json", // Fixed Content-Type
    };

    // Merge default headers with extra headers (if any)
    const headers = { ...defaultHeaders, ...extraHeaders };

    // Make the GET request
    const exactUrl = chatBaseUrl + url
    const response = await axios.get(exactUrl, { headers });
   
    return response.data; // Assuming the API returns data in response.data
  } catch (error) {
    console.error("GET Request Error:", error);
    throw error; // Handle this error in the calling function
  }
};
