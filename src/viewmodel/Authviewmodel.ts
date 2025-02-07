import { useState, useEffect } from 'react';
import { handleLogin, handleSignup, handleOTP } from '../services/login/Authservice';
import { LoginErrors, SignupErrors } from '../models/Autherrors';
import { useAuth } from '../context/Authcontext';
import useOtpManager from '../hooks/useOtpManager';
import Toast from 'react-native-toast-message';
 
const useLoginViewModel = () => {
  const { login } = useAuth();
  const [loginUserName, setLoginUserName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState<LoginErrors>({});
  const [loginMessage, setLoginMessage] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('');
  const showToast =(type: 'success'|'error',message:string)=>{
    Toast.show({
      type:type,
      text1:'',
      text2:message,
      position:'bottom',
      visibilityTime:5000,
      bottomOffset: 80,
      text2Style:{
        fontFamily:'PlusJakartaSans-Medium',
        fontSize:12
      }
    })
  }

  const validateLogin = () => {
    const errors: LoginErrors = {};
    if (!loginUserName) {
      errors.username = 'E-mail is required';
    } else if (!isValidEmail(loginUserName)) {
      errors.username = 'Invalid E-mail';
    }
    if (!loginPassword) {
      errors.password = 'Password is required';
    } else if (/\s/.test(loginPassword)) {
      errors.password = 'Password must not contain any spaces';
    }
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateAndLogin = async () => {
    try{
    if (validateLogin()) {
      const result = await login(loginUserName, loginPassword);
      if (result.success) {
        console.log('toast displayed')
        showToast('success','Login successful')
        console.log('login succesfull')
      } else {
        if (result.message !== null && result.message !== undefined) {
          setLoginMessage(result.message);
        }
      }
    }
  }catch(error){
    console.log(error)
  }
  };

  return {
    loginUserName,
    setLoginUserName,
    loginPassword,
    setLoginPassword,
    loginErrors,
    loginMessage,
    notificationMessage,
    showNotification,
    notificationType,
    validateLogin,
    validateAndLogin,
    setLoginErrors
  };
};

const useSignupViewModel = () => {
  const otpManager = useOtpManager(); //Re-use otp states
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupNumber, setSignupNumber] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signUpErrors, setSignUpErrors] = useState<SignupErrors>({});
  
  const [registration, setRegistration] = useState(false);
  
  const showToast =(type: 'success'|'error',message:string)=>{
    Toast.show({
      type:type,
      text1:'',
      text2:message,
      position:'bottom',
      visibilityTime:5000,
      bottomOffset: 80,
      text2Style:{
        fontFamily:'PlusJakartaSans-Medium',
        fontSize:12
      }
    })
  }


  
  const validateSignup = (field?: 'name' | 'email' | 'whatsappnumber' | 'password', text?: string): boolean => {
    const errors: SignupErrors = { ...signUpErrors };

    // Remove the userRegistered error if it exists
    if (errors.userRegistered) delete errors.userRegistered;

    // Helper function for field-specific validation
    const validateField = (field: string, value: string) => {
        switch (field) {
            case 'name':
                if (!value) errors.name = 'Name is required';
                else if (value.length < 3) errors.name = 'Full name should be at least three characters long';
                else if (!/^[A-Za-z\s]+$/.test(value)) errors.name = 'Name should only contain alphabetic characters';
                else delete errors.name;
                break;
            case 'email':
                if (!value) errors.email = 'E-mail is required';
                else if (!isValidEmail(value)) errors.email = 'Please enter a valid email address';
                else delete errors.email;
                break;
            case 'whatsappnumber':
                if (!value) errors.whatsappnumber = 'Whatsapp Number is required';
                else if (value.length < 10) errors.whatsappnumber = 'Please enter a valid 10 digit mobile number';
                else if (!/^[6-9][0-9]{9}$/.test(value)) errors.whatsappnumber = 'Mobile number should begin with 6, 7, 8, or 9';
                else delete errors.whatsappnumber;
                break;
            case 'password':
                if (!value) errors.password = 'Password is required';
                else if (value.length < 6) errors.password = 'Password must be at least 6 characters long';
                else if (!/[A-Z]/.test(value)) errors.password = 'Password must contain at least one uppercase letter';
                else if (!/[!@#$%^&*]/.test(value)) errors.password = 'Password must contain at least one special character';
                else if (!/\d/.test(value)) errors.password = 'Password must contain at least one digit';
                else if (/\s/.test(value)) errors.password = 'Password cannot contain any spaces';
                else delete errors.password;
                break;
        }
    };

    // Field-specific validation if field and text are provided
    if (field && text !== undefined) {
        validateField(field, text);
    } else {
        // Full validation for all fields
        validateField('name', signupName);
        validateField('email', signupEmail);
        validateField('whatsappnumber', signupNumber);
        validateField('password', signupPassword);
    }

    setSignUpErrors(errors);
    return Object.keys(errors).length === 0;
};

  
  
  
  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateAndSignup = async () => {
    if (validateSignup()) {
      const result = await handleSignup(signupEmail, signupNumber);
      if (result.success) {
        otpManager.setOtpReceived(true);
        otpManager.setTimer(60);
        otpManager.setIsOtpExpired(false);
        showToast('success', 'OTP sent successfully');
        // otpManager.triggerNotification('OTP sent successfully','success');
        
        
        // setTimeout(() => otpManager.setShowNotification(false), 3000);
      } else {
        setSignUpErrors({ userRegistered: result.message });
      }
    }
  };

  const handleOtp = async () => {
    try{
    const result = await handleOTP(otpManager.otp, signupEmail, signupName, signupNumber, signupPassword);
    if (result.success) {
      setRegistration(true);
      otpManager.setTimer(0);
      showToast('success','User Registered Succesfully')
      // otpManager.triggerNotification('User registered successfully','success');
      // setNotificationType('success');
      // setShowNotification(true);
      // setTimeout(() => setShowNotification(false), 3000);
    } else {
      console.log('error occured');
      otpManager.setOtpValid(false);
      setTimeout(() => otpManager.setOtpValid(true), 3000);
    }
  }catch(error){
    console.error('Error occurred:', error);
    showToast('error','An Error Occured')
  }
  };

  return {
    signupName,
    setSignupName,
    signupEmail,
    setSignupEmail,
    signupNumber,
    setSignupNumber,
    signupPassword,
    setSignupPassword,
    signUpErrors,
    setRegistration,
    setSignUpErrors,
    validateSignup,
    validateAndSignup,
    handleOtp,
    registration,
    ...otpManager
  };
};

export { useLoginViewModel, useSignupViewModel };