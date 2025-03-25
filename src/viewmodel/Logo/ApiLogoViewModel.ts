import { useState, useEffect } from 'react';
import { useAuth } from '@context/Authcontext';
import { fetchLogoFromAPI } from '../../services/Logo/ApiLogoModel';

export const useApiLogoViewModel = () => {
    const { userToken } = useAuth();
  const [logoData, setLogoData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const base64data = await fetchLogoFromAPI('eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwcmFzYWRjaG93ZGFyeTk4M0BnbWFpbC5jb20iLCJleHAiOjE3NDI5MTQ4MDksImlhdCI6MTc0Mjg3ODgwOX0.N0WyY1lYmLzUU-VyerY6Ijx4-qM0thfXLdoDzTjlmTM');
        setLogoData(base64data);
      } catch (err: any) {
        setError(err.message || 'Failed to load logo');
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();
  }, []);

  return { logoData, loading, error };
};
