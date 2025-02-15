import apiClient from "../login/ApiClient";

export const ProfileModel = {
  createProfile: async (userId: number |null, userToken: string|null, requestData: any) => {
    try {
      const response = await apiClient.post(
        `/applicantprofile/createprofile/${userId}`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error('Error creating profile');
    }
  },

  uploadResume: async (userToken: string|null, userId: number | null, formData: FormData) => {
    try {
      const response = await apiClient.post(
        `/applicantprofile/uploadresume/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error('Error uploading resume');
    }
  },
};