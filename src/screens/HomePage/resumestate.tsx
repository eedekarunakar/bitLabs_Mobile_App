import React, { createContext, useContext, useState, ReactNode } from 'react';
import API_BASE_URL from '../../services/API_Service';
 
interface PdfContextType {
  pdfUri: string;
  refreshPdf: (userId: string) => Promise<void>;
  setPdfUri: React.Dispatch<React.SetStateAction<string>>;  // Add this line
}
 
interface PdfProviderProps {
  children: ReactNode;
}
 
const PdfContext = createContext<PdfContextType>({
  pdfUri: '',
  setPdfUri: () => {},  // Provide a default empty function
  refreshPdf: async () => {},
});
 
export const PdfProvider: React.FC<PdfProviderProps> = ({ children }) => {
  const [pdfUri, setPdfUri] = useState<string>('');
 
 
  const refreshPdf = async (userId: string) => {
    try {
      console.log('Fetching PDF for user:', userId);
     
      const response = await fetch(`${API_BASE_URL}/resume/pdf/${userId}`);
      console.log(response)
 
      console.log('Response Status:', response.status);
 
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
 
      const arrayBuffer = await response.arrayBuffer();
      console.log('ArrayBuffer Length:', arrayBuffer.byteLength);
 
      const base64Pdf = arrayBufferToBase64(arrayBuffer);
      console.log('Base64 PDF (First 100 chars):', base64Pdf.substring(0, 100));
 
      const pdfUri = `data:application/pdf;base64,${base64Pdf}`;
      setPdfUri(pdfUri);
    } catch (error) {
      console.error('Error fetching PDF:', error);
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
 
  return (
    <PdfContext.Provider value={{ pdfUri, refreshPdf,setPdfUri}}>
      {children}
    </PdfContext.Provider>
  );
};
 
export const usePdf = () => useContext(PdfContext);