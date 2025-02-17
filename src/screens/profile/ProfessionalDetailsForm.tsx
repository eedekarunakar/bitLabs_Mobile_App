
import React, { useMemo, useState, useCallback } from 'react';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import GradientButton from '@components/styles/GradientButton';
import { useAuth } from '@context/Authcontext';
import { ProfileViewModel } from '@viewmodel/Profileviewmodel';

import { ApplicantSkillBadge } from '@models/Model';
import Icon from 'react-native-vector-icons/AntDesign'; // Assuming you're using AntDesign for icons
import { showToast } from '@services/login/ToastService';


interface Skill {
  id: number;
  skillName: string;
  experience: number;
}

interface ProfessionalDetailsFormProps {
  visible: boolean;
  onClose: () => void;
  qualification: string;
  specialization: string;
  skillsRequired: Skill[];
  experience: string;
  preferredJobLocations: string[];
  skillBadges: [];
  onReload: () => void;
}

import { FlatList } from 'react-native';
const { width, height } = Dimensions.get('window');
const ProfessionalDetailsForm: React.FC<ProfessionalDetailsFormProps> = React.memo(({
  visible,
  onClose,
  qualification: initialQualification = '',
  specialization: initialSpecialization = '',
  skillsRequired: initialSkills = [],
  experience: initialExperience = '',
  preferredJobLocations: initialLocations = [],
  skillBadges: applicantSkillBadges,
  onReload,
}) => {
  const [qualification, setQualification] = useState<string>(initialQualification);
  const [specialization, setSpecialization] = useState<string>(initialSpecialization);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [locations, setLocations] = useState<string[]>(initialLocations);
  const [experience, setExperience] = useState<string>(initialExperience);

  const [qualificationQuery, setQualificationQuery] = useState(initialQualification);
  const [specializationQuery, setSpecializationQuery] = useState(initialSpecialization);
  const [experienceQuery, setExperienceQuery] = useState(initialExperience);
  const [skillQuery, setSkillQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const [showQualificationList, setShowQualificationList] = useState(false);
  const [showSpecializationList, setShowSpecializationList] = useState(false);
  const [showExperienceList, setShowExperienceList] = useState(false);
  const [showSkillsList, setShowSkillsList] = useState(false);
  const [showLocationList, setShowLocationList] = useState(false);

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const { userToken, userId } = useAuth();

  const qualificationsOptions = useMemo(
    () => ['B.Tech', 'MCA', 'Degree', 'Intermediate', 'Diploma'], []
  );
  const specializationsByQualification: Record<string, string[]> = useMemo(() => ({
    'B.Tech': ['Computer Science and Engineering (CSE)', 'Electronics and Communication Engineering (ECE)', 'Electrical and Electronics Engineering (EEE)', 'Mechanical Engineering (ME)', 'Civil Engineering (CE)', 'Aerospace Engineering', 'Information Technology(IT)', 'Chemical Engineering', 'Biotechnology Engineering'],
    'MCA': ['Software Engineering', 'Data Science', 'Artificial Intelligence', 'Machine Learning', 'Information Security', 'Cloud Computing', 'Mobile Application Development', 'Web Development', 'Database Management', 'Network Administration', 'Cyber Security', 'IT Project Management'],
    'Degree': ['Bachelor of Science (B.Sc) Physics', 'Bachelor of Science (B.Sc) Mathematics', 'Bachelor of Science (B.Sc) Statistics', 'Bachelor of Science (B.Sc) Computer Science', 'Bachelor of Science (B.Sc) Electronics', 'Bachelor of Science (B.Sc) Chemistry', 'Bachelor of Commerce (B.Com)'],
    'Intermediate': ['MPC', 'BiPC', 'CEC', 'HEC'],
    'Diploma': ['Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering', 'Electronics and Communication Engineering', 'Computer Engineering', 'Automobile Engineering', 'Chemical Engineering', 'Information Technology', 'Instrumentation Engineering', 'Mining Engineering', 'Metallurgical Engineering', 'Agricultural Engineering', 'Textile Technology', 'Architecture', 'Interior Designing', 'Fashion Designing', 'Hotel Management and Catering Technology', 'Pharmacy', 'Medical Laboratory Technology', 'Radiology and Imaging Technology']
  }), [])

  const skillsOptions = useMemo(
    () => ['Java', 'C', 'C++', 'C Sharp', 'Python', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Angular', 'React', 'Vue', 'JSP', 'Servlets', 'Spring', 'Spring Boot', 'Hibernate', '.Net', 'Django', 'Flask', 'SQL', 'MySQL', 'SQL-Server', 'Mongo DB', 'Selenium', 'Regression Testing', 'Manual Testing']
    , [])
  const cities = useMemo(
    () => ['Chennai', 'Thiruvananthapuram', 'Bangalore', 'Hyderabad', 'Coimbatore', 'Kochi', 'Madurai', 'Mysore', 'Thanjavur', 'Pondicherry', 'Vijayawada', 'Pune', 'Gurgaon']
    , [])
  const experienceOptions = Array.from({ length: 16 }, (_, i) => i.toString());

  const [skillBadgesState, setSkillBadgesState] = useState<ApplicantSkillBadge[]>(
    applicantSkillBadges.filter((badge: ApplicantSkillBadge) => badge.flag === 'added')
  );
  // const toggleQualificationDropdown = () => {
  //   setShowQualificationList(!showQualificationList);
  //   setShowSpecializationList(false);
  //   setShowExperienceList(false);
  //   setShowSkillsList(false);
  //   setShowLocationList(false);
  // };

  // const toggleSpecializationDropdown = () => {
  //   setShowSpecializationList(!showSpecializationList);
  //   setShowQualificationList(false);
  //   setShowExperienceList(false);
  //   setShowSkillsList(false);
  //   setShowLocationList(false);
  // };

  // const toggleExperienceDropdown = () => {
  //   setShowExperienceList(!showExperienceList);
  //   setShowQualificationList(false);
  //   setShowSpecializationList(false);
  //   setShowSkillsList(false);
  //   setShowLocationList(false);
  // };

  // const toggleSkillsDropdown = () => {
  //   setShowSkillsList(!showSkillsList);
  //   setShowQualificationList(false);
  //   setShowSpecializationList(false);
  //   setShowExperienceList(false);
  //   setShowLocationList(false);
  // };

  // const toggleLocationDropdown = () => {
  //   setShowLocationList(!showLocationList);
  //   setShowQualificationList(false);
  //   setShowSpecializationList(false);
  //   setShowExperienceList(false);
  //   setShowSkillsList(false);
  // };
  // Unified Dropdown Toggle (using useCallback)
  const toggleDropdown = useCallback(
    (dropdown: 'qualification' | 'specialization' | 'experience' | 'skills' | 'location') => {
      setShowQualificationList(dropdown === 'qualification' ? !showQualificationList : false);
      setShowSpecializationList(dropdown === 'specialization' ? !showSpecializationList : false);
      setShowExperienceList(dropdown === 'experience' ? !showExperienceList : false);
      setShowSkillsList(dropdown === 'skills' ? !showSkillsList : false);
      setShowLocationList(dropdown === 'location' ? !showLocationList : false);
    },
    [showQualificationList, showSpecializationList, showExperienceList, showSkillsList, showLocationList]
  );
  const closeAllDropdowns = useCallback(() => {
    setShowQualificationList(false);
    setShowSpecializationList(false);
    setShowExperienceList(false);
    setShowSkillsList(false);
    setShowLocationList(false);
    Keyboard.dismiss(); // Dismiss the keyboard if it's open
  }, []);
  const addSkill = useCallback((skillName: string) => {
    if (!skillsOptions.includes(skillName)) {
      showToast('error', `${skillName} is not a valid skill.`);
      return;
    }

    const skillExists = skills.find((s) => s.skillName === skillName);
    const badgeSkillExists = skillBadgesState.find((badge) => badge.skillBadge.name === skillName);

    if (badgeSkillExists) {
      const updatedSkillBadges = skillBadgesState.map((badge) =>
        badge.skillBadge.name === skillName ? { ...badge, flag: 'added' } : badge
      );
      setSkillBadgesState(updatedSkillBadges);
    } else if (!skillExists) {
      const newSkill: Skill = { id: skills.length + 1, skillName, experience: 0 };
      setSkills([...skills, newSkill]);
    }

    setSkillQuery('');
    setShowSkillsList(false);
  }, [skills, skillBadgesState, skillsOptions])

  const removeSkill = useCallback((id: number, fromBadge: boolean, skillName: string) => {
    if (fromBadge) {
      const updatedSkillBadges = skillBadgesState.map((badge) =>
        badge.skillBadge.name === skillName ? { ...badge, flag: 'removed' } : badge
      );
      setSkillBadgesState(updatedSkillBadges);
    } else {
      const updatedSkills = skills.filter((s) => s.id !== id);
      setSkills(updatedSkills);
    }

    setSkillQuery('');
    // setShowSkillsList(true);  // Optionally show the list after removing a skill
  }, [])


  const addLocation = useCallback((location: string) => {
    if (!cities.includes(location)) {
      showToast('error', `${location} is not a valid location.`);
      return;
    }
    if (!locations.includes(location)) {
      setLocations([...locations, location]);
    }
    setLocationQuery('');
    setShowLocationList(false);
  }, [locations, cities])

  const removeLocation = useCallback((location: string) => {
    setLocations(locations.filter((loc) => loc !== location));
  }, [])

  const handleSaveChanges = async () => {
    let errors: { [key: string]: string } = {};

    if (!qualification || !qualificationsOptions.includes(qualification)) {
      errors.qualification = 'Qualification is required';
    }

    const specializationOptions = specializationsByQualification[qualification as keyof typeof specializationsByQualification];

    if (!specialization || !specializationOptions?.includes(specialization)) {
      errors.specialization = 'Specialization is required';
    }

    if (skills.length === 0) {
      errors.skills = 'At least one valid skill is required';
    }

    if (locations.length === 0) {
      errors.locations = 'At least one location is required';
    }

    if (!experience || !experienceOptions.includes(experience)) {
      errors.experience = 'Experience is required';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const skillsRequired = [
      ...skills,
      ...skillBadgesState.filter(badge => badge.flag === 'added')
        .map(badge => ({ id: badge.skillBadge.id, skillName: badge.skillBadge.name, experience: 0 }))
    ];

    const requestBody = {
      experience,
      preferredJobLocations: locations,
      qualification,
      specialization,
      skillsRequired,
    };

    console.log('Request Body:', requestBody);

    try {
      const response = await ProfileViewModel.saveProfessionalDetails(userToken, userId, requestBody);

      if (response.formErrors) {
        setValidationErrors(response.formErrors);
      } else if (response.success) {
        showToast('success', 'Professional details updated successfully');
        onClose();
        onReload();
      } else {
        showToast('error', 'Error updating professional details');
        onClose();
        onReload();
      }
    } catch (error) {
      console.error('Internal error:', error);
      showToast('error', 'Internal error occurred while updating professional details');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
        <TouchableWithoutFeedback onPress={closeAllDropdowns}>
          <View style={styles.modalView}>
            <View style={styles.modalCard}>
              <View style={{ alignItems: 'flex-end' }}>
                <TouchableOpacity onPress={onClose}>
                  <Icon name="close" size={20} color={'0D0D0D'} />
                </TouchableOpacity>
              </View>
              {/* <ScrollView contentContainerStyle={{ padding: 10 }}> */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.modalTitle}>Professional Details</Text>
              </View>

              {/* Qualification */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, validationErrors.qualification ? styles.errorInput : {}]}
                  placeholder="Qualification" placeholderTextColor="#B1B1B1"
                  value={qualificationQuery}
                  onFocus={() => toggleDropdown('qualification')}
                  onChangeText={(text) => {
                    setQualificationQuery(text);
                    setQualification(text);
                    setShowQualificationList(true);
                  }}
                />
                {validationErrors.qualification && (
                  <Text style={styles.errorText}>{validationErrors.qualification}</Text>
                )}
                {showQualificationList && (
                  <View style={[styles.dropdown, { zIndex: 1000 }]}>

                    <FlatList
                      keyboardShouldPersistTaps='handled'
                      data={qualificationsOptions.filter((qual) => qual.toLowerCase().includes(qualificationQuery.toLowerCase()))}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => {
                          Keyboard.dismiss(); // Dismiss the keyboard first
                          setTimeout(() => {
                            setQualification(item);
                            setQualificationQuery(item);
                            setShowQualificationList(false);
                          }, 0); // Ensure it runs after the keyboard dismiss
                        }}>
                          <Text style={styles.suggestionItem}>{item}</Text>
                        </TouchableOpacity>
                      )}
                      ListEmptyComponent={<Text style={styles.noMatchText}>No matches found</Text>}
                      nestedScrollEnabled={true}
                    />

                  </View>
                )}
              </View>

              {/* Specialization */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, validationErrors.specialization ? styles.errorInput : {}]}
                  placeholder="Specialization" placeholderTextColor="#B1B1B1"
                  value={specializationQuery}
                  onFocus={() => toggleDropdown('specialization')}
                  onChangeText={(text) => {
                    setSpecializationQuery(text);
                    setSpecialization(text);
                    setShowSpecializationList(true);
                  }}
                />
                {validationErrors.specialization && (
                  <Text style={styles.errorText}>{validationErrors.specialization}</Text>
                )}
                {showSpecializationList && (
                  <View style={[styles.dropdown, { zIndex: 1000 }]}>

                    <FlatList
                      keyboardShouldPersistTaps='handled'
                      data={(specializationsByQualification[qualification as keyof typeof specializationsByQualification] || [])
                        .filter((spec: string) => spec.toLowerCase().includes(specializationQuery.toLowerCase()))}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => {
                          setSpecialization(item);
                          setSpecializationQuery(item);
                          setShowSpecializationList(false);
                        }}>
                          <Text style={styles.suggestionItem}>{item}</Text>
                        </TouchableOpacity>
                      )}
                      ListEmptyComponent={<Text style={styles.noMatchText}>No matches found</Text>}
                      nestedScrollEnabled={true}
                    />

                  </View>
                )}
              </View>

              {/* Skills */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, validationErrors.skills ? styles.errorInput : {}]}
                  placeholder="Search Skills"
                  placeholderTextColor="#0D0D0D"
                  value={skillQuery}
                  onFocus={() => toggleDropdown('skills')}
                  onChangeText={setSkillQuery}
                />
                {validationErrors.skills && <Text style={styles.errorText}>{validationErrors.skills}</Text>}
                {showSkillsList && (
                  <View style={[styles.dropdown, { zIndex: 1000 }]}>
                    <FlatList
                      keyboardShouldPersistTaps='handled'
                      data={skillQuery.length > 0
                        ? skillsOptions.filter((s) => s.toLowerCase().includes(skillQuery.toLowerCase()) &&
                          !skills.some((skill) => skill.skillName === s) &&
                          !skillBadgesState.some((badge) => badge.skillBadge.name === s && badge.flag === 'added')
                        )
                        : skillsOptions.filter((s) =>
                          !skills.some((skill) => skill.skillName === s) &&
                          !skillBadgesState.some((badge) => badge.skillBadge.name === s && badge.flag === 'added')
                        )
                      }
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => addSkill(item)}>
                          <Text style={styles.autocompleteItem}>{item}</Text>
                        </TouchableOpacity>
                      )}
                      ListEmptyComponent={<Text style={styles.noMatchText}>No matches found</Text>}
                      nestedScrollEnabled={true}
                    />
                  </View>
                )}
                <View style={styles.selectedItems}>
                  {skillBadgesState
                    .filter((badge) => badge.flag === 'added')
                    .map((badge) => (
                      <View key={badge.skillBadge.id} style={[styles.selectedItem, { backgroundColor: '#334584' }]}>
                        <Text style={styles.selectedItemText}>{badge.skillBadge.name}</Text>
                        <TouchableOpacity onPress={() => removeSkill(badge.skillBadge.id, true, badge.skillBadge.name)}>
                          <Text style={styles.removeText}>x</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  {skills.map((skill) => (
                    <View key={skill.id} style={[styles.selectedItem, { backgroundColor: '#334584' }]}>
                      <Text style={styles.selectedItemText}>{skill.skillName}</Text>
                      <TouchableOpacity onPress={() => removeSkill(skill.id, false, skill.skillName)}>
                        <Text style={styles.removeText}>x</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>



              {/* Locations */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, validationErrors.locations ? styles.errorInput : {}]}
                  placeholder="Search Locations"
                  placeholderTextColor="#0D0D0D"
                  value={locationQuery}
                  onFocus={() => toggleDropdown('location')}
                  onChangeText={setLocationQuery}
                />
                {validationErrors.locations && <Text style={styles.errorText}>{validationErrors.locations}</Text>}
                {showLocationList && (
                  <View style={[styles.dropdown, { zIndex: 1000 }]}>
                    <FlatList
                      keyboardShouldPersistTaps='handled'
                      data={locationQuery.length > 0
                        ? cities.filter((loc) => loc.toLowerCase().includes(locationQuery.toLowerCase()) &&
                          !locations.some((location) => location === loc)
                        )
                        : cities.filter((loc) =>
                          !locations.some((location) => location === loc)
                        )
                      }
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => addLocation(item)}>
                          <Text style={styles.autocompleteItem}>{item}</Text>
                        </TouchableOpacity>
                      )}
                      ListEmptyComponent={<Text style={styles.noMatchText}>No matches found</Text>}
                      nestedScrollEnabled={true}
                    />
                  </View>
                )}
                <View style={styles.selectedItems}>
                  {locations.map((location) => (
                    <View key={location} style={[styles.selectedItem, { backgroundColor: '#334584' }]}>
                      <Text style={styles.selectedItemText}>{location}</Text>
                      <TouchableOpacity onPress={() => removeLocation(location)}>
                        <Text style={styles.removeText}>x</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>


              {/* Experience */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, validationErrors.experience ? styles.errorInput : {}]}
                  placeholder="Experience" placeholderTextColor="#B1B1B1"
                  value={experienceQuery}
                  onFocus={() => toggleDropdown('experience')}
                  onChangeText={(text) => {
                    setExperienceQuery(text);
                    setExperience(text);
                    setShowExperienceList(true);
                  }}
                />
                {validationErrors.experience && (
                  <Text style={styles.errorText}>{validationErrors.experience}</Text>
                )}
                {showExperienceList && (
                  <View style={[styles.dropdown, { zIndex: 1000 }]}>
                    <FlatList
                      keyboardShouldPersistTaps='handled'
                      data={experienceQuery.length > 0 ? experienceOptions.filter((exp) => exp.toLowerCase().includes(experienceQuery.toLowerCase())) : experienceOptions}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => {
                          setExperience(item);
                          setExperienceQuery(item);
                          setShowExperienceList(false);
                        }}>
                          <Text style={styles.autocompleteItem}>{item}</Text>
                        </TouchableOpacity>
                      )}
                      ListEmptyComponent={<Text style={styles.noMatchText}>No matches found</Text>}
                      nestedScrollEnabled={true}
                    />
                  </View>
                )}
              </View>
              <GradientButton
                title="Save Changes"
                onPress={handleSaveChanges}
                style={styles.button} // Apply button styles
              />
              {/* </ScrollView> */}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAvoidingView>
  );
}
)


const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },
  modalCard: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 10,


  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666666',
    fontFamily: 'PlusJakartaSans-Bold'
  },
  input: {
    backgroundColor: '#E5E5E5',
    borderWidth: 1,
    width: '100%',
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    color: '#0D0D0D',
    fontFamily: 'PlusJakartaSans-Medium'
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    fontFamily: 'PlusJakartaSans-Medium',
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    borderRadius: 5,
    zIndex: 1000,
    overflow: 'hidden',
    elevation: 5, // Added elevation for better visibility

  },
  suggestionItem: {
    padding: 10,
    fontSize: 16,
    backgroundColor: '#FFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#0D0D0D',
    fontFamily: 'PlusJakartaSans-Medium'
  },
  autocompleteItem: {
    padding: 10,
    fontSize: 16,
    backgroundColor: '#FFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#0D0D0D',
    fontFamily: 'PlusJakartaSans-Medium'
  },
  noMatchText: {
    padding: 10,
    fontSize: 16,
    color: '#bbb',
    fontFamily: 'PlusJakartaSans-Medium'
  },
  selectedItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    marginTop: 8
  },
  selectedItem: {

    backgroundColor: '#334584',
    padding: 5,
    marginRight: 10,
    marginBottom: 5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedItemText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  removeText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 5,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    width: '100%',
    borderRadius: 5,
    marginTop: 8
  },
  scrollContainer: {
    maxHeight: 150,
  },
});

export default ProfessionalDetailsForm;