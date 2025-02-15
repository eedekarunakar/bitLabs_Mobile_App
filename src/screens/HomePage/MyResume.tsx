import React, { useState, useCallback, } from 'react';
import { StyleSheet, Dimensions, View, ActivityIndicator, Text, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import Pdf from 'react-native-pdf';
import { useAuth } from '@context/Authcontext';
import API_BASE_URL from '@services/API_Service';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Resumebanner from '@assests/icons/Resumebanner';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { requestStoragePermission } from './permissions';
import { RootStackParamList } from '@models/home/model';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResumeBuilder'>;
 
 
const PDFExample = () => {
  const userid = useAuth();
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();
  const fetchPdf = async () => {

    try {
      setLoading(true);
 
      console.log('userid:', userid.userId);
      const response = await fetch(`${API_BASE_URL}/resume/pdf/${userid.userId}`);
      console.log(response);
      const arrayBuffer = await response.arrayBuffer();
      const base64Pdf = arrayBufferToBase64(arrayBuffer);
      const pdfUri = `data:application/pdf;base64,${base64Pdf}`;
      setPdfUri(pdfUri);
    }
    catch (error) {
    console.error('Error fetching PDF:', error);
    setError('Error fetching PDF');
  }
  finally {
    setLoading(false);
  }



};

useFocusEffect(
  useCallback(() => {
    fetchPdf();
  }, [userid.userId])
);

// Helper function to convert ArrayBuffer to Base64
const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const source = { uri: pdfUri };
const downloadFile = async () => {
  if (!pdfUri) {
    Toast.show({
      type: 'error',
      text1: '',
      text2: 'No PDF available to download.',
      position: 'bottom',
      visibilityTime: 5000, // Toast stays for 3 seconds
      text2Style: {
        fontSize: 14

      },
    });
    return;
  }

  const hasPermission = await requestStoragePermission();
  if (!hasPermission) {
    Toast.show({
      type: 'error',
      text1: '',
      text2: 'Allow storage permission to download.',
      position: 'bottom',
      visibilityTime: 5000, // Toast stays for 4 seconds      
      text2Style: { fontSize: 16 },
    });
    return;
  }


  const fileName = `Resume_${new Date().getTime()}.pdf`;
  const downloadPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

  try {
    await RNFS.writeFile(downloadPath, pdfUri.replace('data:application/pdf;base64,', ''), 'base64');
    Toast.show({
      type: 'success',
      text1: '',
      text2: `File saved successfully!`,
      position: 'bottom',
      visibilityTime: 5000, // Toast stays for 5 seconds
      text1Style: { fontSize: 18, fontWeight: 'bold' },
      text2Style: { fontSize: 16 },
    });
  } catch (error) {
    console.error('Download Error:', error);
    Toast.show({
      type: 'error',
      text1: '',
      text2: 'Failed to save PDF file.',
      position: 'bottom',
      visibilityTime: 4000, // Toast stays for 4 seconds
      text1Style: { fontSize: 18, fontWeight: 'bold' },
      text2Style: { fontSize: 16 },
    });
  }
};



return (
  <SafeAreaView style={{ flex: 1 }}>


    <View style={styles.headerContainer}>
      <Text style={styles.title}>My Resume</Text>
    </View>
    <View style={styles.container}>
      <LinearGradient
        colors={['#FAA428', '#F97316']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }} // 90-degree (horizontal) gradient
        style={styles.gradientContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.resumeText}>Build your professional
            resume for free.</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ResumeBuilder')}>
            <Text style={styles.buttonText}>Create Now</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Resumebanner width={130} height={130} />
        </View>


      </LinearGradient>
      <View style={styles.pdfContainer}>

        {pdfUri ? (
          <>
            <Pdf
              source={source as { uri: string }}
              onLoadComplete={(numberOfPages, filePath) => {
                console.log(`Number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page, numberOfPages) => {
                console.log(`Current page: ${page}`);
              }}
              onError={(error) => {
                console.log(error);
              }}
              onPressLink={(uri) => {
                console.log(`Link pressed: ${uri}`);
              }}
              style={styles.pdf}
            />
            <TouchableOpacity onPress={downloadFile} style={styles.downloadButton}>
              <Image source={require('../../assests/Images/download.png')} style={styles.downloadIcon} />
            </TouchableOpacity>
          </>
        ) : error ? (
          <ScrollView>
            <Text>{error}</Text>
          </ScrollView>
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
      </View>
    </View>
  </SafeAreaView>
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
  pdfContainer: {
    flex: 1,
    marginTop: 10,
 
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  gradientContainer: {
    width: 385,
    height: 149,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 20,
  },
  textContainer: {
    flexDirection: 'column',
    width: 200,
    justifyContent: 'center',
    marginLeft: 10,
  },
  resumeText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  button: {
    backgroundColor: '#fff',
    width: 93,
    height: 28,
    flexShrink: 0,
    justifyContent: 'center',
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 12,
    color: '#F97517',
    textAlign: 'center',
  },
  headerContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: 58,
    backgroundColor: '#FFF'
  },
  headerImage: {
    width: 20, // Adjust size as needed
    height: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#495057',
    lineHeight: 25,
    marginLeft: 15
  },
  downloadButton: {
    position: 'absolute',
    bottom: 10, // Adjust as needed
    right: 10, // Adjust as needed
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 50,
    marginRight: 1,
  },
  downloadIcon: {
    width: 30,
    height: 30,
  }
});

export default PDFExample;