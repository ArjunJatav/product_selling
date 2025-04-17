export const getStateNames = async (
  url: string
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `HTTP Error: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    if (!data || typeof data !== "object" || !data.data) {
      throw new Error("Invalid API response format");
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error: any) {
    let errorMessage = "An unknown error occurred";

    if (error.name === "TypeError" && error.message.includes("fetch")) {
      errorMessage = "Network error: Please check your internet connection";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
};

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const createCardApiCalling = async (
  url: string,
  formData: FormData
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    // Retrieve the token from AsyncStorage
    const rawToken = await AsyncStorage.getItem("userToken");
    const token = rawToken ? JSON.parse(rawToken) : null;

    // API request with Axios
    const response = await axios.post(url, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "multipart/form-data",
      },
    });

    // Check if API response has data
    if (
      !response.data ||
      typeof response.data !== "object" ||
      !response.data.data
    ) {
      throw new Error("Invalid API response format");
    }

    return { success: true, data: response.data.data };
  } catch (error: any) {
    let errorMessage = "An unknown error occurred";

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        errorMessage = "Network error: Please check your internet connection";
      } else {
        errorMessage = `HTTP Error: ${error.response.status} - ${error.response.statusText}`;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
};

export const getCardData = async (
  url: string,
  id: number
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const rawToken = await AsyncStorage.getItem("userToken");
    const token = rawToken ? JSON.parse(rawToken) : null;

    // Properly encode the ID in the URL
    const fullUrl = `${url}?id=${encodeURIComponent(id)}`;

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `HTTP Error: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "An unknown error occurred",
    };
  }
};
