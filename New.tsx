import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingPage from './src/screens/LandingPage/LandingPage'; // Replace with actual path
// Replace with actual path
import BottomTab from './src/routes/BottomNavigation';
import Dummystep1 from './src/screens/Steps/dummyStep1'; // Replace with actual path
import Dummystep2 from './src/screens/Steps/dummyStep2';
import dummyStep3 from './src/screens/Steps/dummyStep3'
import { useAuth, AuthProvider } from './src/context/Authcontext'; // Replace with actual path
import { fetchProfileId } from './src/services/Create/createProfile'; // Replace with actual path
import TestInstruction from './src/screens/TestInstruction'; // Ensure the path is correct
import TestScreen from './src/screens/TestScreen';
import ForgotPassword from './src/screens/LandingPage/ForgotPassword';
import AppliedJobs from './src/screens/Jobs/AppliedJobs';
import SavedJobs from './src/screens/Jobs/SavedJobs';
import JobDetailsScreen from './src/screens/Jobs/JobDetailsScreen';
import JobDetails from './src/screens/Jobs/JobDetails';
import ProfileComponent from './src/screens/profile/Profile';
import ImagePreviewScreen from './src/screens/profile/ImagePreviewScreen';
import Pass from './src/screens/Test/passContent';
import Fail from './src/screens/Test/FailContent';
import Timeup from './src/screens/Test/TimeUp';
import Toast from 'react-native-toast-message';
import ChangePasswordScreen from './src/screens/HomePage/ChangePassword';
import { JobData } from './src/models/Jobs/ApplyJobmodel';
import ViewJobDetails from './src/screens/Jobs/ViewJobDetails';
import Notification from './src/screens/alert/Notification';
import SavedDetails from './src/screens/Jobs/SavedDetails';
import { ProfilePhotoProvider } from './src/context/ProfilePhotoContext';

export type RootStackParamList = {
  ForgotPassword: undefined,
  LandingPage: undefined;
  BottomTab: undefined;
  Step1: { email: string | null }; // Specify that Step1 expects an email parameter
  Step2: undefined;
  Step3: { updateShouldShowStep1: React.Dispatch<React.SetStateAction<boolean>> };
  TestInstruction: { testName: string };
  TestScreen: { questions: any[] };
  Jobs: undefined;
  JobDetails: { job: any }; // Pass job data to the JobDetails screen
  JobDetailsScreen: { job: any };
  ViewJobDetails: {job:any};
  AppliedJobs: {job:any};
  SavedDetails: { job: any };
  SavedJobs: undefined;
  Profile: { retake?: boolean } | undefined
  ImagePreview: { uri: string; retake?: boolean }
  passContent: { finalScore: number; testName: string };
  FailContent: undefined;
  TimeUp: undefined;
  Badge: { skillName: string; testType: string };
  ChangePassword: undefined;
  Notification:undefined;
};

const Stack = createStackNavigator<RootStackParamList>();


const Appnavigator = () => {
  const { isAuthenticated, userToken, userId, userEmail } = useAuth(); // Assuming AuthProvider provides these
  console.log('userToken', userToken);
  console.log('userId', userId);
  const [profileChecked, setProfileChecked] = useState(false);
  const [shouldShowStep1, setShouldShowStep1] = useState(false);

  useEffect(() => {
    const checkProfileId = async () => {
      if (isAuthenticated && userToken && userId) {
        try {
          const result = await fetchProfileId(userId, userToken);
          console.log(result)
          if (result.success) {
            // Show Step1 if profileid is 0, otherwise show Dashboard
            console.log('Profile ID:', result.profileid);
            setShouldShowStep1(result.profileid === 0);
          } else {
            console.error('Failed to fetch profile details');
          }
        } catch (error) {
          console.error('Error fetching profile ID:', error);
        }
      }
      setProfileChecked(true); // Set profileChecked to true after the profile check is done
    };

    checkProfileId();
  }, [isAuthenticated, userToken, userId]);

  if (!isAuthenticated || !profileChecked) {
    // Show LandingPage while checking profile or if not authenticated
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
            options={{ title: '' }}
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
            options={{headerShown:false}}
          />

          <Stack.Screen
            name="JobDetails"
            component={JobDetails}
            options={{ title: 'Job Details' }}
          />
          <Stack.Screen
            name="AppliedJobs"
            component={AppliedJobs}
            options={{ title: 'Applied Jobs' }}
          />
          <Stack.Screen
            name="JobDetailsScreen"
            component={JobDetailsScreen}
            options={{ title: 'Job Details' }}
          />
           <Stack.Screen
            name="ViewJobDetails"
            component={ViewJobDetails}
          
          />
           <Stack.Screen
            name="SavedDetails"
            component={SavedDetails}
            options={{ title: 'Job Details' }}
          />
          <Stack.Screen
            name="SavedJobs"
            component={SavedJobs}
            options={{ title: 'Saved Jobs' }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileComponent}
            options={{ title: 'profile' }}
          />
          <Stack.Screen
            name="ImagePreview"
            component={ImagePreviewScreen}
            options={{ title: 'Image Preview' }}
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
        />
        </>
      )}
    </Stack.Navigator>
  );
};

const AppWithProfileProvider = () => {
  const { userToken, userId } = useAuth();

    return (
    <ProfilePhotoProvider userToken={userToken} userId={userId}>
      <NavigationContainer >
       <Appnavigator />
       <Toast />
        </NavigationContainer>
         </ProfilePhotoProvider>
          );
         };

const App = () => {

 return (
   <AuthProvider>
     <AppWithProfileProvider />
   </AuthProvider>
 );
};

export default App;