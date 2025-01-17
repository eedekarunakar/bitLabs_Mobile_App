import React, { useEffect, useState } from 'react';
import { View, Button, Text, Image } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

const GoogleSignInComponent = () => {
  const [userInfo, setUserInfo] = useState<any>(null);  // To hold user information
  const [isSignedIn, setIsSignedIn] = useState(false);  // To track sign-in status

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '1012652072709-si1433abp421jlvlf3qtljm8jgheqdvo.apps.googleusercontent.com', // From Google Developer Console
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      console.log('User Info:', user);
      setUserInfo(user);  // Set the user info after successful sign-in
      setIsSignedIn(true);  // Update sign-in status
    } catch (error:any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign-In in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services are not available');
      } else {
        console.error('Google Sign-In Error:', error);
      }
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      console.log('User signed out');
      setIsSignedIn(false);  // Update sign-out status
      setUserInfo(null);  // Clear user info
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isSignedIn ? (
        <View style={{ alignItems: 'center' }}>
          <Text>Welcome, {userInfo?.data.user?.name}!</Text>
          <Image source={{ uri: userInfo?.datauser?.photo }} style={{ width: 100, height: 100, borderRadius: 50, marginTop: 10 }} />
          <Button title="Sign Out" onPress={signOut} />
        </View>
      ) : (
        <View>
          <Button title="Sign In with Google" onPress={signIn} />
        </View>
      )}
    </View>
  );
};

export default GoogleSignInComponent;
