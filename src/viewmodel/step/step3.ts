import { useState,useContext} from 'react';
import UserContext from '@context/UserContext';

import { ProfileModel } from '@services/step/stepServices';
import { ToastAndroid } from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import DocumentPicker, {
    DocumentPickerResponse,
  } from "react-native-document-picker";
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@models/model';
import ProfileService from '@services/profile/ProfileService';

type navigation = NavigationProp<RootStackParamList, 'BottomTab'>;

export const useStep3ViewModel = (userId: number |null, userToken: string|null, navigation: any, route: any) => {
  const [resumeFile, setResumeFile] = useState<DocumentPickerResponse | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showBorder, setShowBorder] = useState(false);
  const [bgcolor, setbgcolor] = useState(false);
  const {setPersonalName,refreshJobCounts,refreshVerifiedStatus} = useContext(UserContext)
const nav = useNavigation<navigation>();
  const showToast = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const toastmsg = (type1: 'success' | 'error', message: string) => {
    Toast.show({
      type: type1,
      text1: '',
      text2: message,
      position: 'bottom',
      visibilityTime: 5000,
      text2Style: {
        fontFamily: 'PlusJakartaSans-Medium',
        fontSize: 12,
      },
    });
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
 
      const response = await ProfileModel.createProfile(userId, userToken, requestData);
 
      if (response) {
        if(route ?.params ?.firstName){
        setPersonalName(route.params.firstName)
        }
        refreshJobCounts();
        refreshVerifiedStatus();
       navigation();
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const handleUploadResume = async () => {
    setIsUploadComplete(true);
    try {
      const result: DocumentPickerResponse[] = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      if (!result || result.length === 0) {
        return;
      }

      const selectedFile: DocumentPickerResponse = result[0];
      const maxSize = 1048576;

      if (selectedFile.size && selectedFile.size > maxSize) {
        toastmsg('error', 'File size exceeds the 1MB limit.');
        setIsUploadComplete(false);
        return;
      }

      setResumeFile(selectedFile);
      setResumeText(selectedFile.name || '');

      setTimeout(() => {
        setLoading(true);
        setProgress(0);
        setShowBorder(true);
        setbgcolor(false);

        const interval = setInterval(() => {
          setProgress((prevProgress) => {
            const newProgress = prevProgress + 0.5;
            if (newProgress >= 2) {
              clearInterval(interval);
              setLoading(false);
              setIsUploadComplete(false);
            }
            return newProgress;
          });
        }, 1000);
      }, 10);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        toastmsg('error', 'Upload cancelled.');
        setIsUploadComplete(false);
      } else {
        toastmsg('error', 'Error selecting file. Please try again.');
      }
    }
  };

  const handleCancelUpload = () => {
    setResumeFile(null);
    setLoading(false);
    setProgress(0);
    toastmsg('error', 'Upload cancelled.');
    setShowBorder(false);
  };

  const handleSaveResume = async () => {
    if (resumeFile) {
      setbgcolor(false);
      const formData = new FormData();
      formData.append('resume', {
        uri: resumeFile.uri,
        type: resumeFile.type,
        name: resumeFile.name,
      } as any);

      const response = await ProfileService.uploadResume(userToken, userId, formData);

      if (response.success) {

        //setResumeFile(response.fileName);
        toastmsg('success', 'Resume uploaded successfully!');
      } else {
        toastmsg('error', 'Error uploading resume. Please try again later.');
      }
    } else {
      setbgcolor(true);
    }
  };

  return {
    resumeFile,
    resumeText,
    errorMessage,
    isUploadComplete,
    loading,
    progress,
    showBorder,
    bgcolor,
    handleAPI,
    handleUploadResume,
    handleCancelUpload,
    handleSaveResume,
  };
};