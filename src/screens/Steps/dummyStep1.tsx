import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../New';
import ProgressBar from '../../components/progessBar/ProgressBar';
import LinearGradient from 'react-native-linear-gradient';
 
type Step1ScreenRouteProp = RouteProp<RootStackParamList, 'Step1'>;
 
interface Step1Props {
  route: Step1ScreenRouteProp;
  navigation: any;
}
 
const Dummystep1: React.FC = ({ route, navigation }: any) => {
  const { email } = route.params;
  const [step, setStep] = useState(1);
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
 
  const newErrors = {
    firstName: '',
    lastName: '',
    whatsappNumber: '',
  };
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      whatsappNumber: '',
    };
 
    // Validate first name
    if (!formData.firstName || formData.firstName.length < 3) {
      newErrors.firstName = 'First name should be at least 3 characters long.';
      isValid = false;
    }
 
    // Validate last name
    if (!formData.lastName || formData.lastName.length < 3) {
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
    if (validateForm()) {
      console.log('Form Data:', { ...formData, email });
      navigation.navigate('Step2',{
        firstName: formData.firstName,
        lastName: formData.lastName,
        whatsappNumber: formData.whatsappNumber,
        email: email,  // Use email passed from route params
      }); // Proceed to next step
    }
  };
 
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollView}>
      <Image
        style={styles.logo}
        source={require('../../assests/Images/rat/logo.png')} // Replace with your actual logo path
      />
 
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.completeProfile}>Complete Your Profile</Text>
          <Text style={styles.subHeader}>
            Fill the form fields to go next step
          </Text>
        </View>
 
        {/* ProgressBar with currentStep */}
        <ProgressBar
          currentStep={step}
          onStepPress={(stepId) => setStep(stepId)}
        />
 
        <TextInput
          placeholder="First Name" placeholderTextColor="#B1B1B1"
          style={styles.input}
          value={formData.firstName}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, firstName: text }))
          }
        />
        {errors.firstName ? (
          <Text style={styles.errorText}>{errors.firstName}</Text>
        ) : null}
 
        <TextInput
          placeholder="Last Name" placeholderTextColor="#B1B1B1"
          style={styles.input}
          value={formData.lastName}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, lastName: text }))
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
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, whatsappNumber: text }))
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
  <LinearGradient
    colors={['#F97316', '#FAA729']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={[styles.nextButton, styles.applyButtonGradient]}
  >
    <TouchableOpacity style={styles.gradientTouchable} onPress={handleNext}>
      <Text style={styles.nextButtonText}>Next</Text>
    </TouchableOpacity>
  </LinearGradient>
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
   
    marginBottom: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 15,
    backgroundColor: '#fff',
    
    borderTopColor: '#ccc',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
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
    borderColor: '#E5E4E2',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    color: 'black',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
  applyButtonGradient: {
    width: '45%', // Adjust this if necessary
  },
  gradientTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
 
export default Dummystep1;