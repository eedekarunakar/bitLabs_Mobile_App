import React, { useState, useCallback } from 'react';
import { ScrollView, ActivityIndicator, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useSavedJobs } from '../../services/Jobs/SavedJob';
import { JobData1 } from '../../models/Jobs/SavedJob';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../New';
 
const SavedJobs = () => {
  const { savedJobs, loading, error, fetchSavedJobs } = useSavedJobs(); // Assuming `fetchSavedJobs` is available to manually trigger data fetch
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'SavedJobs'>>();
  const [reload, setReload] = useState(false); // Reload state
 
  // Automatically reload data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchSavedJobs(); // Trigger a reload of the saved jobs data
    }, [reload]) // Dependency ensures fresh data each time
  );
 
 
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF8C00" />
      </View>
    );
  }
 
  if (error || savedJobs.length === 0) {
    return <Text style={styles.placeholderText}>No saved jobs available!</Text>;
  }
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const formatDate = (dateArray: [number, number, number]): string => {
    const [year, month, day] = dateArray;
    return `${monthNames[month - 1]} ${day}, ${year}`;
  };
  return (
    <ScrollView style={styles.container}>
      {savedJobs.map((job: JobData1) => (
        <TouchableOpacity
          key={job.id}
          style={styles.jobCard}
          onPress={() => navigation.navigate('SavedDetails', { job })}
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
              <Text style={styles.locationText}> {job.location}</Text>
            </View>    
          <View style={styles.tagRow}>
           
            <View style={styles.oval}>
              <Image
                source={require('../../assests/Images/rat/exp.png')}
                style={styles.brieficon}
              />
              <Text style={styles.ovalText}>
                Exp: {job.minimumExperience} - {job.maximumExperience} years
              </Text>
              <Text style={{color:'#E2E2E2'}}>  |</Text>
            </View>
            <View style={styles.oval1}>
            <Text style={styles.tag}>
              ₹ {job.minSalary.toFixed(2)} - {job.maxSalary.toFixed(2)} LPA
            </Text>
            <Text style={{color:'#E2E2E2'}}>  |</Text>
            <Text style={styles.tag}>{job.employeeType}</Text>
 
            </View>
 
          </View>
          <Text style={styles.postedOn}>Posted on {formatDate(job.creationDate)}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 50, fontFamily: 'PlusJakartaSans-Bold' },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 10,
    paddingHorizontal: 10,
    margin: 12,
    marginBottom: 0,
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  companyLogo: { width: 50, height: 50, borderRadius: 15, marginRight: 16 },
  jobDetails: { flex: 1 },
  jobTitle: {
    color: '#121212', // Text color
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 16, // Font size
    fontStyle: 'normal', // Font style
    lineHeight: 16, // Adjust line height as needed
    textTransform: 'capitalize', // Capitalize text
    marginTop:10,
  },
  companyName: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Medium",
    fontStyle: 'normal',
    fontWeight: 600,
    color: 'rgba(83, 83, 83, 0.80)',
    marginVertical: 4,
  },
  tagRow: { flexDirection: 'row', flexWrap: 'nowrap', marginBottom: 8, justifyContent:'flex-start' },
  tag: {
   
    color: 'black',
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 50,
    //marginRight: 3,
    //marginBottom: 8,
    fontSize: 11,
    fontFamily: 'PlusJakartaSans-Medium',
   
  },
  oval: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 50, // Makes the container oval
   
    //marginRight: 30,
    marginTop:-7,
   
  },
  oval1: {
    flexDirection: 'row',
    alignItems: 'center',
    //paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50, // Makes the container oval
    marginBottom: 8,
    //marginRight: 3,
     marginTop:3
  },
  ovalText: { fontSize: 11, color: 'black', fontFamily: 'PlusJakartaSans-Medium' },
  brieficon: { height: 10, width: 12, marginRight: 8, marginLeft:-2 },
  locationContainer: { flexDirection: 'row', alignItems: 'center' },
  locationIcon: { width: 11, height: 12, marginRight: 1},
  locationText: { fontSize: 11, color: 'black', fontFamily: 'PlusJakartaSans-Medium' },
  postedOn: {
    color: '#979696', // Text color
    fontFamily: 'PlusJakartaSans-Medium', // Custom font
    fontSize: 9, // Font size
    fontStyle: 'normal', // Font style
    fontWeight: '500', // Font weight
    lineHeight: 23.76, // Line height (in points, not percentage),
    //marginLeft:200
    position:'relative',
    left:'58%',
    marginTop:-19
  },
});
 
export default SavedJobs;