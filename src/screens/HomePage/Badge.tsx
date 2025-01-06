import React, { useState, useEffect ,useCallback} from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Import the useFocusEffect hook
import Navbar from '../../components/Navigation/Navbar';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import { useProfileViewModel } from '../../viewmodel/Profileviewmodel';
import { ProfileService } from '../../services/profile/ProfileService';
import { useAuth } from '../../context/Authcontext';


const { width } = Dimensions.get('window');



const Badge = ({ route, navigation }: any) => {
  const { isTestComplete } = route.params || { isTestComplete: false }; // Default to false if not passed
  const [selectedStep, setSelectedStep] = useState(1); // Default to Step 1 for new users
  const [timer, setTimer] = useState<null | { days: number, hours: number, minutes: number }>(null); // Set the initial timer in seconds
  const [timerState, setTimerState] = useState<any>({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Disable button initially if not complete
  const [isRetakeAvailable, setIsRetakeAvailable] = useState(false);
  const [testName, setTestName] = useState('');;
  const [testStatus, setTestStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const { userId, userToken } = useAuth();
  const [applicantSkillBadges, setApplicantSkillBadges] = useState<any[]>([]);
  const { profileData } = useProfileViewModel(userToken, userId);
  const applicant = profileData?.applicant || {};
  const { skillsRequired = [] } = profileData || {}; // Default to an empty array if skills are missing
  const [skillBadges, setSkillBadges] = useState<any[]>([]); // For storing the fetched skill badges data
  const [skillLoading, setSkillLoading] = useState(true); // Loading state for skill badges
  const API_BASE_URL = 'https://g23jza8mtp.ap-south-1.awsapprunner.com';

  const testImage: Record<string, any> = {
    Angular: require('../../assests/Images/Test/Angular.png'),
    Java: require('../../assests/Images/Test/Java.png'),
    C: require('../../assests/Images/Test/C.png'),
    'C++': require('../../assests/Images/Test/CPlusPlus.png'),
    'C Sharp': require('../../assests/Images/Test/CSharp.png'),
    CSS: require('../../assests/Images/Test/CSS.png'),
    Django: require('../../assests/Images/Test/Django.png'),
    DotNet: require('../../assests/Images/Test/Dot Net.png'),
    Flask: require('../../assests/Images/Test/Flask.png'),
    Hibernate: require('../../assests/Images/Test/Hibernate.png'),
    HTML: require('../../assests/Images/Test/HTML.png'),
    JavaScript: require('../../assests/Images/Test/JavaScript.png'),
    Jsp: require('../../assests/Images/Test/JSP.png'),
    'Manual Testing': require('../../assests/Images/Test/ManualTesting.png'),
    MongoDB: require('../../assests/Images/Test/MongoDB.png'),
    Python: require('../../assests/Images/Test/Python.png'),
    React: require('../../assests/Images/Test/React.png'),
    'Regression Testing': require('../../assests/Images/Test/RegressionTesting.png'),
    Selenium: require('../../assests/Images/Test/Selenium.png'),
    Servlets: require('../../assests/Images/Test/Servlets.png'),
    'Spring Boot': require('../../assests/Images/Test/SpringBoot.png'),
    TypeScript: require('../../assests/Images/Test/TypeScript.png'),
    Spring: require('../../assests/Images/Test/Spring.png'),
    SQL: require('../../assests/Images/Test/MySQL.png'),
    Css: require('../../assests/Images/Test/CSS.png')
  };

    const fetchTestStatus = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/applicant1/tests/${userId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${userToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Test Data:', data);

        if (Array.isArray(data) && data.length > 0) {
          // Assign default names for tests with empty testName
          data.forEach(test => {
            if (!test.testName || test.testName.trim() === '') {
              test.testName = 'General Aptitude Test'; // Default name
            }
          });
          const aptitudeTest = data.find(test => test.testName.toLowerCase().includes('aptitude'));
          const technicalTest = data.find(test => test.testName.toLowerCase().includes('technical'));
          console.log(aptitudeTest.testStatus)
          if (aptitudeTest) {
            if (aptitudeTest.testStatus === 'P') {
              if (technicalTest) {
                // If Technical Test exists, handle its status
                if (technicalTest.testStatus === 'P') {
                  setSelectedStep(3); // Both tests passed
                  setTestName('');
                  setTestStatus('');
                } else {
                  setSelectedStep(2); // Technical test failed
                  setTestName('Technical Test');
                  setTestStatus(technicalTest.testStatus);
                  const testDateTime = new Date(
                    technicalTest.testDateTime[0], // Year
                    technicalTest.testDateTime[1] - 1, // Month (0-based index)
                    technicalTest.testDateTime[2], // Day
                    technicalTest.testDateTime[3], // Hours
                    technicalTest.testDateTime[4], // Minutes
                    technicalTest.testDateTime[5] // Seconds
                  );
                  const retakeDate = new Date(testDateTime);
                  retakeDate.setDate(retakeDate.getDate() + 7); // Set the retake date to 7 days later
                  retakeDate.setHours(retakeDate.getHours() + 5); // Add 5 hours
                  retakeDate.setMinutes(retakeDate.getMinutes() + 30); // Add 30 minutes

                  const calculateTimeLeft = () => {
                    const now = new Date();
                    const difference = retakeDate.getTime() - now.getTime();

                    if (difference > 0) {
                      const timeLeft = {
                        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                      };
                      setTimer(timeLeft);
                      setIsButtonDisabled(true);; // Timer is still counting down
                    } else {
                      setTimer(null); // Timer has ended
                      setIsButtonDisabled(false);// Enable the button when timer ends
                    }
                  };

                  // Initial call and set interval for countdown
                  calculateTimeLeft();
                  const timerInterval = setInterval(calculateTimeLeft, 1000);

                  // Cleanup interval on component unmount
                  return () => clearInterval(timerInterval);
                }
              } else {
                // Aptitude test passed but no technical test yet
                setSelectedStep(2);
                setTestName('Technical Test');
                setTestStatus('');
              }
            } else {
              // Aptitude test failed
              setSelectedStep(1);
              setTestName('General Aptitude Test');
              setTestStatus(aptitudeTest.testStatus);
              const testDateTime = new Date(
                aptitudeTest.testDateTime[0], // Year
                aptitudeTest.testDateTime[1] - 1, // Month (0-based index)
                aptitudeTest.testDateTime[2], // Day
                aptitudeTest.testDateTime[3], // Hours
                aptitudeTest.testDateTime[4], // Minutes
                aptitudeTest.testDateTime[5] // Seconds
              );
              const retakeDate = new Date(testDateTime);
              retakeDate.setDate(retakeDate.getDate() + 7); // Set retake date to 7 days later
              retakeDate.setHours(retakeDate.getHours() + 5); // Add 5 hours
              retakeDate.setMinutes(retakeDate.getMinutes() + 30); // Add 30 minutes

              const calculateTimeLeft = () => {
                const now = new Date();
                const difference = retakeDate.getTime() - now.getTime();

                if (difference > 0) {
                  const timeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                  };
                  setTimer(timeLeft);
                  setIsButtonDisabled(true); // Disable button while timer is counting down
                } else {
                  setTimer(null); // Timer has ended
                  setIsButtonDisabled(false); // Enable button when timer ends
                }
              };

              // Initial call and set interval for countdown
              calculateTimeLeft();
              const timerInterval = setInterval(calculateTimeLeft, 1000);

              // Cleanup interval on component unmount or when the test status changes
              return () => {
                clearInterval(timerInterval);
              };
            }
          } else {
            // Default case if no aptitude test found
            setSelectedStep(1);
            setTestName('General Aptitude Test');
            setTestStatus('');
          }
        }
      } catch (error) {
        setSelectedStep(1);
        setTestName('General Aptitude Test');
      } finally {
        setLoading(false);
      }
    };

    const fetchSkillBadges = async () => {
      if (!userId || !userToken) {
        // Skip fetching if applicantId or jwtToken is null
        setSkillBadges([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/skill-badges/${userId}/skill-badges`, // Replace with your actual API endpoint
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${userToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch skill badges');
        }

        const data = await response.json();
        console.log('Skill Badge Data', data)
        setSkillBadges(data); // Set the fetched skill badges data
        setApplicantSkillBadges(data.applicantSkillBadges || []); // Set the fetched skill badges data
      } catch (error) {
        console.error('Error fetching skill badges:', error);
      } finally {
        setSkillLoading(false); // Set loading state to false once done
      }
    };

  useFocusEffect(
    useCallback(() => {
      // Reset all states or trigger re-fetching data
      fetchTestStatus();
      fetchSkillBadges();
      return () => {
        // Optional cleanup logic
      };
    }, [userId, userToken])
  );
   // This effect runs when userId or userToken changes
  useEffect(() => {
    const calculateTimers = () => {
      // Go through each badge and calculate its timer if the status is 'FAILED'
      applicantSkillBadges.forEach((badge: any) => {
        if (badge.status === 'FAILED') {
          const testDateTime = new Date(
            badge.testTaken[0], // Year
            badge.testTaken[1] - 1, // Month (0-based index)
            badge.testTaken[2], // Day
            badge.testTaken[3], // Hours
            badge.testTaken[4], // Minutes
            badge.testTaken[5] // Seconds
          );
          const retakeDate = new Date(testDateTime);
          retakeDate.setDate(retakeDate.getDate() + 7); // Set retake date to 7 days later
          retakeDate.setHours(retakeDate.getHours() + 5); // Add 5 hours
          retakeDate.setMinutes(retakeDate.getMinutes() + 30); // Add 30 minutes

          const timerId = badge.skillBadge.id; // Use skill badge ID as a unique identifier
          console.log(timerId)

          // Timer calculation function
          const calculateTimeLeft = () => {
            const now = new Date();
            const difference = retakeDate.getTime() - now.getTime();

            if (difference > 0) {
              const timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
              };

              setTimerState((prevState: any) => ({
                ...prevState,
                [badge.skillBadge.id]: timeLeft, // Track each badge's timer separately
              }));
            } else {
              setTimerState((prevState: any) => ({
                ...prevState,
                [badge.skillBadge.id]: null, // Timer ended
              }));
            }

          };

          // Start the timer
          calculateTimeLeft();
          const timerInterval = setInterval(calculateTimeLeft, 1000);

          // Clear the interval when the component unmounts or badge changes
          return () => clearInterval(timerInterval);
        }
      });
    };

    calculateTimers();
  }, [applicantSkillBadges]); // Run whenever applicantSkillBadges changes

  const handleTestAction = () => {
    if (!isButtonDisabled) {
      navigation.navigate('TestInstruction');
    }
  };

  if (loading) {
    return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
    )
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Navbar />
      <ScrollView horizontal={false} style={styles.mainScroll}>
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Verified Badges</Text>
          </View>

          {/* Pre-Screened Badge with Progress Bar */}
          <View style={selectedStep === 3 ? null : styles.box1}>
            {selectedStep === 3 ? (
              // Show this view when Step 3 is completed
              <View style={styles.badge}>
                <LinearGradient
                  colors={['#FFEAC4', '#FFF9D6']} // Set the gradient colors
                  style={styles.gradientBackground1} // Style to ensure the gradient takes the full width and height
                >
                  <Text style={[styles.content, { marginLeft: 10 }]}>Pre-Screenedbadge</Text>


                  {/* Image Section (Middle) */}
                  <View>
                    <Image
                      source={require('../../assests/Images/Test/Badge.png')}
                      style={styles.congratulationsImage}
                    />
                  </View>
                  {/* Congratulations Message */}
                  <Text style={styles.congratulationsMessage}>
                    Congratulations, You are now Verified
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                    <Text style={styles.name}>
                      {applicant.name
                        ? applicant.name.charAt(0).toUpperCase() + applicant.name.slice(1)
                        : 'Guest'}</Text>
                    <Image source={require('../../assests/Images/Test/verified.png')}
                      style={styles.verified} />
                  </View>

                </LinearGradient>
              </View>
            ) : (
              // Show the original view when Step 3 is not yet completed
              <View style={styles.badge1}>
                <Text style={styles.content}>Pre-Screened Badge</Text>
                <Text style={styles.matter1}>
                  Achieve your dream job faster by demonstrating your{"\n"}aptitude and technical skills
                </Text>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                  <View
                    style={[
                      styles.stepCircle,
                      { backgroundColor: selectedStep >= 1 ? 'green' : '#D9D9D9' },
                    ]}
                  >
                    {testName === 'General Aptitude Test' && testStatus === 'P' ? (
                      <Icon1 name="check" size={14} style={{ color: 'white' }} />
                    ) : (
                      <Text style={styles.stepText}>1</Text>
                    )}
                  </View>
                  <View
                    style={[
                      styles.stepLine,
                      { backgroundColor: selectedStep >= 2 ? 'green' : '#D9D9D9' },
                    ]}
                  />
                  <View
                    style={[
                      styles.stepCircle,
                      { backgroundColor: selectedStep >= 2 ? 'green' : '#D9D9D9' },
                    ]}
                  >
                    {testName === 'Technical Test' && testStatus === 'P' ? (
                      <Icon name="check" size={14} style={{ color: 'white' }} />
                    ) : (
                      <Text style={styles.stepText}>2</Text>
                    )}
                  </View>
                  <View
                    style={[
                      styles.stepLine,
                      { backgroundColor: selectedStep >= 3 ? 'green' : '#D9D9D9' },
                    ]}
                  />
                  <View
                    style={[
                      styles.stepCircle,
                      { backgroundColor: selectedStep >= 3 ? 'green' : '#D9D9D9' },
                    ]}
                  >
                    <Icon name="flag" size={12} style={{ color: selectedStep >= 3 ? 'white' : 'black' }} />
                  </View>
                </View>
                {/* Other Sections */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#434343', fontSize: 13 }}>     General{"\n"}Aptitude Test</Text>
                  <Text style={{ color: '#434343', fontSize: 13 }}>Technical{"\n"}    Test</Text>
                  <Text style={{ color: '#434343', fontSize: 13 }}>Verification{"\n"}    done</Text>
                </View>

                <View style={{ marginVertical: 30, flexDirection: 'column', alignItems: 'flex-start' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.content}>{testName}</Text>
                      <Text style={styles.matter1}>
                        A Comprehensive Assessment to{"\n"}Measure Your Analytical and{"\n"}Reasoning Skills
                      </Text>
                    </View>
                    <Image source={require('../../assests/Images/boyimage.png')} />
                  </View>

                  {/* TouchableOpacity */}
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <LinearGradient
                      colors={isButtonDisabled ? ['#d3d3d3', '#d3d3d3'] : ['#F97316', '#FAA729']} // Gradient colors
                      start={{ x: 0, y: 0 }} // Gradient start
                      end={{ x: 1, y: 0 }} // Gradient end
                      style={[
                        styles.gradientBackground,
                        isButtonDisabled && testName !== 'Technical Test' && styles.disabledButton, // Apply disabled styles only for non-technical t

                      ]}
                    >
                      <TouchableOpacity
                        // style={[styles.progressButton, isButtonDisabled && styles.disabledButton]}
                        style={[
                          styles.progressButton,
                          isButtonDisabled && testName !== 'Technical Test' && styles.disabledButton, // Apply disabled button styles
                          // Apply resizing only when it's not a Technical Test and the timer is present
                          testName === 'General Aptitude Test' && testStatus === 'F' && timer && styles.disabledButton,
                        ]}
                        onPress={() => {
                          if (!isButtonDisabled && selectedStep < 3) {
                            navigation.navigate('TestInstruction');
                          }
                          // If button is disabled (timer running), do nothing
                        }}
                        disabled={isButtonDisabled} // Disable the button when the timer is running
                      >
                        <Text style={styles.progressButtonText}>
                          Take Test
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                    {/* Timer Container placed beside the Button */}
                    {testName === 'General Aptitude Test' && testStatus === 'F' && timer && (
                      <View style={styles.timerContainer}>
                        <Text style={styles.timerText}>Retake test after{"\n"}
                          <Text style={styles.timerNumber}>{timer.days}</Text>
                          <Text style={styles.timerUnit}>d </Text>
                          <Text style={styles.timerNumber}>{timer.hours}</Text>
                          <Text style={styles.timerUnit}>hrs </Text>
                          <Text style={styles.timerNumber}>{timer.minutes}</Text>
                          <Text style={styles.timerUnit}>mins</Text>
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={{ alignSelf: 'center' }}>
                    {testName === 'Technical Test' && testStatus === 'F' && timer && (
                      <View style={styles.timerContainer1}>
                        <Text style={styles.timerText}>Retake test after{"   "}
                          <Text style={styles.timerNumber}>{timer.days}</Text>
                          <Text style={styles.timerUnit}>d </Text>
                          <Text style={styles.timerNumber}>{timer.hours}</Text>
                          <Text style={styles.timerUnit}>hrs </Text>
                          <Text style={styles.timerNumber}>{timer.minutes}</Text>
                          <Text style={styles.timerUnit}>mins</Text>
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Skill Badge</Text>
          </View>

          {/* Horizontal ScrollView for Cards */}
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {/* Mapping skillsRequired */}
            {skillsRequired.length > 0 ? (
              skillsRequired.map((skill: any, index: any) => (
                <View key={index} style={styles.card}>
                  <Image
                    source={testImage[skill.skillName] || require('../../assests/Images/Test/NotFound.png')}
                    style={styles.cardImage}
                  />
                  <Text style={styles.cardTitle}>{skill.skillName || 'Skill Name Not Available'}</Text>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate('TestInstruction', {
                        skillName: skill.skillName,
                        testType: 'SkillBadge',
                      })
                    }
                  >
                    <Text style={styles.buttonText}>Take Test</Text>
                    <Icon name="external-link" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noSkillsText}></Text>
            )}

            {/* Mapping applicantSkillBadges */}
            {applicantSkillBadges.length > 0 ? (
              applicantSkillBadges.map((badge: any) => {
                const { status, skillBadge } = badge;
                const isFailed = status === 'FAILED';
                const timer = timerState[skillBadge.id]; // Get the timer for the specific test

                return (
                  <View key={badge.id} style={styles.card}>
                    <Image
                      source={testImage[skillBadge.name] || require('../../assests/Images/Test/NotFound.png')}
                      style={styles.cardImage}
                    />
                    <Text style={styles.cardTitle}>{skillBadge.name}</Text>

                    {/* Status Display */}
                    <View style={styles.statusContainer}>
                      <Text
                        style={[
                          styles.badgeStatus,
                          status === 'PASSED' ? styles.passed : styles.failed,
                        ]}
                      >
                        {status === 'PASSED' ? 'Passed' : 'Failed'}
                      </Text>
                    </View>

                    {/* Button or Timer Display */}
                    {isFailed ? (
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {timer ? (
                          // Display the timer if it exists (countdown)
                          <LinearGradient
                            colors={['#d3d3d3', '#d3d3d3']} // Adjust colors based on your requirement
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.gradientBackground, styles.timerContain]} // Combine gradient styles with the timer container
                          >
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                              <Text style={styles.timerText1}>Retake test in:</Text>
                              <Text style={styles.timerText1}>
                                {timer.days}d {timer.hours}h {timer.minutes}m
                              </Text>
                            </View>
                          </LinearGradient>
                        ) : (
                          // Once timer is null, show the "Take Test" button

                          <View style={styles.cardFooter}>
                            <TouchableOpacity
                              style={styles.button}
                              onPress={() =>
                                navigation.navigate('TestInstruction', {
                                  skillName: skillBadge.name,
                                  testType: 'SkillBadge',
                                  timer: true, // Timer flag for failed tests
                                })
                              }
                            >
                              <Text style={styles.buttonText}>Retake Test</Text>
                              <Icon name="external-link" size={20} color="white" />
                            </TouchableOpacity>
                          </View>

                        )}
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[styles.button, styles.verifiedButton]}
                        disabled
                      >
                        <Text style={styles.verifiedText}>✔ Verified</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })
            ) : (
              <Text style={styles.noSkillsText}></Text>
            )}

          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Badge;
const styles = StyleSheet.create({
  mainScroll: {
    flex: 1,
  },
  container: {
    flexDirection: 'column',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    padding: 10,
    marginTop: 10,
    marginLeft: 24,
  },
  text: {
    fontWeight: '700',
    fontSize: 20,
    color: '#495057',
  },
  box1: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#FFFF',
    padding: 8,
  },
  badge1: {
    marginLeft: 10,
  },
  content: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 5,
  },
  matter1: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  stepCircle: {
    width: 20,
    height: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  stepText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
  },
  stepLine: {
    width: 117,
    height: 3,
    backgroundColor: '#BFBFBF',
  },
  gradientBackground: {
    marginTop: 20,
    borderRadius: 10,
    height: 40,
  },
  progressButton: {
    marginTop: 10,
    height: 40,
    width: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  progressButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 20,
  },
  horizontalScrollContent: {
    marginTop: 20,
    paddingBottom: 50,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    width: 197,
    height: 210,
    marginRight: 16,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    
    alignItems: 'center',
  },
  cardImage: {
    width: 100,
    height: 90,
    marginVertical: 10,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 30
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 0,
    width: 197,
    height: 40,
    backgroundColor: '#374A70',
    alignItems: 'center',
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 10,
  },
  gradientBackground1: {
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 8,
    height: 335
  },
  badge: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  congratulationsImage: {
    width: 102.95,
    height: 108.75,
    marginLeft: '35%',
    marginTop: 20
  },
  congratulationsMessage: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 600,
    fontSize: 18,
    lineHeight: 26,
    color: '#F67505',
    alignSelf: 'center'
  },
  name: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: 400,
    fontSize: 24,
    lineHeight: 26,
    color: '#000000'
  },
  verified: {
    width: 36.95,
    height: 37.29,
    marginLeft: 10
  },
  disabledButton: {
    width: width * 0.3,
    height: 40
  },
  timerContainer: {
    marginLeft: 15,
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
  },
  timerContainer1: {
    marginLeft: 15,
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'column',
  },
  timerText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: 400,
    color: '#6D6D6D',
    marginRight: 5, // Adding space between text and timer
    lineHeight: 26
  },
  timerNumber: {
    fontSize: 15, // Larger size for the numbers
    fontWeight: 700,
    lineHeight: 26,
    color: '#F3780D',
  },
  timerUnit: {
    fontSize: 10, // Larger size for the numbers
    fontWeight: 500,
    lineHeight: 26,
    color: '#F3780D', // Regular weight for units
  },
  noSkillsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  badgeStatus: {
    fontSize: 14,
    padding: 5,
    borderRadius: 5,
    textTransform: 'capitalize',
  },
  passed: {
    backgroundColor: '#d4edda',
    color: 'green',
  },
  failed: {
    backgroundColor: '#f8d7da',
    color: 'red',
  },
  badgeDate: {
    fontSize: 12,
    color: '#555',
  },
  statusContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  verifiedButton: {
    backgroundColor: 'green',
    justifyContent: 'center'
  },
  verifiedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  timerContain: {
    bottom: 0,
    width: 197,
    height: 40,
    alignItems: 'center',
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    flexDirection: 'row',
  },
  timerText1: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    fontWeight: 400,
    color: 'black',
    marginRight: 5, // Adding space between text and timer
    lineHeight: 23
  },
  cardFooter: {
    marginTop: 'auto', // Push the footer to the bottom of the card
    width: '100%',
    alignItems: 'center', // Center the button horizontally
    padding: 10
  }
});