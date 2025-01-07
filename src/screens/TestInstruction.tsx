import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../context/Authcontext'; // Assuming you have a useAuth hook

// Importing test data files
import aptitudeTestData from '../models/data/testData.json';
import technicalTestData from '../models/data/TechnicalTest.json';
import AngularData from '../models/data/Angular.json';
import JavaData from '../models/data/Java.json';
import CData from '../models/data/C.json';
import CppData from '../models/data/Cpp.json';
import CSharpData from '../models/data/CSharp.json';
import CSSData from '../models/data/CSS.json';
import DjangoData from '../models/data/Django.json';
import DotNetData from '../models/data/DotNet.json';
import FlaskData from '../models/data/Flask.json';
import HibernateData from '../models/data/Hibernate.json';
import HTMLData from '../models/data/HTML.json';
import JavascriptData from '../models/data/Javascript.json';
import JspData from '../models/data/Jsp.json';
import ManualTestingData from '../models/data/ManualTesting.json'
import MongoData from '../models/data/MongoDB.json';
import PythonData from '../models/data/Paython.json';
import ReactData from '../models/data/React.json';
import RegressionTestingData from '../models/data/Regression Testing.json';
import SeleniumData from '../models/data/Selenium.json';
import ServletsData from '../models/data/Servlets.json';
import SpringBootData from '../models/data/Spring Boot.json';
import TSData from '../models/data/TS.json';
import SpringData from '../models/data/Spring.json';
import SQLData from '../models/data/SQL.json'

const { width } = Dimensions.get('window');

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

const Test = ({ route, navigation }: any) => {
  const { userId, userToken } = useAuth();
  const { testName: routeTestName, testStatus: routeTestStatus, testType, skillName } = route.params || {};
  const [testName, setTestName] = useState(routeTestName || 'General Aptitude Test');
  const [testStatus, setTestStatus] = useState(routeTestStatus || 'F');
  const [step, setStep] = useState(1); // Default initial step
  const [testData, setTestData] = useState<TestData>({
    testName: '',
    duration: '',
    numberOfQuestions: 0,
    topicsCovered: [],
  });
  const [loading, setLoading] = useState(true);

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
          `https://g23jza8mtp.ap-south-1.awsapprunner.com/applicant1/tests/${userId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${userToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        if (Array.isArray(data) && data.length > 0) {
          const { testStatus: fetchedStatus, testName: fetchedName } = data[0];
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

  // Dynamically adjust step based on fetched data
  const adjustStep = (name: string, status: string) => {
    if (status === 'P' && name === 'General Aptitude Test') {
      setStep(2); // Proceed to Technical Test
    } else if (status === 'P' && name === 'Technical Test') {
      setStep(3); // Completed verification
    } else if (status === 'F' && name === 'Technical Test') {
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
        case 'DotNet':
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
          setTestData(CSSData)
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
  console.log(testType,skillName)
 

  if (loading) {
    return <Text>Loading test data...</Text>;
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.container1}>
            <MaskedView
              style={styles.maskedView}
              maskElement={
                <Text style={styles.head}>
                  {testData.testName || 'Loading...'}
                </Text>
              }
            >
              <LinearGradient
                colors={['#F97316', '#FAA729']} // Gradient colors
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBackground1}
              />
            </MaskedView>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginLeft: -20 }}>
              <View style={styles.box1}>
                <Text style={styles.text}>Duration</Text>
                <Text style={styles.text1}>{testData.duration || 'N/A'}</Text>
              </View>
              <View style={styles.box1}>
                <Text style={styles.text}>Questions</Text>
                <Text style={styles.text1}>{testData.numberOfQuestions || 0}</Text>
              </View>
            </View>
            <Text>Topics Covered</Text>
            <Text style={{ lineHeight: 27, color: 'black' }}>
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

      <View style={styles.footer}>
        <LinearGradient
          colors={['#F97316', '#FAA729']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBackground}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              // Determine the name to send based on testType
              const nameToSend = testType === 'SkillBadge' ? skillName : testData.testName;
              console.log("Navigating with",nameToSend)
              // Navigate to the TestScreen with the determined name
              navigation.navigate('TestScreen', { testName: nameToSend });
            }}
          >
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
    width: '93%',
    height: 650,
    marginTop: 20,
    marginLeft: 13,
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  container1: {
    width: '90%',
    height: 217,
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
    fontWeight: '700',
    lineHeight: 25,
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
    flex: 1,
    padding:10,
    backgroundColor: '#FFF',
  },
  text: {
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 20,
    color: '#9E9E9E',
    marginLeft: 10,
  },
  maskedView: {
    flexDirection: 'row',
    height: 40,
  },
  gradientBackground1: {
    flex: 1,
  },
  text1: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 10,
    color: '#484848',
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#000',
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
  },
  instruction: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: '#756E6E',
    lineHeight: 23,
  },
  footer: {
    height: 93,
    marginTop: 100,
    gap: 15,
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },
  gradientBackground: {
    borderRadius: 10,
    width: width * 0.9,
    height: 47,
    marginLeft: 22.5,
  },
  button: {
    width: width * 0.8,
    height: 47,
    borderRadius: 8,
    marginLeft: 22.5,
    alignItems: 'center',
  },
  start: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 26,
    padding: 10,
  },
});