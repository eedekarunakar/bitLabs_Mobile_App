import React, { useState } from "react";
import { useAuth } from "@context/Authcontext";
import { usePdf } from "@context/ResumeContext";
import resumeCall from "@services/profile/Resume";
import { useFocusEffect } from "@react-navigation/native";
import { Buffer } from "buffer";
 
export const usePdfViewModel = () => {
  const { pdfUri, setPdfUri } = usePdf();
  const { userId } = useAuth();
  const [error, setError] = useState<string | null>(null);
 
  const fetchPdf = async () => {
    try {
      if (!userId) throw new Error("User ID is null");
 
      
      const response = await resumeCall(userId);
 
      if (!response || response.status !== 200) {
        throw new Error("Failed to fetch PDF");
      }
 
      const arrayBuffer = response.data; // Axios already returns ArrayBuffer
      const base64Pdf = arrayBufferToBase64(arrayBuffer);
      setPdfUri(`data:application/pdf;base64,${base64Pdf}`);
    } catch (error) {
      console.error("Error fetching PDF:", error);
      setError(error instanceof Error ? error.message : String(error));
    }
  };
 
  useFocusEffect(
    React.useCallback(() => {
      if (userId) fetchPdf();
    }, [userId])
  );
 
  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    return Buffer.from(new Uint8Array(buffer)).toString("base64");
  };
  
 
  return { pdfUri, error, fetchPdf };
};