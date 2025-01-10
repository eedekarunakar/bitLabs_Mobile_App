import axios from 'axios';
import { JobData } from '../../models/Jobs/ApplyJobmodel';
import API_BASE_URL from '../API_Service';
const API_URLS = {
  recommendedJobs: (userId: number |null) =>
    `${API_BASE_URL}/recommendedjob/findrecommendedjob/${userId}`,
  jobDetails: (jobId: number, userId: number|null) =>
    `${API_BASE_URL}/viewjob/applicant/viewjob/${jobId}/${userId}`,
};

export const fetchRecommendedJobs = async (userId: number| null, userToken: string|null): Promise<JobData[]> => {
  const response = await axios.get(API_URLS.recommendedJobs(userId), {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  return response.data;
};

export const fetchJobDetails = async (
  jobId: number,
  userId: number| null,
  userToken: string |null
): Promise<JobData> => {
  const response = await axios.get(API_URLS.jobDetails(jobId, userId), {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  return response.data.body;
};
