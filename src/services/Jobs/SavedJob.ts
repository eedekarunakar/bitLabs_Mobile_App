import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { JobData1 } from '../../models/Jobs/SavedJob';
import { useAuth } from '../../context/Authcontext';

export const useSavedJobs = () => {
  const { userId, userToken } = useAuth();
  const [savedJobs, setSavedJobs] = useState<JobData1[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  const fetchSavedJobs = useCallback(async () => {
    setLoading(true);
    setError(false); // Reset error state before fetching
    try {
      const response = await axios.get(
        `https://g23jza8mtp.ap-south-1.awsapprunner.com/savedjob/getSavedJobs/${userId}`,
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

  // Automatically fetch saved jobs on mount
  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  return { savedJobs, loading, error, fetchSavedJobs };
};
