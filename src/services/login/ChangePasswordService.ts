import axios, { AxiosError } from 'axios';
import * as CryptoJS from 'crypto-js';
import * as Keychain from 'react-native-keychain';
import { showToast } from './ToastService';
import apiClient from './ApiClient';
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
      const response = await apiClient.post(
        `/applicant/authenticateUsers/${userId}`,
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

        showToast('success','Password changed successfully');
      } else {
        showToast('error',response.data.message || 'Old password is incorrect');
      }

    } else {
      showToast('error','Retry after some time');
    }

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errResponse = error as AxiosError;
      if (errResponse.response) {
        if (errResponse.response.status === 400) {
          showToast('error','Old password is incorrect');
        } else {
          showToast('error','An unexpected error occurred');
        }
      }
    } else {
      showToast('error', 'An unexpected error occurred');
    }
  }
};

export const checkPasswordsMatch = (oldPassword: string, newPassword: string) => {
  if (oldPassword === newPassword && oldPassword) {
    showToast('error', 'Old password and new password cannot be the same');
    return false;
  }
  return true;
};
