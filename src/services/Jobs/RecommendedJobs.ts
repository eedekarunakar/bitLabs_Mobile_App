import axios from 'axios';
import { JobData } from '@models/Model';
import { JobCounts } from '@models/Model';
import {API_BASE_URL} from '@env';
import { Buffer } from 'buffer';

const API_URLS = {
  recommendedJobs: (userId: number | null, size: number = 300) =>
    `${API_BASE_URL}/recommendedjob/findrecommendedjob/${userId}?page=${0}&size=${size}`,
    jobDetails: (jobId: number, userId: number | null) =>
    `${API_BASE_URL}/viewjob/applicant/viewjob/${jobId}/${userId}`
};

export const fetchRecommendedJobs = async (userId: number | null, userToken: string | null, jobCounts: JobCounts | null): Promise<JobData[]> => {
  const count = jobCounts?.recommendedJobs ?? 300;

 
  const response = await axios.get(API_URLS.recommendedJobs(userId, count), {
    headers: { Authorization: `Bearer ${userToken}` },
  });


  return response.data;
  
};

export const fetchCompanyLogo = async (
  recruiterId: number | null,
  userToken: string | null
): Promise<string | null> => {
  if (!recruiterId) {
    console.error("Recruiter ID is null");
    return null;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/recruiters/companylogo/download/${recruiterId}`, {
      headers: { Authorization: `Bearer ${userToken}` },
      responseType: 'arraybuffer', // Specify binary data response
    });

    // Convert binary data to Base64
    const base64Logo = `data:image/jpeg;base64,${Buffer.from(response.data, 'binary').toString('base64')}`;


    return base64Logo;
  } catch (error) {
    console.error("Error fetching or converting company logo:", error);
    return null;
  }
};



export const fetchJobDetails = async (
  jobId: number,
  userId: number | null,
  userToken: string | null
): Promise<JobData> => {
  const response = await axios.get(API_URLS.jobDetails(jobId, userId), {
    headers: { Authorization: `Bearer ${userToken}` },
  });

  const jobData = response.data.body;


  // Fetch company logo using recruiterId
  if (jobData.recruiterId) {
    await fetchCompanyLogo(jobData.recruiterId, userToken);
  }

  return jobData;
};
