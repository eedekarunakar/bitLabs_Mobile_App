// /src/ViewModels/RecommendedJobsViewModel.ts
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { JobData } from '../../models/Jobs/ApplyJobmodel';
import { fetchRecommendedJobs, fetchJobDetails } from '../../services/Jobs/RecommendedJobs'
import { useAuth } from '../../context/Authcontext';

const useRecommendedJobsViewModel = () => {
  const { userId, userToken } = useAuth();
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to load jobs from the API
  const loadJobs = async () => {
    setLoading(true); // Start loading
    try {
      const data = await fetchRecommendedJobs(userId, userToken);
      setJobs(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch job data');
    } finally {
      setLoading(false); // End loading
    }
  };

  // Initial load of jobs when the component is mounted
  useEffect(() => {
    loadJobs();
  }, []);


  const getJobDetails = async (jobId: number): Promise<JobData | null> => {
    try {
      return await fetchJobDetails(jobId, userId, userToken);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch job details');
      return null;
    }
  };
  const reloadJobs = () => {
    loadJobs();
  };

  return { jobs, loading, getJobDetails ,reloadJobs};
};

export default useRecommendedJobsViewModel;