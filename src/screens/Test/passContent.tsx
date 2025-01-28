
import React from 'react';
import { View, Image, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useProfileViewModel } from '../../viewmodel/Profileviewmodel';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../context/Authcontext';
import MaskedView from '@react-native-masked-view/masked-view';
import { RootStackParamList } from '../../../New';
const { width,height } = Dimensions.get('window');

const Pass = ({ navigation }: any) => {
  const route = useRoute();
  const { userId, userToken, } = useAuth();
  const { finalScore, testName }: any = route.params; // Access the passed score
  const { profileData } = useProfileViewModel(userToken, userId);
  const applicant = profileData?.applicant || {}; // Fallback to an empty object
  const roundedScore = Math.round(finalScore);
  console.log("Final Score:", finalScore);
  console.log("Applicant:", applicant);

  if (!profileData) {
    return <Text>Loading...</Text>; // Show a loading indicator while fetching data
  }

  return (
    <View style={styles.container}>
      <View style={styles.Items}>
        {/* Greeting Section */}
        <View style={styles.Name}>
          <Text style={styles.nameText}>
            Hi {applicant.name
              ? applicant.name.charAt(0).toUpperCase() + applicant.name.slice(1)
              : 'Guest'},
          </Text>
        </View>

        {/* Score Section */}
        <View style={styles.score}>
          <MaskedView
            maskElement={
              <Text style={[styles.scoreText, styles.maskedText]}>
                You scored {roundedScore}%
              </Text>
            }
          >
            <LinearGradient
              colors={['#F97316', '#FAA729']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBackground}
            />
          </MaskedView>
        </View>

        {/* Common Image */}
        <Image source={require('../../assests/Images/Test/passed.png')} style={styles.Image} />

        {/* Conditional Rendering Based on Test Name */}
        {testName === 'General Aptitude Test' && (
          <>
            <View style={styles.messageContainer}>
              <Text style={styles.message}>
                Congratulations! You have successfully{"\n"}completed the General Aptitude Test
              </Text>
            </View>
            <View style={styles.retakeContainer}>
              <Text style={styles.text}>
                Now you are eligible for{"\n"}the Technical Test
              </Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate('TestInstruction', { testName: 'Technical Test' })
              }
            >
              <LinearGradient
                colors={['#F97316', '#FAA729']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.button, { borderRadius: 10 }]}
              >
                <Text style={styles.buttonText}>Take Test</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('BottomTab', { screen: 'Badge', isTestComplete: true })
              }
              style={styles.later}
            >
              <Text style={styles.laterText}>I’ll take later</Text>
            </TouchableOpacity>
          </>
        )}

        {testName === 'Technical Test' && (
          <>
            <View style={styles.messageContainer}>
              <Text style={styles.message}>
                Congratulations! You are now verified.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('BottomTab', { screen: 'Badge' })}
            >
              <LinearGradient
                colors={['#F97316', '#FAA729']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.button, { borderRadius: 10 }]}
              >
                <Text style={styles.buttonText}>Exit</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        {testName !== 'General Aptitude Test' && testName !== 'Technical Test' && (
          <>
            <View style={styles.messageContainer}>
              <Text style={styles.message}>
                Congratulations! You are now verified for{"\n"} {testName} test
              </Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('BottomTab', { screen: 'Badge' })}
            >
              <LinearGradient
                colors={['#F97316', '#FAA729']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.button, { borderRadius: 10 }]}
              >
                <Text style={styles.buttonText}>Exit</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

};
export default Pass;

const styles = StyleSheet.create({
  container: {
    width: width * 0.92,
    height: height*0.85,
    marginTop: 50,
    marginLeft: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20
  },
  Items: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  Name: {
    height: 30,
    marginTop: 50,
    alignSelf: 'center'
  },
  nameText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontWeight: 700,
    fontSize: 28,
    lineHeight: 27,
    alignContent: 'center',
    color: '#000000'
  },
  score: {
    width: 220,
    height: 30,
    marginTop: 15,
    marginLeft: '27.5%'
  },
  scoreText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontWeight: 700,
    fontSize: 28,
    lineHeight: 28,
    alignContent: 'center',
    color: 'orange'
  },
  Image: {
    width: 199,
    height: 191,
    marginTop: 45,
    marginLeft: 101
  },
  messageContainer: {
    width: 292,
    height: 62,
    marginLeft: 50,
    marginTop: 20,
    alignItems: 'center'
  },
  message: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 31,
    alignContent: 'center',
    color: '#474646'
  },
  retakeContainer: {
    width: 279.53,
    height: 72,
    marginTop: 45,
    marginLeft: 62
  },
  text: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontWeight: 500,
    fontSize: 24,
    lineHeight: 36,
    alignContent: 'center',
    color: '#000000'
  },
  button: {
    marginTop: 10,
    width: '90%',
    height: 42,
    marginLeft: 10,
    alignItems: 'center'
  },
  buttonText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    lineHeight: 14.4,
    alignContent: 'center',
    color: '#FFFFFF',
    marginTop: 15
  },
  later: {
    width: 346,
    height: 14,
    marginLeft: 28,
    marginTop: 20,
    alignItems: 'center',
  },
  laterText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontWeight: 700,
    fontSize: 14,
    lineHeight: 14.4,
    alignContent: 'center',
    color: '#4D82D1',
  },
  maskedText: {
    color: 'black', // The text acts as a mask and is not visible
    backgroundColor: 'transparent',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  gradientBackground: {
    height: 25, // Ensure the height matches or exceeds the text height
  },
})