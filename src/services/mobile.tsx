import axios from 'axios';

// Base URL for the API
const BASE_URL = 'https://kqryamxpv3.ap-south-1.awsapprunner.com';

// Function to fetch mobile number from API
export const getMobileNumber = async (id: number|null): Promise<string | null> => {
    try {
        // Construct the full API URL with the provided id
        const response = await axios.get(`${BASE_URL}/applicant/getApplicantById/${id}`);
        if (response.status === 200) {
            const applicantData = response.data;
            return applicantData.mobilenumber; // Assuming the mobilenumber field exists
        }
        return null;
    } catch (error) {
        console.error('Error fetching mobile number:', error);
        return null;
    }
};
