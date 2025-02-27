import axios from 'axios';
import { Alert } from 'react-native';
import API_BASE_URL from '../API_Service';

let logoutHandler: (() => void) | null = null;
let sessionExpiredAlertActive = false;

let interceptorId: number | null = null; // Store interceptor ID
let lastNoInternetAlertTime = 0; // timestamp in milliseconds


// Function to set logout handler from AuthContext
export const setLogoutHandler = (logoutFn: () => void) => {
  logoutHandler = logoutFn;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle errors
const responseInterceptor = async (error: any) => {
 // Handle no internet / network errors:
 if (!error.response) {
  const now = Date.now();
  // Check if 1 minutes have passed since the last no internet alert
  if (now - lastNoInternetAlertTime > 1 * 60 * 1000) {
    lastNoInternetAlertTime = now;
    Alert.alert(
      'No Internet Connection',
      'Please check your internet connection and try again.',
      [{ text: 'OK' }]
    );
  }
  return Promise.reject(error);
}

  if (error.response?.status === 401 || error.response?.status === 403) {
    if (!sessionExpiredAlertActive) {
      sessionExpiredAlertActive = true; // Activate the flag so it won't trigger again immediately
      console.log('Token expired! Logging out...');

      if (logoutHandler) {
        logoutHandler(); // Log out user
      }

      Alert.alert(
        'Session Expired',
        'Your session has expired. Please log in again.',
        [{
          text: 'OK',
          onPress: () => {
            sessionExpiredAlertActive = false; // Reset flag after user acknowledges alert
          },
        }]

      );
    }
  }

  return Promise.reject(error);
};

// Add interceptor and store ID
interceptorId = apiClient.interceptors.response.use(
  response => response,
  responseInterceptor
);

// Function to remove interceptors when logging out
export const removeInterceptors = () => {
  if (interceptorId !== null) {
    apiClient.interceptors.response.eject(interceptorId);
    interceptorId = null; // Reset ID
  }
};

export default apiClient;
