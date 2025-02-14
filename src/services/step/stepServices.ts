import axios from 'axios';
import API_BASE_URL from '../API_Service';

export const ProfileModel = {
  createProfile: async (userId: number |null, userToken: string|null, requestData: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/applicantprofile/createprofile/${userId}`,
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
      const response = await axios.post(
        `${API_BASE_URL}/applicantprofile/uploadresume/${userId}`,
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