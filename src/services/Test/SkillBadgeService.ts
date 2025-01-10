import axios from 'axios';
import API_BASE_URL from '../API_Service';
// Create Axios instance with base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL, // Your base API URL
});
export const submitSkillBadge = async (userId: number, testName: string, testStatus: string, jwtToken: string | null):Promise<any> => {
    try {
      const response = await apiClient.post('/skill-badges/save', {
        applicantId: userId,
        skillBadgeName: testName,
        status: testStatus,
      }, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        console.log('Skill badge saved successfully');
      }
      return response.data;
    } catch (error) {
      console.error('Error submitting the test result:', error);
      throw error;
    }
  };
  