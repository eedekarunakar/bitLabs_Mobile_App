import React from 'react';
import { View, Text,Image,TouchableOpacity,StyleSheet,Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
const Drives = () => {
  return (
    <View style={{  flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>This is Drives Section!</Text>
      {/* Add your other Dashboard UI components here */}
    </View>
    
  );
};

export default Drives;

