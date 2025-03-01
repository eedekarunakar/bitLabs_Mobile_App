// /src/Services/JobService.ts
// import axios from 'axios';
import { JobData } from '@models/Model';
import { JobCounts } from '@models/Model';
import apiClient from '../login/ApiClient';


// API endpoint URL
export const fetchAppliedJobs = async (userId: number |null, userToken: string|null , jobCounts : JobCounts | null): Promise<JobData[]> => {
  try {
    const applyJobsCount = jobCounts ?.appliedJobs ?? 300;
    const response = await apiClient.get(`/applyjob/getAppliedJobs/${userId}?page=${0}&size=${applyJobsCount}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('');
  }
};
