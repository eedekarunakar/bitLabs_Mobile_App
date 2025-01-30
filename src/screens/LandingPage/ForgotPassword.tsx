import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../New';
import useOtpManager from '../../hooks/useOtpManager';
import { sendOtp, verifyOtp, resetPassword } from '../../services/login/ForgotPasswordService';
import { ForgotErrors } from '../../models/Autherrors';
import Icon from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<ForgotErrors>({});
  const { otp, setOtp, otpReceived, setOtpReceived, isOtpExpired, setIsOtpExpired, timer, setTimer, isOtpValid, setOtpValid } = useOtpManager();
  const [isOtpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isResetPasswordVisible, setIsResetPasswordVisible] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const showToast = (type: 'success' | 'error', message: string) => {
    Toast.show({
      type: type,
      text1: message,
      position: 'bottom',
      visibilityTime: 5000,
    });
  };

  useEffect(() => {
    if (otpReceived && !isOtpExpired) {
      const interval = setInterval(() => {
        if (timer > 0) {
          setTimer(prevTimer => prevTimer - 1);
        } else {
          setIsOtpExpired(true);
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpReceived, timer, isOtpExpired, setTimer, setIsOtpExpired]);

  useEffect(() => {

  }, [errors]);

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrors((prevErrors) => ({ ...prevErrors, email: 'E-mail is required' }));
    } else if (!regex.test(email)) {
      setErrors((prevErrors) => ({ ...prevErrors, email: 'Invalid E-mail' }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, email: undefined }));
    }
    return regex.test(email);
  };

  const sendOTP = async () => {
    if (isValidEmail(email)) {
      const result = await sendOtp(email);
      if (result.success) {
        setOtpReceived(true);
        setTimer(60);
        setIsOtpExpired(false);
        showToast('success', 'OTP sent successfully');
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, email: result.message }));
        showToast('error', 'Error sending OTP');
      }
    } else {
      showToast('error', 'Invalid email address');
    }
  };

  const verifyOTP = async () => {
    const result = await verifyOtp(otp, email);
    if (result.success) {
      setOtpVerified(true);
      showToast('success', 'OTP verified successfully');
    } else {
      setOtpValid(false);
      setTimeout(() => setOtpValid(true), 3000);
      showToast('error', 'Invalid OTP');
    }
  };

  const validatePassword = () => {
    const newErrors: ForgotErrors = {}; // Create a new errors object

    if (!newPassword) {
      newErrors.password = 'Password is required';
    } else if (newPassword.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    } else if (!/[A-Z]/.test(newPassword)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[!@#$%^&*]/.test(newPassword)) {
      newErrors.password = 'Password must contain at least one special character';
    } else if (!/\d/.test(newPassword)) {
      newErrors.password = 'Password must contain at least one digit';
    } else if (/\s/.test(newPassword)) {
      newErrors.password = 'Password cannot contain any spaces';
    }

    if (newPassword !== confirmPassword) {
      newErrors.password = 'Passwords do not match';
    }

    setErrors(newErrors); // Update state with the new errors object

    return Object.keys(newErrors).length === 0; // Return true if there are no errors
  };

  const resetUserPassword = async () => {
    if (validatePassword()) {
      const result = await resetPassword(email, newPassword, confirmPassword);
      if (result.success) {
        navigation.navigate('LandingPage');
        showToast('success', 'Password reset Successfully');
      } else {
        console.log(newPassword, confirmPassword);
        console.log('Error resetting password');
        showToast('error', 'Error resetting Password');
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.navbar}>
          <Image source={require('../../assests/Images/logo.png')} style={styles.logo} />
        </View>
        <View style={styles.separator} />
        <View style={styles.headerContainer}>
          {/* Back Arrow */}
          <TouchableOpacity onPress={() => { navigation.navigate('LandingPage') }} style={styles.backButton}>
            <Icon name="left" size={24} color="#495057" />
          </TouchableOpacity>

          {/* Screen Name */}
          <Text style={styles.title}>Forgot Password</Text>
        </View>
        <View style={styles.separator} />
        <TextInput
          style={styles.input}
          placeholder="Email"  placeholderTextColor="#B1B1B1" 
          value={email}
          onChangeText={setEmail}
          editable={!isOtpVerified}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        {otpReceived ? (
          isOtpVerified ? (
            <View style={styles.form}>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="New Password"  placeholderTextColor="#B1B1B1" 
                  style={styles.passwordInput}
                  secureTextEntry={!isPasswordVisible}
                  onBlur={() => { setIsPasswordVisible(false) }}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <Image
                    source={
                      isPasswordVisible
                        ? require('../../assests/LandingPage/openeye.png')
                        : require('../../assests/LandingPage/closedeye.png')
                    }
                    style={styles.eyeImage}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Confirm Password"  placeholderTextColor="#B1B1B1" 
                  style={styles.passwordInput}
                  secureTextEntry={!isResetPasswordVisible}
                  value={confirmPassword}
                  onBlur={() => { setIsResetPasswordVisible(false) }}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setIsResetPasswordVisible(!isResetPasswordVisible)}>
                  <Image
                    source={
                      isResetPasswordVisible
                        ? require('../../assests/LandingPage/openeye.png')
                        : require('../../assests/LandingPage/closedeye.png')
                    }
                    style={styles.eyeImage}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"  placeholderTextColor="#B1B1B1" 
                value={otp}
                onChangeText={setOtp}
              />
              {!isOtpValid && <Text style={styles.errorText}>Invalid OTP</Text>}
              <View style={styles.otpContainer}>
                {isOtpExpired && (
                  <TouchableOpacity onPress={sendOTP}>
                    <Text style={styles.resendText}>Resend OTP</Text>
                  </TouchableOpacity>)}
              </View>
              {otpReceived && !isOtpExpired &&
                <Text style={styles.timerText}>Please verify OTP within {timer} seconds</Text>
              }
            </View>
          )
        ) : null}
        <View style={[styles.buttonContainer, { alignSelf: 'center' }]}>
          <TouchableOpacity style={styles.backButtonBottom} onPress={() => navigation.navigate('LandingPage')}>
            <Text style={{
              color: '#F46F16',
              fontSize: 15,
              fontFamily: 'PlusJakartaSans-Bold',
            }}>Back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButtonBottom}
            onPress={otpReceived ? (isOtpVerified ? resetUserPassword : verifyOTP) : sendOTP}
          >
            <LinearGradient
              colors={['#F97316', '#FAA729']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[ styles.applyButtonGradient]}
            >
              <Text style={styles.buttonText}>
                {otpReceived ? (isOtpVerified ? 'Save' : 'Verify OTP') : 'Send OTP'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  separator: {
    height: 1,
    backgroundColor: '#D3D3D3',
    width: '100%',
    marginTop: 8,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
  navbar: {
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  headerContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: 50,
    backgroundColor: '#FFF',
  },
  title: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16,
    color: '#495057',
    lineHeight: 25,
    marginLeft: 50,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: '95%',
    alignSelf: 'center',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',

    fontFamily: 'PlusJakartaSans-Medium',

    fontSize:12,

  },
  otpContainer: {
    top: -4,
    alignItems: 'flex-end',
    marginVertical: 10,
    width: '95%',
  },
  timerText: {
    color: 'red',
    alignSelf: 'center',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  resendText: {
    color: '#F97316',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  applyButtonGradient: {
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
    width:'50%' // Add consistent spacing
  },
  backButtonBottom: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F46F16',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
    width:'43%' // Add consistent spacing
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  form: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  passwordContainer: {
    
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: '95%',
    alignSelf: 'center',
  },
  passwordInput: {
    flex: 1,
    height: 40,
    color:'black',
    fontFamily: 'PlusJakartaSans-Medium',
    
  },
  eyeImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', // Distribute space evenly
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    bottom: 20,
    paddingHorizontal: 16,
   

  },
});

export default ForgotPassword;
