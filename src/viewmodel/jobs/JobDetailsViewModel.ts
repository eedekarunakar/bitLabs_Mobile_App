import { useEffect, useState } from "react";
import { fetchJobStatus } from "@services/Jobs/JobDetailsService";
import { JobDetails } from "@models/Model";

type JobStatus = {
  id: number;
  status: string;
  changeDate: [number, number, number];
};

export const useJobDetailsViewModel = (job: JobDetails, userToken: string) => {
  const [jobStatus, setJobStatus] = useState<JobStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getJobStatus = async () => {
      try {
        const body = await fetchJobStatus(job.applyJobId, userToken);
        setLoading(false);

        if (Array.isArray(body) && body.length > 0) {
          const filteredStatuses = body.filter(
            status => !["screening", "interview", "selected", "rejected"].includes(status.status),
          );
          const reversedStatuses = filteredStatuses.reverse();
          setJobStatus(reversedStatuses);
        }
      } catch (error) {
        setLoading(false);
      }
    };

    getJobStatus();
  }, [job, userToken]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formatDate = (dateArray: [number, number, number]): string => {
    const [year, month, day] = dateArray;
    return `${monthNames[month - 1]} ${day}, ${year}`;
  };

  const formatDates = (dateArray: [number, number, number]): string => {
    const [year, month, day] = dateArray;
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return {
    jobStatus,
    loading,
    formatDate,
    formatDates,
  };
};
