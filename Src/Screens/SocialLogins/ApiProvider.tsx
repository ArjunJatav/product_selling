import axios from "axios";

export const socialLoginApi = async (
  url: string,
  formData: FormData
): Promise<{ success: boolean; data?: any; error?: string }> => {
    
  try {
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
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
