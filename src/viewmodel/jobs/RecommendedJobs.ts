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

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await fetchRecommendedJobs(userId, userToken);
        setJobs(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch job data');
      } finally {
        setLoading(false);
      }
    };

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

  return { jobs, loading, getJobDetails };
};

export default useRecommendedJobsViewModel;