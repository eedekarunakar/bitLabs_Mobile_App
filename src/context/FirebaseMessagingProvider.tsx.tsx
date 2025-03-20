import { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { PermissionsAndroid, Platform } from 'react-native';

export const useFirebaseMessaging = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Permission granted');
    } else {
      console.log('Permission denied');
    }
  };

  const requestAndroidNotificationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Notification Permission',
          message: 'This app needs access to send notifications',
          buttonPositive: 'OK',
        }
      );
      console.log('Android Notification permission granted:', granted === PermissionsAndroid.RESULTS.GRANTED);
    }
  };

  const getFcmToken = async () => {
    const token = await messaging().getToken();
    //console.log('FCM Token:', token);
    setFcmToken(token);
  };

  useEffect(() => {
    const initialize = async () => {
      await requestUserPermission();
      await requestAndroidNotificationPermission();
      await getFcmToken();
    };

    initialize();

    // Create notification channel once
    PushNotification.createChannel(
      {
        channelId: 'default-channel-id',
        channelName: 'Default Channel',
        playSound: true,
        soundName: 'default',
        vibrate: true,
      },
      (created) => console.log(`Channel created: ${created}`)
    );

    // Foreground message handler
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground Message Received:', remoteMessage);
      const title = remoteMessage.notification?.title;
      const message = remoteMessage.notification?.body;

      if (title && message) {
        PushNotification.localNotification({
          channelId: 'default-channel-id',
          title,
          message,
        });
      } else {
        console.log('Notification skipped: title or body is missing.');
      }
    });

    // Background message handler
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      const title = remoteMessage.notification?.title;
      const message = remoteMessage.notification?.body;

      if (title && message) {
        PushNotification.localNotification({
          channelId: 'default-channel-id',
          title,
          message,
        });
      } else {
        console.log('Notification skipped: title or body is missing.');
      }
      console.log('Background Message Received:', remoteMessage);
    });

    return () => {
      unsubscribeForeground();
    };
  }, []);

  return { fcmToken };
};
