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
      setErrorMessage('Please upload your resume before proceeding.'); // Set error message
      showToast('Please upload your resume before proceeding.'); // Optional: Show toast message for immediate feedback
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
        showToast("No file selected.");
        return;
      }

      const selectedFile: DocumentPickerResponse = result[0];
      const maxSize = 1048576; // 1MB size limit

      // Validate file size
      if (selectedFile.size && selectedFile.size > maxSize) {
        showToast("File size exceeds the 1MB limit.");
        return;
      }

      // Set selected file but do not upload yet
      setResumeFile(selectedFile);
      setResumeText(selectedFile.name || "");

      showToast("Resume selected. Remember to save changes.");
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

  const handleSaveResume = async () => {
    if (resumeFile) {
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
        // showToast('Error uploading resume. Please try again later.');
        setResumeModalVisible(false)
      }
    } else {
      showToast('No file selected to upload.');
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
              <Text style={styles.modalTitle1}>Upload Resume</Text>
            </View>
            <View style={{ alignItems: 'center', width: '100%', height: 150, borderColor: '#3A76DE', borderWidth: 1, borderStyle: 'dashed', marginBottom: 20, borderRadius: 10, backgroundColor: '#E7F2FF' }}>
              <TouchableOpacity
                onPress={handleUploadResume}
              >
                <Image
                  source={require('../../../src/assests/Images/file1.png')}
                  style={{ position: 'relative', left: 60, top: 40 }}

                />
                <Text style={{ padding: 50, fontFamily: 'PlusJakartaSans-Bold', }}>Select File</Text>
              </TouchableOpacity>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>

              <View style={styles.line}></View>
              <Text style={{ marginTop: -10, fontWeight: 600, fontFamily: 'PlusJakartaSans-Bold', }}> Or</Text>
              <View style={[styles.line, { marginLeft: 3 }]}></View>
            </View>
            <View>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => navigation.navigate('ResumeBuilder')}
              >
                <Text style={{ color: 'black', fontFamily: 'PlusJakartaSans-Bold', }}>Create Resume</Text>
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
  modalTitle1: {
    color: '#333333',
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    marginBottom: 20,
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
    height: 30,
    borderRadius: 5,
    marginBottom: 55

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
    marginBottom: 10,
    width: '80%',
    paddingLeft: 10,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 60,
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
    alignItems: "center",
    padding: 15,
    marginBottom: 15,

  },
  browseButton: {
    backgroundColor: "#F97316",
    flexDirection: "row",
    padding: 10,
    marginLeft: 7,
    borderRadius: 5,
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
    backgroundColor: "#F97316",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'center',
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