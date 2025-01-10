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
 
 
interface Step3Props {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  saveProfile: () => void;
  //route: Props;
  // navigation: any;
}
 
type Props = StackScreenProps<RootStackParamList, 'Step3'> & Step3Props;
 
const Step3: React.FC = ({ route, navigation }: any) => {
  const [step, setStep] = useState(3); // Initialize step state
  const { updateShouldShowStep1 } = route.params;
  const [resumeFile, setResumeFile] = useState<DocumentPickerResponse | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [isResumeModalVisible, setResumeModalVisible] = useState(false);
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
    setStep(2);
    navigation.goBack(); // Go back to Step 2 screen
  };
 
  const handleSave = () => {
    saveProfile(); // Call saveProfile when the user saves
    setStep(3);
    //navigation.navigate("Step1"); // Navigate wherever you want after saving
    updateShouldShowStep1(false);
    setTimeout(() => {
      navigation.navigate("BottomTab", { shouldShowStep1: false });
    }, 100);
  };
 
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
        showToast('Error uploading resume. Please try again later.');
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
        <Image style={styles.logo} source={require("../../assests/Images/rat/logo.png")} />
      </View>
 
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.completeProfile}>Upload Your Resume</Text>
          <Text style={styles.subHeader}>Please upload your resume before finalizing:</Text>
        </View>
 
        {/* ProgressBar */}
        <ProgressBar currentStep={step} />
 
        {/* Resume Upload Section */}
        <View style={styles.form}>
          <Text style={styles.label}>Resume</Text>
          <View style={styles.uploadContainer}>
            <TextInput
              placeholder="Upload your resume" placeholderTextColor="#B1B1B1"
              style={styles.textInput}
              editable={false}
              value={resumeText}
            />
            <TouchableOpacity
              style={styles.browseButton}
              onPress={handleUploadResume}
            >
              <Text style={styles.browseText}>Browse</Text>
            </TouchableOpacity>
          </View>
         
        </View>
      </View>
 
      {/* Button container for Save or Back */}
      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={goBackToStep2}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
 
          {/* Save & Next Button */}
          <TouchableOpacity style={styles.nextButton} onPress={() => { handleSaveResume();handleSave(); }}>
            <Text style={styles.nextButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
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
    fontWeight: "bold",
    color: "black",
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 11,
    color: "black",
  },
  form: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    color: "black",
    marginBottom: 8,
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
    marginLeft:7,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  browseText: {
    color: "white",
  },
  orText: {
    textAlign: "center",
    fontSize: 14,
    marginVertical: 10,
  },
  buildButton: {
    backgroundColor: "#F97316",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
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
    paddingVertical: 17,
    backgroundColor: "#fff",
   
    borderTopColor: "#ccc",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  backButton: {
    borderWidth: 2,
    borderColor: "#F97316",
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
  },
  backButtonText: {
    color: "#F97316",
    fontSize: 16,
    fontWeight: "bold",
  },
  nextButton: {
    backgroundColor: "#F97316",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
 
export default Step3;