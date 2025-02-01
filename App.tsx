import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useRoute} from '@react-navigation/native';

import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const {width, height} = Dimensions.get('window');

const Pass = () => {
  return (
    <View style={styles.container}>
      <View style={styles.Items}>
        <View style={styles.centeredView}>
          <Text style={styles.nameText}>Hi Vitesh Kumar,</Text>
          <View style={styles.score}>
            <MaskedView
              maskElement={
                <Text style={[styles.scoreText, styles.maskedText]}>
                  You scored {80}%
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

        <Image
          source={require('./src/assests/Images/Test/passed.png')}
          style={styles.Image}
        />
        <View style={{marginTop: 10}}>
          <Text style={styles.message}>
            Congratulations! You have successfully{'\n'}
            completed the {}.
          </Text>
          <Text style={styles.text}>
            Now you are eligible for{'\n'}the Technical Test
          </Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <LinearGradient
            colors={['#F97316', '#FAA729']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[styles.button, {borderRadius: 10}]}>
            <Text style={styles.buttonText}>Test Button</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.later}>
          <Text style={styles.laterText}>Test Later Button</Text>
        </TouchableOpacity>
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
    backgroundColor: 'red',
    padding: width * 0.05, // Dynamic padding based on screen width
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.95, // 95% width of the screen
    height: height * 0.9, // 90% height of the screen
  },

  nameText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontWeight: '700',
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
    fontWeight: '700',
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
    marginTop: 10,
    alignItems: 'center',
  },
  message: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 16, // Adjusted font size dynamically
    lineHeight: 31,
    textAlign: 'center',
    marginTop: 10,
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
    fontWeight: '700',
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
    fontSize: 22, // Adjusted font size dynamically
    lineHeight: 36,
    textAlign: 'center',
    color: '#000000',
    marginTop: 10,
  },
  centeredView: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center', // Ensures vertical alignment
    flexDirection: 'column',   // Make sure children are stacked vertically
    width: '100%',             // Ensure it takes up full width
  },
});
