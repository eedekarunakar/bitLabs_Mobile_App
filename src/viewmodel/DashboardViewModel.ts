import { useState, useEffect } from 'react';
import { fetchJobCounts } from '../services/Home/apiService';
import { JobCounts } from '../models/home/model';

export const useJobCounts = (applicantId: number | null,jwtToken:string|null) => {
  const [jobCounts, setJobCounts] = useState<JobCounts | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getJobCounts = async () => {
      if (!applicantId || !jwtToken) {
        // Skip fetching if applicantId or jwtToken is null
        setJobCounts(null);
        setLoading(false);
        setError(null);
        return;
      }
      setLoading(true);
      try {
        const counts = await fetchJobCounts(applicantId,jwtToken);
        setJobCounts(counts);
      } catch (err) {
        setError('Failed to load job data');
        setJobCounts(null);
      } finally {
        setLoading(false);
      }
    };

    getJobCounts();
  }, [applicantId,jwtToken]);

  return { jobCounts, loading, error };
};