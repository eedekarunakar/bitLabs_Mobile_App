import { useState, useEffect, useCallback, useContext } from 'react';
import { JobData1 } from '../../models/Jobs/SavedJob';
import { useAuth } from '../../context/Authcontext';
import apiClient from '../login/ApiClient';
import { JobCounts } from '../../models/home/model';
import UserContext from '../../context/UserContext';

export const useSavedJobs = () => {
  const { userId, userToken } = useAuth();
  const { jobCounts } = useContext(UserContext);
  const [savedJobs, setSavedJobs] = useState<JobData1[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  const fetchSavedJobs = useCallback(async (savedJobCount: number | null) => {
    setLoading(true);
    setError(false); // Reset error state before fetching
    console.log("Saved job count: ",savedJobCount)
    try {
      const response = await apiClient.get(
        `/savedjob/getSavedJobs/${userId}?page=${0}&size=${savedJobCount}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`, // Replace with actual token
          },
        }
      );
      setSavedJobs(response.data);
    } catch (err) {
      setError(true);
      console.error('Error fetching saved jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, userToken]);
  const savedJobsCount = jobCounts?.savedJobs ?? 300;

  // Automatically fetch saved jobs on mount
  useEffect(() => {
    fetchSavedJobs(savedJobsCount);
  }, [fetchSavedJobs]);

  return { savedJobs, loading, error, fetchSavedJobs };
};
