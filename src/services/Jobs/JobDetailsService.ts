import axios from 'axios';
import API_BASE_URL from '../API_Service'

export const fetchJobStatus = async (applyJobId: number, userToken: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/applyjob/recruiters/applyjob-status-history/${applyJobId}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching job status:', error);
    throw error;
  }
};
