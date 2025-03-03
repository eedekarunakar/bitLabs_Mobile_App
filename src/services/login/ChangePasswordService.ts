import axios, { AxiosError } from 'axios';
import * as CryptoJS from 'crypto-js';
import * as Keychain from 'react-native-keychain';
import {API_BASE_URL} from '@env';
import Toast from 'react-native-toast-message';

const secretKey = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';

export const encryptPassword = (password: string, secretkey: string) => {
  const iv = CryptoJS.lib.WordArray.random(16); // Generate a random IV (16 bytes for AES)
  const encryptedPassword = CryptoJS.AES.encrypt(
    password,
    CryptoJS.enc.Utf8.parse(secretkey),
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString();
  return { encryptedPassword, iv: iv.toString(CryptoJS.enc.Base64) };
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string,
  userToken: string,
  userId: string,
  setMessage: (msg: string) => void,
) => {
  const oldPasswordEncrypt = encryptPassword(oldPassword, secretKey);
  const newPasswordEncrypt = encryptPassword(newPassword, secretKey);

  const formData = {
    oldPassword: oldPasswordEncrypt.encryptedPassword,
    newPassword: newPasswordEncrypt.encryptedPassword,
    ivOld: oldPasswordEncrypt.iv,
    ivNew: newPasswordEncrypt.iv,
  };

  try {
    const result = await Keychain.getGenericPassword();

    const jwtToken = result ? result.password : null; // Retrieve JWT token from keychain

    if (!jwtToken) {
      const response = await axios.post(
        `${API_BASE_URL}/applicant/authenticateUsers/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (
        response.status === 200 &&
        response.data === 'Password updated and stored'
      ) {
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: '',
          text2: 'Password changed successfully',

          visibilityTime: 5000,
        });
      } else {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: '',
          text2: response.data.message || 'Old password is incorrect',
          visibilityTime: 5000,
        });
      }

    } else {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: '',
        text2: 'Retry after some time',
        visibilityTime: 5000,
      });
    }

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errResponse = error as AxiosError;
      if (errResponse.response) {
        if (errResponse.response.status === 400) {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: '',
            text2: 'Old password is incorrect',
            visibilityTime: 5000,
          });
        } else {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: '',
            text2: 'An unexpected error occurred',
            visibilityTime: 5000,
          });
        }
      }
    } else {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: '',
        text2: 'An unexpected error occurred',
        visibilityTime: 5000,
      });
    }
  }
};

export const checkPasswordsMatch = (oldPassword: string, newPassword: string) => {
  if (oldPassword === newPassword && oldPassword) {
    Toast.show({
      type: 'error',
      position: 'bottom',
      text1: '',
      text2: 'Old password and new password cannot be the same',
      visibilityTime: 5000,
    });
    return false;
  }
  return true;
};
