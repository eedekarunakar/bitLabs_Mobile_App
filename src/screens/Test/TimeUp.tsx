import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTestViewModel } from '../../viewmodel/Test/TestViewModel';  // Adjust the import path based on your project structure
import { useAuth } from '../../context/Authcontext';  // Adjust the import path for your auth hook
import { useSkillTestViewModel } from '../../viewmodel/Test/skillViewModel';

const { width } = Dimensions.get('window');

const TimeUp = ({ route }:any) => {
  const { testName } = route.params;
  const { finalScore } = route.params; // Get the final score from route params
  const { userId, userToken } = useAuth(); // Assuming you have a hook to get auth data
  const { submitTest } = useTestViewModel(userId, userToken,testName); // Call the useTestViewModel hook
  const {submitSkillTest} = useSkillTestViewModel(userId,userToken,testName)
  const handleTimeUpSubmission = async () => {
    // Pass the final score and mark the test as complete
     if (testName === 'Technical Test' || testName === 'General Aptitude Test') {
        await submitTest(finalScore, false);
      } else {
        await submitSkillTest(finalScore, false);
      }
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Image source={require('../../assests/Images/Test/Alarm.png')} style={styles.Alarm} />
        <Text style={styles.modalText}>Time's Up!</Text>
        <Text style={[styles.modalText1, { color: '#8F8F8F', lineHeight: 35 }]}>
          Your answers have been submitted. Go{"\n"}check the results.
        </Text>
        <TouchableOpacity onPress={handleTimeUpSubmission}>
          <LinearGradient
            colors={['#F97316', '#FAA729']} // Gradient colors
            start={{ x: 0, y: 0 }} // Gradient starting point
            end={{ x: 1, y: 0 }} // Gradient ending point
            style={[styles.modalButton1, { borderRadius: 10 }]} // Ensure it matches your button styling
          >
            <Text style={styles.modalButtonText}>View Results</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TimeUp;

const styles = StyleSheet.create({
  modalContainer: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '95%',
    height: '97%',
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 18,
    lineHeight: 25,
    color: '#333333',
    marginTop: 10,
    marginBottom: 8,
    textAlign: 'center',
  },
  Alarm: {
    width: 123.88,
    height: 124.2,
  },
  modalText1: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 25,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalButton1: {
    borderRadius: 7.68,
    alignItems: 'center',
    padding: 10,
    width: width * 0.9,
    height: 45,
    backgroundColor: 'orange',
  },
  modalButtonText: {
    fontSize: 14,
    color: '#FFF',
    fontFamily: 'PlusJakartaSans-Bold',
  },
});
