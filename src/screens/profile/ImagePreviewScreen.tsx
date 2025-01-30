import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp, } from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack'
import { RootStackParamList } from '../../../New';
type ImageScreenRouteProp = RouteProp<RootStackParamList, 'ImagePreview'>
const ImagePreviewScreen = () => {
 
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<ImageScreenRouteProp>();
  const { uri ,retake} = route.params
  console.log('Navigated to ImagePreview with URI:', uri);
 
  const handleRetake = () => {
    navigation.replace('Profile',{retake:true})
  };
 
  const handleSave = () => {
    // Save logic here
    navigation.goBack();
  };
 
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri }} onError={(error) => console.log('Image load error:', error)} style={styles.image} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleRetake} style={[styles.button,{ borderColor:'#B4B4B4',borderWidth:1,}]}>
          <Text style={[styles.buttonText,{color:'#757575'}]}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave} style={[styles.button,{ backgroundColor: '#F97316',}]}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: 294,
    width: 294,
    borderWidth: 1,
    borderRadius: 150,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  image: {
    height: '113%',
    width: '100%',
    resizeMode: 'cover',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30, width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
   
    padding: 10,
    borderRadius: 8,
    margin: 10,
    flex: 1,
    marginHorizontal: 5,
   
    alignItems:'center',
    justifyContent:'center',
   
   
  },
  buttonText: {
    color: '#fff',
    marginVertical:3,
    fontFamily:'PlusJakartaSans-Bold',
    fontSize:16
   
  },
});
 
export default ImagePreviewScreen;