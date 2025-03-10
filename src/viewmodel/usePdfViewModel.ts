import { useState, useEffect } from 'react';
import { useAuth } from '@context/Authcontext';
import { usePdf } from '@context/ResumeContext';
import resumeCall from '@services/profile/Resume';

export const usePdfViewModel = () => {
  const { pdfUri, setPdfUri } = usePdf();
  const { userId } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const fetchPdf = async () => {
    try {
      if (!userId) {
        throw new Error('User ID is null');
      }
      console.log('Fetching PDF for userId:', userId);
      
      const response = await resumeCall(userId);
      if (!response || !response.ok) {
        throw new Error('Failed to fetch PDF');
      }

      const arrayBuffer = await response.arrayBuffer();
      const base64Pdf = arrayBufferToBase64(arrayBuffer);
      setPdfUri(`data:application/pdf;base64,${base64Pdf}`);
    } catch (error) {
      console.error('Error fetching PDF:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
    }
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  useEffect(() => {
    if (!pdfUri) {
      fetchPdf();
    }
  }, [pdfUri, userId]);

  return { pdfUri, error, fetchPdf };
};
