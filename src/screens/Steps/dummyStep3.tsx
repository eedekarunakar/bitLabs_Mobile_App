import React, { useState } from "react";
import { View, Text,  TouchableOpacity, StyleSheet, Image,Dimensions } from "react-native";
import { StackScreenProps } from '@react-navigation/stack';
import ProgressBar from "../../components/progessBar/ProgressBar";
import { RootStackParamList } from "../../../New";
import DocumentPicker, {
  DocumentPickerResponse,
} from "react-native-document-picker";

import { useAuth } from '../../context/Authcontext';
import { ProfileService } from '../../services/profile/ProfileService';
import LinearGradient from 'react-native-linear-gradient';
import API_BASE_URL from '../../services/API_Service';
import * as Progress from 'react-native-progress';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon7 from 'react-native-vector-icons/AntDesign';
import Fileupload from "../../assests/icons/Fileupload";
import { ScrollView } from "react-native-gesture-handler";
import Toast from 'react-native-toast-message';
const { width } = Dimensions.get('window'); 


import axios from "axios";


 
interface Step3Props {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  saveProfile: () => void;
}
 
type Props = StackScreenProps<RootStackParamList, 'Step3'> & Step3Props;
 
const Step3: React.FC = ({ route, navigation }: any) => {
  const [currentStep, setCurrentStep] = useState(3);
  const { updateShouldShowStep1 } = route.params;
  const [resumeFile, setResumeFile] = useState<DocumentPickerResponse | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [isResumeModalVisible, setResumeModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isUploadComplete, setIsUploadComplete] = useState(false);

  console.log('RR', route.params);


  const toastmsg = (type1: 'success' | 'error', message: string) => {
          Toast.show({
              type: type1,
              text1: '',
              text2:message,
              position: 'bottom',
              visibilityTime: 5000,
              text2Style:{
                  fontFamily:'PlusJakartaSans-Medium',
                  fontSize:12
              }
          });
      }
 
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showBorder, setShowBorder] = useState(false);
  const [bgcolor, setbgcolor] = useState(false)
  const [saveClicked, setSaveClicked] = useState(false);
 

  const { userId, userToken } = useAuth();
  const saveProfile = () => {
    console.log("Profile saved!");
    // Add your logic for saving the profile
  };
 
  const goBackToStep2 = () => {
    console.log("Back button pressed, changing step to 2");
    setCurrentStep(2);
    navigation.goBack(); // Go back to Step 2 screen
  };
 
  const handleSave = () => {
    // Check if the resume is uploaded
    if (!resumeFile) {
      return; // Prevent calling saveProfile or navigating further
    }
 
    // Clear any previous error messages
    setErrorMessage('');
 
    // Proceed with saving the profile only if the resume is uploaded
    saveProfile(); // Call saveProfile when the user saves
    setCurrentStep(3); // Update the current step
 
    // Update step1 visibility and navigate to BottomTab after a delay
    updateShouldShowStep1(false);
    setTimeout(() => {
      navigation.navigate("BottomTab", { shouldShowStep1: false, welcome: "Welcome" });
    }, 100);
  };
 
  const handleAPI = async () => {
    try {
      const requestData = {
        basicDetails: {
          firstName: route.params.firstName,
          lastName: route.params.lastName,
          email: route.params.email,
          alternatePhoneNumber: route.params.alternatePhoneNumber,
        },
        experience: route.params.experience,
        qualification: route.params.qualification,
        specialization: route.params.specialization,
        preferredJobLocations: route.params.preferredJobLocations,
        skillsRequired: route.params.skillsRequired.map((skill: any) => ({ skillName: skill.skillName })),
      };

      console.log('API Request Data:', requestData);

      const response = await axios.post(
        `${API_BASE_URL}/applicantprofile/createprofile/${userId}`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },

        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log('Profile created successfully:', response.data);
handleSave();
      } else {
        console.error('Failed to create profile', response.status);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  }
 
  const handleUploadResume = async () => {
    setIsUploadComplete(true)
    try {
      const result: DocumentPickerResponse[] = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf], // Allow only PDF files
 
 
      });
 
 
      if (!result || result.length === 0) {
 
        return;
      }
 
      const selectedFile: DocumentPickerResponse = result[0];
      const maxSize = 1048576; // 1MB size limit
 
      // Validate file size
      if (selectedFile.size && selectedFile.size > maxSize) {
        toastmsg('error',"File size exceeds the 1MB limit.");
        return;
      }
 
      setResumeFile(selectedFile);
      setResumeText(selectedFile.name || '');
      
      // Show a toast message
      //showToast('Resume selected. Uploading...');
 
      // Simulate delay to ensure the file name is displayed first
      setTimeout(() => {
        
        // Start the upload process
        setLoading(true);
        setProgress(0);
        setShowBorder(true)
        setbgcolor(false)
        
 
        // Simulate upload progress
        const interval = setInterval(() => {
          
          setProgress((prevProgress) => {
            const newProgress = prevProgress + 0.5; 
            if (newProgress >= 2) {
              clearInterval(interval);
              setLoading(false);
              setIsUploadComplete(false)
              
              
            }
            return newProgress;
            
          });
          
        }, 1000); // Update progress every 1 second
      }, 10); // 0.5 second delay before starting the progress bar
 
  
 
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User canceled the picker");
        toastmsg('error',"Upload cancelled.");
        setIsUploadComplete(false)
      } else {
        console.error("Unknown error: ", err);
        toastmsg('error',"Error selecting file. Please try again.");
      }
    }
 
 
  };
 
  const handleCancelUpload = () => {
    setResumeFile(null);
    setResumeText('');
    setLoading(false);
    setProgress(0);
    toastmsg('error','Upload canceled.');
    setShowBorder(false);
  };
 
  const handleSaveResume = async () => {
    if (resumeFile) {
      setbgcolor(false)
      const formData = new FormData();
      formData.append('resume', {
        uri: resumeFile.uri,
        type: resumeFile.type,
        name: resumeFile.name,
      } as any);
 
      const response = await ProfileService.uploadResume(userToken, userId, formData);
      if (response.success) {
        setResumeFile(response.data.fileName);
        toastmsg('success','Resume uploaded successfully!');
        setResumeModalVisible(false)
      } else {
        console.error(response.message);
        toastmsg('error','Error uploading resume. Please try again later.');
        setResumeModalVisible(false)
      }
    } else {
      setbgcolor(true)
    }
  };
 
 
  return (
 
    
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>

        <Image style={styles.logo} source={require('../../assests/LandingPage/logo.png')}/>

      </View>
      

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.completeProfile}>Complete Your Profile</Text>
          <Text style={styles.subHeader}>Fill the form fields to go to the next step</Text>
        </View>
 
        {/* ProgressBar */}
        <ProgressBar initialStep={currentStep} />
        <View>
          <View style={{ paddingHorizontal: 15 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
              <Text style={styles.modalTitle1}>Upload Resume</Text>
            </View>
            <View style={[styles.uploadContainer, { borderColor: bgcolor ? '#DE3A3A' : '#3A76DE', borderWidth: 1.5,alignSelf: 'stretch', borderStyle: 'dashed', backgroundColor: bgcolor ? "#FFEAE7" : "#E7F2FF", borderRadius: 20, }]}>
              <TouchableOpacity onPress={handleUploadResume}>
                <View style={{ alignItems: 'center' }}>
                  {/* <Image
                    source={require('../../../src/assests/Images/file1.png')}
                    style={{ position: 'absolute', top: 30 }}
                  /> */}
                  <Fileupload style={{position:'absolute',top:30}}/>
                </View>
 
                <View style={{ padding: 10,}}>
                  <Text style={{ fontSize: 17, marginTop: 65, textAlign: 'center',fontFamily: 'PlusJakartaSans-Bold' }} >Select File</Text>
                  <Text style={{ color: '#6C6C6C', textAlign: 'center',fontFamily: 'PlusJakartaSans-Medium' }}>File must be less than 1Mb</Text>
                  <Text style={{ color: '#6C6C6C', textAlign: 'center',fontFamily: 'PlusJakartaSans-Medium' }}>Only .doc or .PDFs are allowed.</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ marginBottom: 50 }}>
              {bgcolor? (
                <Text style={{ color: 'red', marginTop: 7,marginBottom:22,fontFamily: 'PlusJakartaSans-Medium' }}>File Not selected</Text>
              ) : (
                <Text></Text>
              )}
            </View>
 
            <View style={[styles.fileContainer, showBorder && styles.showborder]}>
 
              {resumeFile && (
 
                <View style={{ flexDirection: 'row', }}>
                  <FontAwesome name="file-text-o" size={20} color="#000" />
 
                  <Text style={[styles.fileNameText, { marginLeft: 12 }]}>
                    {resumeFile?.name ? (resumeFile.name.length > 20 ? `${resumeFile.name.substring(0, 17)}...` : resumeFile.name) : "No file selected"}
                  </Text>
                  <TouchableOpacity
                    style={styles.closeIcon}
                    onPress={handleCancelUpload}
                  >
                    <View style={{ position:'absolute',right:5,top:1.5 }}>
                      <Icon7 name="close" size={15} color={'0D0D0D'} />
                    </View>
 
                  </TouchableOpacity>
                </View>
              )}
 
              {loading && (
                <View style={styles.progressContainer}>
                  <Progress.Bar
                    progress={progress}
                    width={width*0.65}
                    color="#F97316"  // Progress bar color
                    unfilledColor="#D7D6D6"  // Unfilled background color
                    borderColor="#D7D6D6"  // Outline color
                  />
                </View>
              )}
 
            </View>
 
 
            <View>
              {showBorder ? (
                <View style={[styles.orContainer, { marginTop: 15, marginVertical: 10 }]}>
                  <View style={styles.line}></View>
                  <Text style={{ marginTop: -12, fontWeight: '600', fontFamily: 'PlusJakartaSans-Bold' }}>  Or  </Text>
                  <View style={[styles.line, { marginLeft: 3 }]}></View>
                </View>) :
                (
                  <View style={[styles.orContainer, { marginTop: -26, marginVertical: 20, }]}>
                    <View style={styles.line}></View>
                    <Text style={{ marginTop: -12, fontWeight: '600', fontFamily: 'PlusJakartaSans-Bold' }}>  Or  </Text>
                    <View style={[styles.line, { marginLeft: 3 }]}></View>
                  </View>
 
                )}
 
            </View>
 
 
            <View>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => navigation.navigate('ResumeBuilder')}
              >
                <Text style={{ color: '#FFFFFF', fontFamily: 'PlusJakartaSans-Bold' }}>Create Resume</Text>
              </TouchableOpacity>
            </View>
          </View>
 
        </View>
        {/* Resume Upload Section */}
        </View>
      </ScrollView>
  
      
    
 
 
      {/* Button container for Save or Back */}
      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          {/* Back Button */}

 
          {/* Save & Next Button */}

          <TouchableOpacity style={[ styles.backButton,  { borderWidth: 0}]} disabled={isUploadComplete}   onPress={() => { handleSaveResume(); handleAPI(); handleSave(); }}>
            {
              isUploadComplete?(
                <View style={[styles.saveButton, { backgroundColor: "#D7D6D6", alignItems: "center", justifyContent: "center", borderRadius: 5 }]}>
                <Text style={[styles.nextButtonText, { color: "#A0A0A0",fontFamily: 'PlusJakartaSans-Medium' }]}>Save</Text>
              </View>
              ):(

              <LinearGradient

              colors={['#F97316', '#FAA729']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.saveButton]} // Combine backButton styling with gradient-specific overrides
            >
              <Text style={styles.nextButtonText}>Save</Text>
            </LinearGradient>
              )
            }

          </TouchableOpacity>
 
        </View>
      </View>
    </View >
    
  );
};

const styles = StyleSheet.create({
  fileContainer: {
    padding: 10,
    marginBottom: 10,
    marginTop: -50,
    position: 'relative',
    width:'100%'
  },
  showborder: {
    borderWidth: 1,
    borderColor: '#D7D6D6',
    borderRadius: 10,
  },
  modalTitle1: {
    color: '#333333',
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    marginBottom: 20,
  },
  progressContainer: {
    marginTop: 20,
    alignItems: 'center',
    position:'relative',
    bottom:5
  },
 
  orContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
 
  },
  fileNameText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  closeIcon: {
    position: 'absolute',
    top: 1,
    right: 1,
    padding: 3,
    paddingRight:30
 
  },
  line: {
    width: '20%',
    height: 1,
    backgroundColor: '#D8D8D8',
    position: 'static',
    top: '60%',
    marginBottom: 10,
  },
  uploadButton: {
    maxWidth: width*0.75,
    backgroundColor: '#4B4A4A',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 5,
    marginBottom: 55,
    
  },
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    paddingBottom: 75,
    width: "100%",
    maxWidth: Dimensions.get("window").width, // Prevents overflow
    minWidth: Dimensions.get("window").width,
   
   
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 3,
    width: '80%',
    paddingLeft: 10,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  logoContainer: {
    marginBottom: 20,
    marginTop:9,
    alignSelf:'center'
  },
  logo: {
    width: 150, // Decreased width
    height: 45,
    marginBottom: 20,
 
  },
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  completeProfile: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: "black",
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 11,
    color: "black",
    fontFamily: 'PlusJakartaSans-Medium',
  },
  form: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    color: "black",
    marginBottom: 8,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  uploadContainer: {
    //flexDirection: "row",
    //justifyContent: "space-between",
    textAlign:'center',
    padding: 5,
    width: '100%',
    
  
  },
  browseButton: {
    backgroundColor: "gray",
    flexDirection: "row",
    padding: 10,
    marginLeft: 7,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  browseText: {
    color: "white",
    fontFamily: 'PlusJakartaSans-Medium',
  },
  orText: {
    textAlign: "center",
    fontSize: 14,
    marginVertical: 10,
  },
  buildButton: {
    width: 142,
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
 
  },
  buildText: {
    color: "white",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 15,
    borderTopColor: "#ccc",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    paddingVertical: 10,
    gap: 10
  },
  backButton: {
    borderWidth: 1,
    borderColor: '#F97316',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  backButtonText: {
    color: "#F97316",
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  nextButton: {
    backgroundColor: "#F97316",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  saveButton: {
    padding: 10,
    borderRadius: 6, // Consistent with backButton
    alignItems: 'center',
    justifyContent: 'center',
    width: '95%'
  }
});
 
export default Step3;