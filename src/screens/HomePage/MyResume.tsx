import React, { useState, useCallback,useEffect } from 'react';
import { StyleSheet, Dimensions, View, ActivityIndicator, Text, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useAuth } from '@context/Authcontext';
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


const { width, height } = Dimensions.get('window');
const BANNER_SIZE = Math.min(width * 0.2, 100); // Adjust the size dynamically
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
      refreshPdf(); // Fetch PDF when component mounts
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
      {/* <LinearGradient
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
          <Resumebanner width={width*0.35} height={height*0.2} right={10} />
        </View>

      </LinearGradient> */}
      <View style={styles.pdf}>
     
        <PDFExam/>
   
        <View>
        <TouchableOpacity onPress={downloadFile} style={styles.downloadButton}>
              {/* <Image source={require('../../assests/Images/download.png')} style={styles.downloadIcon} /> */}
              <AntDesign name="download" size={20} color="gray" />
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
    marginTop:10,
    padding:10,
    paddingRight:1.5

  },
  banner:{
    position:'relative',
    padding:5

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

  },
  pdf: {
    marginTop:20,
    flex: 1,
    width: '100%',
    height: Dimensions.get('window').height,
  },
  gradientContainer: {
    width: '98%',
    height: height*0.21,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainer: {
    flexDirection: 'column',
    width: 200,
    justifyContent: 'center',
    marginLeft: 20,
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
    fontFamily:'PlusJakartaSans-Bold'
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