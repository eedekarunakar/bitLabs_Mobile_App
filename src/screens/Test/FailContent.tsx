import React from 'react';
import { View, Image, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import BottomTab from '../../routes/BottomNavigation';
import Badge from '../HomePage/Badge';
import { RootStackParamList } from '../../../New';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';



const { width,height } = Dimensions.get('window');
const Fail = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.Items}>
        <Image source={require('../../assests/Images/Test/failed.png')} style={styles.Image} />
        <View style={styles.messageContainer}>
          <Text style={styles.message}> Unfortunately, you scored{"\n"}less than 70%, and have not{"\n"}        passed the exam.</Text>
        </View>
        <View style={styles.retakeContainer}>
          <Text style={styles.text}>You Can Retake The Test{"\n"}        After 7 Days</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('BottomTab', { screen: 'Badge', isTestComplete: false })
          }
        >
          <LinearGradient
            colors={['#F97316', '#FAA729']} // Gradient colors
           // Gradient colors
            start={{ x: 0, y: 0 }} // Gradient starting point
            end={{ x: 1, y: 0 }} // Gradient ending point
            style={[styles.button, { borderRadius: 10 }]} // Ensure it matches your button styling
          >
            <Text style={styles.buttonText}>Exit</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Fail;

const styles = StyleSheet.create({
  container: {
    width: width * 0.92,
    height: height*0.85,
    marginTop: 20,
    marginLeft: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20
  },
  Items: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  Image: {
    width: 228,
    height: 203,
    marginTop: 75,
    marginLeft: 87
  },
  messageContainer: {
    width: 316,
    height: 154,
    marginLeft: 49
  },
  message: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 600,
    fontSize: 22,
    lineHeight: 34,
    alignContent: 'center',
    color: '#000000',
    marginTop: 20
  },
  retakeContainer: {
    width: 261,
    height: 88,
    marginLeft: 77
  },
  text: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 600,
    fontSize: 20,
    lineHeight: 34,
    alignContent: 'center',
    color: '#F97316'
  },
  button: {
    width: '90%',
    height: 42,
    marginLeft: 25,
    borderRadius: 7.68,
    backgroundColor: 'orange',
    alignItems: 'center'
  },
  buttonText: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 700,
    fontSize: 14,
    lineHeight: 14.4,
    alignContent: 'center',
    color: '#FFFFFF',
    marginTop: 15
  }
})