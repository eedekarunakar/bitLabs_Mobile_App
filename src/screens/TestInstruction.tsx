
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Modal,
  Image,
  BackHandler
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import {useAuth} from '@context/Authcontext'; 
import aptitudeTestData from '@models/data/testData.json';
import technicalTestData from '@models/data/TechnicalTest.json';
import AngularData from '@models/data/Angular.json';
import JavaData from '@models/data/Java.json';
import CData from '@models/data/C.json';
import CppData from '@models/data/Cpp.json';
import CSharpData from '@models/data/CSharp.json';
import CSSData from '@models/data/CSS.json';
import DjangoData from '@models/data/Django.json';
import DotNetData from '@models/data/DotNet.json';
import FlaskData from '@models/data/Flask.json';
import HibernateData from '@models/data/Hibernate.json';
import HTMLData from '@models/data/HTML.json';
import JavascriptData from '@models/data/Javascript.json';
import JspData from '@models/data/Jsp.json';
import ManualTestingData from '@models/data/ManualTesting.json';
import MongoData from '@models/data/MongoDB.json';
import PythonData from '@models/data/Paython.json';
import ReactData from '@models/data/React.json';
import RegressionTestingData from '@models/data/Regression Testing.json';
import SeleniumData from '@models/data/Selenium.json';
import ServletsData from '@models/data/Servlets.json';
import SpringBootData from '@models/data/Spring Boot.json';
import TSData from '@models/data/TS.json';
import SpringData from '@models/data/Spring.json';
import SQLData from '@models/data/SQL.json';
import VueData from '@models/data/Vue.json';
import {API_BASE_URL} from '@env';
import Icon from 'react-native-vector-icons/AntDesign';

const { width, height } = Dimensions.get('window');


// Define the type for the test data
interface TestData {
  testName: string;
  duration: string;
  numberOfQuestions: number;
  topicsCovered: string[];
  questions?: {
    id: number;
    question: string;
    options: string[];
    answer: string;
  }[];
}

const Test = ({route, navigation}: any) => {
  const {userId, userToken} = useAuth();
  const {
    testName: routeTestName,
    testStatus: routeTestStatus,
    testType,
    skillName,
  } = route.params || {};
  const [testName, setTestName] = useState(
    routeTestName || 'General Aptitude Test',
  );
  const [testStatus, setTestStatus] = useState(routeTestStatus || 'F');
  const [step, setStep] = useState(1); // Default initial step
  const [testData, setTestData] = useState<TestData>({
    testName: '',
    duration: '',
    numberOfQuestions: 0,
    topicsCovered: [],
  });
  const [loading, setLoading] = useState(true);

  const [showExitModal, setShowExitModal] = useState(false);

  // Fetch API data to dynamically adjust step and test information
  useEffect(() => {
    if (testType === 'SkillBadge') {
      // Skip API call for Skill Badge Tests
      setLoading(false);
      return;
    }


    const fetchTestStatus = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/applicant1/tests/${userId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${userToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        if (Array.isArray(data) && data.length > 0) {
          const {testStatus: fetchedStatus, testName: fetchedName} = data[0];
          setTestName(fetchedName || testName); // Use current state default if undefined
          setTestStatus(fetchedStatus || testStatus);
          adjustStep(fetchedName, fetchedStatus);
        } else {
          adjustStep(testName, testStatus); // Default adjustments if no data
        }
      } catch (error) {
        setTestName('General Aptitude Test');
      }
      setLoading(false);
    };

    fetchTestStatus();
  }, [userId, userToken, testType]);

  useFocusEffect(
      React.useCallback(() => {
        const backAction = () => {
          setShowExitModal(true);
          return true;
        };
  
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
      }, [])
    );

  // Dynamically adjust step based on fetched data
  const adjustStep = (name: string, status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === 'p' && name === 'General Aptitude Test') {
      setStep(2); // Proceed to Technical Test
    } else if (lowerStatus === 'p' && name === 'Technical Test') {
      setStep(3); // Completed verification
    } else if (lowerStatus === 'f' && name === 'Technical Test') {
      setStep(2); // Retry Technical Test
    } else {
      setStep(1); // Default to Aptitude Test
    }
  };

  // Load test data dynamically
  useEffect(() => {
    if (testType === 'SkillBadge') {
      // Load Skill Badge Test data
      switch (skillName) {
        case 'Angular':
          setTestData(AngularData);
          break;
        case 'Java':
          setTestData(JavaData);
          break;
        case 'C':
          setTestData(CData);
          break;
        case 'C++':
          setTestData(CppData);
          break;
        case 'C Sharp':
          setTestData(CSharpData);
          break;
        case 'CSS':
          setTestData(CSSData);
          break;
        case 'Django':
          setTestData(DjangoData);
          break;
        case '.Net':
          setTestData(DotNetData);
          break;
        case 'Flask':
          setTestData(FlaskData);
          break;
        case 'Hibernate':
          setTestData(HibernateData);
          break;
        case 'HTML':
          setTestData(HTMLData);
          break;
        case 'JavaScript':
          setTestData(JavascriptData);
          break;
        case 'Python':
          setTestData(PythonData);
          break;
        case 'JSP':
          setTestData(JspData);
          break;
        case 'Manual Testing':
          setTestData(ManualTestingData);
          break;
        case 'Mongo DB':
          setTestData(MongoData);
          break;
        case 'React':
          setTestData(ReactData);
          break;
        case 'Regression Testing':
          setTestData(RegressionTestingData);
          break;
        case 'Selenium':
          setTestData(SeleniumData);
          break;
        case 'Servlets':
          setTestData(ServletsData);
          break;
        case 'Spring Boot':
          setTestData(SpringBootData);
          break;
        case 'TypeScript':
          setTestData(TSData);
          break;
        case 'Spring':
          setTestData(SpringData);
          break;
        case 'SQL':
          setTestData(SQLData);
          break;
        case 'Css':
          setTestData(CSSData);
          break;
        case 'MySQL':
          setTestData(SQLData);
          break;
        case 'Vue':
          setTestData(VueData);
          break;
        case 'SQL-Server':
          setTestData(SQLData);
          break;
        default:
          setTestData({
            testName: 'Unknown Skill Test',
            duration: 'N/A',
            numberOfQuestions: 0,
            topicsCovered: [],
          });
          break;
      }
    } else {
      // Load Aptitude/Technical Test data
      if (step === 1) {
        setTestData(aptitudeTestData);
      } else if (step === 2) {
        setTestData(technicalTestData);
      } else {
        setTestData({
          testName: '',
          duration: '',
          numberOfQuestions: 0,
          topicsCovered: [],
        });
      }
    }
  }, [step, testType, testName]);

  console.log(testType, skillName);

  if (loading) {
    return (
      <Text style={{fontFamily: 'PlusJakartaSans-Medium', fontSize: 14}}>
        Loading test data...
      </Text>
    );
  }
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.headerContainer}>

        <TouchableOpacity onPress={() => setShowExitModal(true)} style={styles.backButton}>
          <Icon name="arrowleft" size={24} color="#495057" />
        </TouchableOpacity>

      </View>
      <ScrollView style={{ flexGrow: 1 }}>

        <View style={styles.container}>
          <View style={styles.container1}>
            <MaskedView
              style={styles.maskedView}
              maskElement={
                <Text style={styles.head}>
                  {testData.testName || 'Loading...'}
                </Text>
              }>
              <LinearGradient
                colors={['#F97316', '#FAA729']} // Gradient colors
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.gradientBackground1}
              />
            </MaskedView>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginLeft: -20,
              }}>
              <View style={styles.box1}>
                <Text style={styles.text}>Duration</Text>
                <Text style={styles.text1}>{testData.duration || 'N/A'}</Text>
              </View>
              <View style={styles.box1}>
                <Text style={styles.text}>Questions</Text>
                <Text style={styles.text1}>
                  {testData.numberOfQuestions || 0}
                </Text>
              </View>
            </View>

            <Text style={{ color: '#797979', fontFamily: 'PlusJakartaSans-Medium' }}>Topics Covered</Text>
            <Text style={{ lineHeight: 27, color: 'black', fontFamily: 'PlusJakartaSans-Bold', }}>
              {Array.isArray(testData.topicsCovered) && testData.topicsCovered.length > 0

                ? `${testData.topicsCovered.join(', ')}`
                : 'No topics available'}
            </Text>
          </View>

          <View style={styles.container2}>
            <Text style={styles.heading}>Instructions</Text>

            {/* Individual Points */}
            {[
              'You need to score at least 70% to pass the exam.',
              'Once started, the test cannot be paused or reattempted during the same session.',
              'If you score below 70%, you can retake the exam after 7 days.',
              'Ensure all questions are answered before submitting, as your first submission will be final.',
              'Please complete the test independently. External help is prohibited.',
              'Make sure your device is fully charged and has a stable internet connection before starting the test.',
            ].map((instruction, index) => (
              <View key={index} style={styles.point}>
                <Text style={styles.bullet}>{'\u2022'}</Text>
                <Text style={styles.instruction}>{instruction}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal visible={showExitModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setShowExitModal(false)} // Close the modal
            >
              <Icon name="close" size={20} color={'0D0D0D'} />
            </TouchableOpacity>

            <Image source={require('../assests/Images/Test/Warning.png')} style={styles.Warning} />

            <Text style={styles.modalText}>Do you really want to exit?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: '#FFF',
                    borderColor: '#9D9D9D',
                    borderWidth: 0.96,
                  },
                ]}
                onPress={() => setShowExitModal(false)} // Close the modal
              >
                <Text style={[styles.modalButtonText, {color: 'grey'}]}>
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowExitModal(false); // Close modal first
                  setTimeout(() => {
                    navigation.goBack(); // Navigate after a short delay
                  }, 300); // Adjust timing as needed
                }}
              >
                <LinearGradient
                  colors={['#F97316', '#FAA729']} // Gradient colors

                  start={{ x: 0, y: 0 }} // Gradient start point
                  end={{ x: 1, y: 1 }}   // Gradient end point
                  style={[styles.modalButton, { borderRadius: 10, width: width * 0.41 }]} // Ensure borderRadius matches your button's design

                >
                  <Text style={styles.modalButtonText}>Yes</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.footer}>
        <LinearGradient
          colors={['#F97316', '#FAA729']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.gradientBackground}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              // Determine the name to send based on testType

              const nameToSend = testType === 'SkillBadge' ? skillName : testData.testName;
              console.log("Navigating with", nameToSend)

              // Navigate to the TestScreen with the determined name
              navigation.navigate('TestScreen', {testName: nameToSend});
            }}>
            <Text style={styles.start}>Start</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

export default Test;

const styles = StyleSheet.create({
  container: {
    width: width * 0.93,

    height: 690,

    marginTop: 20,
    marginLeft: 13,
    borderRadius: 8,
    backgroundColor: '#FFF',
    marginBottom:10
  },
  container1: {
    width: '90%',
    height: 220,
    marginTop: 15,
    marginLeft: 20,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    padding: 15,
    justifyContent: 'space-around',
  },
  head: {
    color: 'orange',
    fontSize: 20,
    lineHeight: 20,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  box1: {
    width: 98,
    height: 62,
    marginLeft: 20,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'space-evenly',
  },
  container2: {

    alignContent: 'center',
    marginLeft: 20,

  },
  text: {
    fontSize: 12,
    lineHeight: 20,
    color: '#9E9E9E',
    marginLeft: 10,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  maskedView: {
    flexDirection: 'row',
    height: 40,
  },
  gradientBackground1: {
    flex: 1,
  },
  text1: {
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 10,
    color: '#484848',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  heading: {
    fontSize: 18,
    marginBottom: 16,
    color: '#000',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  point: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bullet: {
    fontSize: 18,
    color: 'grey',
    marginRight: 8,
    lineHeight: 22,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  instruction: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: '#756E6E',
    lineHeight: 23,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  footer: {
    height: height * 0.075,
    gap: height * 0.015, // Responsive gap
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },
  gradientBackground: {
    borderRadius: 10,
    width: width * 0.9,
    height: 40,
    marginLeft: 22.5,
    justifyContent: 'center',
  },
  button: {
    width: '100%',
    height: height*0.06,
    borderRadius: width * 0.02,
    marginLeft: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  start: {
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: width * 0.045, // Scales based on screen width
    lineHeight: height * 0.03,
    marginRight:40

  },
  headerContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: 50,

    backgroundColor: '#FFF'

  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
  modalContainer: {
    flex: 1,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '95%',
    height: 337,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F97316',
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 14,
    color: '#FFF',
    fontFamily: 'PlusJakartaSans-Medium',
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
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  Warning: {
    width: 85,
    height: 73,
  },

  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
});
