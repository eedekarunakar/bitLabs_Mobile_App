// /src/Services/JobService.ts
// import axios from 'axios';
import { JobData } from '../../models/Jobs/ApplyJobmodel';
import apiClient from '../login/ApiClient';
// API endpoint URL
export const fetchAppliedJobs = async (userId: number |null, userToken: string|null): Promise<JobData[]> => {
  try {
    const response = await apiClient.get(`/applyjob/getAppliedJobs/${userId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch applied jobs');
  }
};
