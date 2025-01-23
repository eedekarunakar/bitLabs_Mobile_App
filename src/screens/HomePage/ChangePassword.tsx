import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image,Keyboard, TouchableWithoutFeedback } from 'react-native';
import axios, { AxiosError } from 'axios';
import * as CryptoJS from 'crypto-js';
import { useAuth } from '../../context/Authcontext';
import * as Keychain from 'react-native-keychain';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';
import API_BASE_URL from '../../services/API_Service';
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
  const [visibleField, setVisibleField] = useState<string | null>(null);

  const { userId } = useAuth();
  const navigation = useNavigation();
  const handleBackButton = (): void => {
    navigation.goBack();
  };
  const handleKeyboardDismiss = () => {
    setVisibleField(null); // Hide all password fields when dismissing the keyboard
    Keyboard.dismiss();
  };
  const handleFocus = (field:any) => {
    setVisibleField(field); // Set the current field as visible
  };
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
 
      if (!jwtToken) {
        const response = await axios.post(
          `${API_BASE_URL}/applicant/authenticateUsers/${userId}`,
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
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    field: string,
    placeholder: string
  ) => (
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          secureTextEntry={visibleField !== field}
          value={value}
          onChangeText={setValue}
          onFocus={() => handleFocus(field)}
          placeholder={placeholder} // Add placeholder here
          placeholderTextColor="#A9A9A9" // Adjust placeholder text color
          
        />
       <TouchableOpacity onPress={() => setVisibleField(visibleField === field ? null : field)} style={styles.eyeIcon}>
          <Image
            source={
              visibleField !== field
                ? require('../../assests/LandingPage/openeye.png') // Replace with your open eye image path
                : require('../../assests/LandingPage/closedeye.png') // Replace with your closed eye image path
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
          source={require('../../assests/Images/logo.png')} // Replace with your logo path
          style={styles.logo}
        />
      </View>
      <View style={styles.separator} />
{/*      
      <TouchableOpacity style={styles.headerContainer} onPress={handleBackButton}>
       
        <Text style={styles.header}>Change Password</Text>
      </TouchableOpacity> */}
      <View style={styles.headerContainer}>
         {/* Back Arrow */}
         <TouchableOpacity onPress={handleBackButton} style={styles.backButton}>
           <Icon name="left" size={24} color="#495057" />
        
           </TouchableOpacity>
         {/* Screen Name */}
         <Text style={styles.title}>Change Password</Text>
         
       </View>
       <View style={styles.separator} />
 
      {renderPasswordField(
 
        oldPassword,
        setOldPassword,
        'OldPassword',  
        'Type Old Password'
      )}
 
      {renderPasswordField(
        newPassword,
        setNewPassword,
        'NewPassword',
        'Enter New Password',
      )}
 
      {renderPasswordField(
        reEnterPassword,
        setReEnterPassword,
        'showReEnterPassword',
        'Confirm New Password',
      )}
 
    {message ? (
      <Text style={[styles.message, message === 'Password changed successfully' ? styles.successMessage : styles.errorMessage]}>
    {message} </Text>) : null}
 
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
    padding: 16,
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
    borderRadius: 8,
    height: 52,
    paddingHorizontal: 10,
    marginBottom:15,
    marginTop:15,
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
    width: '40%',
    height: 47,
    bottom: 20,
    left: 10,
    borderRadius: 8,
 
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerbackButton: {
    width: '50%',
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
    fontWeight: 'bold',
  },
  footerbackButtonText: {
    color: '#F46F16',
    fontSize: 15,
    fontWeight: 'bold',
  },
  footerButtonBack: {
    backgroundColor: '#007BFF',
  },
   
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    bottom: 20,
    paddingHorizontal: 16,
  },
  navbar: {
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
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
    fontWeight: 'bold',
    color: '#000',
  },
 
  backButton: {
    position: 'absolute',
    left: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: '#495057',
    lineHeight:25,
    marginLeft:50
  },
});
 
export default ChangePasswordScreen;