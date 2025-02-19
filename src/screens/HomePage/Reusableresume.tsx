import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, View, ActivityIndicator, Text, ScrollView } from 'react-native';
import Pdf from 'react-native-pdf';
import { useAuth } from '../../context/Authcontext';
import { usePdf } from './resumestate';
import resumeCall from '@services/profile/Resume';

const PDFExam = () => {
  const { pdfUri, setPdfUri, refreshPdf } = usePdf(); // Get refresh function
  const userid = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        console.log('Fetching PDF for userId:', userid.userId);
        const response = await resumeCall(userid.userId);
        if (!response || !response.ok) {
          throw new Error('Failed to fetch PDF');
        }
        const arrayBuffer = await response.arrayBuffer();
        const base64Pdf = arrayBufferToBase64(arrayBuffer);
        const newPdfUri = `data:application/pdf;base64,${base64Pdf}`;
        setPdfUri(newPdfUri);
      } catch (error) {
        console.error('Error fetching PDF:', error);
        setError('Error fetching PDF');
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

    if (!pdfUri) {
      fetchPdf();
    }
  }, [pdfUri, setPdfUri, userid.userId]); // Runs whenever `pdfUri` changes

  return (
    <View style={styles.container}>
      {pdfUri ? (
        <Pdf source={{ uri: pdfUri }} style={styles.pdf} />
      ) : error ? (
        <ScrollView><Text>{error}</Text></ScrollView>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 10,
    // The default flexDirection is 'column', so items align to the left by default.
  },
  headerText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 20,
    color: 'grey',
    textAlign: 'left',
  },

  pdf: {
    flex: 1,
    width: '100%',
    height: Dimensions.get('window').height,
  },
})

export default PDFExam;
