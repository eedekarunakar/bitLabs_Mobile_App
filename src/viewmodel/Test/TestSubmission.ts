import {useState, useEffect, useCallback} from 'react';
import {AppState, BackHandler} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {useFocusEffect} from '@react-navigation/native';
import {useTestViewModel} from '@viewmodel/Test/TestViewModel'; // Import the useTestViewModel hook
import {useSkillTestViewModel} from '@viewmodel/Test/skillViewModel'; // Import the useSkillTestViewModel hook

export const useSubmissionModel = (
  userId: number | null,
  userToken: string | null,
  testName: string,
  navigation: any,
) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [timeLeft, setTimeLeft] = useState(2 * 60); // 2 minutes for testing
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [testData, setTestData] = useState<{questions: any[]}>({questions: []});
  const [isNetworkAvailable, setIsNetworkAvailable] = useState<boolean>(true);
  const [hasExceededTimeout, setHasExceededTimeout] = useState(false);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const {submitSkillTest} = useSkillTestViewModel(userId, userToken, testName);
  const {
    isTestComplete,
    showEarlySubmissionModal,
    setShowEarlySubmissionModal,
    setIsTestComplete,
    submitTest,
  } = useTestViewModel(userId, userToken, testName);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  let timerInterval: NodeJS.Timeout;

  // Handle app state changes (background/foreground)
  useEffect(() => {
    let backgroundStartTime: number | null = null;

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background') {
        backgroundStartTime = Date.now();
        clearInterval(timerInterval);
      } else if (nextAppState === 'active' && backgroundStartTime) {
        const elapsedTime = Math.floor((Date.now() - backgroundStartTime) / 1000);
        setTimeLeft(prevTime => Math.max(0, prevTime - elapsedTime));
        backgroundStartTime = null;
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  // Handle network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsNetworkAvailable(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  // Handle test timer
  useEffect(() => {
    if (isTestComplete || showEarlySubmissionModal || isTestSubmitted) {
      clearInterval(timerInterval);
      return;
    }
    if (timeLeft === 0) {
      setIsTestComplete(true);
      goToTimeUpScreen();
      return;
    }

    timerInterval = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeLeft, isTestComplete, showEarlySubmissionModal, isTestSubmitted]);

  // Handle back button press
  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        setShowEarlySubmissionModal(true);
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }, []),
  );

  // Load test data based on testName
  useEffect(() => {
    if (!testName) return;

    let fetchedTestData;

    switch (testName) {
      case 'General Aptitude Test':
        fetchedTestData = require('../../models/data/testData.json');
        break;
      case 'Technical Test':
        fetchedTestData = require('../../models/data/TechnicalTest.json');
        break;
      case 'Angular':
        fetchedTestData = require('../../models/data/Angular.json');
        break;
      case 'Java':
        fetchedTestData = require('../../models/data/Java.json');
        break;
      case 'C':
        fetchedTestData = require('../../models/data/C.json');
        break;
      case 'C++':
        fetchedTestData = require('../../models/data/Cpp.json');
        break;
      case 'C Sharp':
        fetchedTestData = require('../../models/data/CSharp.json');
        break;
      case 'CSS':
        fetchedTestData = require('../../models/data/CSS.json');
        break;
      case 'Django':
        fetchedTestData = require('../../models/data/Django.json');
        break;
      case '.Net':
        fetchedTestData = require('../../models/data/DotNet.json');
        break;
      case 'Flask':
        fetchedTestData = require('../../models/data/Flask.json');
        break;
      case 'Hibernate':
        fetchedTestData = require('../../models/data/Hibernate.json');
        break;
      case 'HTML':
        fetchedTestData = require('../../models/data/HTML.json');
        break;
      case 'JavaScript':
        fetchedTestData = require('../../models/data/Javascript.json');
        break;
      case 'JSP':
        fetchedTestData = require('../../models/data/Jsp.json');
        break;
      case 'Manual Testing':
        fetchedTestData = require('../../models/data/ManualTesting.json');
        break;
      case 'Mongo DB':
        fetchedTestData = require('../../models/data/MongoDB.json');
        break;
      case 'Python':
        fetchedTestData = require('../../models/data/Paython.json');
        break;
      case 'React':
        fetchedTestData = require('../../models/data/React.json');
        break;
      case 'Regression Testing':
        fetchedTestData = require('../../models/data/Regression Testing.json');
        break;
      case 'Selenium':
        fetchedTestData = require('../../models/data/Selenium.json');
        break;
      case 'Servlets':
        fetchedTestData = require('../../models/data/Servlets.json');
        break;
      case 'Spring Boot':
        fetchedTestData = require('../../models/data/Spring Boot.json');
        break;
      case 'TypeScript':
        fetchedTestData = require('../../models/data/TS.json');
        break;
      case 'Spring':
        fetchedTestData = require('../../models/data/Spring.json');
        break;
      case 'SQL':
        fetchedTestData = require('../../models/data/SQL.json');
        break;
      case 'Css':
        fetchedTestData = require('../../models/data/CSS.json');
        break;
      case 'MySQL':
        fetchedTestData = require('../../models/data/SQL.json');
        break;
      case 'Vue':
        fetchedTestData = require('../../models/data/Vue.json');
        break;
      case 'SQL-Server':
        fetchedTestData = require('../../models/data/SQL.json');
        break;
      default:
        console.error(`No data found for test: ${testName}`);
        return;
    }
    if (fetchedTestData) {
      const shuffledQuestions = shuffleArray(fetchedTestData.questions);
      setTestData({questions: shuffledQuestions});
      const durationString = fetchedTestData?.duration || '30 mins';
      const durationInSeconds = parseDuration(durationString);
      setTimeLeft(durationInSeconds);
    }
  }, [testName]);

  // Helper functions
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const parseDuration = (duration: string): number => {
    const regex = /(\d+)\s*(mins?|hr|hours?)/i;
    const match = regex.exec(duration);

    if (match) {
      const value = parseInt(match[1], 10);
      const unit = match[2].toLowerCase();

      if (unit.includes('hr')) {
        return value * 3600;
      } else if (unit.includes('min')) {
        return value * 60;
      }
    }

    return 1800; // Default to 30 mins
  };

  const calculateScore = () => {
    let score = 0;
    for (let i = 0; i < testData.questions.length; i++) {
      const currentQuestion = testData.questions[i];
      if (answers[i] && currentQuestion?.answer && answers[i] === currentQuestion.answer) {
        score += 1;
      }
    }
    return score;
  };

  const handleModalConfirm = async () => {
    setShowEarlySubmissionModal(false);
    clearInterval(timerInterval);
    const finalScore = 0; // Score is 0 for early submission
    if (testName === 'Technical Test' || testName === 'General Aptitude Test') {
      await submitTest(finalScore, true);
    } else {
      await submitSkillTest(finalScore, true);
    }
  };

  const goToTimeUpScreen = async () => {
    clearInterval(timerInterval);
    const finalScore = calculateScore();
    const percentageScore = parseFloat(((finalScore / testData.questions.length) * 100).toFixed(2));
    navigation.navigate('TimeUp', {finalScore: percentageScore, testName});
  };

  const handleAnswerSelect = (index: number, answer: string) => {
    setSelectedAnswer(answer);
    setAnswers(prevAnswers => ({...prevAnswers, [index]: answer}));
    setErrorMessage('');
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const previousAnswer = answers[currentQuestionIndex - 1] || null;
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(previousAnswer);
      setErrorMessage('');
    }
  };

  const goToNextQuestion = async () => {
    if (!selectedAnswer) {
      setErrorMessage('Please provide your answer before moving to the next question.');
      return;
    }

    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [currentQuestionIndex]: selectedAnswer,
    }));

    if (currentQuestionIndex < testData.questions.length - 1) {
      const nextAnswer = answers[currentQuestionIndex + 1] || null;
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(nextAnswer);
      setErrorMessage('');
    } else {
      setIsTestSubmitted(true);
      const finalScore = calculateScore();
      const percentageScore = parseFloat(
        ((finalScore / testData.questions.length) * 100).toFixed(2),
      );
      if (testName === 'Technical Test' || testName === 'General Aptitude Test') {
        await submitTest(percentageScore, false);
      } else {
        await submitSkillTest(percentageScore, false);
      }
    }
  };

  return {
    currentQuestionIndex,
    selectedAnswer,
    answers,
    timeLeft,
    errorMessage,
    testData,
    isNetworkAvailable,
    hasExceededTimeout,
    isTestSubmitted,
    isTestComplete,
    showEarlySubmissionModal,
    formatTime,
    handleAnswerSelect,
    goToPreviousQuestion,
    goToNextQuestion,
    handleModalConfirm,
    setShowEarlySubmissionModal,
  };
};
