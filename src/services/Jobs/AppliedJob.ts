// /src/Services/JobService.ts
import axios from 'axios';
import { JobData } from '../../models/Jobs/ApplyJobmodel';
import { useAuth } from '../../context/Authcontext';

// API endpoint URL
export const fetchAppliedJobs = async (userId: number |null, userToken: string|null): Promise<JobData[]> => {
  const API_URL = `https://g23jza8mtp.ap-south-1.awsapprunner.com/applyjob/getAppliedJobs/${userId}`;
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
