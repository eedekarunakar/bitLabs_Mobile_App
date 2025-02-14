// TestViewModel.ts
import { useState } from 'react';
import { submitTestResult } from '../../services/Test/testService'; // Import the service
import { TestDetails } from '../../models/Test/TestModel'; // Assuming you have a model for test details
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../New'; // Define your stack param list
// Type the navigation object with your stack's params

export const useTestViewModel = (userId: number | any, jwtToken: string | null, testName: string) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [showEarlySubmissionModal, setShowEarlySubmissionModal] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);



  const submitTest = async (finalScore: number, isEarlySubmission: boolean) => {
    const testStatus = isEarlySubmission
      ? 'F' // Early submission fails by default
      : finalScore >= 70
        ? 'P' // Pass if score >= 70
        : 'F'; // Fail otherwise 
    const testDetails: TestDetails = {
      testName: testName,
      testScore: isEarlySubmission ? 0 : finalScore,
      testStatus: testStatus,
      testDateTime: new Date().toISOString(),
      applicant: { id: userId },
    };

    console.log('Data being sent to API:', testDetails);
    try {
      const response = await submitTestResult(userId, testDetails, jwtToken);
      console.log('Test submission response:', response);

      if (response.status) {
        // Handle success
        setIsTestComplete(true);
        
        if (finalScore >= 70) {
          console.log('Final Score:', finalScore);

          if (testName === 'General Aptitude Test' )  {
            navigation.navigate('passContent', { finalScore,testName });
          } else if (testName === 'Technical Test') {
            // Assuming the bottom tab is part of the navigation stack
            navigation.navigate('passContent', { finalScore,testName }); // Adjust the tab name as needed
          }
        } else {
          navigation.navigate('FailContent');
        }
      } else {
        // Handle fail case
        console.error('Error during test submission:');
      }
    } catch (error) {
      console.error('Error during test submission:', error);
    }
  };

  return {
    isTestComplete,
    showEarlySubmissionModal,
    setShowEarlySubmissionModal,
    setIsTestComplete,
    submitTest,
    showTimeUpModal,
    setShowTimeUpModal,

  };
};
