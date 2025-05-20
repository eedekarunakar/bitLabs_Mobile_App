import apiClient from '@services/login/ApiClient';

export const fetchJobStatus = async (applyJobId: number, userToken: string) => {
  try {
    const response = await apiClient.get(
      `/applyjob/recruiters/applyjob-status-history/${applyJobId}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching job status:', error);
    throw error;
  }
};
