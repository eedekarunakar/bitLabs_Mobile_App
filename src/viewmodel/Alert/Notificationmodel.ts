import { useState, useEffect } from "react";
import { useAuth } from "@context/Authcontext";
import { fetchJobAlerts, markAlertAsSeen, JobAlert } from "@services/Alert/NotificationServieces";

export const useJobAlerts = () => {
  const { userId, userToken } = useAuth(); // Getting userId and userToken from useAuth context
  const [jobAlerts, setJobAlerts] = useState<JobAlert[]>([]);
  const [unseenCount, setUnseenCount] = useState<number>(0);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const alerts = await fetchJobAlerts(userId, userToken);

        setJobAlerts(alerts);
      } catch (error) {
        console.error("Error fetching job alerts:", error);
      }
    };

    if (userId && userToken) {
      fetchAlerts();
    }
  }, [userId, userToken]);

  useEffect(() => {
    const countUnseen = jobAlerts.filter(alert => !alert.seen).length;
    setUnseenCount(countUnseen);
  }, [jobAlerts]);

  const handleMarkAsSeen = async (alertId: string) => {
    try {
      await markAlertAsSeen(alertId, userToken);
      const updatedJobAlerts = jobAlerts.map(jobAlert =>
        jobAlert.alertsId === alertId ? { ...jobAlert, seen: true } : jobAlert,
      );
      setJobAlerts(updatedJobAlerts);
    } catch (error) {
      console.error("Error marking alert as seen:", error);
    }
  };

  return { jobAlerts, unseenCount, handleMarkAsSeen };
};
