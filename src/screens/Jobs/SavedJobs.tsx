import React,{useState,useCallback} from 'react';
import { ScrollView, ActivityIndicator, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useSavedJobs } from '../../services/Jobs/SavedJob';
import { JobData1 } from '../../models/Jobs/SavedJob';
import { useNavigation,useFocusEffect } from '@react-navigation/native';
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
  const formatDate = (dateArray: [number, number, number]): string => {
    const [year, month, day] = dateArray;
    return `${day}-${month}-${year}`;
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
              ₹ {job.minSalary.toFixed(2)} - {job.maxSalary.toFixed(2)} LPA
            </Text>
            <Text style={styles.tag}>{job.employeeType}</Text>
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
  placeholderText: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 50 },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
   
    marginHorizontal: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  companyLogo: { width: 50, height: 50, borderRadius: 15, marginRight: 16 },
  jobDetails: { flex: 1 },
  jobTitle: { fontSize: 16, fontWeight: 'bold' },
  companyName: { fontSize: 14, color: '#888' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  tag: {
    backgroundColor: '#f6f6f6',
    color: 'black',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 50,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 10,
  },
  oval: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
    marginRight: 8,
  },
  ovalText: { fontSize: 9, color: 'black' },
  brieficon: { height: 10, width: 10, marginRight: 8 },
  locationContainer: { flexDirection: 'row', alignItems: 'center' },
  locationIcon: { width: 10, height: 10, marginRight: 6 },
  locationText: { fontSize: 10, color: 'black' },
  postedOn: { fontSize: 12, color: '#888', marginTop: 8 },
});

export default SavedJobs;