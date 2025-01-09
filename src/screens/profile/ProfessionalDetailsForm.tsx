import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform

} from 'react-native';
import { useAuth } from '../../context/Authcontext';
import { ProfileViewModel } from '../../viewmodel/Profileviewmodel';
import Toast from 'react-native-toast-message';
import { ApplicantSkillBadge } from '../../models/profile/profile';

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

const ProfessionalDetailsForm: React.FC<ProfessionalDetailsFormProps> = ({
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

  const qualificationsOptions = ['B.Tech', 'MCA', 'Degree', 'Intermediate', 'Diploma'];
  const specializationsByQualification: Record<string, string[]> = {
    'B.Tech': ['Computer Science and Engineering (CSE)', 'Electronics and Communication Engineering (ECE)', 'Electrical and Electronics Engineering (EEE)', 'Mechanical Engineering (ME)', 'Civil Engineering (CE)', 'Aerospace Engineering', 'Information Technology(IT)', 'Chemical Engineering', 'Biotechnology Engineering'],
    'MCA': ['Software Engineering', 'Data Science', 'Artificial Intelligence', 'Machine Learning', 'Information Security', 'Cloud Computing', 'Mobile Application Development', 'Web Development', 'Database Management', 'Network Administration', 'Cyber Security', 'IT Project Management'],
    'Degree': ['Bachelor of Science (B.Sc) Physics', 'Bachelor of Science (B.Sc) Mathematics', 'Bachelor of Science (B.Sc) Statistics', 'Bachelor of Science (B.Sc) Computer Science', 'Bachelor of Science (B.Sc) Electronics', 'Bachelor of Science (B.Sc) Chemistry', 'Bachelor of Commerce (B.Com)'],
    'Intermediate': ['MPC', 'BiPC', 'CEC', 'HEC'],
    'Diploma': ['Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering', 'Electronics and Communication Engineering', 'Computer Engineering', 'Automobile Engineering', 'Chemical Engineering', 'Information Technology', 'Instrumentation Engineering', 'Mining Engineering', 'Metallurgical Engineering', 'Agricultural Engineering', 'Textile Technology', 'Architecture', 'Interior Designing', 'Fashion Designing', 'Hotel Management and Catering Technology', 'Pharmacy', 'Medical Laboratory Technology', 'Radiology and Imaging Technology']
  };

  const skillsOptions = ['Java', 'C', 'C++', 'C Sharp', 'Python', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Angular', 'React', 'Vue', 'JSP', 'Servlets', 'Spring', 'Spring Boot', 'Hibernate', '.Net', 'Django', 'Flask', 'SQL', 'MySQL', 'SQL-Server', 'Mongo DB', 'Selenium', 'Regression Testing', 'Manual Testing'];
  const cities = ['Chennai', 'Thiruvananthapuram', 'Bangalore', 'Hyderabad', 'Coimbatore', 'Kochi', 'Madurai', 'Mysore', 'Thanjavur', 'Pondicherry', 'Vijayawada', 'Pune', 'Gurgaon'];
  const experienceOptions = Array.from({ length: 16 }, (_, i) => i.toString());

  const [skillBadgesState, setSkillBadgesState] = useState<ApplicantSkillBadge[]>(
    applicantSkillBadges.filter((badge: ApplicantSkillBadge) => badge.flag === 'added')
  );

  const showToast = (type1: 'success' | 'error', message: string) => {
    Toast.show({
      type: type1,
      text1: message,
      position: 'bottom',
      visibilityTime: 3000,
    });
  };

  const toggleQualificationDropdown = () => {
    setShowQualificationList(!showQualificationList);
    setShowSpecializationList(false);
    setShowExperienceList(false);
    setShowSkillsList(false);
    setShowLocationList(false);
  };

  const toggleSpecializationDropdown = () => {
    setShowSpecializationList(!showSpecializationList);
    setShowQualificationList(false);
    setShowExperienceList(false);
    setShowSkillsList(false);
    setShowLocationList(false);
  };

  const toggleExperienceDropdown = () => {
    setShowExperienceList(!showExperienceList);
    setShowQualificationList(false);
    setShowSpecializationList(false);
    setShowSkillsList(false);
    setShowLocationList(false);
  };

  const toggleSkillsDropdown = () => {
    setShowSkillsList(!showSkillsList);
    setShowQualificationList(false);
    setShowSpecializationList(false);
    setShowExperienceList(false);
    setShowLocationList(false);
  };

  const toggleLocationDropdown = () => {
    setShowLocationList(!showLocationList);
    setShowQualificationList(false);
    setShowSpecializationList(false);
    setShowExperienceList(false);
    setShowSkillsList(false);
  };
  const closeAllDropdowns = () => {
    setShowQualificationList(false);
    setShowSpecializationList(false);
    setShowExperienceList(false);
    setShowSkillsList(false);
    setShowLocationList(false);
    Keyboard.dismiss(); // Dismiss the keyboard if it's open
  };
  const addSkill = (skillName: string) => {
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
  };

  const removeSkill = (id: number, fromBadge: boolean, skillName: string) => {
    if (fromBadge) {
      const updatedSkillBadges = skillBadgesState.map((badge) =>
        badge.skillBadge.name === skillName ? { ...badge, flag: 'removed' } : badge
      );
      setSkillBadgesState(updatedSkillBadges);
    } else {
      const updatedSkills = skills.filter((s) => s.id !== id);
      setSkills(updatedSkills);
    }
  };

  const addLocation = (location: string) => {
    if (!cities.includes(location)) {
      showToast('error', `${location} is not a valid location.`);
      return;
    }
    if (!locations.includes(location)) {
      setLocations([...locations, location]);
    }
    setLocationQuery('');
    setShowLocationList(false);
  };

  const removeLocation = (location: string) => {
    setLocations(locations.filter((loc) => loc !== location));
  };

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
        showToast('success', 'Professional Details updated successfully');
        onClose();
        onReload();
      } else {
        showToast('error', 'Error updating Professional Details');
        onClose();
        onReload();
      }
    } catch (error) {
      console.error('Internal error:', error);
      showToast('error', 'Internal error occurred while updating Professional Details');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
        <TouchableWithoutFeedback onPress={closeAllDropdowns}>
          <View style={styles.modalView}>
            <View style={styles.modalCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                <Text style={styles.modalTitle}>Professional Details</Text>
                <TouchableOpacity onPress={onClose}>
                  <Text style={{ fontSize: 24, color: 'red', top: -10 }}>X</Text>
                </TouchableOpacity>
              </View>

              {/* Qualification */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, validationErrors.qualification ? styles.errorInput : {}]}
                  placeholder="Qualification" placeholderTextColor="#B1B1B1"
                  value={qualificationQuery}
                  onFocus={toggleQualificationDropdown}
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
                      data={qualificationsOptions.filter((qual) => qual.toLowerCase().includes(qualificationQuery.toLowerCase()))}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => {
                          setQualification(item);
                          setQualificationQuery(item);
                          setShowQualificationList(false);
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
                  onFocus={toggleSpecializationDropdown}
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
                  placeholder="Search Skills" placeholderTextColor="#0D0D0D"
                  value={skillQuery}
                  onFocus={toggleSkillsDropdown}
                  onChangeText={setSkillQuery}
                />
                {validationErrors.skills && <Text style={styles.errorText}>{validationErrors.skills}</Text>}
                {showSkillsList && (
                  <View style={[styles.dropdown, { zIndex: 1000 }]}>

                    <FlatList
                      data={skillQuery.length > 0 ? skillsOptions.filter((s) => s.toLowerCase().includes(skillQuery.toLowerCase())) : skillsOptions}
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
                      <View key={badge.skillBadge.id} style={[styles.selectedItem, { backgroundColor: '#4CAF50' }]}>
                        <Text style={styles.selectedItemText}>{badge.skillBadge.name}</Text>
                        <TouchableOpacity onPress={() => removeSkill(badge.skillBadge.id, true, badge.skillBadge.name)}>
                          <Text style={styles.removeText}>x</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  {skills.map((skill) => (
                    <View key={skill.id} style={[styles.selectedItem, { backgroundColor: '#4CAF50' }]}>
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
                  placeholder="Search Locations" placeholderTextColor="#0D0D0D"
                  value={locationQuery}
                  onFocus={toggleLocationDropdown}
                  onChangeText={setLocationQuery}
                />
                {validationErrors.locations && <Text style={styles.errorText}>{validationErrors.locations}</Text>}
                {showLocationList && (
                  <View style={[styles.dropdown, { zIndex: 1000 }]}>

                    <FlatList
                      data={locationQuery.length > 0 ? cities.filter((loc) => loc.toLowerCase().includes(locationQuery.toLowerCase())) : cities}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => addLocation(item)}>
                          <Text style={styles.autocompleteItem}>{item}</Text>
                        </TouchableOpacity>
                      )}
                      ListEmptyComponent={<Text style={styles.noMatchText}>No matches found</Text>

                      }
                      nestedScrollEnabled={true}
                    />

                  </View>
                )}
                <View style={styles.selectedItems}>
                  {locations.map((location) => (
                    <View key={location} style={[styles.selectedItem, { backgroundColor: '#FF9800' }]}>
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
                  onFocus={toggleExperienceDropdown}
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


              <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalCard: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 20,
    
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    color:'#0D0D0D',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
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
    color:'#0D0D0D'
  },
  autocompleteItem: {
    padding: 10,
    fontSize: 16,
    backgroundColor: '#FFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color:'#0D0D0D'
  },
  noMatchText: {
    padding: 10,
    fontSize: 16,
    color: '#bbb',
  },
  selectedItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  selectedItem: {
    backgroundColor: '#4CAF50',
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
  },
  removeText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    width: 128,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  scrollContainer: {
    maxHeight: 150,
  },
});

export default ProfessionalDetailsForm;
