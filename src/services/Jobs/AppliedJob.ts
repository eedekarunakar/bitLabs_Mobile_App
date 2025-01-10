// /src/Services/JobService.ts
import axios from 'axios';
import { JobData } from '../../models/Jobs/ApplyJobmodel';
import { useAuth } from '../../context/Authcontext';
import API_BASE_URL from '../API_Service';
// API endpoint URL
export const fetchAppliedJobs = async (userId: number |null, userToken: string|null): Promise<JobData[]> => {
  const API_URL = `${API_BASE_URL}/applyjob/getAppliedJobs/${userId}`;
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch applied jobs');
  }
};
