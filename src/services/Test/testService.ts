import apiClient from "../login/ApiClient";
// Create Axios instance with base URL

// Function to submit test results
export const submitTestResult = async (userId: number, testDetails: object, jwtToken: string | null) => {
  try {
    const response = await apiClient.post(`/applicant1/saveTest/${userId}`, JSON.stringify(testDetails));
    if(response.status===200){

        return {status:true} 
    }
    return response.data; // Return the response data (success/failure message)
  } catch (error) {
    console.error('Error submitting test result:', error);
    throw error; // Throw error if the request fails
  }
};

// Additional functions can be added for other API calls related to tests
