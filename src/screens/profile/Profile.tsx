import React, { useState, useEffect, useContext } from 'react';
import {
    View, Text, Image, StyleSheet, TouchableOpacity, ScrollView,
    KeyboardAvoidingView, Platform, Modal, TextInput, Button, PermissionsAndroid, ActivityIndicator, Dimensions
} from 'react-native';
import ProfessionalDetailsForm from './ProfessionalDetailsForm';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon5 from 'react-native-vector-icons/MaterialIcons'
import { RootStackParamList } from '../../../New';
import { useProfileViewModel } from '../../viewmodel/Profileviewmodel';
import { useAuth } from '../../context/Authcontext';
import { Skill, ApplicantSkillBadge } from '../../models/profile/profile';
import { ProfileService } from '../../services/profile/ProfileService';
import { ToastAndroid } from 'react-native';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import { useProfilePhoto } from '../../context/ProfilePhotoContext';
import { base64Image } from '../../services/base64Image';
import LinearGradient from 'react-native-linear-gradient';
import Icon7 from 'react-native-vector-icons/AntDesign'; // Assuming you're using AntDesign for icons
import { launchCamera, launchImageLibrary, CameraOptions, ImagePickerResponse, ImageLibraryOptions } from 'react-native-image-picker';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import Fileupload from '../../assests/icons/Fileupload';



import * as Progress from 'react-native-progress';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import UserContext from '../../context/UserContext';





const { width } = Dimensions.get('window');

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>
function ProfileComponent() {
    const [isProfessionalFormVisible, setProfessionalFormVisible] = useState(false);
    const [isCameraOptionsVisible, setCameraOptionsVisible] = useState(false);
    const [isPersonalDetailsFormVisible, setPersonalDetailsFormVisible] = useState(false);
    const [isResumeModalVisible, setResumeModalVisible] = useState(false);
    const [resumeFile, setResumeFile] = useState<DocumentPickerResponse | null>(null);
    const [resumeText, setResumeText] = useState<string>('');
    const { fetchProfilePhoto, photo } = useProfilePhoto();
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showBorder, setShowBorder] = useState(false);
    const [bgcolor, setbgcolor] = useState(false)
    const [verified, setVerified] = useState(false)
    const [isUploadComplete, setIsUploadComplete] = useState(false);
  

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute<ProfileScreenRouteProp>()
    const { userId, userToken } = useAuth();
    const { setPersonalName } = useContext(UserContext)

    const DEFAULT_PROFILE_IMAGE = require('../../assests/profile/profile.png');
    console.log(userId, userToken)
    const {
        profileData,
        isLoading,
        setIsLoading,
        error,
        personalDetails,
        formErrors,
        setFormErrors,
        handleInputChange,
        updateBasicDetails,
        reloadProfile,
        resetPersonalDetails
    } = useProfileViewModel(userToken, userId);
    const { applicant, basicDetails, skillsRequired = [], qualification, specialization, preferredJobLocations, experience, applicantSkillBadges = [] } = profileData || [];



    const handlePermission = async () => {
        if (Platform.OS === 'android') {
            const permissions = Platform.Version >= 33
                ? [PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES]
                : [PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE];
            for (const permission of permissions) {
                const status = await PermissionsAndroid.check(permission);
                console.log(`Permission ${permission}:`, status ? 'GRANTED' : 'DENIED');
            }
            const grantedStatuses = await Promise.all(
                permissions.map((permission) => PermissionsAndroid.check(permission))
            );


            const allPermissionsGranted = grantedStatuses.every((status) => status);

            if (!allPermissionsGranted) {
                const granted = await PermissionsAndroid.requestMultiple(permissions);
                return Object.values(granted).every(status => status === PermissionsAndroid.RESULTS.GRANTED);
            }
            return true;
        }
        return true; // For iOS or platforms other than Android
    };
    const [key, setKey] = useState(0);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            console.log('Profile screen is focused');
            setKey(prevKey => (prevKey + 1) % 1000);
            // Change the key to force re-render
        });
        return unsubscribe;
    }, [navigation]);


    useEffect(() => {
        if (userId && userToken) {
            fetchProfilePhoto(userToken, userId);
        }
    }, [userId, userToken]);
    useEffect(() => {
        const checkVerification = async () => {
            try {
                const result = await ProfileService.checkVerified(userToken, userId);
                if (result) {
                    console.log("verified: " + result)
                    setVerified(result);
                }
            } catch (error) {
                console.error('Error checking verification:', error);
            }
        };

        checkVerification();
    }, [userId]);

    



    const validatePhoto = (photoFile: any) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        const maxSize = 1048576; // 1 MB in bytes

        if (!allowedTypes.includes(photoFile.type)) {
            toastmsg('error', 'only JPEG and PNG files are allowed.');
            return false;
        }

        if (photoFile.fileSize > maxSize) {
            toastmsg('error', 'File size must be less than 1 MB.');
            return false;
        }

        return true;
    };


    const uploadProfilePhoto = async (photoFile: any) => {
        setIsLoading(true);
        try {
            const result = await ProfileService.uploadProfilePhoto(userToken, userId, photoFile);
            if (result.success) {
                console.log('Photo uploaded successfully');
                fetchProfilePhoto(userToken, userId);
                toastmsg('success', 'Profile photo uploaded successfully!');
            } else {
                console.log('Failed to upload photo:', result.message);
                toastmsg('error', 'Failed to upload photo.');
            }
        } catch (error) {
            console.error('Error uploading photo:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCamera = async () => {
        const isPermissionGranted = await handlePermission();
        if (!isPermissionGranted) {
            console.log('Permission denied');
            return;
        }
        const options: CameraOptions = {
            mediaType: 'photo',
            saveToPhotos: true
        };
        launchCamera(options, (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log('User cancelled');
            } else if (response.errorCode) {
                console.log('Image picker error');
            } else if (response.assets && response.assets.length > 0) {
                const photoFile = response.assets[0];
                if (validatePhoto(photoFile)) {
                    console.log('uploading......');
                    uploadProfilePhoto(photoFile);
                } else {
                    console.log('Invalid file type or size.');
                }
            } else {
                console.log('Error storing image');
            }
            setCameraOptionsVisible(false);
        });

    };
    const removePhoto = async () => {
        if (photo === DEFAULT_PROFILE_IMAGE) {
            toastmsg('error', 'No photo to remove.');
            return;
        }
        setIsLoading(true);
        try {
            // Prepare the default image file object
            const defaultImageFile = {
                uri: base64Image,
                type: 'image/png', // Correct MIME type
                fileName: 'default_profile.png',
            };

            console.log('Default Image File:', defaultImageFile);

            // Upload the default image
            const result = await ProfileService.uploadProfilePhoto(userToken, userId, defaultImageFile);

            if (result.success) {
                await fetchProfilePhoto(userToken, userId); // Refresh profile photo after successful upload
                console.log('Default photo uploaded successfully');
                toastmsg('success', 'Default image set successfully!');
            } else {
                console.log('Failed to set default photo:', result.message);
                toastmsg('error', 'Failed to remove photo.');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error setting default photo:', error.message);
            }
            toastmsg('error', 'Error removing photo. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };




    const handleLibrary = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
        };
        launchImageLibrary(options, (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log('User cancelled');
            } else if (response.errorCode) {
                console.log(response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const photoFile = response.assets[0];
                if (validatePhoto(photoFile)) {
                    console.log('uploading......');
                    console.log(photoFile)
                    uploadProfilePhoto(photoFile);
                } else {
                    console.log('Invalid file type or size.');
                }
            }
            setCameraOptionsVisible(false);
        });
    };




    useEffect(() => {
        if (route.params?.retake) {
            handleCamera()
            navigation.setOptions({
                headerShown: false // Hide the header button to prevent re-navigation
            });
            navigation.setParams({ retake: false });
        }
    }, [route.params]);
    if (isLoading) {
        return <ActivityIndicator size="large" color="#F97316" />;
    }
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <Text onPress={reloadProfile} style={styles.retryText}>Tap to Retry</Text>
            </View>
        );
    }
    if (!profileData || !profileData.applicant) {
        setIsLoading(true)
        return (

            <View>

                <Text>No Applicant Data Found</Text>
            </View>
        );
    }

    const handleCancelUpload = () => {
        setResumeFile(null);
        setResumeText('');
        setLoading(false);
        setProgress(0);
        toastmsg('error', 'Upload cancelled');
        setShowBorder(false);

    };

    const handleUploadResume = async () => {
        setIsUploadComplete(true)
        try {
            const result: DocumentPickerResponse[] = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf], // Ensure only PDF files are shown
            });

            if (!result || result.length === 0) {
                toastmsg('error', 'No file selected.');
                return;
            }

            const selectedFile: DocumentPickerResponse = result[0];
            const maxSize = 1048576; // 1MB size limit

            // Validate file size
            if (selectedFile.size && selectedFile.size > maxSize) {
                toastmsg('error', 'File size exceeds the 1MB limit.');
                return;
            }

            // Set selected file but do not upload yet
            setResumeFile(selectedFile);
            setResumeText(selectedFile.name || '');
            //showToast('Resume selected. Uploading...');
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
                            setIsUploadComplete(false)
                        }
                        return newProgress;
                    });
                }, 1000); // Update progress every 1 second
            }, 10); // 0.5 second delay before starting the progress bar
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User canceled the picker');
                toastmsg('error', 'Upload canceled.');
                setIsUploadComplete(false)
            } else if ((err as { message: string }).message === 'Network Error') {
                console.log('Network Error:', err);
                toastmsg('error', 'Network error. Please check your internet connection and try again.');
            } else {
                console.error('Unknown error: ', err);
                toastmsg('error', 'Error selecting file. Please try again.');
            }
        }
    };



    const handleSaveResume = async () => {
        if (resumeFile) {

            //showToast('Resume uploaded')
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
                toastmsg('success', 'Resume uploaded successfully!');
                setResumeModalVisible(false)
                setShowBorder(false)
            } else {
                console.error(response.message);
                toastmsg('error', 'Error uploading resume. Please try again later.');
                setResumeModalVisible(false)

            }

        } else {

            setbgcolor(true)
        }
    };

    const handleSaveChanges = async () => {
        const success = await updateBasicDetails();
        if (personalDetails.firstName.length <= 19 && personalDetails.lastName.length <= 19 && success) {
            setPersonalName(personalDetails.firstName);
            console.log('Personal details updated successfully');
            setPersonalDetailsFormVisible(false);
            reloadProfile();
            toastmsg('success', 'Personal details updated successfully')
        }
        else {
            toastmsg('error', 'Error updating, please try again later')
        }
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
                fontSize: 12
            }
        });
    }




    return (
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'} key={key}>
            <ScrollView>
                <View>
                    <View style={styles.card}>
                        <View style={styles.container}>
                            <View style={styles.pencil}>
                                <TouchableOpacity onPress={() => {setPersonalDetailsFormVisible(true);resetPersonalDetails()}}>
                                    <Icon3 name='pencil' size={18} color='black' />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.imageContainer}>
                                <TouchableOpacity onPress={() => {
                                    if (photo) {
                                        navigation.navigate('ImagePreview', { uri: photo, retake: false });
                                    }
                                }}>
                                    <Image source={photo ? { uri: photo } : require('../../assests/profile/profile.png')} style={styles.image} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cameraIcon}
                                    accessible={true} accessibilityLabel="Open Camera Options"
                                    onPress={() => { setCameraOptionsVisible(true) }

                                    }
                                >
                                    <Icon1 name="camera-alt" size={24} color="#6C757D" />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={[styles.name, { textAlign: 'center', alignSelf: 'center' }]}>
                                    {`${basicDetails?.firstName || ''} ${basicDetails?.lastName || ''}`.trim()}
                                </Text>
                                {verified && <Icon5 name="verified" size={25} color="#F46F16" style={{ marginLeft: 5 }} />}
                            </View>

                            <View style={styles.infoContainer}>
                                <View style={styles.info}>
                                    <Icon name="mail" size={16} color="#6C757D" />
                                    <Text style={styles.text}>{basicDetails?.email}</Text>
                                </View>
                                <View style={styles.info}>
                                    <Icon name="phone" size={16} color="#6C757D" />
                                    <Text style={styles.text}>{basicDetails?.alternatePhoneNumber}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.professional}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon2 name='graduation-cap' size={24} style={styles.cap} />
                            <Text style={{ left: 3, fontFamily: 'PlusJakartaSans-Bold', fontSize: 14, color: '#F97316' }}>Professional Details</Text>
                            <View style={styles.pencil}>
                                <TouchableOpacity onPress={() => setProfessionalFormVisible(true)}>
                                    <Icon3 name='pencil' size={18} color='black' />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ margin: 2 }}>
                            <Text style={styles.subheading}>Qualification</Text>
                            {/* {qualification||'no qualification details availiable !!'} */}
                            <Text style={styles.details}>{qualification}</Text>
                            <Text style={styles.subheading}>Specilization</Text>
                            <Text style={styles.details}>{specialization}</Text>
                            <Text style={styles.subheading}>Skills</Text>

                            <View style={styles.skillContainer}>
                                {applicantSkillBadges
                                    .filter((badge: ApplicantSkillBadge) => badge.flag === 'added') // Filter badges based on flag
                                    .sort((a: ApplicantSkillBadge, b: ApplicantSkillBadge) => {
                                        // Sorting logic: PASSED badges come first
                                        if (a.status === 'PASSED' && b.status !== 'PASSED') return -1;
                                        if (a.status !== 'PASSED' && b.status === 'PASSED') return 1;
                                        return 0; // If both have the same status, keep their original order
                                    })
                                    .map((badge: ApplicantSkillBadge, index: number) => (
                                        <View
                                            key={index}
                                            style={[
                                                styles.skillBadge,
                                                { backgroundColor: badge.status === 'PASSED' ? '#498C07' : '#498C07' },
                                            ]}
                                        >
                                            {badge.status === 'PASSED' && (
                                                <Icon5 name="verified" size={16} color="white" />
                                            )}
                                            <Text style={styles.skillBadgeText}>
                                                {badge.skillBadge.name}
                                            </Text>
                                        </View>
                                    ))
                                }


                                {skillsRequired.length > 0 && skillsRequired.map((skill: { id: number; skillName: string }, index: number) => (
                                    <Text key={index} style={styles.skillcolor}>
                                        {skill.skillName}
                                    </Text>
                                ))}

                                {skillsRequired.length === 0 && applicantSkillBadges.length === 0 && (
                                    <Text>No skills added yet.</Text>
                                )}


                            </View>




                            <Text style={styles.subheading}>Experience</Text>
                            <Text style={styles.details}>{experience}</Text>
                            <View>
                                <Text style={styles.subheading}>Preferred Location</Text>
                                {preferredJobLocations.length > 0 && (


                                    <Text style={{ color: '#000', fontFamily: 'PlusJakartaSans-Bold', fontSize: 12 }}>


                                        {preferredJobLocations.join(', ')}
                                    </Text>
                                )}
                            </View>

                        </View>
                        <ProfessionalDetailsForm
                            visible={isProfessionalFormVisible}
                            onClose={() => { setProfessionalFormVisible(false); resetPersonalDetails() }}
                            qualification={qualification}
                            specialization={specialization}
                            skillsRequired={skillsRequired}
                            experience={experience}
                            preferredJobLocations={preferredJobLocations}
                            skillBadges={applicantSkillBadges}
                            onReload={reloadProfile}

                        />

                        <Modal
                            transparent={true}
                            animationType="slide"
                            visible={isCameraOptionsVisible}
                            onRequestClose={() => setCameraOptionsVisible(false)}
                        >
                            <View style={styles.modalView5}>
                                <View style={styles.modalCard5}>
                                    <TouchableOpacity style={styles.customButton} onPress={handleCamera}>
                                        <Text style={styles.buttonText1}>Take a photo</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.modalButton7} onPress={handleLibrary}>
                                        <Text style={styles.buttonText1}>Choose a photo</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.modalCard6}>
                                    <TouchableOpacity style={styles.modalButton7} onPress={() => setCameraOptionsVisible(false)}>
                                        <Text style={styles.modalButtonText7}>Cancel</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>

                        </Modal>
                        <Modal
                            transparent={true}
                            animationType='slide'
                            visible={isPersonalDetailsFormVisible}
                            onRequestClose={() => {
                                setPersonalDetailsFormVisible(false);
                                setFormErrors({});
                            }}>
                            <View style={styles.modalView}>
                                <View style={styles.modalCard}>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <TouchableOpacity onPress={() => setPersonalDetailsFormVisible(false)} >
                                            <Icon7 name="close" size={20} color={'0D0D0D'} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={styles.modalTitle1}>Personal Details</Text>
                                    </View>
                                    <TextInput placeholder='FirstName' placeholderTextColor="#B1B1B1" style={styles.input}
                                        value={personalDetails.firstName}
                                        onChangeText={(text) => handleInputChange('firstName', (text))} />
                                    {formErrors?.firstName && (
                                        <Text style={styles.errorText}>{formErrors.firstName}</Text>
                                    )}
                                    <TextInput placeholder='LastName' placeholderTextColor="#B1B1B1" style={styles.input}
                                        value={personalDetails.lastName}
                                        onChangeText={(text) => handleInputChange('lastName', (text))} />
                                    {formErrors?.lastName && (
                                        <Text style={styles.errorText}>{formErrors.lastName}</Text>
                                    )}
                                    <TextInput placeholder={basicDetails?.email || 'Email'} placeholderTextColor="#B1B1B1" editable={false} style={styles.input} />
                                    <TextInput placeholder='+91*******' style={styles.input} placeholderTextColor="#B1B1B1"
                                        value={personalDetails.alternatePhoneNumber}
                                        onChangeText={(text) => handleInputChange('alternatePhoneNumber', (text))} />
                                    {formErrors?.alternatePhoneNumber && (
                                        <Text style={styles.errorText}>{formErrors.alternatePhoneNumber}</Text>
                                    )}

                                    <View >
                                        <LinearGradient
                                            colors={['#F97316', '#FAA729']} // Gradient colors
                                            style={styles.button} // Apply styles to the gradient button
                                            start={{ x: 0, y: 0 }} // Starting point of the gradient
                                            end={{ x: 1, y: 0 }} // Ending point of the gradient
                                        >
                                            <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
                                                <Text style={{ color: '#fff', fontFamily: 'PlusJakartaSans-Bold', fontSize: 14, }}>Save Changes</Text>
                                            </TouchableOpacity>
                                        </LinearGradient>
                                    </View>
                                </View>
                            </View>
                        </Modal>

                    </View>
                </View>

                <View style={{ flex: 1, padding: 10 }}>
                    <View style={styles.card1}>
                        <Text style={[styles.resumeText, { color: '#F97316' }]}>Resume</Text>


                        <TouchableOpacity onPress={() => setResumeModalVisible(true)}>
                            <Icon3 name='pencil' size={18} color='black' />
                        </TouchableOpacity>
                    </View>
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isResumeModalVisible}
                    onRequestClose={() => setResumeModalVisible(false)}
                >
                    <View style={styles.modalView1}>
                        <View style={styles.modalCard1}>
                            <View style={{ marginLeft: '95%' }}>
                                <TouchableOpacity onPress={() => { setResumeModalVisible(false); setIsUploadComplete(false); setLoading(false); setProgress(0); setResumeFile(null); setShowBorder(false) }} >
                                    <Icon7 name="close" size={20} color={'0D0D0D'} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                                <Text style={styles.modalTitle1}>Upload Resume</Text>
                            </View>
                            <View style={[styles.uploadContainer, { borderColor: bgcolor ? '#DE3A3A' : '#3A76DE', borderWidth: 1.5, borderStyle: 'dashed', backgroundColor: bgcolor ? "#FFEAE7" : "#E7F2FF", borderRadius: 20 }]}>
                                <TouchableOpacity onPress={handleUploadResume}>
                                    <View style={{ alignItems: 'center' }}>
                                        {/* <Image
                                            source={require('../../../src/assests/Images/file1.png')}
                                            style={{ position: 'absolute', top: 30 }}
                                        /> */}
                                        <Fileupload style={{ position: 'absolute', top: 30 }} />
                                    </View>

                                    <View style={{ padding: 10, }}>
                                        <Text style={{ fontSize: 17, marginTop: 65, textAlign: 'center', fontFamily: 'PlusJakartaSans-Bold' }} >Select File</Text>
                                        <Text style={{ color: '#6C6C6C', textAlign: 'center', fontFamily: 'PlusJakartaSans-Medium' }}>File must be less than 1Mb</Text>
                                        <Text style={{ color: '#6C6C6C', textAlign: 'center', fontFamily: 'PlusJakartaSans-Medium' }}>Only .doc or .PDFs are allowed.</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginBottom: 50 }}>
                                {bgcolor ? (
                                    <Text style={{ color: 'red', marginBottom: 25, marginTop: 10, fontFamily: 'PlusJakartaSans-Bold' }}>File Not selected</Text>
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
                                            <View style={{ marginLeft: 50, position: 'absolute', top: 2.5 }}>
                                                <Icon7 name="close" size={15} />
                                            </View>

                                        </TouchableOpacity>
                                    </View>
                                )}

                                {loading && (
                                    <View style={styles.progressContainer}>
                                        <Progress.Bar
                                            progress={progress}
                                            width={290}
                                            color="#F97316" // Progress bar color
                                            unfilledColor="#D7D6D6" // Unfilled background color
                                            borderColor="#D7D6D6" // Outline color
                                        />
                                    </View>
                                )}

                            </View>


                            <View>
                                {showBorder ? (
                                    <View style={[styles.orContainer, { marginTop: 20, marginVertical: 20 }]}>
                                        <View style={styles.line}></View>
                                        <Text style={{ marginTop: -12, fontWeight: '600', fontFamily: 'PlusJakartaSans-Bold' }}> Or </Text>
                                        <View style={[styles.line, { marginLeft: 3 }]}></View>
                                    </View>) :
                                    (
                                        <View style={[styles.orContainer, { marginTop: -30, marginVertical: 20, }]}>
                                            <View style={styles.line}></View>
                                            <Text style={{ marginTop: -12, fontWeight: '600', fontFamily: 'PlusJakartaSans-Bold' }}> Or </Text>
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
                            <TouchableOpacity style={[styles.buttonContent, { alignItems: 'flex-end', marginBottom: 10 }]} onPress={handleSaveResume} disabled={isUploadComplete}>
                                {
                                    isUploadComplete ? (
                                        <View style={[styles.button, { backgroundColor: "#D7D6D6", alignItems: "center", justifyContent: "center", borderRadius: 5 }]}>
                                            <Text style={[styles.saveButtonText, { fontFamily: 'PlusJakartaSans-Bold' }]}>Save Changes</Text>
                                        </View>


                                    ) : (
                                        <LinearGradient
                                            colors={['#F97316', '#FAA729']} // Gradient colors
                                            style={styles.button} // Apply styles to the gradient button
                                            start={{ x: 0, y: 0 }} // Starting point of the gradient
                                            end={{ x: 1, y: 0 }} // Ending point of the gradient
                                        >
                                            <Text style={[styles.saveButtonText, { fontFamily: 'PlusJakartaSans-Bold' }]}>Save Changes</Text>

                                        </LinearGradient>

                                    )
                                }

                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>



            </ScrollView>
        </KeyboardAvoidingView>
    )

}



const styles = StyleSheet.create({
    line: {
        width: '20%',
        height: 1,
        backgroundColor: '#D8D8D8',
        position: 'static',
        top: '60%',
        marginBottom: 10,
    },
    uploadContainer: {
        //flexDirection: "row",
        //justifyContent: "space-between",
        padding: 5,

    },
    fileNameText: {
        fontSize: 16,
        color: '#000',
        fontFamily: 'PlusJakartaSans-Medium',
    },
    orContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    },
    fileContainer: {
        padding: 10,
        marginBottom: 15,
        marginTop: -55
    },
    progressContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    showborder: {
        borderWidth: 1,
        borderColor: '#D7D6D6',
        borderRadius: 10,
    },
    buttonContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    uploadButton: {
        width: '100%',
        backgroundColor: '#4B4A4A',
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        borderRadius: 5,
        marginBottom: 55

    },
    closeIcon: {
        position: 'absolute',
        left: 220,

    },
    skillBadge: {
        height: 30,
        flexDirection: 'row',
        alignItems: 'center', // Align children vertically
        justifyContent: 'center', // Center children horizontally
        paddingHorizontal: 8, // Consistent padding inside badges
        backgroundColor: '#334584', // Default background color
        borderRadius: 15,
        marginRight: 8,
        marginBottom: 5,

    },

    skillBadgeText: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'PlusJakartaSans-Medium',

    },
    button: {
        marginTop: 4,
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        width: '100%',
        borderRadius: 5

    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 8,
        marginTop: 4,
        paddingHorizontal: 10,
        borderRadius: 2,
        backgroundColor: '#E5E5E5',
        color: '#0D0D0D',
        fontFamily: 'PlusJakartaSans-Medium'


    },
    skillContainer: {
        alignItems: 'center',
        marginTop: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    skillcolor: {
        height: 30,
        width: 'auto',
        padding: 5,
        backgroundColor: '#498C07',
        borderRadius: 15,
        marginRight: 8,
        justifyContent: 'space-between',
        margin: 5,
        color: '#fff',

        paddingHorizontal: 8,
        fontFamily: 'PlusJakartaSans-Medium',



    },
    card: {
        margin: 10,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,

    },
    container: {
        alignItems: 'center',
    },
    imageContainer: {
        position: 'relative',
        alignItems: 'center', // Center the image horizontally
    },

    pencil: {
        marginLeft: 'auto'
    },
    name: {

        fontSize: 24,
        color: '#424242',
        fontFamily: 'PlusJakartaSans-Bold',


    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75, // Ensure the image is circular
        shadowColor: 'transparent', // Remove shadow
        elevation: 0, // Remove elevation shadow
        resizeMode: 'cover'
    },
    cameraIcon: {
        position: 'absolute',
        right: 5, // Reduce the right margin
        bottom: 1, // Reduce the bottom margin
        backgroundColor: '#EAF0F1',
        borderRadius: 20,
        padding: 10,
    },
    infoContainer: {
        alignItems: 'center',
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,

    },
    text: {
        marginLeft: 10,
        fontSize: 14,
        color: '#6C757D',
        fontFamily: 'PlusJakartaSans-Medium'
    },
    professional: {
        backgroundColor: '#fff',
        margin: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
        shadowOpacity: 0.8,
        shadowRadius: 2,
        padding: 20


    },
    cap: {
        margin: 2,
        color: '#F97316',
        transform: [{ scaleX: -1 }],
    },
    subheading: {
        color: '#A1A1A1',
        fontSize: 14,
        marginTop: 10,
        fontFamily: 'PlusJakartaSans-Medium'
    },
    details: {
        fontFamily: 'PlusJakartaSans-Bold',
        color: '#463F3F',
        fontSize: 14,
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    modalCard: {
        width: 300,
        backgroundColor:
            'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },

    resumeModal: {
        // flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    resumeText: {
        fontSize: 14,
        fontFamily: 'PlusJakartaSans-Bold'
    },
    // Add the new style for the container

    card1: {
        width: '100%', // Adjust width to 90% of the screen width
        backgroundColor: '#fff',
        //paddingTop: 10, // Increase top padding for more height
        paddingBottom: 40, // Increase bottom padding for more height
        paddingLeft: 40, // Space from the left side of the card
        paddingRight: 20, // Space from the right side of the card
        flexDirection: 'row', // Horizontally align the text and the button
        justifyContent: 'space-between', // Space between the text and logo
        alignItems: 'center', // Vertically center the content inside the card
        borderRadius: 10, // Rounded corners for the card
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.8, // Shadow opacity
        shadowRadius: 2, // Shadow blur radius
        elevation: 5, // Elevation for Android
        marginVertical: 10, // Space between cards
        height: 100, // Increase height of the card
    },

    // Style for the static Resume Text (left side)

    // Style for the Edit Logo (right side)


    editLogo: {
        width: 18,
        height: 18,
    },


    // Modal View for the Resume Edit
    modalView1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background opacity for modal
    },

    // Modal Card Style
    modalCard1: {
        width: 350,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },

    // Modal Title
    modalTitle1: {
        color: '#666666',
        fontSize: 18,
        fontFamily: 'PlusJakartaSans-Bold',
        marginBottom: 20,
    },

    // Text Input for editing the resume
    input1: {
        height: 40,
        width: '90%',
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        // paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#E5E5E5',
        // textAlignVertical: 'top', // Makes the text align from top in the input box
        fontFamily: 'PlusJakartaSans-Medium',
    },



    // Save Button Text
    saveButtonText: {
        color: 'white',


    },

    modalView5: {
        flex: 1,
        justifyContent: 'flex-end', // Align modal at the bottom
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Background overlay

    },

    modalCard5: {
        width: '95%', // Adjusts modal width
        marginHorizontal: '5%', // Centers the modal horizontally
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 3, // Padding for top and bottom, reducing the space inside the modal
        paddingHorizontal: 2, // Horizontal padding to keep space on sides
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        marginBottom: 10
    },

    modalCard6: {
        width: '95%',
        marginHorizontal: '5%',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 2,
        paddingHorizontal: 3,
        marginBottom: 10,
        paddingLeft: 5
    },

    customButton: {
        width: '100%', // Full-width button
        backgroundColor: 'white',
        paddingVertical: 15, // Vertical padding for button height
        paddingHorizontal: 10, // Left and right padding
        borderBottomWidth: 1, // Divider between buttons
        borderColor: '#ccc', // Divider color
        justifyContent: 'flex-start', // Align text to the left
    },
    customButton1: {
        width: '100%', // Full-width button
        backgroundColor: 'white',
        paddingVertical: 15, // Vertical padding for button height
        paddingHorizontal: 10, // Left and right padding
        borderColor: '#ccc', // Divider color
        justifyContent: 'flex-start', // Align text to the left
    },

    buttonText1: {




        fontSize: 14,
        color: '#0D0D0D',
        fontFamily: 'PlusJakartaSans-Medium', // Set font to Jakarta Sans
    },

    modalButton7: {
        width: '100%', // Full-width cancel button
        fontSize: 18,
        paddingVertical: 15, // Vertical padding for button height
        paddingHorizontal: 10, // Left and right padding
        backgroundColor: 'white',
        // marginTop: 5, // Reduce margin to avoid excessive space before "Cancel"
    },

    modalButtonText7: {
        color: '#E35D6A', // Text color for the Cancel button
        fontWeight: 400,
        fontSize: 14,
        fontFamily: 'PlusJakartaSans-Medium', // Set font to Jakarta Sans
    },

    separator: {
        height: 1,
        width: '100%',
        backgroundColor: '#ccc', // Add a grey line as separator
        marginVertical: 15,

    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        fontFamily: 'PlusJakartaSans-Medium'
    }
    ,
    retryText: {
        color: '#F97316',
        fontSize: 16,
        marginTop: 10
    },

});
export default ProfileComponent;


