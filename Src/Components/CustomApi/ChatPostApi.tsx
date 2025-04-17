import axios from "axios";
import { chatBaseUrl } from "../../Constants/ApiUrls";

export const chatMultipartPostRequest = async (
  url: string,
  body: any,
  extraHeaders = {}
) => {
  try {
    // Define fixed headers
    const defaultHeaders = {
  //    Authorization: `Bearer ${globalThis.token}`, 
      "Content-Type": "multipart/form-data",
    };

    // Merge default headers with extra headers (if any)
    const headers = { ...defaultHeaders, ...extraHeaders };


    // Make the POST request
    const exactUrl = chatBaseUrl + url;
    const response = await axios.post(exactUrl, body, { headers });

    return response.data; // Assuming the API returns data in response.data
  } catch (error) {
    console.error("POST Request Error:", error);
    throw error; // Handle this error in the calling function
  }
};

export const chatPostRequest = async (
  url: string,
  body: any,
  extraHeaders = {}
) => {
  try {
    // Define fixed headers
    const defaultHeaders = {
      "Content-Type": "application/json",
    };

    // Merge default headers with extra headers (if any)
    const headers = { ...defaultHeaders, ...extraHeaders };


    // Make the POST request
    const exactUrl = chatBaseUrl + url;
    const response = await axios.post(exactUrl, body, { headers });

    return response.data; // Assuming the API returns data in response.data
  } catch (error) {
    console.error("POST Request Error:", error);
    throw error; // Handle this error in the calling function
  }
}