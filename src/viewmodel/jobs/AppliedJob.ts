// /src/ViewModel/AppliedJobsViewModel.ts
import { useEffect, useState } from 'react';
import { fetchAppliedJobs } from '@services/Jobs/AppliedJob';
import { JobData } from '@models/Jobs/ApplyJobmodel';

// ViewModel for managing applied jobs state
export const useAppliedJobsViewModel = (userId:number |null,token: string | null) => {
  const [appliedJobs, setAppliedJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAppliedJobs = async () => {
      try {
        const jobs = await fetchAppliedJobs(userId,token);
        setAppliedJobs(jobs);
      } catch (err) {
        setError('Failed to load applied jobs');
      } finally {
        setLoading(false);
      }
    };

    getAppliedJobs();
  }, [userId,token]); // Trigger when token changes

  return {
    appliedJobs,
    loading,
    error,
  };
};