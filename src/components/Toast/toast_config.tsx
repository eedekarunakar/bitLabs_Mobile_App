import React from 'react';
import { TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Toast ,{ BaseToast, ToastConfig}from 'react-native-toast-message';

const { width } = Dimensions.get('window');

export const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'green', paddingRight: 15, width: width * 0.9 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 12, fontFamily: 'PlusJakartaSans-Bold' }}
      text2Style={{ fontSize: 10, fontFamily: 'PlusJakartaSans-Bold', color: 'black' }}
      text1={props.text1}
      text2={props.text2}
      renderTrailingIcon={() => (
        <TouchableOpacity onPress={() => Toast.hide()} style={{ alignSelf: 'center', marginLeft: 10 }}>
          <Icon name="cross" size={18} color="black" />
        </TouchableOpacity>
      )}
    />
  ),
  error: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'red', paddingRight: 15, width: width * 0.9 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 12, fontFamily: 'PlusJakartaSans-Bold' }}
      text2Style={{ fontSize: 10, fontFamily: 'PlusJakartaSans-Bold', color: 'black' }}
      text1={props.text1}
      text2={props.text2}
      renderTrailingIcon={() => (
        <TouchableOpacity onPress={() => Toast.hide()} style={{ alignSelf: 'center', marginLeft: 10 }}>
          <Icon name="cross" size={18} color="black" />
        </TouchableOpacity>
      )}
    />
  ),
};