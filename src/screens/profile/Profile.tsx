import React, { useState, useEffect } from 'react';
import {
    View, Text, Image, StyleSheet, TouchableOpacity, ScrollView,
    KeyboardAvoidingView, Platform, Modal, TextInput, Button, PermissionsAndroid, ActivityIndicator,
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
 
import { launchCamera, launchImageLibrary, CameraOptions, ImagePickerResponse, ImageLibraryOptions } from 'react-native-image-picker';

 
 
 
 
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>
function ProfileComponent() {
    const [isProfessionalFormVisible, setProfessionalFormVisible] = useState(false);
    const [isCameraOptionsVisible, setCameraOptionsVisible] = useState(false);
    // const [photo, setPhoto] = useState<string | null>(null);
    const [isPersonalDetailsFormVisible, setPersonalDetailsFormVisible] = useState(false);
    const [isResumeModalVisible, setResumeModalVisible] = useState(false);
    const [resumeFile, setResumeFile] = useState<DocumentPickerResponse | null>(null);
    const [resumeText, setResumeText] = useState<string>('');
    const { fetchProfilePhoto,photo } = useProfilePhoto();
 
 
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute<ProfileScreenRouteProp>()
    const { userId, userToken } = useAuth();
   
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
        reloadProfile
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
    useEffect(() => {
        if (userId && userToken) {
            fetchProfilePhoto(userToken, userId);
        }
    }, [userId, userToken]);
    
    const showToast = (message: string) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };
 
    const validatePhoto = (photoFile: any) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        const maxSize = 1048576; // 1 MB in bytes
 
        if (!allowedTypes.includes(photoFile.type)) {
            showToast('Only JPEG and PNG files are allowed.');
            return false;
        }
 
        if (photoFile.fileSize > maxSize) {
            showToast('File size must be less than 1 MB.');
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
                showToast('Profile photo uploaded successfully!');
            } else {
                console.log('Failed to upload photo:', result.message);
                showToast('Failed to upload photo.');
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
        if(photo === DEFAULT_PROFILE_IMAGE){
            showToast('No photo to remove.');
            return;
        }
        setIsLoading(true);
        try {
            // Resolve the local path of the default image
            const resolvedImage = await Image.resolveAssetSource(require('../../assests/profile/profile.png'));
            const defaultImageFile = {
                uri: resolvedImage.uri, // This will give a local path (e.g., file://path/to/image)
                type: 'image/png', // Correct MIME type
                fileName: 'default_profile.png', // Match the file name
               
                width: 1440, // Set the image dimensions
                height: 1920, // Set the image dimensions
            };
   
   
            // Upload the default image
            const result = await ProfileService.uploadProfilePhoto(userToken, userId, defaultImageFile);
   
            if (result.success) {
                fetchProfilePhoto(userToken,userId);
                console.log('Default photo uploaded successfully');
                showToast('Default image set successfully!');
            } else {
                console.log('Failed to set default photo:', result.message);
                showToast('Failed to remove photo.');
            }
        } catch (error) {
            console.error('Error setting default photo:', error);
            showToast('Error removing photo. Please try again.');
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
 
    const handleUploadResume = async () => {
        try {
            const result: DocumentPickerResponse[] = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf], // Ensure only PDF files are shown
            });
 
            if (!result || result.length === 0) {
                showToast('No file selected.');
                return;
            }
 
            const selectedFile: DocumentPickerResponse = result[0];
            const maxSize = 1048576; // 1MB size limit
 
            // Validate file size
            if (selectedFile.size && selectedFile.size > maxSize) {
                showToast('File size exceeds the 1MB limit.');
                return;
            }
 
            // Set selected file but do not upload yet
            setResumeFile(selectedFile);
            setResumeText(selectedFile.name || '');
 
            showToast('Resume selected. Remember to save changes.');
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User canceled the picker');
                showToast('Upload canceled.');
            } else if ((err as { message: string }).message === 'Network Error') {
                console.log('Network Error:', err);
                showToast('Network error. Please check your internet connection and try again.');
            } else {
                console.error('Unknown error: ', err);
                showToast('Error selecting file. Please try again.');
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
 
    const handleSaveChanges = async () => {
        const success = await updateBasicDetails();
        if (success) {
            console.log('Personal details updated successfully');
            setPersonalDetailsFormVisible(false);
            reloadProfile();
        }
    };
 
    return (
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'} >
            <ScrollView>
                <View>
                    <View style={styles.card}>
                        <View style={styles.container}>
                            <View style={styles.pencil}>
                                <TouchableOpacity onPress={() => setPersonalDetailsFormVisible(true)}>
                                    <Icon3 name='pencil' size={24} color='black' />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.imageContainer}>
                                <TouchableOpacity onPress={() => {
                                    if (photo) {
                                        navigation.navigate('ImagePreview', { uri: photo, retake: false });
                                    }
                                }}>
                                    <Image source={photo ? { uri: photo } :require('../../assests/profile/profile.png')} style={styles.image} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cameraIcon}
                                    accessible={true} accessibilityLabel="Open Camera Options"
                                    onPress={() => setCameraOptionsVisible(true)
 
                                    }
                                >
                                    <Icon1 name="camera-alt" size={24} color="#6C757D" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.name}>
                                {`${basicDetails?.firstName || ''} ${basicDetails?.lastName || ''}`.trim()}
                            </Text>
 
                            <View style={styles.infoContainer}>
                                <View style={styles.info}>
                                    <Icon name="mail" size={24} color="#6C757D" />
                                    <Text style={styles.text}>{basicDetails?.email}</Text>
                                </View>
                                <View style={styles.info}>
                                    <Icon name="phone" size={24} color="#6C757D" />
                                    <Text style={styles.text}>{basicDetails?.alternatePhoneNumber}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.professional}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon2 name='graduation-cap' size={24} style={styles.cap} />
                            <Text style={{ left: 3, fontWeight: 'bold', fontSize: 18, color: '#F97316' }}>Professional Details</Text>
                            <View style={styles.pencil}>
                                <TouchableOpacity onPress={() => setProfessionalFormVisible(true)}>
                                    <Icon3 name='pencil' size={24} color='black' />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ margin: 2 }}>
                            <Text style={styles.subheading}>Qualification</Text>
                            {/* {qualification||'no qualification details availiable !!'} */}
                            <Text style={styles.details}>{qualification}</Text>
                            <Text style={styles.subheading}>Specilization</Text>
                            <Text style={styles.details}> {specialization}</Text>
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
                                                { backgroundColor: badge.status === 'PASSED' ? '#498C07' : '#334584' },
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
                                    <Text style={{ color: '#000',fontWeight:'bold' }}>
                                        {preferredJobLocations.join(', ')}
                                    </Text>
                                )}
                            </View>
 
                        </View>
                        <ProfessionalDetailsForm
                            visible={isProfessionalFormVisible}
                            onClose={() => setProfessionalFormVisible(false)}
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
                                    <TouchableOpacity style={styles.customButton} onPress={handleLibrary}>
                                        <Text style={styles.buttonText1}>Choose a photo</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.customButton} onPress={removePhoto}>
                                        <Text style={styles.buttonText1}>Remove a photo</Text>
                                    </TouchableOpacity>
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
                                    <TextInput placeholder='FirstName'placeholderTextColor="#B1B1B1" style={styles.input}
                                        value={personalDetails.firstName}
                                        onChangeText={(text) => handleInputChange('firstName', (text))} />
                                    {formErrors?.firstName && (
                                        <Text style={styles.errorText}>{formErrors.firstName}</Text>
                                    )}
                                    <TextInput placeholder='LastName'placeholderTextColor="#B1B1B1" style={styles.input}
                                        value={personalDetails.lastName}
                                        onChangeText={(text) => handleInputChange('lastName', (text))} />
                                    {formErrors?.lastName && (
                                        <Text style={styles.errorText}>{formErrors.lastName}</Text>
                                    )}
                                    <TextInput placeholder={basicDetails?.email || 'Email'}placeholderTextColor="#B1B1B1" editable={false} style={styles.input} />
                                    <TextInput placeholder='+91*******' style={styles.input}placeholderTextColor="#B1B1B1"
                                        value={personalDetails.alternatePhoneNumber}
                                        onChangeText={(text) => handleInputChange('alternatePhoneNumber', (text))} />
                                    {formErrors?.alternatePhoneNumber && (
                                        <Text style={styles.errorText}>{formErrors.alternatePhoneNumber}</Text>
                                    )}
 
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
                                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save Changes</Text>
                                        </TouchableOpacity>
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
                            <Icon3 name='pencil' size={24} color='black' />
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
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                                <Text style={styles.modalTitle1}>Resume</Text>
                                <TouchableOpacity onPress={() => setResumeModalVisible(false)}>
                                    <Text style={{ fontSize: 16, color: 'red', top: -10 }}>X</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <TextInput
                                    style={styles.input1}
                                    placeholder='Search from device'
                                    placeholderTextColor="#B1B1B1"
                                    value={resumeText} // Ensure string type
                                    onChangeText={setResumeText}
                                />
                                <TouchableOpacity
                                    style={styles.uploadButton}
                                    onPress={handleUploadResume}
                                >
                                    <Text style={styles.saveButtonText}>Upload</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.separator} />
                            <View style={styles.resumeModal}>
                                <TouchableOpacity
                                    style={[styles.uploadButton, { marginRight: 10 }]}
                                >
                                    <Text style={styles.saveButtonText}>Build your Resume</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={handleSaveResume} // Save changes and upload the file to the backend
                                >
                                    <Text style={styles.saveButtonText}>Save Changes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
 
 
 
 
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
 
 
 
const styles = StyleSheet.create({
    uploadButton: {
        backgroundColor: '#778289',
        borderRadius: 8,
        margin: 4,
        flexDirection: 'row',
        alignItems: 'center',
        // paddingHorizontal: 12,
        padding: 8
 
    },
    skillBadge: {
        backgroundColor: '#334584',
        borderRadius: 15,
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
 
    },
    skillBadgeText: {
        color: 'white',
        fontSize: 14,
    },
    button: {
        backgroundColor: '#F97316',
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        width: 120,
        borderRadius: 5
 
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 2,
        backgroundColor: '#E5E5E5',
        color:'#0D0D0D',
 
    },
    skillContainer: {
        marginTop: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
       
 
 
    },
    skillcolor: {
        height: 30,
        width: 'auto',
        padding: 5,
        backgroundColor: '#334584',
        borderRadius: 15,
        marginRight: 8,
        justifyContent: 'space-between',
        margin: 5,
        color: '#fff',
        paddingHorizontal: 8
 
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
        fontWeight: 'bold',
        fontSize: 30,
        color: '#424242'
 
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75, // Ensure the image is circular
        shadowColor: 'transparent', // Remove shadow
        elevation: 0, // Remove elevation shadow
        resizeMode:'cover'
    },
    cameraIcon: {
        position: 'absolute',
        right: 5,  // Reduce the right margin
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
        fontSize: 16,
        color: '#6C757D'
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
        fontSize: 18,
        marginTop: 10
    },
    details: {
        fontWeight: 'bold',
        color: '#463F3F',
        fontSize: 18
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
        fontSize: 18,
        fontWeight: 'bold',
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
        width: 300,
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
        color: '#333333',
        fontSize: 18,
        fontWeight: 'bold',
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
    },
 
   
 
    // Save Button Text
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
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
        paddingVertical: 20, // Padding for top and bottom, reducing the space inside the modal
        paddingHorizontal: 20, // Horizontal padding to keep space on sides
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
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
 
    buttonText1: {
 
        fontWeight: 400,
        fontSize: 18,
 
        fontFamily: 'JakartaSans', // Set font to Jakarta Sans
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
        color: 'red', // Text color for the Cancel button
        fontWeight: 400,
        fontSize: 18,
        fontFamily: 'JakartaSans', // Set font to Jakarta Sans
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
        fontSize: 16
    }
    ,
    retryText: {
        color: '#F97316',
        fontSize: 16,
        marginTop: 10
    },
 
});
 
export default ProfileComponent;
 
 