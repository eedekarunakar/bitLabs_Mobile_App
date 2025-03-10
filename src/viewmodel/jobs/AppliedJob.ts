// /src/ViewModel/AppliedJobsViewModel.ts
import { useContext,useEffect, useState } from 'react';
import { fetchAppliedJobs, fetchCompanyLogo } from '@services/Jobs/AppliedJob';
import { JobData } from '@models/Model';
import UserContext from '@context/UserContext';


// ViewModel for managing applied jobs state
export const useAppliedJobsViewModel = (userId:number |null,token: string | null) => {
  const [appliedJobs, setAppliedJobs] = useState<JobData[]>([]);
  const [logos, setLogos] = useState<{ [key: string]: string | null }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {jobCounts} = useContext(UserContext);

  useEffect(() => {
    const getAppliedJobs = async () => {
      try {
        const jobs = await fetchAppliedJobs(userId,token , jobCounts);
        setAppliedJobs(jobs);
      } catch (err) {
        setError('');
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