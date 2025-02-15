import {API_BASE_URL} from '@env';

const resumeCall = async (id: number | null): Promise<Response | null> => {
  if (id) {
    const result = await fetch(`${API_BASE_URL}/resume/pdf/${id}`);
    return result;
  } else {
    return null;
  }
};

export default resumeCall;
