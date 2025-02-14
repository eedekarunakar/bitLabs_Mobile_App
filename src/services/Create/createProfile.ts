import axios from 'axios';
import API_BASE_URL from '../API_Service';
export const fetchProfileId = async (id: number, token: string): Promise<{ success: boolean; profileid?: number }> => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/applicantprofile/${id}/profileid`,
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