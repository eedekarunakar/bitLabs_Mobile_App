import axios from 'axios';
import { JobData } from '../../models/Jobs/ApplyJobmodel';

const API_URLS = {
  recommendedJobs: (userId: number |null) =>
    `https://g23jza8mtp.ap-south-1.awsapprunner.com/recommendedjob/findrecommendedjob/${userId}`,
  jobDetails: (jobId: number, userId: number|null) =>
    `https://g23jza8mtp.ap-south-1.awsapprunner.com/viewjob/applicant/viewjob/${jobId}/${userId}`,
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
