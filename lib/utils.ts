import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const API_BASE_URL = "https://altcredit.onrender.com";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function handleAPIRequest(
  endpoint: string,
  method = "GET",
  body = {},
  isFile = false
) {
  const token = localStorage.getItem("token");

  if (!token || token.length === 0) {
    return { success: false, message: "Unauthorized: Please log in first." };
  }

  try {
    const headers = { Authorization: `Bearer ${token}` };
    if (!isFile) headers["Content-Type"] = "application/json";

    console.log(`Making API call to: ${endpoint}`);
    console.log(`Using Token: ${token}`);

    const response = await axios({
      method,
      url: `${API_BASE_URL}/${endpoint}`,
      headers,
      data: isFile ? body : JSON.stringify(body),
    });

    return { success: true, data: response.data };
  } catch (err) {
    console.error("API Error:", err.response?.data);
    return {
      success: false,
      message: err.response?.data?.detail || "API Request Failed!",
    };
  }
}
