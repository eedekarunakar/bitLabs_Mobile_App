import axios, { AxiosError } from 'axios';

export const fetchProfileId = async (id: number, token: string): Promise<{ success: boolean; profileid?: number }> => {
    try {
        const response = await axios.get(
            `https://g23jza8mtp.ap-south-1.awsapprunner.com/applicantprofile/${id}/profileid`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        console.log("API",response.data)

        if (response.status === 200) {
            return { success: true, profileid: response.data};

        } else {
            return { success: false };
        }
    } catch (error) {
        console.error("Error fetching profile ID:", error);
        return { success: false };
    }
};