import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView,ActivityIndicator} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Ensure this is imported
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { saveJob, applyJob } from '../../services/Jobs/JobDetails'; // Import API functions
import { JobData } from '../../models/Jobs/ApplyJobmodel'; // Import types
import { RootStackParamList } from '../../../New';
import { useAuth } from '../../context/Authcontext';
import SemiCircleProgress from '../../components/progessBar/SemiCircularProgressBar';
import { ProfileService } from '../../services/profile/ProfileService';
import { fetchJobDetails } from '../../services/Jobs/RecommendedJobs';
import { Linking } from 'react-native';
import Toast from 'react-native-toast-message';

// Type for navigation prop
type JobDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'JobDetails'>;

// Type for route prop
type JobDetailsScreenRouteProp = RouteProp<RootStackParamList, 'JobDetails'>;

type JobDetailsProps = {
  route: JobDetailsScreenRouteProp;
  navigation: JobDetailsScreenNavigationProp;
};

const JobDetails: React.FC<JobDetailsProps> = ({ route, navigation }) => {
  const { job } = route.params; // job data passed from the previous screen
  const [isJobSaved, setIsJobSaved] = useState(false);
  const { userToken, userId } = useAuth();
  const [isJobApplied, setIsJobApplied] = useState(false);
  const [skills, setSkills] = useState<string[]>([]); // Explicitly setting the type as string[]
  const [suggestedCourses, setSuggestedCourses] = useState<string[]>([]);
  const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
  const [percent, setPercent] = useState<number>(0);
  const [skillProgressText, setSkillProgressText] = useState<string | null>(null);
  const [perfectMatchSkills, setPerfectMatchSkills] = useState<string[]>([]); // State for perfect match skills
  const [unmatchedSkills, setUnmatchedSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state


  const courseImages: Record<string, any> = {
    "HTML&CSS": require('../../assests/Images/Html&Css.png'),
    "JAVA": require('../../assests/Images/Java1.png'),
    "JAVASCRIPT": require('../../assests/Images/JavaScript.png'),
    "MYSQL": require('../../assests/Images/Mysqll.png'),
    "REACT": require('../../assests/Images/React.png'),
    "SPRINGBOOT": require('../../assests/Images/SpringBoot.png'),
    "PYTHON": require('../../assests/Images/python.png'),
  };
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const formatDate = (dateArray: [number, number, number]): string => {
    const [year, month, day] = dateArray;
    return `${monthNames[month - 1]} ${day}, ${year}`;
  };
  const courseUrlMap: Record<string, any> = {
    "HTML&CSS": "https://upskill.bitlabs.in/course/view.php?id=9",
    "JAVA": "https://upskill.bitlabs.in/course/view.php?id=22",
    "PYTHON": "https://upskill.bitlabs.in/course/view.php?id=7",
    "MYSQL": "https://upskill.bitlabs.in/course/view.php?id=8",
    "JAVASCRIPT": "https://upskill.bitlabs.in/course/view.php?id=47",
    "REACT": "https://upskill.bitlabs.in/course/view.php?id=21",
    "SPRING BOOT": "https://upskill.bitlabs.in/course/view.php?id=23"
  };

  useEffect(() => {

    const fetchProfileData = async () => {
      try {
        const profileData = await ProfileService.fetchProfile(userToken, userId);
        const applicantSkills = profileData.skillsRequired.map((skill: { skillName: string }) =>
          skill.skillName.toUpperCase()
        );

        // Storing applicant skills
        console.log("Applicant Skills:", applicantSkills);
        const jobData = await fetchJobDetails(job.id, userId, userToken);
        console.log(jobData);
        setSkillProgressText(jobData.matchStatus);
        const Scourse = jobData.sugesstedCourses;

        // setSkills(job.skillsRequired.map((skill:any) => skill.skillName as string));
        setSkills(job.skillsRequired.map((skill: { skillName: string }) => skill.skillName.toUpperCase()));
        setSuggestedCourses(Scourse);

        const matchPercentage = jobData.matchPercentage;
        const skillsRequired = jobData.skillsRequired.map(skill => skill.skillName.toUpperCase());
        // const matchskill = jobData.matchedSkills.map(skill => skill.skillName.toUpperCase());
        // console.log("matchskill", matchskill);
        console.log("skillsrequired", skillsRequired);



        //   const perfectMatchedSkills = applicantSkills.filter((skill:any) => combinedSkills.includes(skill));

        // // Find unmatched skills
        // const unmatchedSkills = combinedSkills.filter(skill => !applicantSkills.includes(skill));


        setPerfectMatchSkills(jobData.matchedSkills.map((skill:any)=>skill.skillName));
        setUnmatchedSkills(skillsRequired);
        //   const matchPercentage = (perfectMatchedSkills.length / combinedSkills.length) * 100;
        console.log(matchPercentage);
        setPercent(matchPercentage);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [job.id, userId, userToken]);

  const handleSaveJob = async () => {
    try {
      const result = await saveJob(job.id, userId, userToken);
      if (result) {
        setIsJobSaved(true);
        // Alert.alert('Success', 'Job saved successfully!');
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Job saved successfully!',
        });
      }
    } catch (error) {
      console.error('Error saving job:', error);
      // Alert.alert('Error', 'Failed to save job.');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save job.',
      });
    }
  };

  const handleApplyJob = async () => {
    try {
      const result = await applyJob(userId, job.id, userToken);
      if (result) {
        setIsJobApplied(true);
        // Alert.alert('Success', 'Job application submitted successfully!');
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Job application submitted successfully!',
          visibilityTime: 5000, // Set toast visibility duration to 5 seconds
        });
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      // Alert.alert('Error', 'Failed to apply for job.');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to apply for job.',
        visibilityTime: 5000, // Set toast visibility duration to 5 seconds
      });
    }
  };
  <View style={isLoading ? styles.loader : null}>
  {isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
</View>

  // const percentageMatch = matchPercentage;

  return (

    <View style={styles.container}>
    
      <ScrollView>
      <View style={styles.jobCard}>
        <View style={styles.row}>
          <Image
            source={{ uri: 'https://via.placeholder.com/50' }} // Replace with actual company logo URL
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
            ₹ {job.minSalary} - ₹ {job.maxSalary} LPA
          </Text>
          <Text style={styles.tag}>{job.employeeType}</Text>
        </View>
        <Text style={styles.postedOn}>
          Posted on {formatDate(job.creationDate)}
        </Text>
      </View>
      <View style={styles.jobCard}>
        <Text style={[styles.jobdestitle, { marginBottom: 16 }]}>Skill Match Probability</Text>
        <Text style={styles.message}>
          The more the probability, the more are the chances to get hired.
        </Text>
        <SemiCircleProgress percentage={percent} />

        <View>
          <View style={styles.centeredView}>
            <Text style={styles.centeredText}>{skillProgressText}</Text>
          </View>
        </View>

        {/* <View style={styles.skillsContainer}>
          {skills.map((skill: string, index: number) => (
            <Text key={index} style={matchedSkills.includes(skill) ? [styles.skillTag, styles.matchedSkill] : styles.skillTag}>
              {skill}
            </Text>
          ))}
        </View> */}
        {/* <View style={styles.skillsContainer}>
  {skills
    .filter(skill => perfectMatchSkills.includes(skill))
    .map((skill, index) => (
      <Text key={index} style={[styles.skillTag, styles.matchedSkills]}>
        {skill}
      </Text>
    ))}
  
  {skills
    .filter(skill => unmatchedSkills.includes(skill))
    .map((skill, index) => (
      <Text key={index} style={[styles.skillTag, styles.unmatchedSkill]}>
        {skill}
      </Text>
    ))}
</View> */}

        <View style={styles.skillsContainer}>
          {/* Perfectly Matched Skills */}
          {perfectMatchSkills.length > 0 && (
            <View style={styles.skillRow}>
              {perfectMatchSkills.map((skill, index) => (
                <Text key={index} style={[styles.skillTag, styles.matchedSkills]}>
                  {skill}
                </Text>
              ))}
            </View>

          )}

          {/* Unmatched Skills */}
{unmatchedSkills.length > 0 && (
  <View style={styles.skillRow}>
    {unmatchedSkills.map((skill, index) => (
      <View key={index} style={styles.unmatchedSkillContainer}>
        {/* Add an image before the skill text */}
        <Image
          source={require('../../assests/Images/alert-circle.png')} // Replace with the actual image path
          style={styles.unmatchedSkillIcon} // Define this style as needed
        />
        <Text style={styles.unmatchedSkill}>
          {skill}
        </Text>
      </View>
    ))}
  </View>
)}


       
        </View>

      </View>
      <View style={styles.jobCard}>
            <Text style={styles.jobdestitle}>Full Job Description</Text>
      <ScrollView style={styles.descriptionContainer}>
        <Text style={styles.description}>
          {job.description.replace(/<[^>]+>/g, '')}
        </Text>
      </ScrollView>
              
            </View>

      {/* Suggested Courses Container */}
      {suggestedCourses && suggestedCourses.length > 0 && (
        <View style={styles.jobCard}>
          <Text style={styles.jobdestitle}>Suggested Courses</Text>
          <View>
            {suggestedCourses.map((course, index) => (
              <View key={index} style={styles.courseCard}>
                {/* Check if the course has a matching image */}
                {courseImages[course] ? (
                  <TouchableOpacity
                    style={styles.imageRow}
                    onPress={() => Linking.openURL(courseUrlMap[course])}
                  >
                    <Image
                      source={courseImages[course]}
                      style={styles.courseImage}
                    />
                    <Image source={require('../../assests/Images/external-link2.png')} style={styles.externalLinkIcon} />

                  </TouchableOpacity>
                ) : (
                  <Text style={styles.fallbackText}>Image not found</Text>
                )}
                <Toast />
              </View>

            ))}
          </View>
        </View>
      )}
</ScrollView>

      <View style={styles.footerContainer}>
        {/* Save Job Button */}
        {isJobSaved ? (
          <TouchableOpacity style={[styles.button, styles.appliedButton]} disabled>
            <Text style={styles.appliedButtonText}>Saved</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSaveJob}
          >
            <View style={styles.buttonContent}>
        <Image
          source={require('../../assests/Images/bookmark.png')} // Replace with your image path
          style={styles.buttonImage}
        />
        <Text style={styles.buttonText}>Save Job</Text>
      </View>
          </TouchableOpacity>
        )}

        {/* Apply Now Button */}
        {isJobApplied ? (
          <TouchableOpacity style={[styles.button, styles.appliedButton]} disabled>
            <Text style={styles.appliedButtonText}>Applied</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.applyButton]}
            onPress={handleApplyJob}
          >
            <LinearGradient
              colors={['#F97316', '#FAA729']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.button, styles.applyButtonGradient]}
            >
              <Text style={styles.applybuttonText}>Apply Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    justifyContent:'space-between',
  },
  jobdestitle: {
    color: '#F46F16',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  appliedButton: {
    backgroundColor: '#d3d3d3', // Gray background for "Applied"
    marginLeft: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#a9a9a9',
  },
  appliedButtonText: {
    color: '#555', // Gray text for "Applied"
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    flexShrink:1,
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
  saveIcon: {
    width: 12, // Adjust size as needed
    height: 12,
    marginRight: 8, // Space between icon and text
  },
  scrollContainer: {
    padding: 16,
    flexGrow:1,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  progressText: {
    marginRight:30,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBar: {
    marginVertical: 8,
  },
  matchedSkill: {
    backgroundColor: '#498C07',

  },

  circleProgress: {
    transform: [{ rotate: '0deg' }], // Rotate to start progress from the bottom
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(236, 78, 29, 0.7)',
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginLeft: 16,
    marginTop: 10,
    marginRight: 13
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  jobDetails: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  companyName: {
    fontSize: 14,
    color: '#888',
    marginVertical: 4,
  },
  externalLinkIcon: {
    width: 24,
    height: 24,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 9,
    color: 'black',
  },
  tag: {
    backgroundColor: '#f6f6f6',
    color: 'black',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 50,
    marginRight: 10,
    marginBottom: 8,
    fontSize: 9
  },
  skillTags: {
    backgroundColor: '#f6f6f6',  // Light background color for the tag
    padding: 10,
    margin: 5,
    borderRadius: 8,               // Rounded corners
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseImage: {
    // width: '70%',                  // Adjust width to fit the image
    height: 50,                 // Maintain aspect ratio
    resizeMode: 'contain',
    // Ensures the image covers the full area
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingRight: 10,
  },
  postedOn: {
    fontSize: 12,
    color: '#888',
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
    borderBottomColor: '#FF8C00',
  },
  tabText: {
    fontSize: 14,
    color: '#888',
  },
  activeTabText: {
    color: '#FF8C00',
    fontWeight: 'bold',
  },
  footerContainer: {
    flexDirection: 'row',
    position: 'relative',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    height: 80,
    paddingHorizontal: 10,
    justifyContent: 'space-evenly',
    alignItems: 'center',
   
  },
  button: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderColor: '#F97316'
  },
  saveButton: {
    backgroundColor: 'white',
    marginRight: 5,
    borderColor: '#F46F16',
    borderWidth: 1,
    borderRadius: 8,
  },
  applyButton: {
    marginLeft: 5,
    marginRight: 10
  },
  applyButtonGradient: {
    borderRadius: 10,
    flex:1,
    width:'100%'
  },
  buttonText: {
    color: '#F46F16',
    fontWeight: 'bold',
  },
  locationIcon: {
    width: 8,
    height: 8,
    marginRight: 4,
  },
  applybuttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  skillMatchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  semiCircle: {
    width: 120,
    height: 60,
    borderRadius: 60,
    backgroundColor: '#FF8C00',
    overflow: 'hidden', // Keep contents within bounds
    justifyContent: 'center',
    alignItems: 'center',

  },
  skillMatchText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 27.27,
    textAlign: 'center',
    textDecorationStyle: 'solid',
    textDecorationColor: 'transparent',
    color: '#fff',
    marginLeft: 8,
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  requiredSkills: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Align items to the start
    alignItems: 'center', // Vertically center items
  },
  skillTag: {
    flex: 0,
    backgroundColor: '#F46F16',
    color: 'white',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 4,
    fontSize: 14,
    textAlign: 'center',
  },
  skillRow: {
    flex: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  courseTitle: {
    fontSize: 14,
    color: '#333',
  },
  fallbackText: {
    fontSize: 12,
    color: 'red',
  },
  centeredView: {
    justifyContent: "center",
    alignSelf: "center",
    marginLeft: -20,

  },
  centeredText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 35.27,
    
    marginRight:'5%',
    color: '#000000',
  },
  matchedSkills: {
    color: '#fff',
    backgroundColor: '#498C07',
    fontSize: 12,
  },

  unmatchedSkill: {
    color: '#fff',
   
    fontSize: 12,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonImage: {
    width: 20, // Set the desired width
    height: 20, // Set the desired height
    marginRight: 8, // Add some space between the image and text
  },
  unmatchedSkillIcon: {
    width: 16, // Adjust width as needed
    height: 16, // Adjust height as needed
    marginRight: 8, // Space between image and text
  },
  skillContainer: {
    flexDirection: 'row', // Ensures image and text are side by side
    alignItems: 'center', // Aligns items vertically in the center
    marginBottom: 8, // Space between skill items
  },
  unmatchedSkillContainer: {
    flexDirection: 'row', // Align image and text side by side
    alignItems: 'center', // Vertically center image and text
    backgroundColor: '#BF2308', // Red background
    paddingHorizontal: 8, // Add padding to the sides
    paddingVertical: 4, // Add padding to the top and bottom
    borderRadius: 10, // Rounded corners
    marginRight: 8, // Space between skill tags
    marginBottom: 4, // Space between rows of skills
  },
  descriptionContainer: {
    maxHeight: 150, // Set max height for the scrollable container
  }
  


});

export default JobDetails;