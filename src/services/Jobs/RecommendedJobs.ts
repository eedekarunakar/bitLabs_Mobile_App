import axios from 'axios';
import { useState } from 'react';
import { JobData } from '../../models/Jobs/ApplyJobmodel';
import API_BASE_URL from '../API_Service';
import { JobCounts } from '../../models/home/model';


const API_URLS = {
  recommendedJobs: (userId: number | null, size: number = 300) =>
    `${API_BASE_URL}/recommendedjob/findrecommendedjob/${userId}?page=${0}&size=${size}`,
  jobDetails: (jobId: number, userId: number | null) =>
    `${API_BASE_URL}/viewjob/applicant/viewjob/${jobId}/${userId}`,
};

export const fetchRecommendedJobs = async (userId: number | null, userToken: string | null, jobCounts: JobCounts | null): Promise<JobData[]> => {
  const count = jobCounts?.recommendedJobs ?? 300;
  console.log("recommended jobs count: " + count);

  const response = await axios.get(API_URLS.recommendedJobs(userId, count), {
    headers: { Authorization: `Bearer ${userToken}` },
  });


  return response.data;

};

export const fetchJobDetails = async (
  jobId: number,
  userId: number | null,
  userToken: string | null
): Promise<JobData> => {
  const response = await axios.get(API_URLS.jobDetails(jobId, userId), {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  return response.data.body;
};
