import { useContext,useEffect, useState } from 'react';
import { fetchAppliedJobs, fetchCompanyLogo } from '@services/Jobs/AppliedJob';
import { JobData } from '@models/Model';
import UserContext from '@context/UserContext';

// ViewModel for managing applied jobs state
export const useAppliedJobsViewModel = (userId:number |null,token: string | null) => {
  const [appliedJobs, setAppliedJobs] = useState<JobData[]>([]);
  const [logos, setLogos] = useState<{ [key: string]: string | null }>({});
  const [loading, setLoading] = useState(true);
  const [logosLoading, setLogosLoading] = useState(true); 
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

  // Fetch company logos for all jobs
  useEffect(() => {
    const fetchLogos = async () => {
      if (appliedJobs.length > 0) {
        const logoPromises = appliedJobs.map(async (job) => {
          if (job.recruiterId) {
            try {
              const logo = await fetchCompanyLogo(job.recruiterId, token);
              return { [job.id]: logo };
            } catch (error) {
              console.error(`Error fetching logo for recruiterId ${job.recruiterId}:`, error);
              return { [job.id]: null }; // Set null if logo fetch fails
            }
          }
          return { [job.id]: null }; // Handle cases where recruiterId is missing
        });

        // Resolve all promises in parallel
        const logoDataArray = await Promise.all(logoPromises);
        const logoData = logoDataArray.reduce((acc, logo) => ({ ...acc, ...logo }), {});
        setLogos(logoData);
      }
      setLogosLoading(false); // Mark logo fetching as completed
    };

    if (!loading) {
      fetchLogos(); // Trigger logo fetching after jobs are loaded
    }
  }, [appliedJobs, token, loading]);
  return {
    appliedJobs,
    logos,
    loading: loading || logosLoading, // Combine loading states
    error,
  };
};