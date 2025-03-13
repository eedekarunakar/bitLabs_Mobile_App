import { useState, useEffect } from 'react';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'; 
import { useAuth } from '@context/Authcontext';  
import { showToast } from '../login/ToastService';

const useGoogleSignIn = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const {Glogin} = useAuth();
  
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '1012652072709-si1433abp421jlvlf3qtljm8jgheqdvo.apps.googleusercontent.com', // Replace with your webClientId
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();

      setUserInfo(user);
      setIsSignedIn(true); 
      const email = user?.data.user?.email;

      await Glogin(email);
      showToast('success','Login Successful')
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {

      } else if (error.code === statusCodes.IN_PROGRESS) {

      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {

      } else {
        console.error('Google Sign-In Error:', error);
      }
    }
  };
  
  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();

      setIsSignedIn(false);
      setUserInfo(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return {
    userInfo,
    isSignedIn,
    signIn,
    signOut,
  
  };
};

export default useGoogleSignIn;
