import apiClient from '../login/ApiClient';
// Create Axios instance


export const fetchJobCounts = async (applicantId: number|null,jwtToken:string|null) => {
  try {
    // const jwtToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwYXRlbHlhc2gyNTA3MDJAZ21haWwuY29tIiwiZXhwIjoxNzMzNzYzNTQ2LCJpYXQiOjE3MzM3Mjc1NDZ9.oEUVk0zBYJM9RouLupoPM8ZjqlayJfXnpwy2wC71vAE'; // Replace with actual token

    const [recommendedResponse, appliedResponse, savedResponse] = await Promise.all([
      apiClient.get(`/recommendedjob/countRecommendedJobsForApplicant/${applicantId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }),
      apiClient.get(`/applyjob/countAppliedJobs/${applicantId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }),
      apiClient.get(`/savedjob/countSavedJobs/${applicantId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }),
    ]);

    return {
      recommendedJobs: recommendedResponse.data,
      appliedJobs: appliedResponse.data,
      savedJobs: savedResponse.data,
    };
  } catch (error) {
    console.error('Error fetching job counts:', error);
    throw error;
  }
};
