import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import axios, { AxiosError } from 'axios';
import * as CryptoJS from 'crypto-js';
import { useAuth } from '../../context/Authcontext';
import * as Keychain from 'react-native-keychain';
const apiUrl = 'https://g23jza8mtp.ap-south-1.awsapprunner.com';
const secretKey = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
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
  return { encryptedPassword, iv: iv.toString(CryptoJS.enc.Base64) };
};
const ChangePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [reEnterPassword, setReEnterPassword] = useState<string>('');
  const [message, setMessage] = useState<string | null>('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showReEnterPassword, setShowReEnterPassword] = useState(false);
  const { userId } = useAuth();
  const handleChangePassword = async (): Promise<void> => {
    if (newPassword !== reEnterPassword) {
      setMessage('New password and re-entered password must match');
      return;
    }
    if (!oldPassword || !newPassword || !reEnterPassword) {
      setMessage('All fields are required');
      return;
    }
    if(oldPassword ==newPassword) {
        setMessage("Old Password and new password cannot be same");
        return;
    }
  
    // Validate password complexity
    const passwordValidationRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordValidationRegex.test(newPassword)) {
      setMessage('Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.');
      return;
    }
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
      if (jwtToken) {
        const response = await axios.post(
          `${apiUrl}/applicant/authenticateUsers/${userId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        if (response.status === 200 && response.data === 'Password updated and stored') {
          setMessage('Password changed successfully');
        } else {
          setMessage(response.data.message || 'Old password is not correct');
        }
      } else {
        setMessage('No JWT token found in keychain');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errResponse = error as AxiosError;
        if (errResponse.response) {
        if (errResponse.response.status === 400) {
          setMessage('Old password is incorrect'); // Handle specific "incorrect old password" error
        } 
        else if (errResponse.response && typeof errResponse.response.data === 'string') {
          setMessage(errResponse.response.data);
        } else {
          setMessage('Unknown error');
        }
        }
      } else {
        setMessage('Unknown error');
      }
    }
  };
  const renderPasswordField = (
    label: string,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    isPasswordVisible: boolean,
    togglePasswordVisibility: () => void
  ) => (
    <View style={styles.labelContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          secureTextEntry={!isPasswordVisible}
          value={value}
          onChangeText={setValue}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Image
            source={
              isPasswordVisible
                ? require('../../assests/LandingPage/openeye.png') // Replace with your open eye image path
                : require('../../assests/LandingPage/closedeye.png') // Replace with your closed eye image path
            }
            style={styles.eyeImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      
      <Text style={styles.header}>Change Password</Text>
      {renderPasswordField(
        'Old Password*',
        oldPassword,
        setOldPassword,
        showOldPassword,
        () => setShowOldPassword(!showOldPassword)
      )}
      {renderPasswordField(
        'New Password*',
        newPassword,
        setNewPassword,
        showNewPassword,
        () => setShowNewPassword(!showNewPassword)
      )}
      {renderPasswordField(
        'Re-enter Password*',
        reEnterPassword,
        setReEnterPassword,
        showReEnterPassword,
        () => setShowReEnterPassword(!showReEnterPassword)
      )}
    {message ? (
      <Text style={[styles.message, message === 'Password changed successfully' ? styles.successMessage : styles.errorMessage]}>
    {message} </Text>) : null}
      <TouchableOpacity style={styles.footerButton} onPress={handleChangePassword}>
        <Text style={styles.footerButtonText}>Change Password</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  labelContainer: {
    marginVertical: 10,
  },
  label: {
    marginBottom: 5,
    color: '#000',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    height: 56,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    color: '#000',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 5,
  },
  eyeImage: {
    width: 12,
    height: 12,
  },
  message: {
    color: 'red',
    marginBottom: 8,
  },
  successMessage: {
    color: 'green',
  },
  errorMessage: {
    color: 'red',
  },
  
  footerButton: {
    position: 'absolute',
    width: 370,
    height: 47,
    bottom: 20,
    left: 16,
    borderRadius: 8,
    backgroundColor: '#F97316',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
export default ChangePasswordScreen;