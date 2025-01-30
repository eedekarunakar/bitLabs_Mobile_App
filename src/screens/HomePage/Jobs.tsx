import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  FlatList,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../New'; // Import navigation types
import AppliedJobs from '../Jobs/AppliedJobs';
import SavedJobs from '../Jobs/SavedJobs';
import useRecommendedJobsViewModel from '../../viewmodel/jobs/RecommendedJobs'; // Your ViewModel
import { JobData } from '../../models/Jobs/ApplyJobmodel'; // Your JobData interface
import { useRoute, RouteProp } from '@react-navigation/native';

// Navigation prop type for RecommendedJobs
type RecommendedJobsNavigationProp = StackNavigationProp<RootStackParamList, 'JobDetails'>;
type JobsRouteProp = RouteProp<RootStackParamList, 'Jobs'>;

const RecommendedJobs = () => {
  const route = useRoute<JobsRouteProp>(); // Specify the route type
  const { tab = 'recommended' } = route.params || {}; // Now TypeScript knows about 'tab'
  const { jobs, loading, reloadJobs } = useRecommendedJobsViewModel(); // Assuming jobs are passed from view model
  const [activeTab, setActiveTab] = useState<'recommended' | 'applied' | 'saved'>('recommended');
  const navigation = useNavigation<RecommendedJobsNavigationProp>();
  const [appliedJobs, setAppliedJobs] = useState<JobData[]>([]); // State to store applied jobs
  const [savedJobs, setSavedJobs] = useState<JobData[]>([]); // State to store saved jobs
  const isFocused = useIsFocused();
  const [visibleJobsCount, setVisibleJobsCount] = useState(10); // Number of jobs to display initially

  useEffect(() => {
    if (route.params?.tab) {
      setActiveTab(route.params.tab); // Set the active tab from the passed parameter
    }
  }, [route.params?.tab]);

  useEffect(() => {
    if (isFocused && activeTab === 'recommended') {
      reloadJobs(); // Reload jobs when the screen is focused and tab is 'recommended'
    }
  }, [isFocused, activeTab]);

  // Handle tab press
  const handleTabPress = (tab: 'recommended' | 'applied' | 'saved') => {
    setActiveTab(tab);
  };

  // Filter applied and saved jobs
  const filterAppliedJobs = (jobsToFilter: JobData[]) => {
    return jobsToFilter.filter((job) => {
      return !appliedJobs.some((appliedJob) => appliedJob.id === job.id) &&
        !savedJobs.some((savedJob) => savedJob.id === job.id);
    });
  };

  // Load more jobs when the user scrolls to the bottom
  const loadMoreJobs = () => {
    if (visibleJobsCount < jobs.length) {
      setVisibleJobsCount(visibleJobsCount + 10); // Load 10 more jobs
    }
  };

  // Render job cards
  const renderJobs = ({ item }: { item: JobData }) => {
    return (
      <View key={item.id} style={styles.jobCard}>
        <TouchableOpacity onPress={() => handleJobPress(item)}>
          <View style={styles.row}>
            <Image
              source={require('../../assests/Images/company.png')} // Placeholder image
              style={styles.companyLogo}
            />
            <View style={styles.jobDetails}>
              <Text style={styles.jobTitle}>
                {item.jobTitle.length > 28
                  ? `${item.jobTitle.substring(0, 28)}...`
                  : item.jobTitle}
              </Text>
              <Text style={styles.companyName}>{item.companyname}</Text>
            </View>
          </View>
          <View style={styles.tagRow}>
            <View style={[styles.tag, styles.locationContainer]}>
              <Image
                source={require('../../assests/Images/rat/loc.png')}
                style={styles.locationIcon}
              />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>
            <View style={styles.oval}>
              <Image
                source={require('../../assests/Images/rat/exp.png')}
                style={styles.brieficon}
              />
              <Text style={styles.ovalText}>
                Exp: {item.minimumExperience} - {item.maximumExperience} years
              </Text>
            </View>
            <Text style={styles.tag}>
              ₹ {item.minSalary.toFixed(2)} - {item.maxSalary.toFixed(2)} LPA
            </Text>
            <Text style={styles.tag}>{item.employeeType}</Text>
          </View>
          <Text style={styles.postedOn}>
            Posted on {formatDate(item.creationDate)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Format creation date
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const formatDate = (dateArray: [number, number, number]): string => {
    const [year, month, day] = dateArray;
    return `${monthNames[month - 1]} ${day}, ${year}`;
  };

  // Handle job press to navigate to JobDetails
  const handleJobPress = (job: JobData) => {
    navigation.navigate('JobDetails', { job });
  };

  // Get the first `visibleJobsCount` jobs
  const visibleJobs = jobs.slice(0, visibleJobsCount);

  // Render content based on active tab
  const  renderContent = () => {
    switch (activeTab) {
      case 'recommended':
        return (
          <FlatList
            data={filterAppliedJobs(visibleJobs)} // Filter and display only visible jobs
            renderItem={renderJobs}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={loadMoreJobs} // Load more jobs when the user scrolls to the bottom
            onEndReachedThreshold={0.5} // Trigger when the user is 50% from the bottom
            ListEmptyComponent={
              !loading && jobs.length === 0 ? (
                <Text style={styles.placeholderText}>No recommended jobs found!</Text>
              ) : null
            }
            ListFooterComponent={
              loading ? (
                <ActivityIndicator size="large" color="#FF8C00" />
              ) : null
            }
          />
        );
      case 'applied':
        return <AppliedJobs />;
      case 'saved':
        return <SavedJobs />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.jobstextcon}>
        <Text style={styles.Jobstext}>Jobs</Text>
      </View>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recommended' && styles.activeTab]}
          onPress={() => handleTabPress('recommended')}
        >
          <Text
            style={[
              styles.tabText, styles.rightAlignedText,
              activeTab === 'recommended' && styles.activeTabText,
            ]}
          >
            Recommended Jobs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'applied' && styles.activeTab]}
          onPress={() => handleTabPress('applied')}
        >
          <Text
            style={[
              styles.tabText, styles.rightAlignedText,
              activeTab === 'applied' && styles.activeTabText,
            ]}
          >
            Applied Jobs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
          onPress={() => handleTabPress('saved')}
        >
          <Text
            style={[
              styles.tabText, styles.rightAlignedText,
              activeTab === 'saved' && styles.activeTabText,
            ]}
          >
            Saved Jobs
          </Text>
        </TouchableOpacity>
      </View>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    top: 0,
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
    fontFamily:'PlusJakartaSans-Medium'
  },
  Jobstext: {
    marginLeft: 22,
    marginBottom: 10,
    marginTop:12,
    fontFamily:'PlusJakartaSans-Bold',
    color:'#0D0D0D',
  },
  jobstextcon:{
    backgroundColor:'white'
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
  scrollContainer: {
    padding: 16,
  },
  rightAlignedText: {
    marginLeft: 20, // Adjust this value to set how far you want to move the text to the right
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    margin:12,
    marginBottom:0,
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
  placeholderText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
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
    fontWeight:600,
    color: 'rgba(83, 83, 83, 0.80)',
    marginVertical: 4,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 12,
    marginTop: 6
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
    fontFamily:'PlusJakartaSans-Medium'
  },
  tag: {
    backgroundColor: '#f6f6f6',
    color: 'black',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 50,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 8,
    fontFamily:'PlusJakartaSans-Medium'
  },
  postedOn: {
    color: '#979696', // Text color
    fontFamily: 'PlusJakartaSans-Medium', // Custom font
    fontSize: 8, // Font size
    fontStyle: 'normal', // Font style
    fontWeight: '500', // Font weight
    lineHeight: 23.76, // Line height (in points, not percentage)
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#F97316',
    
    
  },
  tabText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 10,
    fontFamily:'PlusJakartaSans-Bold'
  },
  activeTabText: {
    color: '#F97316',
    marginLeft: 12,
    fontFamily:'PlusJakartaSans-Bold'
 
  },
});
 
export default RecommendedJobs;