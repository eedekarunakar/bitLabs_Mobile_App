import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
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
import Alertcircle from '../../assests/icons/Alertcircle';
import { Dimensions } from 'react-native';

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
  const width = Dimensions.get('window')

  const courseImages: Record<string, any> = {
    "HTML&CSS": require('../../assests/Images/Html&Css.png'),
    "JAVA": require('../../assests/Images/Java1.png'),
    "JAVASCRIPT": require('../../assests/Images/JavaScript.png'),
    "MYSQL": require('../../assests/Images/Mysql.png'),
    "REACT": require('../../assests/Images/React.png'),
    "SPRING BOOT": require('../../assests/Images/SpringBoot.png'),
    "PYTHON": require('../../assests/Images/python.png'),
  };
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Format creation date
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
        // const matchskill = jobData.matchedSkills.map(skill =>skill.skillName.toUpperCase());
        // console.log("matchskill",matchskill);
        console.log("skillsrequired", skillsRequired);



        //   const perfectMatchedSkills = applicantSkills.filter((skill:any) => combinedSkills.includes(skill));

        // // Find unmatched skills
        // const unmatchedSkills = combinedSkills.filter(skill => !applicantSkills.includes(skill));


        //  setPerfectMatchSkills(matchskill);
        setPerfectMatchSkills(jobData.matchedSkills.map((skill: any) => skill.skillName));
        setUnmatchedSkills(skillsRequired);
        //   const matchPercentage = (perfectMatchedSkills.length / combinedSkills.length) * 100;
        console.log(matchPercentage);
        setPercent(matchPercentage);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [job.id, userId, userToken]);


  // const percentageMatch = matchPercentage;

  return (

    <View style={styles.container}>
      <ScrollView>
        <View style={styles.jobCard}>
          <View style={styles.row}>
            <Image
              source={require('../../assests/Images/company.png')}
              style={styles.companyLogo}
            />
            <View style={styles.jobDetails}>
              <Text style={styles.jobTitle}>{job.jobTitle}</Text>
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

          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'nowrap', alignItems: 'center', marginLeft: 10 }}>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
              <Image
                source={require('../../assests/Images/rat/exp.png')}
                style={styles.brieficon}
              />
              <Text style={styles.ovalText}>
                Exp: {job.minimumExperience} - {job.maximumExperience} years
              </Text>
              <Text style={{ color: '#E2E2E2' }}>  |</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginTop: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans-Medium' }}>₹ </Text>
                <Text style={styles.ovalText}>{job.minSalary.toFixed(2)} -  {job.maxSalary.toFixed(2)} LPA  </Text>
                <Text style={{ color: '#E2E2E2' }}>  |</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans-Medium' }}>{job.employeeType}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.postedOn}>Posted on {formatDate(job.creationDate)}</Text>
          </View>
        </View>
        <View style={styles.jobCard}>
          <Text style={[styles.jobdestitle, { marginBottom: 16 }]}>Skill Match Probability</Text>
          <Text style={styles.message}>
            The more the probability, the more are the chances to get hired.
          </Text>
          <SemiCircleProgress percentage={percent} />

          <View>
            <View style={styles.centeredView}>
              <Text style={[styles.centeredText]}>{skillProgressText}</Text>
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
            {perfectMatchSkills.map((skill, index) => (
              <Text key={`perfect-${index}`} style={[styles.skillTag, styles.matchedSkills,]}>
                {skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase()}
              </Text>
            ))}
            {unmatchedSkills.map((skill, index) => (
              <View key={`unmatched-${index}`} style={[styles.unmatchedSkillContainer, { flexDirection: 'row', alignItems: 'center' }]}>
                <Alertcircle height={16} width={16} style={[styles.unmatchedSkillIcon, { marginRight: 4 }]} />
                <Text style={[styles.unmatchedSkill]}> {skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase()}</Text>
              </View>
            ))}
          </View>

        </View>

        <View style={styles.jobCard}>
          <Text style={styles.jobdestitle}>Full Job Description</Text>

          <Text style={styles.description}>
            {job.description.replace(/<[^>]+>/g, '')}
          </Text>


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

                </View>

              ))}
            </View>
          </View>
        )}
      </ScrollView>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  jobdestitle: {
    color: '#F46F16',
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 14,
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
    fontFamily: 'PlusJakartaSans-Medium',
  },
  oval: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
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
  saveIcon: {
    width: 12, // Adjust size as needed
    height: 12,
    marginRight: 8, // Space between icon and text
  },
  scrollContainer: {
    padding: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  progressText: {
    marginLeft: 10,
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
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 8,
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
    color: '#333',
    fontFamily: 'PlusJakartaSans-Bold'
  },
  companyName: {
    fontSize: 14,
    color: '#888',
    marginVertical: 4,
    fontFamily: 'PlusJakartaSans-Medium'
  },
  externalLinkIcon: {
    width: 24,
    height: 24,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 11,
    color: 'black',
    fontFamily: 'PlusJakartaSans-Medium'
  },
  tag: {

    color: 'black',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 50,
    marginRight: 3,
    marginBottom: 8,
    fontSize: 8.5,
    fontFamily: 'PlusJakartaSans-Medium'
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
    color: '#979696', // Text color
    fontFamily: 'PlusJakartaSans-Medium', // Custom font
    fontSize: 9, // Font size
    fontStyle: 'normal', // Font style
    lineHeight: 23.76, // Line height (in points, not percentage)
    marginTop: 10,
    display: 'flex',
    marginLeft: '50%'
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
    fontFamily: 'PlusJakartaSans-Bold'
  },
  activeTabText: {
    color: '#FF8C00',
    fontFamily: 'PlusJakartaSans-Bold'
  },
  footerContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    height: 80,
    paddingHorizontal: 10,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: -2 },
    elevation: 5,
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
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 8,
  },
  applyButton: {
    backgroundColor: '#FF8C00',
    marginLeft: 5,
    marginRight: 10
  },
  buttonText: {
    color: 'orange',
    fontFamily: 'PlusJakartaSans-Bold'
  },
  locationIcon: {
    width: 11,
    height: 12,
    marginRight: 4,
  },
  applybuttonText: {
    color: 'white',
    fontFamily: 'PlusJakartaSans-Bold'
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
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 20,
    lineHeight: 27.27,
    textAlign: 'center',
    textDecorationStyle: 'solid',
    textDecorationColor: 'transparent',
    color: '#fff',
    marginLeft: 8,
  },
  message: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontFamily: 'PlusJakartaSans-Medium'
  },
  requiredSkills: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    fontFamily: 'PlusJakartaSans-Medium'
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
    padding: 3,
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
    fontFamily: 'PlusJakartaSans-Bold'
  },
  fallbackText: {
    fontSize: 12,
    color: 'red',
    fontFamily: 'PlusJakartaSans-Medium'
  },
  centeredView: {
    justifyContent: "center",
    alignSelf: "center",
    marginLeft: -20,
    

  },
  centeredText: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 15,
    lineHeight: 35.27,
    textAlign: 'left',
    color: '#000000',
    
    
  },
  matchedSkills: {
    color: '#fff',
    backgroundColor: '#498C07',
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Medium',
  },

  unmatchedSkill: {
    color: '#fff',
    backgroundColor: '#BF2308',
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  unmatchedSkillContainer: {
    flexDirection: 'row', // Align image and text side by side
    alignItems: 'center', // Vertically center image and text
    backgroundColor: '#BF2308', // Red background
    padding: 3, // Add padding to the top and bottom
    borderRadius: 10, // Rounded corners
    marginRight: 8, // Space between skill tags
    marginBottom: 4, // Space between rows of skills
  },
  unmatchedSkillIcon: {
    width: 16, // Adjust width as needed
    height: 16, // Adjust height as needed
    marginRight: 8, // Space between image and text
  },




});

export default JobDetails;