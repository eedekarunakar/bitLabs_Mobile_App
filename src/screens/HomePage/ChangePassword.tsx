import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import axios, { AxiosError } from 'axios';
import * as CryptoJS from 'crypto-js';
import { useAuth } from '../../context/Authcontext';
import * as Keychain from 'react-native-keychain';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';
import API_BASE_URL from '../../services/API_Service';
import Toast from 'react-native-toast-message';
 
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
  const [oldMessage, setOldMessage] = useState<string | null>('');
  const [newMessage, setNewMessage] = useState<string | null>('');
  const [reEnterMessage, setReEnterMessage] = useState<string | null>('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showReEnterPassword, setShowReEnterPassword] = useState(false);
  const [visibleField, setVisibleField] = useState<string | null>(null);
  const { userToken, userId } = useAuth();
  const navigation = useNavigation();
 
  const handleBackButton = (): void => {
    navigation.goBack();
  };
 
  const handleKeyboardDismiss = () => {
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowReEnterPassword(false); // Hide all password fields when dismissing the keyboard
    Keyboard.dismiss();
  };
 
  const handleFocus = (field: string) => {
    if (field === 'old') {
      setShowNewPassword(false);
      setShowReEnterPassword(false);
    } else if (field === 'new') {
      setShowOldPassword(false);
      setShowReEnterPassword(false);
    } else if (field === 'reEnter') {
      setShowOldPassword(false);
      setShowNewPassword(false);
    }
  };
 
  const validatePassword = (password: string, type: 'old' | 'new' | 'reEnter') => {
    const passwordValidationRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
 
    if (!password) {
      if (type === 'old') setOldMessage('Old Password is required');
      if (type === 'new') setNewMessage('New Password is required');
      if (type === 'reEnter') setReEnterMessage('Confirm Password is required');
    } else {
      if (type === 'new' && !passwordValidationRegex.test(password)) {
        setNewMessage(
          'New password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, one special character, and no spaces.'
        );
      } else {
        if (type === 'old') setOldMessage(null);
        if (type === 'new') setNewMessage(null);
      }
    }
 
    if (type === 'reEnter' && password !== newPassword) {
      setReEnterMessage('New password and re-entered password must match');
    } else {
      if (type === 'reEnter') setReEnterMessage(null);
    }
  };
 
  const handleChangePassword = async (): Promise<void> => {
    setOldMessage(null);
    setNewMessage(null);
    setReEnterMessage(null);
    setMessage(null);
 
    // Ensure all fields are filled
    if (!oldPassword || !newPassword || !reEnterPassword) {
      if (!oldPassword) setOldMessage('Old Password is required');
      if (!newPassword) setNewMessage('New Password is required');
      if (!reEnterPassword) setReEnterMessage('Confirm Password is required');
      return;
    }
 
    // Check if old and new passwords are the same
    if (oldPassword === newPassword) {
      setMessage('Old Password and New Password cannot be the same');
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
            text1: 'Password Changed Successfully',
            text2: 'Your password has been updated.',
            visibilityTime: 5000,
          });
        } else {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Error',
            text2: response.data.message || 'Old password is incorrect',
            visibilityTime: 5000,
          });
        }
      } else {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error',
          text2: 'JWT Token not found',
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
              text1: 'Error',
              text2: 'Old password is incorrect',
              visibilityTime: 5000,
            });
          } else {
            Toast.show({
              type: 'error',
              position: 'bottom',
              text1: 'Unknown Error',
              text2: 'An unexpected error occurred',
              visibilityTime: 5000,
            });
          }
        }
      } else {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Unknown Error',
          text2: 'An unexpected error occurred',
          visibilityTime: 5000,
        });
      }
    }
  };
 
  const renderPasswordField = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    field: 'old' | 'new' | 'reEnter',
    placeholder: string,
    showPassword: boolean,
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>,
  ) => (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        // secureTextEntry={visibleField !== field}
        secureTextEntry={!showPassword}
       
        value={value}
        onChangeText={(text) => {
          setValue(text);
          validatePassword(text, field); // Add validation here
        }}
        onFocus={() => handleFocus(field)}
        placeholder={placeholder}
        placeholderTextColor="#A9A9A9"
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
        <Image
          source={
            !showPassword
              ? require('../../assests/LandingPage/closedeye.png')
              : require('../../assests/LandingPage/openeye.png')
          }
          style={styles.eyeImage}
        />
      </TouchableOpacity>
    </View>
  );
 
  return (
    <TouchableWithoutFeedback onPress={handleKeyboardDismiss}>
      <View style={styles.container}>
        <View style={styles.navbar}>
          <Image
            source={require('../../assests/Images/logo.png')}
            style={styles.logo}
          />
        </View>
        <View style={styles.separator} />
 
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleBackButton} style={styles.backButton}>
            <Icon name="left" size={24} color="#495057" />
          </TouchableOpacity>
          <Text style={styles.title}>Change Password</Text>
        </View>
        <View style={styles.separator} />
 
        {renderPasswordField(
          oldPassword,
          setOldPassword,
          'old',
          'Type Old Password',
          showOldPassword,
        setShowOldPassword,
        )}
        {oldMessage ? (
          <Text style={[styles.message, oldMessage === 'Password changed successfully' ? styles.successMessage : styles.errorMessage]}>
            {oldMessage}
          </Text>
        ) : null}
          {renderPasswordField(
          newPassword,
          setNewPassword,
          'new',
          'Enter New Password',
          showNewPassword,
        setShowNewPassword,
        )}
        {newMessage ? (
          <Text style={[styles.message, newMessage === 'Password changed successfully' ? styles.successMessage : styles.errorMessage]}>
            {newMessage}
          </Text>
        ) : null}
 
        {renderPasswordField(
          reEnterPassword,
          setReEnterPassword,
          'reEnter',
          'Confirm New Password',
          showReEnterPassword,
        setShowReEnterPassword
        )}
        {reEnterMessage ? (
          <Text style={[styles.message, reEnterMessage === 'Password changed successfully' ? styles.successMessage : styles.errorMessage]}>
            {reEnterMessage}
          </Text>
        ) : null}
 
        {message ? (
          <Text style={[styles.message, message === 'Password changed successfully' ? styles.successMessage : styles.errorMessage]}>
            {message}
          </Text>
        ) : null}
 
        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.footerbackButton} onPress={handleBackButton}>
            <Text style={styles.footerbackButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={handleChangePassword}>
            <LinearGradient
              colors={['#F97316', '#FAA729']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.button, styles.applyButtonGradient]}
            >
              <Text style={styles.footerButtonText}>Save</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
 
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
   
    padding:2,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginTop:20,
    fontSize: 22,
    marginBottom: 16,
    textAlign: 'left', // Align text to the left
    fontFamily: 'JakartaSans-Bold', // Assuming you have Jakarta Sans Bold
    color: '#000',
    fontWeight: 'bold',
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
    borderRadius: 4,
    height: 52,
    paddingHorizontal: 10,
    marginBottom:15,
    marginTop:15,
    margin:15,
  },
  input: {
    flex: 1,
    color: '#000',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
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
    fontFamily: 'PlusJakartaSans-Medium',
  },
  successMessage: {
    color: 'green',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  errorMessage: {
    color: 'red',
    marginLeft: 20,
    fontFamily: 'PlusJakartaSans-Medium',
  },
 
  footerButton: {
    width: '35%',
    height: 47,
    bottom: 20,
    borderRadius: 8,
    marginRight:50,
 
   
   
  },
  footerbackButton: {
    width: '45%',
    height: 47,
    bottom: 20,
    left: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth:0.96,
    borderColor:'#F46F16',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  footerbackButtonText: {
    color: '#F46F16',
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  footerButtonBack: {
    backgroundColor: '#007BFF',
  },
   
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
 
    position: 'absolute',
    width: '100%',
    bottom: 20,
    margin:1,
  },
  navbar: {
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    marginTop: 10,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
   
  },
  separator: {
    height: 1,
    backgroundColor: '#D3D3D3',
    width: '100%',
    marginTop: 8,
  },
  applyButtonGradient: {
    borderRadius: 10,
    flex:1,
    width:'125%'
  },
  button: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderColor: '#F97316'
  },
  headerContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: 50,
    backgroundColor:'#FFF'
  },
  headerImage: {
    width: 20, // Adjust size as needed
    height: 20,
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#000',
  },
 
  backButton: {
    position: 'absolute',
    left: 15,
  },
  title: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#495057',
    lineHeight:25,
    marginLeft:50
  },
});
 
export default ChangePasswordScreen;