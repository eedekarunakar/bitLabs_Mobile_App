import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ProfileService } from '../services/profile/ProfileService';

export const useProfileViewModel = (userToken: string | null, userId: number | null) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Personal Details State
  const [personalDetails, setPersonalDetails] = useState({
    firstName: '',
    lastName: '',
    alternatePhoneNumber: '',
    email: '', // Non-editable, if needed
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const data = await ProfileService.fetchProfile(userToken, userId);
      console.log(data.applicant.applicantSkillBadges);

      // Populate personal details from the profile data
      if (data && data.basicDetails) {
        setPersonalDetails({
          firstName: data.basicDetails.firstName || '',
          lastName: data.basicDetails.lastName || '',
          alternatePhoneNumber: data.basicDetails.alternatePhoneNumber || '',
          email: data.basicDetails.email || '', // Non-editable
        });
      }

      setProfileData(data);
    } catch (err) {
      setError('Failed to load profile data.');
    } finally {
      setIsLoading(false);
    }
  };

  // Ensure function doesn't recreate on every render
  const reloadProfile = useCallback(() => {
    loadProfile();
  }, [userToken, userId]);

  useFocusEffect(
    useCallback(() => {
      reloadProfile();
    }, [reloadProfile])
  );

  useEffect(() => {
    loadProfile();
  }, []);
  // Validate Phone Number
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/; // Adjust regex as needed
    return phoneRegex.test(phone);
  };

  // Validate Form
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!personalDetails.firstName)
       errors.firstName = 'First name is required';
    else if (personalDetails.firstName.length < 3) {
      errors.firstName = 'First name must be at least 3 characters long';
    }else if (!nameRegex.test(personalDetails.firstName)) {
      errors.firstName = 'First name must only contain letters and spaces';
    }

    if (!personalDetails.lastName)
       errors.lastName = 'Last name is required';
    else if (personalDetails.lastName.length < 3) {
      errors.lastName = 'Last name must be at least 3 characters long';
    } else if (!nameRegex.test(personalDetails.lastName)) {
      errors.lastName = 'Last name must only contain letters and spaces';
    }
  
    if (!validatePhoneNumber(personalDetails.alternatePhoneNumber)) {
      errors.alternatePhoneNumber = 'Mobile number must start with 6, 7, 8, or 9 and be 10 digits long';
    }
    setFormErrors(errors);
    console.log(errors);
    return Object.keys(errors).length === 0;
  };

  // Update Basic Details
  const updateBasicDetails = async () => {
    
      // Trigger form validation
    const isValid = validateForm();
    if (!isValid) {
      // Prevent submission if there are validation errors
      return false;
    }

    try {
      const result = await ProfileService.updateBasicDetails(userToken, userId, personalDetails);
      
      return result// Indicate success
     
    } catch (error) {
      
      console.log('Error updating personal details:', error);
      return false; // Indicate failure
    }
  };

  // Handle Input Changes
  const handleInputChange = (field: string, value: string) => {
    setPersonalDetails((prevState) => ({ ...prevState, [field]: value }));
  };

  useEffect(() => {
    loadProfile();
  }, []);
  

  return {
    profileData,
    isLoading,
    setIsLoading,
    error,
    reloadProfile: loadProfile,
    personalDetails,
    formErrors,
    handleInputChange,
    updateBasicDetails,
    setFormErrors,
  };
};


export const ProfileViewModel = {
  

  async saveProfessionalDetails(userToken: string | null, userId: number | null, updatedData: any) {
    // const errors = await this.validateFormData(updatedData);

    // if (Object.keys(errors).length > 0) {
    //   // If validation fails, return errors
    //   return { success: false, formErrors: errors };
    // }

    // Proceed to save the data if no validation errors
    const response = await ProfileService.updateProfessionalDetails(userToken, userId, updatedData);

    if (response.success) {
      return { success: true, profileData: response.profileData };
    } else {
      return { success: false, formErrors: response.formErrors };
    }
  },

 
};