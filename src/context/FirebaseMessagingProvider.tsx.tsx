import React, { createContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export const FirebaseMessagingContext = createContext<{ fcmToken: string | null }>({ fcmToken: null });


export const FirebaseMessagingProvider = ({ children }: { children: ReactNode }) => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Permission granted');
      getFcmToken();
    } else {
      console.log('Permission denied');
    }
  };

  const getFcmToken = async () => {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    setFcmToken(token);
  };

  useEffect(() => {
    requestUserPermission();
    //foreground message handler
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground Message Received:', remoteMessage);

      // Alert.alert(
      //   remoteMessage.notification?.title || 'New Notification',
      //   remoteMessage.notification?.body || 'You have a new notification'
      // );
    });

    const unsubscribeBackground = messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Background Message Received:', remoteMessage);
    });

    return () => {
      unsubscribeForeground();
      // Background handler doesn't require unsubscribe
    };
  }, []);

  const contextValue = useMemo(() => ({ fcmToken }), [fcmToken]);

  return (
    <FirebaseMessagingContext.Provider value={contextValue}>
      {children}
    </FirebaseMessagingContext.Provider>
  );
};


