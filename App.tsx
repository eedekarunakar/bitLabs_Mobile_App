import React from 'react';
import {AuthProvider} from '@context/Authcontext';
import {UserProvider} from '@context/UserContext';
import AppWithProfileProvider from '@routes/New';
//import { FirebaseMessagingProvider } from '@context/FirebaseMessagingProvider.tsx';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';



messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  const title = remoteMessage.notification?.title;
  const message = remoteMessage.notification?.body;

  if (title && message) {
    PushNotification.localNotification({
      channelId: 'default-channel-id',
      title,
      message,
      playSound: true,                 // Ensure sound is enabled
      soundName: 'default',            // Ensure the correct sound is specified
      vibrate: true,   
    });
  } else {
    console.log('Notification skipped: title or body is missing.');
  }
  console.log('Background Message Received:', remoteMessage);
});
const App = () => {
  
  return (
  
      <AuthProvider>
        <UserProvider>
            <AppWithProfileProvider />
        </UserProvider>
      </AuthProvider>
   
  );
};

export default App;
