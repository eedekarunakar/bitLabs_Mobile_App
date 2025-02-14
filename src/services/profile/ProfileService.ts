import axios from 'axios';
import API_BASE_URL from '../API_Service';
import apiClient from '../login/ApiClient';

// const API_BASE_URL = 'https://g23jza8mtp.ap-south-1.awsapprunner.com'; // Replace with actual API base URL
interface TestData {
  testStatus: string;
}
export const ProfileService = {
  async fetchProfile(userToken: string | null, userId: number | null) {
    try {
      // Use the hook inside a function scope


      if (!userToken || !userId) {
        throw new Error('Authentication data is missing or incomplete.');
      }

      const response = await apiClient.get(`/applicantprofile/${userId}/profile-view`, {
        headers: {
          Authorization: `Bearer ${userToken}`, // Embed token in the Authorization header
        },
      });

      return {

        applicant: response.data.applicant,
        basicDetails: response.data.basicDetails,
        skillsRequired: response.data.skillsRequired || [],
        qualification: response.data.qualification || '',
        specialization: response.data.specialization || '',
        preferredJobLocations: response.data.preferredJobLocations || [],
        experience: response.data.experience || '',
        applicantSkillBadges: response.data.applicant.applicantSkillBadges || '',
        formErrors: {}, // Initialize form errors as an empty object

      };

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      throw error; // Re-throw the error to handle it in the caller
    }
  },
  async updateBasicDetails(userToken: string | null, userId: number | null, updatedProfileData: any) {
    try {
      if (!userToken || !userId) {
        throw new Error('Authentication data is missing or incomplete.');
      }

      const response = await apiClient.put(
        `/applicantprofile/${userId}/basic-details`,
        updatedProfileData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (response.status !== 200) {
        return false;
      }
      else if (response.data?.formErrors) {
        // If the API returns form errors, return them so that they can be displayed in the UI
        return { success: false, formErrors: response.data.formErrors };
      }


      // If update is successful, return the updated data
      return { success: true, profileData: response.data };

    } catch (error) {
      if (axios.isAxiosError(error)) {

        console.log('Axios error:', error.response?.data || error.message);
        // throw new Error(error.response?.data?.message || 'An error occurred while updating profile data.');
        return (error?.response?.data);
      } else {
        console.log('Unexpected error:', error);
        throw new Error('An unexpected error occurred while updating profile data.');
      }
    }
  },
  async updateProfessionalDetails(userToken: string | null, userId: number | null, updatedProfileData: any) {
    try {
      if (!userToken || !userId) {
        throw new Error('Authentication data is missing or incomplete.');
      }

      const response = await apiClient.put(
        `/applicantprofile/${userId}/professional-details`,
        updatedProfileData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.data?.formErrors) {
        // If the API returns form errors, return them so that they can be displayed in the UI
        return { success: false, formErrors: response.data.formErrors };
      }

      return { success: true, profileData: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Axios error:', error.response?.data || error.message);
        return { success: false, formErrors: error.response?.data };
      } else {
        console.log('Unexpected error:', error);
        return { success: false, formErrors: { general: 'An unexpected error occurred while updating profile data.' } };
      }
    }
  },
  async uploadProfilePhoto(userToken: string | null, userId: number | null, photoFile: any) {
    try {
      if (!userToken || !userId) {
        throw new Error('Authentication data is missing or incomplete.');
      }
      const formData = new FormData();
      formData.append('photo', { uri: photoFile.uri, type: photoFile.type, name: photoFile.fileName, });
      // console.log('FormData prepared:', formData);
      const response = await apiClient.post(`/applicant-image/${userId}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      // console.log("      Image : " +JSON.stringify(response))
      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Axios error:', error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || 'Failed to upload photo.' };
      } else {
        console.log('Unexpected error:', error);
        return { success: false, message: 'An unexpected error occurred while uploading photo.' };
      }
    }
  },
  async fetchProfilePhoto(userToken: string | null, userId: number | null) {
    console.log('fetchProfilePhoto called with:', userToken, userId);
    try {
      if (!userToken || !userId) {
        throw new Error('Authentication data is missing or incomplete.');
      }
      const response = await apiClient.get(`/applicant-image/getphoto/${userId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        }, responseType: 'arraybuffer',
        // Ensure the response is handled as an arraybuffer 
      });
      const base64Image = btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      const photoUrl = `data:${response.headers['content-type']};base64,${base64Image}`;
      return { success: true, photoUrl };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Axios error:', error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || 'Failed to fetch photo.' };
      } else {
        console.log('Unexpected error:', error);
        return { success: false, message: 'An unexpected error occurred while fetching photo.' };
      }
    }
  },



  async uploadResume(userToken: string | null, userId: number | null, formData: FormData) {
    console.log('uploadResume called with:', userToken, userId, formData);
    try {
      if (!userToken || !userId) {
        throw new Error('Authentication data is missing or incomplete.');
      }

      const response = await apiClient.post(
        `/resume/upload/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Axios error:', error.response?.data || error.message);
        return { success: false, message: error.response?.data?.message || 'Failed to upload resume.' };
      } else {
        console.log('Unexpected error:', error);
        return { success: false, message: 'An unexpected error occurred while uploading resume.' };
      }
    }
  },
  async checkVerified(jwtToken: string | null, userId: number | null): Promise<boolean> {
    try {
      const response = await apiClient.get<TestData[]>(`/applicant1/tests/${userId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      const data = response.data;


      // Check if both aptitude and technical tests have status "P" or "p"
      const allTestsPassed = data.length >= 2 && data.every(test => test.testStatus.toLowerCase() === 'p');
      console.log("verified = " +allTestsPassed);
      return allTestsPassed;
    } catch (error) {
      console.error('Error fetching test data:', error);
      return false
    }

  }
}
export default ProfileService;