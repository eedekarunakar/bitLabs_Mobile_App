import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  BackHandler
} from 'react-native';
import {useRoute,useFocusEffect} from '@react-navigation/native';
import {useProfileViewModel} from '../../viewmodel/Profileviewmodel';
import LinearGradient from 'react-native-linear-gradient';
import {useAuth} from '../../context/Authcontext';
import MaskedView from '@react-native-masked-view/masked-view'
const {width, height} = Dimensions.get('window');

const Pass = ({navigation}: any) => {
  
  const route = useRoute();
  const {userId, userToken} = useAuth();
  const {finalScore, testName}: any = route.params; // Access the passed score
  const {profileData} = useProfileViewModel(userToken, userId);
  const {basicDetails} = profileData || [];// Fallback to an empty object
 
  const roundedScore = Math.round(finalScore);
  console.log('Final Score:', finalScore);
  console.log('Applicant:', basicDetails);
  console.log('Test Name:', testName);
  useFocusEffect(
      React.useCallback(() => {
        const onBackPress = () => true; // Returning true disables back action
   
        BackHandler.addEventListener("hardwareBackPress", onBackPress);
        return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      }, [])
    );
  if (!profileData) {
    return <Text>Loading...</Text>; // Show a loading indicator while fetching data
  }

  return (
    <View style={styles.container}>
      <View style={styles.Items}>
        {/* Greeting Section */}
        <View style={styles.centeredView}>
        <Text style={styles.nameText}>
            Hi {basicDetails.firstName
              ? basicDetails.firstName.charAt(0).toUpperCase() + basicDetails.firstName.slice(1)
              : 'Guest'},
          </Text>
          <View style={styles.score}>
            <MaskedView
              maskElement={
                <Text style={[styles.scoreText, styles.maskedText]}>
                You scored {roundedScore}%
              </Text>
              }>
              <LinearGradient
                colors={['#F97316', '#FAA729']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.gradientBackground}
              />
            </MaskedView>
          </View>
        </View>

        {/* Common Image */}
        <Image
          source={require('../../assests/Images/Test/passed.png')}
          style={styles.Image}
        />

        {/* Conditional Rendering Based on Test Name */}
        {testName === 'General Aptitude Test' && (
          <>
            <View style={styles.messageContainer}>
              <Text style={styles.message}>
                Congratulations! You have successfully completed the
                General Aptitude Test
              </Text>
            </View>

            <Text style={styles.text}>
              Now you are eligible for{'\n'}the Technical Test
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate('TestInstruction', {
                  testName: 'Technical Test',
                })
              }>
              <LinearGradient
                colors={['#F97316', '#FAA729']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={[styles.button, {borderRadius: 10}]}>
                <Text style={styles.buttonText}>Take Test</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('BottomTab', {
                  screen: 'Badges',
                  isTestComplete: true,
                })
              }
              style={styles.later}>
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
              onPress={() =>
                navigation.navigate('BottomTab', {screen: 'Badges'})
              }>
              <LinearGradient
                colors={['#F97316', '#FAA729']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={[styles.button, {borderRadius: 10}]}>
                <Text style={styles.buttonText}>Exit</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        {testName !== 'General Aptitude Test' &&
          testName !== 'Technical Test' && (
            <>
              <View style={styles.messageContainer}>
                <Text style={styles.message}>
                  Congratulations! You are now verified for {testName}{' '}
                  test
                </Text>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate('BottomTab', {screen: 'Badges'})
                }>
                <LinearGradient
                  colors={['#F97316', '#FAA729']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={[styles.button, {borderRadius: 10}]}>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  Items: {
    backgroundColor: '#fff',
    padding: width * 0.05, // Dynamic padding based on screen width
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.95, // 95% width of the screen
    height: height * 0.9, // 90% height of the screen
  },

  nameText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 26, // Adjusted font size dynamically
    lineHeight: 27,
    color: '#000000',
  },
  score: {
    width: width * 0.6, // Adjusted width dynamically
    height: 30,
    marginTop: 15,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 28, // Adjusted font size dynamically
    lineHeight: 28,
    color: 'orange',
    marginLeft: 10,
    justifyContent: 'center',
  },
  Image: {
    width: width * 0.5, // Adjusted width dynamically
    height: width * 0.48, // Adjusted height dynamically
    marginTop: 30,
    alignSelf: 'center',
  },
  messageContainer: {
    width: 292,
    height: 62,
   
    alignItems: 'center',
  },
  message: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14, // Adjusted font size dynamically
    lineHeight: 31,
    textAlign: 'center',
    
  },
  button: {
    marginTop: 10,
    width: width * 0.9, // Adjusted width dynamically
    height: 42,
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14, // Adjusted font size dynamically
    lineHeight: 14.4,
    color: '#FFFFFF',
    marginTop: 15,
  },
  later: {
    width: width * 0.9, // Adjusted width dynamically
    height: 14,
    alignSelf: 'center',
    marginTop: 20,
    alignItems: 'center',
  },
  laterText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 14, // Adjusted font size dynamically
    lineHeight: 14.4,
    color: '#4D82D1',
  },
  maskedText: {
    color: 'black',
    backgroundColor: 'transparent',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  gradientBackground: {
    height: 25,
  },
  text: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontWeight: '500',
    fontSize: 20, // Adjusted font size dynamically
    lineHeight: 36,
    textAlign: 'center',
    color: '#000000',
    marginTop: 10,
  },
  centeredView: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center', // Ensures vertical alignment
    flexDirection: 'column', // Make sure children are stacked vertically
    width: '100%', // Ensure it takes up full width
  },
});
