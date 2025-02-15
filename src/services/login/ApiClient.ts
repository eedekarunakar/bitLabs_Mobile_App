import axios from 'axios';
import { Alert } from 'react-native';
import {API_BASE_URL} from '@env';

let logoutHandler: (() => void) | null = null; //  Store logout function globally

//  Function to set logout handler from AuthContext
export const setLogoutHandler = (logoutFn: () => void) => {
  logoutHandler = logoutFn;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
//Interceptor to chec internet connection



//  Interceptor to handle expired token
apiClient.interceptors.response.use(
  response => response,

  async (error) => {
     // Check for network error (no response received)
     if (!error.response ) {
      console.log(error.message)
      Alert.alert(
        'No Internet Connection',
        'Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
      // Optionally, you can return here or continue to reject the error.
      return Promise.reject(error);

    }

    if (error.response?.status === 401 || error.response?.status === 403 ) {
      console.log('Token expired! Logging out...');

      if (logoutHandler) {
        logoutHandler(); //  Log out user
      }

      Alert.alert(
        'Session Expired',
        'Your session has expired. Please log in again.',
        [{ text: 'OK' }]
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;
