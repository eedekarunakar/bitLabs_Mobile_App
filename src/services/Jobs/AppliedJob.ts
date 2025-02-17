// /src/Services/JobService.ts
// import axios from 'axios';
import { JobCounts } from '../../models/home/model';
import { JobData } from '../../models/Jobs/ApplyJobmodel';
import apiClient from '../login/ApiClient';
// API endpoint URL
export const fetchAppliedJobs = async (userId: number |null, userToken: string|null , jobCounts : JobCounts | null): Promise<JobData[]> => {
  try {
    const applyJobsCount = jobCounts ?.appliedJobs ?? 300;
    console.log("apply jobs count: ", applyJobsCount)

    const response = await apiClient.get(`/applyjob/getAppliedJobs/${userId}?page=${0}&size=${applyJobsCount}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch applied jobs');
  }
};
