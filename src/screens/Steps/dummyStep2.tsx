import React, {useState,useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import ProgressBar from '../../components/progessBar/ProgressBar';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../../New';
import DropDownPicker from 'react-native-dropdown-picker';

import {useAuth} from '../../context/Authcontext';
type Step2ScreenRouteProp = RouteProp<RootStackParamList, 'Step2'>;


const getSpecializationOptions = (qualification: string|any): string[] => {
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

interface Step2Props {
  route: Step2ScreenRouteProp;
  navigation: any;
}

const Dummystep2: React.FC = ({route, navigation}: any) => {
  //   const { email } = route.params;
  const [step, setStep] = useState(2);
  const [formData, setFormData] = useState({
    qualification: '',
    specialization: '',
    skills: [],
    experience: '',
    preferredLocation: [],
  });

  const [errors, setErrors] = useState({
    qualification: '',
    specialization: '',
    skills: '',
    experience: '',
    preferredLocation: '',
  });

  const [specialization, setSpecialization] = useState<string>('');
  const [qualification, setQualification] = useState<string>('');

  const [openQualificationDropdown, setOpenQualificationDropdown] =useState(false);
  const [openSpecializationDropdown, setOpenSpecializationDropdown] =useState(false);

  const [openSkillsDropdown, setOpenSkillsDropdown] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const [openLocationDropdown, setOpenLocationDropdown] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const {userToken, userId} = useAuth();


  useEffect(() => { setFormData((prev) => ({ ...prev, qualification, specialization, })); }, [qualification, specialization]);
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
      newErrors.experience = 'Experience must be a number.';
      isValid = false;
    }
    if (!formData.preferredLocation) {
      newErrors.preferredLocation = 'Preferred location is required.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  
  const handleNext = async () => {
    if (validateForm()) {
      const basicDetails = {
        firstName: route.params.firstName,
        lastName: route.params.lastName,
        alternatePhoneNumber: route.params.whatsappNumber, // Map whatsappNumber here
        email: route.params.email,
      };
      console.log('Form Data:', {...formData, skills: selectedSkills});
      console.log('Form Data:', {
        basicDetails,
        skillsRequired: selectedSkills.map(skill => ({skillName: skill})), // Assuming selectedSkills is an array
        experience: formData.experience,
        qualification: formData.qualification,
        specialization: formData.specialization,
        preferredJobLocations: selectedLocations,
      });
      try {
        const response = await fetch(
          `https://g23jza8mtp.ap-south-1.awsapprunner.com/applicantprofile/createprofile/${userId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userToken}`, // Authorization token
            },
            body: JSON.stringify({
              basicDetails,
              skillsRequired: selectedSkills.map(skill => ({skillName: skill})),
              experience: formData.experience,
              qualification: formData.qualification,
              specialization: formData.specialization,
              preferredJobLocations: selectedLocations,
            }),
          },
        );

        if (response.ok) {
          const data = await response.json();
          console.log('Profile created successfully:', data);
          // Navigate to Step3 after successful API call
          //navigation.navigate('Step3');
        } else {
          console.error('Failed to create profile', response.status);
          // You can show an error message here if needed
        }
      } catch (error) {
        console.error('Error during API call:', error);
        // Handle error if API call fails
      } finally {
        // Always navigate to Step3 after the API call, regardless of success or failure
        navigation.navigate('Step3');
      }
    }
  };



  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <Image
        style={styles.logo}
        source={require('../../assests/Images/rat/logo.png')}
      />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.completeProfile}>Complete Your Profile</Text>
          <Text style={styles.subHeader}>
            Fill the form fields to go next step
          </Text>
        </View>

        <ProgressBar
          currentStep={step}
          onStepPress={stepId => setStep(stepId)}
        />

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
          setValue={setQualification}
          //onChangeValue={() => {setSpecialization;}} // Reset specialization on qualification change
          placeholder="Select Qualification"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
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
          setValue={setSpecialization}
          placeholder="Select Specialization"
          disabled={!qualification} // Disable dropdown if qualification is not selected
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
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
          setValue={setSelectedSkills}
          placeholder="*Skills Required"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={900}
          mode="BADGE"
        />
        {errors.skills && <Text style={styles.errorText}>{errors.skills}</Text>}

        <TextInput
          placeholder="*Experience in Years"
          style={styles.input}
          value={formData.experience}
          onChangeText={text =>
            setFormData(prev => ({...prev, experience: text}))
          }
        />
        {errors.experience && (
          <Text style={styles.errorText}>{errors.experience}</Text>
        )}

        <DropDownPicker
          multiple={true} // Allow multiple selection
          open={openLocationDropdown}
          value={selectedLocations} // Array of selected locations
          items={locationOptions.map(location => ({
            label: location,
            value: location,
          }))}
          setOpen={setOpenLocationDropdown}
          setValue={setSelectedLocations}
          placeholder="*Preferred Job Locations"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={800}
          mode="BADGE"
        />
        {errors.preferredLocation && (
          <Text style={styles.errorText}>{errors.preferredLocation}</Text>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
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
    width: 200,
    height: 60,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 17,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  header: {
    marginBottom: 20,
  },
  completeProfile: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 11,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    color: 'black',
    backgroundColor: '#E5E4E2',
  },
  backButton: {
    borderWidth: 2,
    borderColor: '#F97316',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
  },
  backButtonText: {
    color: '#F97316',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#F97316',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 10,
    backgroundColor: '#E5E4E2',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default Dummystep2;