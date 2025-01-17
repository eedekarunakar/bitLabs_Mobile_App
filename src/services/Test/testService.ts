import axios from 'axios';
import API_BASE_URL from '../API_Service';
// Create Axios instance with base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL, // Your base API URL
});

// Function to submit test results
export const submitTestResult = async (userId: number, testDetails: object, jwtToken: string | null) => {
  try {
    const response = await apiClient.post(`/applicant1/saveTest/${userId}`, JSON.stringify(testDetails), {
      headers: {
        Authorization: `Bearer ${jwtToken}`, // Add the JWT token for authorization
        'Content-Type': 'application/json', // Set the content type
      },
   
    });
    if(response.status===200){
        console.log('Test Submitted Successfully')
        return {status:true} 
    }
    return response.data; // Return the response data (success/failure message)
  } catch (error) {
    console.error('Error submitting test result:', error);
    throw error; // Throw error if the request fails
  }
};

// Additional functions can be added for other API calls related to tests
