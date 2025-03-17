import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

interface SkillCardProps {
  skillName: string;
  status: 'PASSED' | 'FAILED' | null;
  onPress: () => void | null;
  disabled?: boolean;
  timer?: { days: number; hours: number; minutes: number } | null;
}

const testImage: Record<string, any> = {
  Angular: require('@assests/Images/Test/Angular.png'),
  Java: require('@assests/Images/Test/Java.png'),
  C: require('@assests/Images/Test/C.png'),
  'C++': require('@assests/Images/Test/CPlusPlus.png'),
  'C Sharp': require('@assests/Images/Test/CSharp.png'),
  CSS: require('@assests/Images/Test/CSS.png'),
  Django: require('@assests/Images/Test/Django.png'),
  '.Net': require('@assests/Images/Test/DotNet.png'),
  Flask: require('@assests/Images/Test/Flask.png'),
  Hibernate: require('../../assests/Images/Test/Hibernate.png'),
  HTML: require('@assests/Images/Test/HTML.png'),
  JavaScript: require('@assests/Images/Test/JavaScript.png'),
  JSP: require('@assests/Images/Test/JSP.png'),
  'Manual Testing': require('@assests/Images/Test/ManualTesting.png'),
  'Mongo DB': require('@assests/Images/Test/MongoDB.png'),
  Python: require('@assests/Images/Test/Python.png'),
  React: require('@assests/Images/Test/React.png'),
  'Regression Testing': require('@assests/Images/Test/RegressionTesting.png'),
  Selenium: require('@assests/Images/Test/Selenium.png'),
  Servlets: require('@assests/Images/Test/Servlets.png'),
  'Spring Boot': require('@assests/Images/Test/SpringBoot.png'),
  TypeScript: require('@assests/Images/Test/TypeScript.png'),
  Spring: require('@assests/Images/Test/Spring.png'),
  SQL: require('@assests/Images/Test/MySQL.png'),
  Css: require('@assests/Images/Test/CSS.png'),
  MySQL: require('@assests/Images/Test/MySQL.png'),
  Vue: require('@assests/Images/Test/Vue.png'),
  'SQL-Server': require('@assests/Images/Test/sqlserver.png'),
};

const SkillCard: React.FC<SkillCardProps> = ({
  skillName,
  status,
  onPress,
  disabled = false,
  timer = null,
}) => {
  const imageSource = testImage[skillName] || require('@assests/Images/Test/NotFound.png');

  return (
    <View style={styles.card}>
      {status && (
        <View style={styles.statusContainer}>
          <Text
            style={[
              styles.badgeStatus,
              status === 'PASSED' ? styles.passed : styles.failed,
            ]}>
            {status}
          </Text>
        </View>
      )}
      <Image source={imageSource} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{skillName}</Text>
      {status === 'FAILED' && timer ? (
        <LinearGradient
          colors={['#d3d3d3', '#d3d3d3']}
          style={[styles.gradientBackground, styles.timerContain]}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.timerText1}>Retake test in</Text>
            <Text style={styles.timerText1}>
              {timer.days}d {timer.hours}h {timer.minutes}m
            </Text>
          </View>
        </LinearGradient>
      ) : (
        <TouchableOpacity
          style={[styles.button, status === 'PASSED' && styles.verifiedButton]}
          onPress={onPress}
          disabled={disabled}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {status === 'PASSED' ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="check" size={19} color="white" style={{ marginRight: 5 }} />
                <Text style={styles.verifiedText}>Verified</Text>
                </View>
            ) : (

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Text style={styles.buttonText}>{status === 'FAILED' ? 'Retake Test' : 'Take Test'}</Text>
                <Icon name="external-link" size={20} color="white" style={{ marginRight: 5 }}/>
              </View>

            )}
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SkillCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: 190,
    height: 210,
    marginRight: 16,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  cardImage: {
    width: 100,
    height: 90,
    padding: 15,
    resizeMode: 'contain',
    borderRadius: 10,
    marginTop: 30,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#000000',
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 0,
    width: 190,
    height: 45,
    backgroundColor: '#374A70',
    alignItems: 'center',
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  statusContainer: {
    position: 'absolute',
    top: 3,
    right: 5,
    paddingHorizontal: 5,
    borderRadius: 8,
  },
  verifiedButton: {
    backgroundColor: 'green',
    justifyContent: 'center',
  },
  verifiedText: {
    color: 'white',
    fontFamily: 'PlusJakartaSans-Bold',
    textAlignVertical: 'center',
  },
  failed: {
    backgroundColor: '#f8d7da',
    color: 'red',
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 10,
  },
  gradientBackground: {
    marginTop: 20,
    borderRadius: 10,
    height: 40,
  },
  timerContain: {
    bottom: 5,
    width: 190,
    height: 40,
    alignItems: 'center',
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    flexDirection: 'row',
  },
  timerText1: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 12,
    fontWeight: '400',
    color: 'black',
    marginRight: 5,
    lineHeight: 20,
    marginBottom: 1,
  },
  badgeStatus: {
    fontSize: 14,
    padding: 5,
    borderRadius: 5,
    textTransform: 'capitalize',
  },
  passed: {
    backgroundColor: '#d4edda',
    color: 'green',
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 10,
  },
});