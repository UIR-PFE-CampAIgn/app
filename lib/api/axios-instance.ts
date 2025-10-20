import axios from "axios";
import { createClient } from "@/lib/supabase/client";
const baseURL = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:3000";

export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// ============================================
// REQUEST INTERCEPTOR - Add JWT Token
// ============================================
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const supabase = createClient();
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) console.error("Error getting session:", error);

      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (err) {
      console.error("Failed to attach auth token:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// RESPONSE INTERCEPTOR - Error Handling
// ============================================
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || "An error occurred";

      if (status === 401) {
        console.warn("Unauthorized - redirecting to login");
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
      }

      return Promise.reject({ status, message });
    } else if (error.request) {
      return Promise.reject({ message: "No response from server" });
    } else {
      return Promise.reject({ message: "Request setup failed" });
    }
  }
);
