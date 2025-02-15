import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useAppliedJobsViewModel } from '@viewmodel/jobs/AppliedJob';
import { JobData } from '@models/Jobs/ApplyJobmodel';
import { useAuth } from '@context/Authcontext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../New';
 
const AppliedJobs = () => {
  const { userId, userToken } = useAuth();
  const { appliedJobs, loading, error } = useAppliedJobsViewModel(userId, userToken);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'AppliedJobs'>>();
 
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const formatDate = (dateArray: [number, number, number]): string => {
    const [year, month, day] = dateArray;
    return `${monthNames[month - 1]} ${day}, ${year}`;
  };;
 
  const renderJobs = () => {
    if (loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#FF8C00" />
        </View>
      );
    }
 
    if (error) {
      return <Text style={styles.placeholderText}>{error}</Text>;
    }
 
    if (appliedJobs.length === 0) {
      return <Text style={styles.placeholderText}>No applied jobs available!</Text>;
    }
 
    return appliedJobs.map((job: JobData) => (
      <TouchableOpacity
        key={job.id}
        style={styles.jobCard}
        onPress={() => navigation.navigate('JobDetailsScreen', { job })}
      >
        <View style={styles.row}>
          <Image
            source={require('../../assests/Images/company.png')}
            style={styles.companyLogo}
          />
          <View style={styles.jobDetails}>
            <Text style={styles.jobTitle} numberOfLines={1} ellipsizeMode="tail">
              {job.jobTitle}
            </Text>
            <Text style={styles.companyName}>{job.companyname}</Text>
          </View>
 
        </View>
 
        <View style={[styles.tag, styles.locationContainer]}>
          <Image
            source={require('../../assests/Images/rat/loc.png')}
            style={styles.locationIcon}
          />
          <Text style={styles.locationText}>{job.location}</Text>
        </View>
 
        <View style={{ flexDirection: 'row',marginLeft:10,justifyContent: 'flex-start', flexWrap: 'nowrap', alignItems: 'center' }}>
 
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
            <Image
              source={require('../../assests/Images/rat/exp.png')}
              style={styles.brieficon}
            />
            <Text style={styles.ovalText}>
              Exp: {job.minimumExperience} - {job.maximumExperience} years   
            </Text>
            <Text style={{color:'#E2E2E2'}}>  |</Text>
          </View>
 
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginTop: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
              <Text style={{ fontSize: 13 }}>₹ </Text>
              <Text style={styles.ovalText}>{job.minSalary.toFixed(2)} -  {job.maxSalary.toFixed(2)} LPA  </Text>
              <Text style={{color:'#E2E2E2'}}>  |</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.ovalText}>{job.employeeType}</Text>
          </View>
          </View>
          <View>
            <Text style={styles.postedOn}>Posted on {formatDate(job.creationDate)}</Text>
          </View>
      </TouchableOpacity>
 
    ));
  };
 
  return <ScrollView style={styles.container}>{renderJobs()}</ScrollView>;
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
    fontFamily: 'PlusJakartaSans-Bold'
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    margin: 12,
    marginBottom: 0,
    paddingHorizontal: 10
  },
  oval: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f6', // Background color for the oval
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50, // Makes the container oval
    marginBottom: 8,
    marginRight: 3
  },
  ovalText: {
    fontSize: 11,
    color: 'black',
    fontFamily: 'PlusJakartaSans-Medium'
  },
 
  brieficon: {
    height: 10,
    width: 12,
    marginRight: 8,
  },
  briefcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
 
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 11,
    height: 12,
    marginRight: 6,
  },
  locationText: {
    fontSize: 11,
    color: 'black',
    fontFamily: 'PlusJakartaSans-Medium'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 15,
    marginRight: 16,
  },
  jobDetails: {
    flex: 1,
  },
  jobTitle: {
    color: '#121212', // Text color
    fontFamily: 'PlusJakartaSans-Bold', // Custom font (ensure the font is properly linked)
    fontSize: 16, // Font size
    fontStyle: 'normal', // Font style
    lineHeight: 16, // Adjust line height as needed
    textTransform: 'capitalize', // Capitalize text
  },
  companyName: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Medium",
    fontStyle: 'normal',
    fontWeight: 600,
    color: 'rgba(83, 83, 83, 0.80)',
    marginVertical: 4,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginBottom: 8,
 
  },
  tag: {
    marginTop: -10,
    color: 'black',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 50,
    marginRight: 3,
    marginBottom: 8,
    fontSize: 11,
    fontFamily: 'PlusJakartaSans-Medium'
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  postedOn: {
    color: '#979696', // Text color
    fontFamily: 'PlusJakartaSans-Medium', // Custom font
    fontSize: 9, // Font size
    fontStyle: 'normal', // Font style
    lineHeight: 23.76, // Line height (in points, not percentage)
    marginTop:10,
    display:'flex',
    marginLeft:'58%',
    //marginBottom:8
    
    
  },
});
 
export default AppliedJobs;