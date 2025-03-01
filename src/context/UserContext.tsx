// UserContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './Authcontext';
import ProfileService from '../services/profile/ProfileService';
import { fetchJobCounts } from '../services/Home/apiService';
import { JobCounts } from '@models/Model';

interface UserContextProps {
  verifiedStatus: boolean;
  isJobsLoaded :boolean;
  setIsJobsLoaded: (value: React.SetStateAction<boolean>) => void;
  personalName: string;
  refreshVerifiedStatus: () => Promise<void>;
  setPersonalName: (value: React.SetStateAction<string>) => void;
  isLoading: boolean;
  refreshJobCounts: () => Promise<void>;
  jobCounts: JobCounts | null;
  reset :()=>Promise<void>;
}

const UserContext = createContext<UserContextProps>({

  verifiedStatus: false,
  personalName: '',
  jobCounts: null,
  isJobsLoaded:false,
  setIsJobsLoaded:()=>{},
  refreshVerifiedStatus: async () => { },
  refreshJobCounts: async () => { },
  setPersonalName: () => { },
  isLoading: true,
  reset:async ()=>{ }
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [isJobsLoaded,setIsJobsLoaded] = useState(false)
  const { userId, userToken } = useAuth();
  const [jobCounts, setJobCounts] = useState<JobCounts | null>(null);
  const [verifiedStatus, setVerifiedStatus] = useState(false);
  const [personalName, setPersonalName] = useState('');
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (!userId || !userToken) {
      
      console.error('No userId or userToken available in UserProvider');
      return;
    }

    const fetchUserData = async () => {
      setLoading(true); 
      try {
        const [status, user, jobs] = await Promise.all([
          ProfileService.checkVerified(userToken, userId),
          ProfileService.fetchProfile(userToken, userId),
          fetchJobCounts(userId, userToken),
        ]);

        if (isMounted) {
          if (typeof status === 'boolean') {
            setVerifiedStatus(status);
            console.log('Verified Status:', status);
          } else {
            console.error('Invalid verified status:', status);
          }

          console.log('Fetched user data:', user);

          const name = user?.basicDetails?.firstName; // Note the capital "N"

          if (name) {
            setPersonalName(name);
            console.log("User's Name:", name);
          } else {
            console.error('User basic details or firstName is missing');
          }

          // Set job counts
          if (jobs) {
            setJobCounts(jobs);
            console.log('Job Counts:', jobs);
          } else {
            console.error('Failed to fetch job counts');
          }
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setLoading(false);
        }
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [userId, userToken]);

  //refresh function

  const refreshVerifiedStatus = async () => {
    try {
      const status = await ProfileService.checkVerified(userToken, userId);
      if (typeof status === 'boolean') {
        setVerifiedStatus(status);
        console.log('Verified Status Refreshed:', status);
      } else {
        console.error('Invalid verified status:', status);
      }
    } catch (error) {
      console.error('Failed to refresh verified status:', error);
    }
  };
  const refreshJobCounts = async () => {
    try {
      const jobs = await fetchJobCounts(userId, userToken);
      if (jobs) {
        setJobCounts(jobs);
        console.log('Job Counts Refreshed:', jobs);
      } else {
        console.error('Failed to fetch job counts');
      }
    } catch (error) {
      console.error('Failed to refresh job counts:', error);
    }
  };

  
 // Reset the information before logging out 
 const reset = async()=>{
  setPersonalName('');
  setVerifiedStatus(false);
  setJobCounts(null);
  setIsJobsLoaded(false);
  
 }
  return (
    <UserContext.Provider
      value={{
        verifiedStatus,
        personalName,
        jobCounts,
        setPersonalName, // Expose setPersonalName to update name after API call
        refreshVerifiedStatus,
        refreshJobCounts,
        isLoading,
        reset,
        isJobsLoaded,
        setIsJobsLoaded
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
