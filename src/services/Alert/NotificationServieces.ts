import { JobData } from '@models/Model';
import apiClient from '../login/ApiClient';


export interface JobAlert {
  alertsId: string;
  status: string;
  companyName: string;
  jobTitle: string;
  changeDate: number[];
  applyJob: { applyjobid:number ,job:{id:number|null},jobTitle: string };
  seen: boolean;
  
}

export const fetchJobAlerts = async (userId: number|null, userToken: string|null): Promise<JobAlert[]> => {
  try {
    const response = await apiClient.get(`/applyjob/applicant/job-alerts/${userId}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching job alerts:', error);
    throw error;
  }
};

export const markAlertAsSeen = async (alertId: string, userToken: string|null): Promise<void> => {
  try {
    await apiClient.put(
      `/applyjob/applicant/mark-alert-as-seen/${alertId}`,
      {},
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
  } catch (error) {
    console.error('Error marking alert as seen:', error);
    throw error;
  }
};


const mapJobData = (apiResponse: any,id:number|null,apply:number): JobData => {
  return {
    id: id ?? 0, // Default to 0 if null
    companyname: apiResponse.body.companyname ?? '',
    jobTitle: apiResponse.body.jobTitle ?? '',
    location: apiResponse.body.location ?? '',
    employeeType: apiResponse.body.employeeType ?? '',
    minimumExperience: apiResponse.body.minimumExperience ?? 0,
    maximumExperience: apiResponse.body.maximumExperience ?? 0,
    minSalary: apiResponse.body.minSalary ?? 0,
    maxSalary: apiResponse.body.maxSalary ?? 0,
    creationDate: apiResponse.body.creationDate ?? [2024, 1, 1], // Default to a valid date if null
    skillsRequired: apiResponse.body.skillsRequired
      ? apiResponse.body.skillsRequired.map((skill: any) => ({
          skillName: skill ?? '',
        }))
      : [], // Default to an empty array if no skills required
    jobStatus: apiResponse.body.jobStatus ?? '',
    logoFile: apiResponse.body.logoFile ?? null,
    description: apiResponse.body.description ?? '',
    matchPercentage: apiResponse.body.matchPercentage ?? '',
    matchStatus: apiResponse.body.matchStatus ?? '',
    sugesstedCourses: apiResponse.body.sugesstedCourses ?? [],
    matchedSkills :apiResponse.body.matchedSkills ?? [],
    applyJobId: apply ?? 0,
  };
};

export const fetchJobDetails = async (jobId: number|null, userToken: string | null,apply:number) => {
  try {
    const response = await apiClient.get(
      `/viewjob/applicant/viewjob/${jobId}`,
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );
      const jobData = mapJobData(response.data,jobId,apply);
      console.log('model',jobData)
  
    return jobData;
    
  } catch (error) {
    console.error('Error fetching job details:', error);
    throw error;
  }
};