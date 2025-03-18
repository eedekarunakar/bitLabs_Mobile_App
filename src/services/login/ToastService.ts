import Toast from 'react-native-toast-message';

const showToast = (type: 'success' | 'error', message: string) => {
  Toast.show({
    type: type,
    text1: '',
    text2: message,
    position: 'bottom',
    bottomOffset: 80,
    visibilityTime: 5000,
    text2Style: {
      fontFamily: 'PlusJakartaSans-Medium',
      fontSize: 12,
    },
  });
};
export {showToast};
