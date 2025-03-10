import React from 'react';
import { StyleSheet, Dimensions, View, ActivityIndicator, Text } from 'react-native';
import Pdf from 'react-native-pdf';
import { usePdfViewModel } from '@viewmodel/usePdfViewModel';

const PDFExam = () => {
  const { pdfUri, error } = usePdfViewModel();

  return (
    <View style={styles.container}>
      {pdfUri ? (
        <Pdf source={{ uri: pdfUri }} style={styles.pdf} />
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: Dimensions.get('window').height,
    backgroundColor: 'white',
  },
});

export default PDFExam;
