import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,

  Dimensions,

} from 'react-native';
import ProgressBar from '@components/progessBar/ProgressBar';
import DropDownPicker from 'react-native-dropdown-picker';
import LinearGradient from 'react-native-linear-gradient';
 
const getSpecializationOptions = (qualification: string | any): string[] => {
  switch (qualification) {
    case 'B.Tech':
      return [
        'Computer Science and Engineering (CSE)',
        'Electronics and Communication Engineering (ECE)',
        'Electrical and Electronics Engineering (EEE)',
        'Mechanical Engineering (ME)',
        'Civil Engineering (CE)',
        'Aerospace Engineering',
        'Information Technology (IT)',
        'Chemical Engineering',
        'Biotechnology Engineering',
      ];
    case 'MCA':
      return [
        'Software Engineering',
        'Data Science',
        'Artificial Intelligence',
        'Machine Learning',
        'Information Security',
        'Cloud Computing',
        'Mobile Application Development',
        'Web Development',
        'Database Management',
        'Network Administration',
        'Cyber Security',
        'IT Project Management',
      ];
    case 'Degree':
      return [
        'Bachelor of Science (B.Sc) Physics',
        'Bachelor of Science (B.Sc) Mathematics',
        'Bachelor of Science (B.Sc) Statistics',
        'Bachelor of Science (B.Sc) Computer Science',
        'Bachelor of Science (B.Sc) Electronics',
        'Bachelor of Science (B.Sc) Chemistry',
        'Bachelor of Commerce (B.Com)',
      ];
    case 'Intermediate':
      return ['MPC', 'BiPC', 'CEC', 'HEC'];
    case 'Diploma':
      return [
        'Mechanical Engineering',
        'Civil Engineering',
        'Electrical Engineering',
        'Electronics and Communication Engineering',
        'Computer Engineering',
        'Automobile Engineering',
        'Chemical Engineering',
        'Information Technology',
        'Instrumentation Engineering',
        'Mining Engineering',
        'Metallurgical Engineering',
        'Agricultural Engineering',
        'Textile Technology',
        'Architecture',
        'Interior Designing',
        'Fashion Designing',
        'Hotel Management and Catering Technology',
        'Pharmacy',
        'Medical Laboratory Technology',
        'Radiology and Imaging Technology',
      ];
    default:
      return [];
  }
};
 
const skillOptions = [
  'Java',
  'C',
  'C++',
  'C Sharp',
  'Python',
  'HTML',
  'CSS',
  'JavaScript',
  'TypeScript',
  'Angular',
  'React',
  'Vue',
  'JSP',
  'Servlets',
  'Spring',
  'Spring Boot',
  'Hibernate',
  '.Net',
  'Django',
  'Flask',
  'SQL',
  'MySQL',
  'SQL-Server',
  'Mongo DB',
  'Selenium',
  'Regression Testing',
  'Manual Testing',
];
const locationOptions = [
  'Chennai',
  'Thiruvananthapuram',
  'Bangalore',
  'Hyderabad',
  'Coimbatore',
  'Kochi',
  'Madurai',
  'Mysore',
  'Thanjavur',
  'Pondicherry',
  'Vijayawada',
  'Pune',
  'Gurgaon',
];
interface FormData {
  qualification: string;
  specialization: string;
  skills: string[];
  experience: string;
  preferredLocation: string[];
}

const {height,width} = Dimensions.get('window');
const Dummystep2: React.FC = ({route, navigation}: any) => {
  const qual = route.params?.formData?.skills ?? '';
  console.log("R",route.params)
  console.log("email",qual);
  const [currentStep, setCurrentStep] = useState(2);
  const [formData, setFormData] = useState<FormData>({
    qualification: route.params?.formData?.qualification || '',
    specialization: route.params?.formData?.specialization || '',
    skills: route.params?.formData?.skills || [] ,
    experience: route.params?.formData?.experience || '',
    preferredLocation: route.params?.formData?.preferredLocation || [] ,
  });
 
  const [errors, setErrors] = useState({
    qualification: '',
    specialization: '',
    skills: '',
    experience: '',
    preferredLocation: '',
  });
 
  const [specialization, setSpecialization] = useState<string>(formData.specialization);
  const [qualification, setQualification] = useState<string>(formData.qualification);
 
  const [openQualificationDropdown, setOpenQualificationDropdown] =
    useState(false);
  const [openSpecializationDropdown, setOpenSpecializationDropdown] =
    useState(false);
 
  const [openSkillsDropdown, setOpenSkillsDropdown] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(formData.skills);
 
  const [openLocationDropdown, setOpenLocationDropdown] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(formData.preferredLocation);
 
  const handleOpenQualification = () => {
    setOpenLocationDropdown(false);
    setOpenSkillsDropdown(false);
    setOpenSpecializationDropdown(false);
  };
  const handleOpenSpecialization = () => {
    setOpenLocationDropdown(false);
    setOpenSkillsDropdown(false);
    setOpenQualificationDropdown(false);
  };
  const handleOpenSkills = () => {
    setOpenLocationDropdown(false);
    setOpenQualificationDropdown(false);
    setOpenSpecializationDropdown(false);
  };
  const handleOpenLocation = () => {
    setOpenQualificationDropdown(false);
    setOpenSkillsDropdown(false);
    setOpenSpecializationDropdown(false);
  };
 
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      qualification,
      specialization,
      skills: selectedSkills,
      preferredLocation: selectedLocations,
    }));
  }, [qualification, specialization, selectedSkills, selectedLocations]);
 
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      qualification: '',
      specialization: '',
      skills: '',
      experience: '',
      preferredLocation: '',
    };
 
    if (!formData.qualification) {
      newErrors.qualification = 'Qualification is required.';
      isValid = false;
    }
    if (!formData.specialization) {
      newErrors.specialization = 'Specialization is required.';
      isValid = false;
    }
    if (selectedSkills.length === 0) {
      newErrors.skills = 'Skills are required.';
      isValid = false;
    }
    if (!formData.experience || isNaN(Number(formData.experience))) {
      newErrors.experience = 'Experience is required.';
      isValid = false;
    }
    if (selectedLocations.length === 0) {
      newErrors.preferredLocation = 'Preferred location is required.';
      isValid = false;
    }
 
    setErrors(newErrors);
    return isValid;
  };
 
  const handleNext = () => {
    if (validateForm()) {
      setCurrentStep(prevStep => Math.min(prevStep + 1, 3));
      navigation.navigate('Step3', {
        firstName: route.params.firstName,
        lastName: route.params.lastName,
        alternatePhoneNumber: route.params.whatsappNumber, // Map whatsappNumber here
        email: route.params.email,
        skillsRequired: selectedSkills.map(skill => ({skillName: skill})),
        experience: formData.experience,
        qualification: formData.qualification,
        specialization: formData.specialization,
        preferredJobLocations: selectedLocations,
      });
    }
  };
 
  const handleBack = () => {
    navigation.goBack();
    navigation.navigate('Step1', {
      formData: formData,
    });
  };
  const isAnyDropdownOpen =
    openQualificationDropdown ||
    openSpecializationDropdown ||
    openSkillsDropdown ||
    openLocationDropdown;
 
 
  return (
    <View style={styles.screen}>
      <Image
        style={styles.logo}
        source={require('../../assests/LandingPage/logo.png')}
      />
      <ScrollView scrollEnabled={!isAnyDropdownOpen}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.completeProfile}>Complete Your Profile</Text>
            <Text style={styles.subHeader}>
              Fill the form fields to go next step
            </Text>
          </View>
 
          <ProgressBar initialStep={currentStep} />
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <DropDownPicker
              open={openQualificationDropdown}
              value={qualification}
              items={[
          {label: 'B.Tech', value: 'B.Tech'},
          {label: 'MCA', value: 'MCA'},
          {label: 'Degree', value: 'Degree'},
          {label: 'Intermediate', value: 'Intermediate'},
          {label: 'Diploma', value: 'Diploma'},
              ]}
              setOpen={setOpenQualificationDropdown}
              onOpen={handleOpenQualification}
              setValue={value => {
          setQualification(value);
          setErrors(prev => ({...prev, qualification: ''})); // Clear the error if input is valid
              }}
              placeholder="*Qualification"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholderText}
              textStyle={styles.dropdownText}
              zIndex={1000}
            />
            {errors.qualification && (
              <Text style={styles.errorText}>{errors.qualification}</Text>
            )}
 
            <DropDownPicker
              open={openSpecializationDropdown}
              items={getSpecializationOptions(qualification).map(spec => ({
          label: spec,
          value: spec,
              }))}
              value={specialization}
              setOpen={setOpenSpecializationDropdown}
              onOpen={handleOpenSpecialization}
              setValue={value => {
          setSpecialization(value);
          setErrors(prev => ({...prev, specialization: ''})); // Clear error dynamically
              }}
              placeholder="*Specialization"
              disabled={!qualification} // Disable dropdown if qualification is not selected
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholderText}
              textStyle={styles.dropdownText}
              dropDownDirection="BOTTOM" 
             
              zIndex={990}
            />
            {errors.specialization && (
              <Text style={styles.errorText}>{errors.specialization}</Text>
            )}
 
            <DropDownPicker
              multiple={true}
              open={openSkillsDropdown}
              value={selectedSkills}
              items={skillOptions.map(skill => ({label: skill, value: skill}))}
              setOpen={setOpenSkillsDropdown}
              onOpen={handleOpenSkills}
              setValue={value => {
          setSelectedSkills(value);
          setErrors(prev => ({
            ...prev,
            skills: value.length > 0 ? '' : 'Skills are required.',
          })); // Clear error dynamically
              }}
              placeholder="*Skills"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholderText}
              textStyle={styles.dropdownText}
              zIndex={900}
              mode="BADGE"
              showBadgeDot={false}
            />
            {errors.skills && (
              <Text style={styles.errorText}>{errors.skills}</Text>
            )}
 
            <DropDownPicker
              multiple={true} // Allow multiple selection
              open={openLocationDropdown}
              value={selectedLocations} // Array of selected locations
              items={locationOptions
          .map(location => ({
          label: location,
          value: location,
              }))}
              setOpen={setOpenLocationDropdown}
              onOpen={handleOpenLocation}
              setValue={value => {
          setSelectedLocations(value);
          setErrors(prev => ({
            ...prev,
            preferredLocation:
              value.length > 0 ? '' : 'Preferred location is required.',
          })); // Clear error dynamically
              }}
              placeholder="*Preferred Job Locations"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              placeholderStyle={styles.placeholderText}
              textStyle={styles.dropdownText}
              zIndex={800}
              mode="BADGE"
              showBadgeDot={false}
            />
            {errors.preferredLocation && (
              <Text style={styles.errorText}>{errors.preferredLocation}</Text>
            )}
          </View>
          <TextInput
            placeholder="*Total Experience"
            placeholderTextColor="#0D0D0D"
            style={styles.input}
            value={formData.experience}
            keyboardType="numeric" // Ensure only numeric input
            onChangeText={text => {
              const numericValue = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
              setFormData(prev => ({...prev, experience: numericValue}));
              if (numericValue) {
          setErrors(prev => ({...prev, experience: ''})); // Clear the error if input is valid
              }
            }}
          />
          {errors.experience && (
            <Text style={styles.errorText}>{errors.experience}</Text>
          )}
        </View>
      </ScrollView>
 
      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
 
          <TouchableOpacity
            style={[styles.backButton, {borderWidth: 0}]}
            onPress={handleNext}>
            <LinearGradient
              colors={['#F97316', '#FAA729']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={[styles.nextButton, {borderRadius: 6}]} // Apply border radius to match
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingBottom: 75,
  },
  logo: {
    width: 150, // Decreased width
    height: 45,
    marginBottom: 20,
  },
  container: {
    width: '100%',
    height: height*1.05,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 17,
    borderTopColor: '#ccc',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 13,
  },
  header: {
    marginBottom: 20,
  },
  completeProfile: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: 'black',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 11,
    color: 'black',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    color: 'black',
    backgroundColor: '#F5F5F5',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  backButton: {
    borderWidth: 1,
    borderColor: '#F97316',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
  },
  backButtonText: {
    color: '#F97316',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  nextButton: {
    padding: 10,
    borderRadius: 6, // Consistent with backButton
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', // Ensure it fits the wrapping TouchableOpacity
  },
  gradientTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 5,
    marginVertical: 10,
    backgroundColor: '#F5F5F5',
    fontFamily: 'PlusJakartaSans-Bold',
    marginTop: 0 ,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#F5F5F5',
  },
  placeholderText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 14,
  },
  dropdownText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 14,
  },
});
export default Dummystep2;
 
 