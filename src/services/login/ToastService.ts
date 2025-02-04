import Toast from 'react-native-toast-message'


 const showToast =(type: 'success'|'error',message:string)=>{
    Toast.show({
      type:type,
      text1:message,
      position:'bottom',
      bottomOffset: 80,
      visibilityTime:5000,
    })
  }
  export{showToast}
