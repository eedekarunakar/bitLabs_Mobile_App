// UserContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./Authcontext";
import ProfileService from "../services/profile/ProfileService";
import { fetchJobCounts } from "../services/Home/apiService";
import { JobCounts } from "@models/Model";

interface UserContextProps {
  verifiedStatus: boolean;
  isJobsLoaded: boolean;
  setIsJobsLoaded: (value: React.SetStateAction<boolean>) => void;
  personalName: string;
  refreshVerifiedStatus: () => Promise<void>;
  setPersonalName: (value: React.SetStateAction<string>) => void;
  isLoading: boolean;
  refreshJobCounts: () => Promise<void>;
  refreshPersonalName: () => Promise<void>;
  jobCounts: JobCounts | null;
  reset: () => Promise<void>;
}

const UserContext = createContext<UserContextProps>({
  verifiedStatus: false,
  personalName: "",
  jobCounts: null,
  isJobsLoaded: false,
  setIsJobsLoaded: () => {},
  refreshVerifiedStatus: async () => {},
  refreshJobCounts: async () => {},
  setPersonalName: () => {},
  isLoading: true,
  reset: async () => {},
  refreshPersonalName: async () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [isJobsLoaded, setIsJobsLoaded] = useState(false);
  const { userId, userToken } = useAuth();
  const [jobCounts, setJobCounts] = useState<JobCounts | null>(null);
  const [verifiedStatus, setVerifiedStatus] = useState(false);
  const [personalName, setPersonalName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (!userId || !userToken) {
      console.error("No userId or userToken available in UserProvider");
      return;
    }

    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const [status, user, jobs] = await Promise.all([
          ProfileService.checkVerified(userToken, userId),
          ProfileService.fetchProfile(userToken, userId),
          fetchJobCounts(userId, userToken),
        ]);

        if (isMounted) {
          if (typeof status === "boolean") {
            setVerifiedStatus(status);
          } else {
            console.error("Invalid verified status:", status);
          }

          const name = user?.basicDetails?.firstName; // Note the capital "N"

          if (name) {
            setPersonalName(name);
          } else {
            console.error("User basic details or firstName is missing");
          }

          // Set job counts
          if (jobs) {
            setJobCounts(jobs);
          } else {
            console.error("Failed to fetch job counts");
          }
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setIsLoading(false);
        }
        console.error("Failed to fetch user data:", error);
      }
    };
    if (isMounted) {
      fetchUserData();
    }

    return () => {
      isMounted = false;
    };
  }, [userId, userToken]);

  //refresh function

  const refreshVerifiedStatus = async () => {
    try {
      const status = await ProfileService.checkVerified(userToken, userId);
      if (typeof status === "boolean") {
        setVerifiedStatus(status);
      } else {
        console.error("Invalid verified status:", status);
      }
    } catch (error) {
      console.error("Failed to refresh verified status:", error);
    }
  };
  const refreshJobCounts = async () => {
    try {
      const jobs = await fetchJobCounts(userId, userToken);
      if (jobs) {
        setJobCounts(jobs);
      } else {
        console.error("Failed to fetch job counts");
      }
    } catch (error) {
      console.error("Failed to refresh job counts:", error);
    }
  };

  const refreshPersonalName = async () => {
    try {
      const user = await ProfileService.fetchProfile(userToken, userId);
      const name = user?.basicDetails?.firstName;

      if (name) {
        setPersonalName(name);
      } else {
        console.error("Error fetching name in usercontext ");
      }
    } catch (error) {
      console.error("Error fetching name :", error);
    }
  };

  // Reset the information before logging out
  const reset = async () => {
    setPersonalName("");
    setVerifiedStatus(false);
    setJobCounts(null);
    setIsJobsLoaded(false);
  };
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
        setIsJobsLoaded,
        refreshPersonalName,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
