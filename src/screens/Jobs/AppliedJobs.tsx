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
import { useAppliedJobsViewModel } from '../../viewmodel/jobs/AppliedJob';
import { JobData } from '../../models/Jobs/ApplyJobmodel';
import { useAuth } from '../../context/Authcontext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../New';
 
const AppliedJobs = () => {
  const { userId, userToken } = useAuth();
  const { appliedJobs, loading, error } = useAppliedJobsViewModel(userId, userToken);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'AppliedJobs'>>();
 
  const formatDate = (dateArray: [number, number, number]): string => {
    const [year, month, day] = dateArray;
    return `${day}-${month}-${year}`;
  };
 
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
            source={{ uri: job.logoFile || 'https://via.placeholder.com/50' }}
            style={styles.companyLogo}
          />
          <View style={styles.jobDetails}>
            <Text style={styles.jobTitle}>{job.jobTitle}</Text>
            <Text style={styles.companyName}>{job.companyname}</Text>
          </View>
        </View>
        <View style={styles.tagRow}>
            <View style={[styles.tag, styles.locationContainer]}>
              <Image
                source={require('../../assests/Images/rat/loc.png')}
                style={styles.locationIcon}
              />
              <Text style={styles.locationText}>{job.location}</Text>
            </View>
            <View style={styles.oval}>
              <Image
                source={require('../../assests/Images/rat/exp.png')}
                style={styles.brieficon}
              />
              <Text style={styles.ovalText}>
                Exp: {job.minimumExperience} - {job.maximumExperience} years
              </Text>
            </View>
            <Text style={styles.tag}>
              ₹ {job.minSalary.toFixed(2)} -  {job.maxSalary.toFixed(2)} LPA
            </Text>
            <Text style={styles.tag}>{job.employeeType}</Text>
          </View>
        {/* <Text style={styles.description}>
          {job.description.replace(/<[^>]+>/g, '')}
        </Text> */}
        <Text style={styles.postedOn}>Posted on {formatDate(job.creationDate)}</Text>
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
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
  
    marginLeft: 6,
  },
  oval: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f6', // Background color for the oval
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50, // Makes the container oval
    marginBottom: 8,
    marginRight: 6
  },
  ovalText: {
    fontSize: 9,
    color: 'black',
  },
 
  brieficon: {
    height: 8,
    width: 8,
    marginRight: 8,
  },
briefcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
tag: {
    backgroundColor: '#f6f6f6',
    color: 'black',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 50,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 8
  },
locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
locationIcon: {
    width: 8,
    height: 8,
    marginRight: 6,
  },
  locationText: {
    fontSize: 9,
    color: 'black',
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  companyName: {
    fontSize: 14,
    color: '#888',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  // tag: {
  //   backgroundColor: '#f6f6f6',
  //   padding: 4,
  //   borderRadius: 50,
  //   marginRight: 8,
  //   fontSize: 9,
  // },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  postedOn: {
    fontSize: 12,
    color: '#888',
  },
});
 
export default AppliedJobs;