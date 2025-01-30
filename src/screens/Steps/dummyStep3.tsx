import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { StackScreenProps } from '@react-navigation/stack';
import ProgressBar from "../../components/progessBar/ProgressBar";
import { RootStackParamList } from "../../../New";
import DocumentPicker, {
  DocumentPickerResponse,
} from "react-native-document-picker";
import { ToastAndroid } from 'react-native';
import { useAuth } from '../../context/Authcontext';
import { ProfileService } from '../../services/profile/ProfileService';
import LinearGradient from 'react-native-linear-gradient';
import API_BASE_URL from '../../services/API_Service';
import * as Progress from 'react-native-progress';
import FontAwesome from 'react-native-vector-icons/FontAwesome';



interface Step3Props {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  saveProfile: () => void;
  //route: Props;
  // navigation: any;
}

type Props = StackScreenProps<RootStackParamList, 'Step3'> & Step3Props;

const Step3: React.FC = ({ route, navigation }: any) => {
  const [currentStep, setCurrentStep] = useState(3);
  const { updateShouldShowStep1 } = route.params;
  const [resumeFile, setResumeFile] = useState<DocumentPickerResponse | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [isResumeModalVisible, setResumeModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const showToast = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showBorder, setShowBorder] = useState(false);
  const [bgcolor,setbgcolor]=useState(false)
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
      //setErrorMessage('Please upload your resume before proceeding.'); // Set error message
      //showToast('Please upload your resume before proceeding.'); // Optional: Show toast message for immediate feedback
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
      const response = await fetch(
        `${API_BASE_URL}/applicantprofile/createprofile/${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`, // Authorization token
          },
          body: JSON.stringify({
            firstName: route.params.firstName,
            lastName: route.params.lastName,
            alternatePhoneNumber: route.params.whatsappNumber, // Map whatsappNumber here
            email: route.params.email,
            skillsRequired: route.params.skillsRequired,// Assuming selectedSkills is an array
            experience: route.params.experience,
            qualification: route.params.qualification,
            specialization: route.params.specialization,
            preferredJobLocations: route.params.selectedLocations,

          }),
        },
      );
      if (response.ok) {
        const data = await response.json();
        console.log('Profile created successfully:', data);
      } else {
        console.error('Failed to create profile', response.status);
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  const handleUploadResume = async () => {
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
        showToast("File size exceeds the 1MB limit.");
        return;
      }

      setResumeFile(selectedFile);
      setResumeText(selectedFile.name || '');

      // Show a toast message
      showToast('Resume selected. Uploading...');

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
            const newProgress = prevProgress + 0.3; // 1/8th of the total progress for 8 seconds
            if (newProgress >= 1) {
              clearInterval(interval);
              setLoading(false);
            }
            return newProgress;
          });
        }, 1000); // Update progress every 1 second
      }, 500); // 0.5 second delay before starting the progress bar
    
    

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User canceled the picker");
        showToast("Upload canceled.");
      } else {
        console.error("Unknown error: ", err);
        showToast("Error selecting file. Please try again.");
      }
    }

    
  };

  const handleCancelUpload = () => {
    setResumeFile(null);
    setResumeText('');
    setLoading(false);
    setProgress(0);
    showToast('Upload canceled.');
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
        showToast('Resume uploaded successfully!');
        setResumeModalVisible(false)
      } else {
        console.error(response.message);
        showToast('Error uploading resume. Please try again later.');
        setResumeModalVisible(false)
      }
    } else {
      setbgcolor(true)
    }
  };



  



  return (
    <View style={styles.screen}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require("../../assests/Images/logo.png")} />
      </View>

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.completeProfile}>Complete Your Profile</Text>
          <Text style={styles.subHeader}>Fill the form  fields to go  next step</Text>
        </View>

        {/* ProgressBar */}
        <ProgressBar initialStep={currentStep} />
        <View>
        <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.modalTitle1}>Upload Resume</Text>
      </View>
      <View style={[styles.uploadContainer,{borderColor: bgcolor ? '#DE3A3A' : '#3A76DE', borderWidth: 1.5, borderStyle: 'dashed', backgroundColor: bgcolor? "#FFEAE7":"#E7F2FF", borderRadius: 20}]}>
        <TouchableOpacity onPress={handleUploadResume}>
          <Image
            source={require('../../../src/assests/Images/file1.png')}
            style={{ position: 'relative', left: 150, top: 40 }}
          />
          <View style={{ padding: 50,alignItems:'center',paddingLeft:80  }}>
            <Text style={{fontWeight:'bold',fontSize:17,marginBottom:10,}} >Select File</Text>
            <Text style={{color:'#6C6C6C'}}>File must be less than 1Mb</Text>
            <Text style={{color:'#6C6C6C'}}>Only .doc or .PDFs are allowed.</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{marginBottom:50}}>
        {bgcolor?(
          <Text style={{color:'red',fontWeight:'bold',marginTop:10}}>File Not selected</Text>
        ):(
          <Text></Text>
        )}
      </View>

      <View style={[styles.fileContainer, showBorder && styles.showborder]}>

        {resumeFile && (

          <View style={{flexDirection:'row',}}>
              <FontAwesome name="file-text-o" size={20} color="#000" />
              <Text style={[styles.fileNameText,{marginLeft:12}]}>{resumeFile.name}</Text>

              <TouchableOpacity
                style={styles.closeIcon}
                onPress={handleCancelUpload}
              >
                <Image source={require('../../assests/Images/x1.png')} ></Image>
              </TouchableOpacity>
          </View>


          )}

        {loading && (
          <View style={styles.progressContainer}>
            <Progress.Bar
              progress={progress}
              width={330}
              color="#F97316"  // Progress bar color
              unfilledColor="#D7D6D6"  // Unfilled background color
              borderColor="#D7D6D6"  // Outline color
            />
          </View>
        )}

      </View>

      <View>
        {showBorder?(

          <View style={[styles.orContainer,{marginTop:20,marginVertical:20}]}>
            <View style={styles.line}></View>
            <Text style={{ marginTop: -12, fontWeight: '600', fontFamily: 'PlusJakartaSans-Bold' }}>  Or  </Text>
            <View style={[styles.line, { marginLeft: 3 }]}></View>
          </View>

          
        ):(

          <View style={[styles.orContainer,{marginTop:-20,marginVertical:20,}]}>
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
          <Text style={{ color: 'black', fontFamily: 'PlusJakartaSans-Bold',fontWeight:'bold' }}>Create Resume</Text>
        </TouchableOpacity>
      </View>
    </View>

        </View>



        {/* Resume Upload Section */}

      </View>



      {/* Button container for Save or Back */}
      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={goBackToStep2}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          {/* Save & Next Button */}
          <TouchableOpacity style={[styles.backButton, { borderWidth: 0 }]} onPress={() => { handleSaveResume(); handleAPI(); handleSave(); }}>
            <LinearGradient
              colors={['#F97316', '#FAA729']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.saveButton]} // Combine backButton styling with gradient-specific overrides
            >
              <Text style={styles.nextButtonText}>Save</Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  fileContainer: {
    padding: 10,
    marginBottom: 10,
    marginTop:-30
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
    marginTop: 10,
    alignItems: 'center',
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
  },
  closeIcon: {
    position:'absolute',
    left:330,
    
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
    width: '100%',
    backgroundColor: '#F8F8F8',
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
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    
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
    width: '50%',
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