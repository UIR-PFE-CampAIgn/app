import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:3000";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data?.message || "An error occurred");
    } else if (error.request) {
      // Request made but no response
      throw new Error("No response from server");
    } else {
      // Error setting up request
      throw new Error("Request failed");
    }
  }
);
