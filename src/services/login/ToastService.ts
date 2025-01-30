import Toast from 'react-native-toast-message'


 const showToast =(type: 'success'|'error',message:string)=>{
    Toast.show({
      type:type,
      text1:message,
      position:'bottom',
      bottomOffset: 80,
      visibilityTime:5000,
      text1Style: {
        fontSize: 12,
        fontFamily: 'PlusJakartaSans-Medium',
      },
    })
  }
  export{showToast}
