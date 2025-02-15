import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Import the useFocusEffect hook
import Navbar from '@components/Navigation/Navbar';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useProfileViewModel } from '@viewmodel/Profileviewmodel';
import { useAuth } from '@context/Authcontext';
import API_BASE_URL from '@services/API_Service';

const { width } = Dimensions.get('window');



const Badge = ({ navigation }: any) => {
  const [selectedStep, setSelectedStep] = useState(1); // Default to Step 1 for new users
  const [timer, setTimer] = useState<null | { days: number, hours: number, minutes: number }>(null); // Set the initial timer in seconds
  const [timerState, setTimerState] = useState<any>({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Disable button initially if not complete
  const [testName, setTestName] = useState('');;
  const [testStatus, setTestStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const { userId, userToken } = useAuth();
  const [applicantSkillBadges, setApplicantSkillBadges] = useState<any[]>([]);
  const { profileData } = useProfileViewModel(userToken, userId);
  const applicant = profileData?.applicant || {};
  const { skillsRequired = [] } = profileData || {}; // Default to an empty array if skills are missing



  const testImage: Record<string, any> = {
    Angular: require('../../assests/Images/Test/Angular.png'),
    Java: require('../../assests/Images/Test/Java.png'),
    C: require('../../assests/Images/Test/C.png'),
    'C++': require('../../assests/Images/Test/CPlusPlus.png'),
    'C Sharp': require('../../assests/Images/Test/CSharp.png'),
    CSS: require('../../assests/Images/Test/CSS.png'),
    Django: require('../../assests/Images/Test/Django.png'),
    '.Net': require('../../assests/Images/Test/DotNet.png'),
    Flask: require('../../assests/Images/Test/Flask.png'),
    Hibernate: require('../../assests/Images/Test/Hibernate.png'),
    HTML: require('../../assests/Images/Test/HTML.png'),
    JavaScript: require('../../assests/Images/Test/JavaScript.png'),
    JSP: require('../../assests/Images/Test/JSP.png'),
    'Manual Testing': require('../../assests/Images/Test/ManualTesting.png'),
    'Mongo DB': require('../../assests/Images/Test/MongoDB.png'),
    Python: require('../../assests/Images/Test/Python.png'),
    React: require('../../assests/Images/Test/React.png'),
    'Regression Testing': require('../../assests/Images/Test/RegressionTesting.png'),
    Selenium: require('../../assests/Images/Test/Selenium.png'),
    Servlets: require('../../assests/Images/Test/Servlets.png'),
    'Spring Boot': require('../../assests/Images/Test/SpringBoot.png'),
    TypeScript: require('../../assests/Images/Test/TypeScript.png'),
    Spring: require('../../assests/Images/Test/Spring.png'),
    SQL: require('../../assests/Images/Test/MySQL.png'),
    Css: require('../../assests/Images/Test/CSS.png'),
    MySQL: require('../../assests/Images/Test/MySQL.png'),
    Vue: require('../../assests/Images/Test/Vue.png'),
    'SQL-Server': require('../../assests/Images/Test/sqlserver.png'),

  };

  const calculateRetakeDate = (testDateTimeArray: number[]) => {
    const testDateTime = new Date(
      testDateTimeArray[0], // Year
      testDateTimeArray[1] - 1, // Month (0-based index)
      testDateTimeArray[2], // Day
      testDateTimeArray[3], // Hours
      testDateTimeArray[4], // Minutes
      testDateTimeArray[5] // Seconds
    );

    const retakeDate = new Date(testDateTime);
    retakeDate.setDate(retakeDate.getDate() + 7); // Retake after 7 days
    retakeDate.setHours(retakeDate.getHours() + 5); // Add 5 hours
    retakeDate.setMinutes(retakeDate.getMinutes() + 30); // Add 30 minutes

    return retakeDate;
  };

  const startTimer = (retakeDate: Date, badgeId?: number) => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = retakeDate.getTime() - now.getTime();

      if (difference > 0) {
        const timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        };

        if (badgeId) {
          setTimerState((prevState: any) => ({
            ...prevState,
            [badgeId]: timeLeft,
          }));
        } else {
          setTimer(timeLeft);
          setIsButtonDisabled(true);
        }
      } else {
        if (badgeId) {
          setTimerState((prevState: any) => ({
            ...prevState,
            [badgeId]: null,
          }));
        } else {
          setTimer(null);
          setIsButtonDisabled(false);
        }
      }
    };

    calculateTimeLeft();
    return setInterval(calculateTimeLeft, 1000);

  };

  const fetchTestStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/applicant1/tests/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

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
          if (aptitudeTest.testStatus === 'P' || aptitudeTest.testStatus === 'p') {
            if (technicalTest) {
              // If Technical Test exists, handle its status
              if (technicalTest.testStatus === 'P'|| technicalTest.testStatus === 'p') {
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
      console.error('Error fetching test status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkillBadges = async () => {
    if (!userId || !userToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/skill-badges/${userId}/skill-badges`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

                if (!response.ok) {
                  throw new Error('Failed to fetch skill badges');
                }

      const data = await response.json();
      console.log('Skill Badge Data', data);
      setApplicantSkillBadges(data.applicantSkillBadges || []);
    } catch (error) {
      console.error('Error fetching skill badges:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTestStatus();
      fetchSkillBadges();
      return () => { }; // Optional cleanup
    }, [userId, userToken])
  );

  useEffect(() => {
    applicantSkillBadges.forEach((badge: any) => {
      if (badge.status === 'FAILED') {
        const retakeDate = calculateRetakeDate(badge.testTaken);
        const timerInterval = startTimer(retakeDate, badge.skillBadge.id);

        return () => clearInterval(timerInterval);
      }
    });
  }, [applicantSkillBadges]);



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
                            <Text style={[styles.content, { marginLeft: 10 }]}>Pre-Screened badge</Text>


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
                            Achieve your dream job faster by demonstrating your aptitude and technical skills
                          </Text>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                  <View
                    style={[
                      styles.stepCircle,
                      { backgroundColor: selectedStep >= 1 ? '#219734' : '#BFBFBF', marginLeft: 15 },
                    ]}
                  >
                    {testName === 'General Aptitude Test' && testStatus === 'P' || selectedStep > 1 ? (
                      <Icon name="check" size={16} color="white" />
                    ) : (
                      <Text style={[styles.stepText, { color: '#fff' }]}>1</Text>
                    )}
                  </View>
                  <View
                    style={[
                      styles.stepLine,
                      { backgroundColor: selectedStep >= 2 ? '#219734' : '#BFBFBF' },
                    ]}
                  />
                  <View
                    style={[
                      styles.stepCircle,
                      { backgroundColor: selectedStep >= 2 ? '#219734' : '#BFBFBF' },
                    ]}
                  >
                    {selectedStep >= 2 ? (
                      <Text style={[styles.stepText, { color: '#fff' }]}>2</Text>
                    ) : (
                      <Text style={styles.stepText}>2</Text>
                    )}
                  </View>
                  <View
                    style={[
                      styles.stepLine,
                      { backgroundColor: selectedStep >= 3 ? '#219734' : '#BFBFBF' },
                    ]}
                  />
                  <View
                    style={[
                      styles.stepCircle,
                      { backgroundColor: selectedStep >= 3 ? '#219734' : '#BFBFBF', marginRight: 15 },
                    ]}
                  >
                    <Icon name="flag" size={12} style={{ color: selectedStep >= 3 ? 'white' : '#6D6969' }} />
                  </View>
                </View>
                {/* Other Sections */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: '#434343', fontSize: 13, fontFamily: 'PlusJakartaSans-Medium', textAlign: 'center' }}>
                      General{"\n"}Aptitude Test
                    </Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: '#434343', fontSize: 13, fontFamily: 'PlusJakartaSans-Medium', textAlign: 'center' }}>
                      Technical{"\n"}Test
                    </Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: '#434343', fontSize: 13, fontFamily: 'PlusJakartaSans-Medium', textAlign: 'center', marginRight: 10 }}>Verification{"\n"}Done
                    </Text>
                  </View>
                </View>


                          <View style={{ marginVertical: 30, flexDirection: 'column', alignItems: 'flex-start' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                              <View style={{ flex: 1 }}>
                                <Text style={styles.content}>{testName}</Text>
                                <Text style={styles.matter1}>
                                  A Comprehensive Assessment to Measure Your Analytical and Reasoning Skills
                                </Text>
                              </View>
                              <View style={{ marginRight: 10 }}>
                                <Image source={require('../../assests/Images/boyimage.png')} style={{ height: 100 }} />
                              </View>
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
                                    {testStatus === 'F' && timer ? 'Retake Test' : 'Take Test'}
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
                      <Text style={styles.text}>Skill Badges</Text>
                    </View>

          {/* Horizontal ScrollView for Cards */}
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {[
              // Step 1: Display "Take Test" skills first
              ...skillsRequired.map((skill: any, index: any) => (
                <View key={`skill-${index}`} style={styles.card}>
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
                    <Icon name="external-link" size={20} color="white" style={{ marginRight: 15 }} />
                  </TouchableOpacity>
                </View>
              )),

              // Step 2: Display "Passed" skill badges
              ...applicantSkillBadges
                .filter((badge: any) => badge.status === 'PASSED')
                .map((badge: any) => (
                  <View key={`badge-${badge.id}`} style={styles.card}>
                    <View style={styles.statusContainer}>
                      <Text style={[styles.badgeStatus, styles.passed]}>Passed</Text>
                    </View>
                    <Image
                      source={testImage[badge.skillBadge.name] || require('../../assests/Images/Test/NotFound.png')}
                      style={styles.cardImage}
                    />
                    <Text style={styles.cardTitle}>{badge.skillBadge.name}</Text>
                    <TouchableOpacity style={[styles.button, styles.verifiedButton]} disabled>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="check" size={19} color="white" style={{ marginRight: 5 }} />
                        <Text style={[styles.verifiedText, { lineHeight: 19 }]}>Verified</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )),

              // Step 3: Display "Failed" skill badges
              ...applicantSkillBadges
                .filter((badge: any) => badge.status === 'FAILED')
                .map((badge: any) => {
                  const timer = timerState[badge.skillBadge.id];
                  return (
                    <View key={`failed-badge-${badge.id}`} style={styles.card}>
                      <View style={styles.statusContainer}>
                        <Text style={[styles.badgeStatus, styles.failed]}>Failed</Text>
                      </View>
                      <Image
                        source={testImage[badge.skillBadge.name] || require('../../assests/Images/Test/NotFound.png')}
                        style={styles.cardImage}
                      />
                      <Text style={styles.cardTitle}>{badge.skillBadge.name}</Text>
                      {timer ? (
                        <LinearGradient colors={['#d3d3d3', '#d3d3d3']} style={[styles.gradientBackground, styles.timerContain]}>
                          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.timerText1}>Retake test in</Text>
                            <Text style={styles.timerText1}>
                              {timer.days}d {timer.hours}h {timer.minutes}m
                            </Text>
                          </View>
                        </LinearGradient>
                      ) : (
                        <View style={styles.cardFooter}>
                          <TouchableOpacity
                            style={styles.button}
                            onPress={() =>
                              navigation.navigate('TestInstruction', {
                                skillName: badge.skillBadge.name,
                                testType: 'SkillBadge',
                                timer: true,
                              })
                            }
                          >
                            <Text style={styles.buttonText}>Retake Test</Text>
                            <Icon name="external-link" size={20} color="white" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  );
                }),
            ]}
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
              fontFamily: 'PlusJakartaSans-Bold',
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
              color: '#000000',
              marginBottom: 5,
              fontFamily: 'PlusJakartaSans-Bold',
            },
            matter1: {
              fontWeight: '400',
              fontSize: 12,
              lineHeight: 20,
              color: '#0D0D0D',
              fontFamily: 'PlusJakartaSans-Medium',
            },
            progressContainer: {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '90%', // Adjusted width for better spacing
              alignSelf: 'center',
              marginBottom: 10,
              marginTop: 20
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
              color: '#6D6969',
              fontWeight: '500',
              fontSize: 12,
              fontFamily: 'PlusJakartaSans-Medium',
            },
            stepLine: {
              flex: 1,
              width: 100,
              height: 1,
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
              marginBottom: 20,
              fontFamily: 'PlusJakartaSans-Bold',
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
              width: 190,
              height: 210,
              marginRight: 16,
              borderRadius: 10,
              backgroundColor: '#FFFFFF',

    alignItems: 'center',
  },
  cardImage: {
    width: 100,
    height: 90,
    padding: 15,
    resizeMode: 'contain',
    borderRadius: 10,
    marginTop: 30
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#000000',
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 0,
    width: 190,
    height: 45,
    backgroundColor: '#374A70',
    alignItems: 'center',
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
    fontFamily: 'PlusJakartaSans-Medium',
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
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 18,
    lineHeight: 26,
    color: '#F67505',
    alignSelf: 'center'
  },
  name: {
    fontFamily: 'PlusJakartaSans-Bold',
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
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 12,
    fontWeight: 400,
    color: '#6D6D6D',
    marginRight: 5, // Adding space between text and timer
    lineHeight: 26
  },
  timerNumber: {
    fontSize: 15, // Larger size for the numbers
    fontFamily: 'PlusJakartaSans-Bold',
    lineHeight: 26,
    color: '#F3780D',
  },
  timerUnit: {
    fontSize: 10, // Larger size for the numbers
    fontFamily: 'PlusJakartaSans-Bold',
    lineHeight: 26,
    color: '#F3780D', // Regular weight for units
  },
  noSkillsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'PlusJakartaSans-Medium',
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
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 10
  },
  failed: {
    backgroundColor: '#f8d7da',
    color: 'red',
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 10
  },
  badgeDate: {
    fontSize: 12,
    color: '#555',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  statusContainer: {
    position: 'absolute',
    top: 3,
    right: 5,
    paddingHorizontal: 5,
    borderRadius: 8,
  },
  verifiedButton: {
    backgroundColor: 'green',
    justifyContent: 'center'
  },
  verifiedText: {
    color: 'white',
    fontFamily: 'PlusJakartaSans-Bold',
    textAlignVertical: 'center'
  },
  timerContain: {
    bottom: 5,
    width: 190,
    height: 40,
    alignItems: 'center',
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    flexDirection: 'row',
  },
  timerText1: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 12,
    fontWeight: 400,
    color: 'black',
    marginRight: 5, // Adding space between text and timer
    lineHeight: 20,
    marginBottom: 1
  },
  cardFooter: {
    marginTop: 'auto', // Push the footer to the bottom of the card
    width: '100%',
    alignItems: 'center', // Center the button horizontally
    padding: 10
  }
});