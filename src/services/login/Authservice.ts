import axios, {AxiosError} from 'axios';
import * as Keychain from 'react-native-keychain';
 
import * as CryptoJS from 'crypto-js';
import API_BASE_URL from '../API_Service';
 
export interface AuthResponse {
  success: boolean;
  data?: {token: string; id: number} | string;
  message?: string;
}
 
const secretkey = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
const encryptPassword = (password: string, secretkey: string) => {
  const iv = CryptoJS.lib.WordArray.random(16); // Generate a random IV (16 bytes for AES)
  const encryptedPassword = CryptoJS.AES.encrypt(
    password,
    CryptoJS.enc.Utf8.parse(secretkey),
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  ).toString();
  return {encryptedPassword, iv: iv.toString(CryptoJS.enc.Base64)};
};
export const handleLoginWithEmail = async (email: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/applicant/applicantLogin`, { email:email });
    if (response.status === 200) {
      const token = response.data.data.jwt;
      const id = response.data.id;

      if (token && id) {
        return { success: true, data: { token, id } };
      }
      return { success: false, message: 'Invalid response data' };
    }
    return { success: false, message: 'Login failed' };
  } catch (error) {
    console.error('Error occurred during login:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('API Error:', error.response.data);
      return { success: false, message: error.response.data };
    } else {
      return { success: false, message: 'Unknown error' };
    }
  }
};

export const handleLogin = async (
  loginemail: string,
  loginpassword: string,
): Promise<AuthResponse> => {
  try {
    const {encryptedPassword, iv} = encryptPassword(loginpassword, secretkey);
 
    console.log('Encrypted Password:', encryptedPassword);
    const response = await axios.post(
      `${API_BASE_URL}/applicant/applicantLogin`,
      {
        email: loginemail.toLowerCase(),
        password: encryptedPassword,
        iv: iv,
      }
 
    );
 
    if (response.status === 200) {
      console.log(response);
      const token = response.data.data.jwt;
      const id = response.data.id;
 
      if (token && id) {
        return {success: true, data: {token, id}};
      }
      return {success: true, data: response.data};
    } else {
      return {success: false, message: 'Login failed'};
    }
  } catch (error) {
    console.error('Error occurred:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('API Error:', error.response.data);
      return {success: false, message: error.response.data};
    } else {
      return {success: false, message: 'unknown error'};
    }
  }
};
export const handleSignup = async (
  signupEmail: string,
  signupNumber: string,
): Promise<AuthResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/applicant/applicantsendotp`,
      {
        email: signupEmail.toLowerCase(),
        mobilenumber: signupNumber,
      },
    );
 
    if (response.status === 200) {
      return {success: true, data: response.data};
    } else {
      return {success: false, message: response.data};
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {success: false, message: error.response.data};
    } else {
      return {success: false, message: 'unknown error'};
    }
  }
};
 
export const handleOTP = async (
  otp: string,
  signupEmail: string,
  signupName: string,
  signupNumber: string,
  signupPassword: string,
): Promise<AuthResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/applicant/applicantverify-otp`,
      {
        otp: otp,
        email: signupEmail.toLowerCase(),
      },
    );
 
    if (response.status === 200) {
      const registeruser = await axios.post(
        `${API_BASE_URL}/applicant/saveApplicant`,
        {
          name: signupName,
          email: signupEmail,
          mobilenumber: signupNumber,
          password: signupPassword,
        },
      );
 
      if (registeruser.status === 200) {
        return {success: true, data: registeruser.data};
      } else {
        return {success: false, message: registeruser.data};
      }
    } else {
      return {success: false, message: response.data};
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {success: false, message: error.response.data};
    } else {
      return {success: false, message: 'unknown error'};
    }
  }
};