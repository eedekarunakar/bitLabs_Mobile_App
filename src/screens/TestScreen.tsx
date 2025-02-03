import React, { useState, useEffect ,useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, SafeAreaView, Dimensions, Image, BackHandler,  AppState,Alert, ScrollView } from 'react-native';
import { useAuth } from '../context/Authcontext'; // Assuming you have an auth context for JWT
import { useFocusEffect } from '@react-navigation/native';
import { useTestViewModel } from '../viewmodel/Test/TestViewModel'; // Import ViewModel
import { RadioButton } from 'react-native-paper'; // Ensure this is imported for RadioButton
import { LinearGradient } from 'react-native-linear-gradient'; // Import LinearGradient for gradient background
import Icon from 'react-native-vector-icons/AntDesign'; // Assuming you're using AntDesign for icons
import Header from '../components/CustomHeader/Header';
import { submitTestResult } from '../services/Test/testService';
import { useSkillTestViewModel } from '../viewmodel/Test/skillViewModel';
import NetInfo from '@react-native-community/netinfo';
import { decode } from "html-entities";

const { width } = Dimensions.get('window');

const TestScreen = ({ route, navigation }: any) => {
  const { testName } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answer, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(2 * 60); // Added state for time left (5 minutes = 300 seconds)
  const { userEmail, userId, userToken } = useAuth(); // Assuming userToken is retrieved from context
  const [errorMessage, setErrorMessage] = useState<string>(''); // Error message state
  const [testData, setTestData] = useState<{ questions: any[] }>({ questions: [] });
  const [testStatus, settestStatus] = useState<string>('');
  const [isNetworkAvailable, setIsNetworkAvailable] = useState<boolean>(true); // Default to true // Network state
  const [disconnectedTime, setDisconnectedTime] = useState<number>(0); // Time duration of network disconnection
  const [hasExceededTimeout, setHasExceededTimeout] = useState(false);
  const {
    submitSkillTest,
  } = useSkillTestViewModel(userId, userToken, testName);


  const {
    isTestComplete,
    showEarlySubmissionModal,
    setShowEarlySubmissionModal,
    setIsTestComplete,
    submitTest,
  } = useTestViewModel(userId, userToken, testName);
  const [finalScore, setFinalScore] = useState<number>(0); // State to hold final score

  let timerInterval: NodeJS.Timeout;

  const appState = useRef(AppState.currentState); // Track app state
  const [appStateVisible, setAppStateVisible] = useState(appState.current); // Current app state
  const backgroundTime = useRef<number | null>(null); // Track background time

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came to the foreground
        if (backgroundTime.current) {
          const elapsedTime = Math.floor((Date.now() - backgroundTime.current) / 1000); // Calculate elapsed time in seconds
          setTimeLeft((prevTime) => prevTime - elapsedTime); // Subtract elapsed time from the timer
        }
      } else if (nextAppState.match(/inactive|background/)) {
        // App went to the background
        backgroundTime.current = Date.now(); // Store the time when the app went to the background
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Log the testName to check what value was sent
    console.log('Test Name received in TestScreen:', testName);
  }, [testName]);


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsNetworkAvailable(state.isConnected ?? false); // Use false if `state.isConnected` is null
    });

    return () => {
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (!isNetworkAvailable) {
      setDisconnectedTime((prevTime) => prevTime + 1);
    } else if (disconnectedTime >= 60) {
      setHasExceededTimeout(true); // Mark that the timeout was exceeded
    } else {
      setDisconnectedTime(0);
    }
  }, [isNetworkAvailable]);

  useEffect(() => {
    if (disconnectedTime >= 60) {
      clearInterval(timerInterval);
      handleModalConfirm();
      setHasExceededTimeout(true); // Ensure reconnection doesn't overwrite
    }
  }, [disconnectedTime]);

  useEffect(() => {
    if (isNetworkAvailable && hasExceededTimeout) {
      handleModalConfirm(); // Call again if needed
    }
  }, [isNetworkAvailable, hasExceededTimeout]);

  useEffect(() => {
    if (isTestComplete || showEarlySubmissionModal) {
      clearInterval(timerInterval);
      return;
    }
    if (timeLeft === 0) {
      setIsTestComplete(true);
      goToTimeUpScreen(); // Navigate to TimeUp screen when time is up
      return;
    }

    timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerInterval);
          setIsTestComplete(true);
          goToTimeUpScreen(); // Navigate to TimeUp screen when time is up
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeLeft, isTestComplete, showEarlySubmissionModal]);

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        setShowEarlySubmissionModal(true);
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }, [])
  );
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    if (!testName) return; // Ensure testName is available before fetching data

    let fetchedTestData;

    switch (testName) {
      case 'General Aptitude Test':
        fetchedTestData = require('../models/data/testData.json');
        break;
      case 'Technical Test':
        fetchedTestData = require('../models/data/TechnicalTest.json');
        break;
      case 'Angular':
        fetchedTestData = require('../models/data/Angular.json');
        break;
      case 'Java':
        fetchedTestData = require('../models/data/Java.json');
        break;
      case 'C':
        fetchedTestData = require('../models/data/C.json');
        break;
      case 'Cpp':
        fetchedTestData = require('../models/data/Cpp.json');
        break;
      case 'C Sharp':
        fetchedTestData = require('../models/data/CSharp.json');
        break;
      case 'CSS':
        fetchedTestData = require('../models/data/CSS.json');
        break;
      case 'Django':
        fetchedTestData = require('../models/data/Django.json');
        break;
      case '.Net':
        fetchedTestData = require('../models/data/DotNet.json');
        break;
      case 'Flask':
        fetchedTestData = require('../models/data/Flask.json');
        break;
      case 'Hibernate':
        fetchedTestData = require('../models/data/Hibernate.json');
        break;
      case 'HTML':
        fetchedTestData = require('../models/data/HTML.json');
        break;
      case 'JavaScript':
        fetchedTestData = require('../models/data/Javascript.json');
        break;
      case 'JSP':
        fetchedTestData = require('../models/data/Jsp.json');
        break;
      case 'Manual Testing':
        fetchedTestData = require('../models/data/ManualTesting.json');
        break;
      case 'Mongo DB':
        fetchedTestData = require('../models/data/MongoDB.json');
        break;
      case 'Python':
        fetchedTestData = require('../models/data/Paython.json');
        break;
      case 'React':
        fetchedTestData = require('../models/data/React.json');
        break;
      case 'Regression Testing':
        fetchedTestData = require('../models/data/Regression Testing.json');
        break;
      case 'Selenium':
        fetchedTestData = require('../models/data/Selenium.json');
        break;
      case 'Servlets':
        fetchedTestData = require('../models/data/Servlets.json');
        break;
      case 'Spring Boot':
        fetchedTestData = require('../models/data/Spring Boot.json');
        break;
      case 'TypeScript':
        fetchedTestData = require('../models/data/TS.json');
        break;
      case 'Spring':
        fetchedTestData = require('../models/data/Spring.json');
        break;
      case 'SQL':
        fetchedTestData = require('../models/data/SQL.json');
        break;
      case 'Css':
        fetchedTestData = require('../models/data/CSS.json');
        break;
      case 'MySQL':
        fetchedTestData = require('../models/data/SQL.json');
        break;
      case 'Vue':
        fetchedTestData = require('../models/data/Vue.json');
        break;
      case 'C++':
        fetchedTestData = require('../models/data/Cpp.json');
        break;  
      default:
        console.error(`No data found for test: ${testName}`);
        return;
    }

    if (fetchedTestData) {
      const shuffledQuestions = shuffleArray(fetchedTestData.questions); // Shuffle questions
      setTestData({ questions: shuffledQuestions });
      const durationString = fetchedTestData?.duration || "30 mins"; // Default duration
      const durationInSeconds = parseDuration(durationString); // Convert duration to seconds
      setTimeLeft(durationInSeconds); // Set time left
    }
  }, [testName]); // Re-run when testName changes

  const parseDuration = (duration: string): number => {
    const match = duration.match(/(\d+)\s*(mins?|hr|hours?)/i);

    if (match) {
      const value = parseInt(match[1]); // Get the numerical value
      const unit = match[2].toLowerCase(); // Get the unit (minute or hour)
      if (unit.includes('hr')) {
        return value * 3600; // Convert hours to seconds
      } else if (unit.includes('min')) {
        return value * 60; // Convert minutes to seconds
      }
    }

    return 1800; // Default to 30 mins if no match (30 mins = 1800 seconds)
  };


  const calculateScore = () => {
    let score = 0;
    for (let i = 0; i < testData.questions.length; i++) {
      const currentQuestion = testData.questions[i];
      if (answer[i] && currentQuestion?.answer && answer[i] === currentQuestion.answer) {
        score += 1;
      }
    }
    return score;
  };

  const handleModalConfirm = async () => {
    setShowEarlySubmissionModal(false);
    clearInterval(timerInterval); // Ensure the timer is cleared for early submission
    const finalScore = 0; // Score is 0 for early submission
    console.log('Submitting test with score:', finalScore);
    if (testName === 'Technical Test' || testName === 'General Aptitude Test') {
      await submitTest(finalScore, true);
    } else {
      await submitSkillTest(finalScore, true);
    }
  };
  const goToTimeUpScreen = async () => {
    clearInterval(timerInterval); // Clear the timer if time's up
    const finalScore = calculateScore(); // Calculate the score
    const percentageScore = parseFloat(((finalScore / testData.questions.length) * 100).toFixed(2));
    setFinalScore(percentageScore); // Store final score in state
    navigation.navigate('TimeUp', { finalScore: percentageScore, testName:testName}); // Pass the score to TimeUp screen
  };
  const currentQuestion =
    testData.questions && currentQuestionIndex < testData.questions.length
      ? testData.questions[currentQuestionIndex]
      : null;

  const handleAnswerSelect = (index: number, answer: string) => {
    setSelectedAnswer(answer);
    setAnswers((prevAnswers) => ({ ...prevAnswers, [index]: answer }));
    setErrorMessage('');
  };
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      // Restore the previously selected answer when going back
      const previousAnswer = answer[currentQuestionIndex - 1] || null;
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(previousAnswer); // Set the previously selected answer
      setErrorMessage(''); // Clear error message when going back
 
    }
  };

  const goToNextQuestion = async () => {
    if (!selectedAnswer) {
      // Show an alert if no answer is selected
      setErrorMessage('Please provide your answer before moving to the next question.');
      return;
    }
 
    // Save the selected answer before proceeding
    setAnswers((prevAnswers) => ({ ...prevAnswers, [currentQuestionIndex]: selectedAnswer }));
 
    if (currentQuestionIndex < testData.questions.length - 1) {
      // Move to the next question
      const nextAnswer = answer[currentQuestionIndex + 1] || null;
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(nextAnswer); // Reset the selected answer for the next question
      setErrorMessage(''); // Clear error message when moving to the next question
    } else {
      // Submit the test if it is the last question
      clearInterval(timerInterval);
      const finalScore = calculateScore();
      const percentageScore = parseFloat(((finalScore / testData.questions.length) * 100).toFixed(2));
      console.log('Final score (on submit):', percentageScore); // Debug
      if (testName === 'Technical Test' || testName === 'General Aptitude Test') {
        await submitTest(percentageScore, false);
      } else {
        await submitSkillTest(percentageScore, false);
      }
    }
  };
  if (!isNetworkAvailable) {
    return (
      <SafeAreaView style={styles.container1}>
        <View style={{ backgroundColor: '#FFF', justifyContent: 'center', borderRadius: 10, padding: 20 }}>
          <Text style={styles.errorText1}>Your test has been interrupted.Kindly try again later.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <Header
        onBackPress={() => {
          setShowEarlySubmissionModal(true);
        }}
        title={testName}
      />
      {/* Other components and UI elements */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          Question {currentQuestionIndex + 1} / {testData?.questions?.length || 0}
        </Text>
        <View style={styles.timerContainer}>
          <Icon name="clockcircleo" size={18} color="#F46F16" style={{ marginLeft: 15 }} />
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
      </View>

      <View style={styles.separator} />

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {currentQuestionIndex + 1}. {decode(currentQuestion?.question || "")} 
        </Text>
      </View>
      <FlatList
        data={currentQuestion?.options || []}
        keyExtractor={(item, index) => `${currentQuestion?.id}-${index}`}
        renderItem={({ item, index }) => {
          const isSelected = answer[currentQuestionIndex] === item;

          return (
            <TouchableOpacity
              style={styles.optionContainer}
              onPress={() => handleAnswerSelect(currentQuestionIndex, item)}
            >
              <View style={[styles.radioButton, isSelected && styles.selectedRadioButton]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.optionText}>{decode(item)}</Text>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={
          errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null
        }
      />





      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.backButton,
            currentQuestionIndex === 0 && { backgroundColor: '#D3D3D3', borderColor: '#D3D3D3' }
          ]}
          onPress={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <Text
            style={[
              styles.navigationButtonText1,
              currentQuestionIndex === 0 && { color: '#fff' }
            ]}
          >
            Back
          </Text>
        </TouchableOpacity>
 
        <TouchableOpacity onPress={goToNextQuestion}>
          <LinearGradient
            colors={['#F97316', '#FAA729']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBackground}
          >
            <Text style={styles.navigationButtonText}>
              {currentQuestionIndex === testData.questions.length - 1
                ? 'Submit Test'
                : 'Next'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>


      {/* Modals */}
      {showEarlySubmissionModal && (
        <Modal
          visible={!!showEarlySubmissionModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent1}>
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => setShowEarlySubmissionModal(false)} // Close the modal
              >
                <Icon name="close" size={20} color={'0D0D0D'} />
              </TouchableOpacity>
              <Image source={require('../assests/Images/Test/Warning.png')} style={styles.Warning} />
              <Text style={styles.modalText}>Do you really want to exit?</Text>
              <Text style={styles.modalText1}>
                Exiciting will erase your progress and prevent retaking{"\n"}the test for 7 days.Proceed?
              </Text>
              <View style={styles.modalOptions}>
                <TouchableOpacity
                  onPress={() => setShowEarlySubmissionModal(false)} // Close the modal
                  style={[styles.modalButton, { backgroundColor: '#FFF', borderColor: '#9D9D9D', borderWidth: 0.96 }]}
                >
                  <Text style={[styles.modalButtonText, { color: 'grey' }]}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsTestComplete(true);
                    setShowEarlySubmissionModal(true);
                    handleModalConfirm();
                    navigation.navigate('FailContent'); // Navigate to failure screen
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
      )}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  headerText: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#F68318',
  },
  timerContainer: {
    width: 115.5, // Set the width
    height: 33.25, // Set the height
    flexShrink: 0, // Prevent shrinking
    flexDirection: 'row', // Ensure content is aligned horizontally
    alignItems: 'center', // Vertically align items
    justifyContent: 'flex-start', // Align items to the start (left)
    borderColor:'#F46F16',
    borderWidth:1,
    borderRadius: 5,
  },
  timerText: {
    fontSize: 18,
    color: '#F46F16',
    marginLeft: 8,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  questionContainer: {
    padding: 16,
    height: 'auto',
    width: width * 0.9,
    marginLeft: 20,
  },
  questionText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontWeight: 500,
    fontSize: 16,
    color: '#000000',
    lineHeight: 25

  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    marginLeft: 25,
    width: width * 0.85
  },
  optionText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontWeight: 500,
    fontSize: 14.5,
    color: '#000000',
    marginLeft: 5,
    lineHeight: 25
  },
  errorText: {
    fontFamily: 'PlusJakartaSans-Medium',
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    marginLeft: 25,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',

    height: 93,
    backgroundColor: '#FFF'
  },
  backButton: {
    width: 161.25,
    padding: 10,
    borderRadius: 7.68,
    borderWidth: 0.96,
    borderColor: '#F97316',
    alignItems: 'center',
    marginLeft: '2%'
  },
  navigationButtonText1: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#F97316',
  },
  gradientBackground: {
    width: 162.21,
    padding: 12,
    borderRadius: 8,

  },
  navigationButtonText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
    color: '#FFF',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent1: {
    width: '95%',
    height: 337,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: '95%',
    height: '95%',
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Warning: {
    width: 85,
    height: 73,
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
    height: 124.2
  },
  modalText1: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 25,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  modalOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30
  },
  modalButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F97316',
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  modalButton1: {
    borderRadius: 7.68,
    alignItems: 'center',
    padding: 10,
    width: width * 0.9,
    height: 45,
    backgroundColor: 'orange'
  },
  modalButtonText: {
    fontSize: 14,
    color: '#FFF',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
  },
  errorText1: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 18,
    color: 'grey',
    textAlign: 'center',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#EAEAEA", // Grey outline
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EAEAEA", // Initially filled with grey
    marginRight: 10,
  },
  selectedRadioButton: {
    backgroundColor: "#EAEAEA", // Keep grey when selected
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#F68318", // Orange dot in the middle when selected
  },
});
export default TestScreen;