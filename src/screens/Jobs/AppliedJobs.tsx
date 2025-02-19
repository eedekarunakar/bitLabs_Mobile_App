import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { useAppliedJobsViewModel } from "../../viewmodel/jobs/AppliedJob";
import { JobData } from "@models/Model";
import { useAuth } from "../../context/Authcontext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@models/Model";
 
const AppliedJobs = () => {
  const { userId, userToken } = useAuth();
  const { appliedJobs, loading, error } = useAppliedJobsViewModel(
    userId,
    userToken
  );
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, "AppliedJobs">
    >();
 
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const formatDate = (dateArray: [number, number, number]): string => {
    const [year, month, day] = dateArray;
    return `${monthNames[month - 1]} ${day}, ${year}`;
  };
 
  // Renders each job item
  const renderJobItem = ({ item }: { item: JobData }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => navigation.navigate("JobDetailsScreen", { job: item })}
    >
      <View style={styles.row}>
        <Image
          source={require("../../assests/Images/company.png")}
          style={styles.companyLogo}
        />
        <View style={styles.jobDetails}>
          <Text style={styles.jobTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.jobTitle}
          </Text>
          <Text style={styles.companyName}>{item.companyname}</Text>
        </View>
      </View>
 
      <View style={[styles.tag, styles.locationContainer]}>
        <Image
          source={require("../../assests/Images/rat/loc.png")}
          style={styles.locationIcon}
        />
        <Text style={styles.locationText}>{item.location}</Text>
      </View>
 
           <View style={{ flexDirection: 'row',justifyContent:'flex-start', flexWrap: 'nowrap', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                    <Image
                      source={require('../../assests/Images/rat/exp.png')}
                      style={styles.brieficon}
                    />
                    <Text style={styles.ovalText}>
                      Exp: {item.minimumExperience} - {item.maximumExperience} years    
                    </Text>
                    <Text style={{color:'#E2E2E2',fontFamily: 'PlusJakartaSans-Bold'}}>   |</Text>
                  </View>
       
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10,marginTop:1}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                      <Text style={{fontSize:13}}>₹ </Text>
                      <Text style={styles.ovalText}>{item.minSalary.toFixed(2)} - {item.maxSalary.toFixed(2)} LPA  </Text>
                      <Text style={{color:'#E2E2E2',fontFamily: 'PlusJakartaSans-Bold'}}>   |</Text>
                    </View>
       
                       
       
                  </View>
       
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.ovalText}>{item.employeeType}</Text>
                  </View>
                </View>
      <View>
        <Text style={styles.postedOn}>Posted on {formatDate(item.creationDate)}</Text>
      </View>
    </TouchableOpacity>
  );
 
  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#FF8C00" />}
      {error && <Text style={styles.placeholderText}>{error}</Text>}
      {!loading && appliedJobs.length === 0 && (
        <Text style={styles.placeholderText}>No applied jobs available!</Text>
      )}
 
   
      <FlatList
        data={appliedJobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f6f6f6',
    top: 0,
    marginBottom: 112,
  },
  oval: {
    flexDirection: 'row',
    alignItems: 'center',
    // Background color for the oval
    paddingHorizontal: 12,
    paddingVertical: 6,
    // Makes the container oval
    //marginBottom: 8,
    marginTop: -35,
    marginRight: 3
  },
  ovalText: {
    fontSize: 11,
    color: 'black',
    fontFamily: 'PlusJakartaSans-Medium'
  },
  Jobstext: {
    marginLeft: 22,
    marginBottom: 10,
    marginTop: 12,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#0D0D0D',
  },
  jobstextcon: {
    backgroundColor: 'white'
  },
  brieficon: {
    height: 10,
    width: 12,
    marginRight: 8,
    marginLeft:8
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
    padding: 14,
    paddingHorizontal: 10,
    margin: 12,
    marginBottom: 0,
    //flexWrap:'nowrap'
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
    fontFamily:'PlusJakartaSans-Bold'
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
    flexWrap: 'nowrap'
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
    justifyContent: 'flex-start',
    marginBottom: 12,
    marginTop: 6,
 
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap'
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
  postedOn: {
    color: '#979696', // Text color
    fontFamily: 'PlusJakartaSans-Medium', // Custom font
    fontSize: 9, // Font size
    fontStyle: 'normal', // Font style
    marginLeft:'58%',
    lineHeight: 23.76, // Line height (in points, not percentage)
    marginTop:10,
    display:'flex'
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
    fontFamily: 'PlusJakartaSans-Bold'
  },
  activeTabText: {
    color: '#F97316',
    marginLeft: 12,
    fontFamily: 'PlusJakartaSans-Bold'
 
  },
});
 
export default AppliedJobs;