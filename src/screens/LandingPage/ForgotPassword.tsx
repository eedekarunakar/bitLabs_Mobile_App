import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../New';
import useOtpManager from '../../hooks/useOtpManager';
import { sendOtp, verifyOtp, resetPassword } from '../../services/login/ForgotPasswordService';
import { ForgotErrors } from '../../models/Autherrors';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<ForgotErrors>({});
  const { otp, setOtp, otpReceived, setOtpReceived, isOtpExpired, setIsOtpExpired, timer, setTimer, isOtpValid, setOtpValid } = useOtpManager();
  const [isOtpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isResetPasswordVisible, setIsResetPasswordVisible] = useState(false);

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
    if (Object.keys(errors).length > 0) {
      const timer = setTimeout(() => {
        setErrors({});
      }, 3000);
      return () => clearTimeout(timer);
    }
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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.container}>
        <Image source={require('../../assests/LandingPage/forgotpasslogo.png')} style={{ alignSelf: 'center', height: 50, width: 50, marginBottom: 16 }} />

        <TextInput
          style={styles.input}
          placeholder="Email"
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
                  placeholder="New Password"
                  style={styles.passwordInput}
                  secureTextEntry={!isPasswordVisible}
                  onBlur={()=>{setIsPasswordVisible(false)}}
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
                  placeholder="Confirm Password"
                  style={styles.passwordInput}
                  secureTextEntry={!isResetPasswordVisible}
                  value={confirmPassword}
                  onBlur={()=>{setIsResetPasswordVisible(false)}}
                  onChangeText={setConfirmPassword}
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
              <TouchableOpacity style={styles.button} onPress={resetUserPassword}>
                <Text style={styles.buttonText}>Reset Password</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
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
              <TouchableOpacity style={styles.button} onPress={verifyOTP}>
                <Text style={styles.buttonText}>Verify OTP</Text>
              </TouchableOpacity>
            </View>
          )
        ) : (
          <TouchableOpacity style={styles.button} onPress={sendOTP}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: '95%',
    alignSelf: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  otpContainer: {
    top: -4,
    alignItems: 'flex-end',
    marginVertical: 10,
    width: '95%',
  },
  timerText: {
    color: 'red',
    alignSelf: 'center'
  },
  resendText: {
    color: '#F97316',
  },
  button: {
    backgroundColor: '#F97316',
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    width: '45%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  form: {
    width: '100%',
    alignItems: 'center',
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
  },
  eyeImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',

  },
});
export default ForgotPassword;