import { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { PermissionsAndroid, Platform } from 'react-native';
import axios from 'axios';

export const useFirebaseMessaging = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('✅ Notification permission granted');
    } else {
      console.log('❌ Notification permission denied');
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
      console.log('✅ Android Notification permission granted:', granted === PermissionsAndroid.RESULTS.GRANTED);
    }
  };

  const getFcmToken = async () => {
    const token = await messaging().getToken();
    setFcmToken(token);

    console.log('✅ FCM Token generated:', token);

    // Send token to backend
    try {
      await axios.post('http://10.0.2.2:8080/api/fcm/token', { fcmToken: token });
      console.log('✅ Token sent to backend');
    } catch (err) {
      if (err instanceof Error) {
        console.log('❌ Error sending token to backend:', err.message);
      } else {
        console.log('❌ Error sending token to backend:', err);
      }
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await requestUserPermission();
      await requestAndroidNotificationPermission();
      await getFcmToken();
    };

    initialize();

    // Create notification channel
    PushNotification.createChannel(
      {
        channelId: 'default-channel-id',
        channelName: 'Default Channel',
        playSound: true,
        soundName: 'default',
        vibrate: true,
      },
      (created) => console.log(`🔔 Channel created: ${created}`)
    );

    // Handle foreground messages
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      console.log('📩 Foreground Message Received:', remoteMessage);

      const title = remoteMessage.notification?.title || 'Notification';
      const message = remoteMessage.notification?.body || 'You have a new message!';

      PushNotification.localNotification({
        channelId: 'default-channel-id',
        title,
        message,
        playSound: true,
        soundName: 'default',
        vibrate: true,
      });
    });

    // Handle background + quit state notifications
    // messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    //   console.log('📩 Background Message Received:', remoteMessage);

    //   const title = remoteMessage.notification?.title || 'Notification';
    //   const message = remoteMessage.notification?.body || 'You have a new message!';

    //   PushNotification.localNotification({
    //     channelId: 'default-channel-id',
    //     title,
    //     message,
    //     playSound: true,
    //     soundName: 'default',
    //     vibrate: true,
    //   });
    // });

    return () => {
      // unsubscribeForeground();
    };
  }, []);

  return { fcmToken };
};
