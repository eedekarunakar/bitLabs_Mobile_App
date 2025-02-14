import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView
} from 'react-native';
import ProgressBar from '../../components/progessBar/ProgressBar';
import LinearGradient from 'react-native-linear-gradient';

import { getMobileNumber } from '../../services/mobile';
import { useAuth } from '../../context/Authcontext';


const Dummystep1: React.FC = ({ route, navigation }: any) => {
 
  const { email } = route.params;
  const [currentStep, setCurrentStep] = useState(1);
  const{userId}=useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    whatsappNumber: '',
  });
 
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    whatsappNumber: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch mobile number from API
    const fetchMobileNumber = async () => {
      const mobileNumber = await getMobileNumber(userId);
      if (mobileNumber) {
        setFormData((prev) => ({ ...prev, whatsappNumber: mobileNumber }));
      }
      setLoading(false); // Mark API call as complete
    };

 
    fetchMobileNumber();
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      whatsappNumber: '',
    };
 
    // Validate first name
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required.';
      isValid = false;
    } else if (formData.firstName.length < 3) {
      newErrors.firstName = 'First name should be at least 3 characters long.';
      isValid = false;
    }
 
    // Validate last name
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required.';
      isValid = false;
    } else if (formData.lastName.length < 3) {
      newErrors.lastName = 'Last name should be at least 3 characters long.';
      isValid = false;
    }
 
    // Validate WhatsApp number
    const whatsappRegex = /^[6-9]\d{9}$/;
    if (!whatsappRegex.test(formData.whatsappNumber)) {
      newErrors.whatsappNumber =
        'Should be 10 digits and start with 6, 7, 8, or 9.';
      isValid = false;
    }
 
    setErrors(newErrors);
    return isValid;
  };
 
  const handleNext = () => {
    console.log('Route Params:', route.params);
    if (validateForm()) {
      console.log('Form Data:', { ...formData, email });
      const totalSteps = 3;
      setCurrentStep((prevStep) => Math.min(prevStep + 1, totalSteps));
      navigation.navigate('Step2', {
        ...route.params,
        firstName: formData.firstName,
        lastName: formData.lastName,
        whatsappNumber: formData.whatsappNumber,
        email: email,
      }); // Proceed to next step
    }
  };
 
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollView}>
 
        <Image
          style={styles.logo}
          source={require('../../assests/LandingPage/logo.png')} // Replace with your actual logo path
        />
 
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.completeProfile}>Complete Your Profile</Text>
            <Text style={styles.subHeader}>
            Fill the form fields to go to the next step
            </Text>
          </View>
 
          {/* ProgressBar with currentStep */}
          <ProgressBar
            initialStep={currentStep}
          />
 
          <TextInput
            placeholder="*First Name" placeholderTextColor="#B1B1B1"
            style={styles.input}
            value={formData.firstName}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, firstName: text }))
              if (text.length >= 3) {
                setErrors((prev) => ({ ...prev, firstName: '' }))
              }
            }
            }
          />
          {errors.firstName ? (
            <Text style={styles.errorText}>{errors.firstName}</Text>
          ) : null}
 
          <TextInput
            placeholder="*Last Name" placeholderTextColor="#B1B1B1"
            style={styles.input}
            value={formData.lastName}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, lastName: text }))
              if (text.length >= 3) {
                setErrors((prev) => ({ ...prev, lastName: '' }))
              }
            }
            }
          />
          {errors.lastName ? (
            <Text style={styles.errorText}>{errors.lastName}</Text>
          ) : null}
 
          {/* Prefilled, non-editable Email field */}
          <TextInput
            value={email}
            style={[styles.input, { backgroundColor: '#E5E4E2', color: 'gray' }]}
            editable={false}
          />
          <TextInput
            placeholder="WhatsApp Number" placeholderTextColor="#B1B1B1"
            style={styles.input}
            value={formData.whatsappNumber}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, whatsappNumber: text }))
              const whatsappRegex = /^[6-9]\d{9}$/;
              if (whatsappRegex.test(text)) {
                setErrors((prev) => ({ ...prev, whatsappNumber: '' }));
              }
            }
            }
          />
          {errors.whatsappNumber ? (
            <Text style={styles.errorText}>{errors.whatsappNumber}</Text>
          ) : null}
        </View>
 
      </ScrollView>
 
      {/* Footer with Back and Next Buttons */}
      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.gradientTouchable} onPress={handleNext}>
            <LinearGradient
              colors={['#F97316', '#FAA729']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.nextButton, styles.applyButtonGradient]}
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
  scrollView: {
    flexGrow: 1,
    paddingBottom: 100, // Adds padding to avoid initial overlap
  },
  logo: {
    width: 150, // Decreased width
    height: 45,
    marginBottom: 20,
    alignSelf: 'center',
  },
  container: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    height: '98%',
    marginBottom: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 15,
    borderTopColor: '#ccc',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 25,
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
    fontFamily: 'PlusJakartaSans-Bold',
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
    fontFamily: 'PlusJakartaSans-Bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#F5F5F5',
    color: 'black',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  applyButtonGradient: {
    width: '100%', // Adjust this if necessary
  },
  gradientTouchable: {
    flex: 1,
    width: '50%'
  },
});

export default Dummystep1;