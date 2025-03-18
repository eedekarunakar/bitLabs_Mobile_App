import {API_BASE_URL} from '@env';
import axios, {AxiosResponse} from 'axios';

const resumeCall = async (id: number | null): Promise<AxiosResponse | null> => {
  if (!id) return null;

  try {
    const result = await axios.get(`${API_BASE_URL}/resume/pdf/${id}`, {
      responseType: 'arraybuffer', // Ensures binary data handling
    });
    return result;
  } catch (error) {
    console.error('Error fetching resume PDF:', error);
    return null;
  }
};

export default resumeCall;
