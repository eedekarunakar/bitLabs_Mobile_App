import React, { useState, useCallback,useEffect } from 'react';
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
import { RootStackParamList } from '@models/model';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';
import { usePdf } from './resumestate';
import PDFExam from './Reusableresume';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResumeBuilder'>;
import AntDesign from 'react-native-vector-icons/AntDesign';


 
 
const PDFExample = () => {
  const userid = useAuth();
  //const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();
  const {setPdfUri,pdfUri,refreshPdf} = usePdf()
 
 
  
console.log('pdfUri',pdfUri)
useEffect(() => {
  if (userid.userId) {
      refreshPdf(userid.userId.toString()); // Fetch PDF when component mounts
  }
}, [userid.userId]); 
 
 
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
      <View style={styles.pdf}>
        <PDFExam/>
        <View>
        <TouchableOpacity onPress={downloadFile} style={styles.downloadButton}>
              {/* <Image source={require('../../assests/Images/download.png')} style={styles.downloadIcon} /> */}
              <AntDesign name="download" size={24} color="gray" />
          </TouchableOpacity>
        </View>
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

  pdf: {
    flex: 1,
    width: '100%',
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
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
    marginRight: 1,
    borderColor:'#00000040',
    borderWidth:2

    
  },
  downloadIcon: {
    width: 30,
    height: 30,
  }
});
 
export default PDFExample;