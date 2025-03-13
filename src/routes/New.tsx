import React, { useEffect, useState } from 'react';
import {ActivityIndicator, View,} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingPage from '../screens/LandingPage/LandingPage'; // Replace with actual path
import BottomTab from './BottomNavigation';
import Dummystep1 from '../screens/Steps/dummyStep1'; // Replace with actual path
import Dummystep2 from '../screens/Steps/dummyStep2';
import dummyStep3 from '../screens/Steps/dummyStep3'
import { useAuth,} from '../context/Authcontext'; // Replace with actual path
import { fetchProfileId } from '../services/Create/createProfile'; // Replace with actual path
import TestInstruction from '../screens/TestInstruction'; // Ensure the path is correct
import TestScreen from '../screens/TestScreen';
import ForgotPassword from '../screens/LandingPage/ForgotPassword';
import AppliedJobs from '../screens/Jobs/AppliedJobs';
import SavedJobs from '../screens/Jobs/SavedJobs';
import JobDetailsScreen from '../screens/Jobs/JobDetailsScreen';
import JobDetails from '../screens/Jobs/JobDetails';
import ProfileComponent from '../screens/profile/Profile';
import ImagePreviewScreen from '../screens/profile/ImagePreviewScreen';
import Pass from '../screens/Test/passContent';
import Fail from '../screens/Test/FailContent';
import Timeup from '../screens/Test/TimeUp';
import Toast from 'react-native-toast-message'; // Ensure this import is correct
import ChangePasswordScreen from '../screens/HomePage/ChangePassword';
import ViewJobDetails from '../screens/Jobs/ViewJobDetails';
import Notification from '../screens/alert/Notification';
import SavedDetails from '../screens/Jobs/SavedDetails';
import { ProfilePhotoProvider } from '../context/ProfilePhotoContext';
import Drives from '../screens/HomePage/Drives';
import { PdfProvider } from '../context/ResumeContext';

import { useMessageContext, MessageProvider } from '../context/welcome';
import { RootStackParamList } from '@models/Model';

import { toastConfig } from '@components/Toast/toast_config';




const Stack = createStackNavigator<RootStackParamList>();

const Appnavigator = () => {

  const { isAuthenticated, userToken, userId, userEmail } = useAuth();
  const [profileChecked, setProfileChecked] = useState(isAuthenticated);
  const [loading, setLoading] = useState(true);
  const [shouldShowStep1, setShouldShowStep1] = useState(false);
  const { setSetmsg } = useMessageContext();

  useEffect(() => {
    const checkProfileId = async () => {
      if (isAuthenticated && userToken && userId) {
        try {
          const result = await fetchProfileId(userId, userToken);
          if (result.success) {
            setShouldShowStep1(result.profileid === 0);
            result.profileid == 0 ? setSetmsg(true) : setSetmsg(false)
          } else {
            console.error('Failed to fetch profile details');
          }
        } catch (error) {
          console.error('Error fetching profile ID:', error);
        }
      }
      setLoading(false);
      setProfileChecked(true);

    };


    checkProfileId();

  }, [isAuthenticated, userToken, userId, profileChecked, setSetmsg]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#F46F16" style={{flex:1,justifyContent:'center',alignItems:'center'}}  />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="LandingPage"
          component={LandingPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      {shouldShowStep1 ? (
        <>
          <Stack.Screen name="Step1" component={Dummystep1} initialParams={{ email: userEmail }} options={{ headerShown: false }} />
          <Stack.Screen name="Step2" component={Dummystep2} options={{ headerShown: false }} />
          <Stack.Screen name="Step3" component={dummyStep3} options={{ headerShown: false }} initialParams={{ updateShouldShowStep1: setShouldShowStep1 }} />
          
        </>
      ) : (
        <>
          <Stack.Screen name="BottomTab" component={BottomTab} options={{ headerShown: false }} />

          {/* Test Instruction Screen */}
          <Stack.Screen
            name="TestInstruction"
            component={TestInstruction}
            options={{ headerShown: false, }}
          />

          {/* Test Instruction Screen */}
          <Stack.Screen
            name="TestScreen"
            component={TestScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePasswordScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="JobDetails"
            component={JobDetails}
            options={{
              title: 'Job Details',
              headerTitleStyle: {
                fontFamily: 'PlusJakartaSans-Bold',
                fontSize: 16, // Customize the font size
              },
            }}
          />
          <Stack.Screen
            name="AppliedJobs"
            component={AppliedJobs}
            options={{
              title: 'Applied Jobs',
              headerTitleStyle: {
                fontFamily: 'PlusJakartaSans-Bold',
                fontSize: 16, // Customize the font size
              },
            }}
          />
          <Stack.Screen
            name="JobDetailsScreen"
            component={JobDetailsScreen}
            options={{
              title: 'Job Details',
              headerTitleStyle: {
                fontFamily: 'PlusJakartaSans-Bold',
                fontSize: 16, // Customize the font size
              },
            }}
          />
          <Stack.Screen
            name="ViewJobDetails"
            component={ViewJobDetails}
            options={{
              title: 'View Job Details',
              headerTitleStyle: {
                fontFamily: 'PlusJakartaSans-Bold',
                fontSize: 16, // Customize the font size
              },
            }}
          />
          <Stack.Screen
            name="SavedDetails"
            component={SavedDetails}
            options={{
              title: 'Job Details',
              headerTitleStyle: {
                fontFamily: 'PlusJakartaSans-Bold',
                fontSize: 16, // Customize the font size
              },
            }}
          />
          <Stack.Screen
            name="SavedJobs"
            component={SavedJobs}
            options={{
              title: 'Saved Jobs',
              headerTitleStyle: {
                fontFamily: 'PlusJakartaSans-Bold',
                fontSize: 16, // Customize the font size
              },
            }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileComponent}
            options={{
              title: 'Profile',
              headerTitleStyle: {
                fontFamily: 'PlusJakartaSans-Bold',
                fontSize: 16, // Customize the font size
              },
            }}
          />
          <Stack.Screen
            name="ImagePreview"
            component={ImagePreviewScreen}
            options={{
              title: 'Image Preview',
              headerTitleStyle: {
                fontFamily: 'PlusJakartaSans-Bold',
                fontSize: 16, // Customize the font size
              },
            }}
          />
          <Stack.Screen
            name="passContent"
            component={Pass}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="FailContent"
            component={Fail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TimeUp"
            component={Timeup}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Notification"
            component={Notification}
            options={{
              title: 'Notification',
              headerTitleStyle: {
                fontFamily: 'PlusJakartaSans-Bold',
                fontSize: 16, // Customize the font size
              },
            }}
          />
          {/* <Stack.Screen
            name="ResumeBuilder"
            component={ResumeBuilder}
            options={{
              title: 'Resume Builder',
              headerTitleStyle: {
                fontFamily: 'PlusJakartaSans-Bold',
                fontSize: 16, // Customize the font size
              },
            }}
          /> */}
          <Stack.Screen
            name="Drives"
            component={Drives}


          />

        </>
      )}
    </Stack.Navigator>
  );
};

const AppWithProfileProvider = () => {
  const { userToken, userId } = useAuth();

  return (
    <PdfProvider>
    <MessageProvider>
      <ProfilePhotoProvider userToken={userToken} userId={userId}>
        <NavigationContainer >
          <Appnavigator />
          <Toast config={toastConfig} /> {/* Pass the toastConfig */}
        </NavigationContainer>
      </ProfilePhotoProvider>
    </MessageProvider>
    </PdfProvider>
  );
};

export default AppWithProfileProvider;
