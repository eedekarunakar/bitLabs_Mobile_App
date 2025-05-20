import {PermissionsAndroid, Platform} from 'react-native';

export const requestStoragePermission = async () => {
  if (Platform.OS !== 'android') return true; // No need for iOS

  try {
    if (Platform.Version >= 33) {
      // Android 13+ permissions
      const readMedia = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      );
      return readMedia === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      // Android 12 and below
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  } catch (error) {
    console.warn('Permission error:', error);
    return false;
  }
};
