import React, { useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Import the useFocusEffect hook
import LinearGradient from 'react-native-linear-gradient';
import { useProfileViewModel } from '@viewmodel/Profileviewmodel';
import { useAuth } from '@context/Authcontext';
import { useBadgeViewModel } from '@viewmodel/BadgeViewModel';
import { fetchTestStatus, } from '@services/Home/BadgeService';
import UserContext from '@context/UserContext';
import SkillCard from '@components/Cards/SkillCard';
import StepIndicator from '@components/progessBar/StepProgress';

const { width } = Dimensions.get('window');
const Badge = ({ navigation }: any) => {
  const { selectedStep, timer, timerState, isButtonDisabled, testName, testStatus, loading, applicantSkillBadges, loadSkillBadges } = useBadgeViewModel();
  const { userId, userToken } = useAuth();
  const { profileData } = useProfileViewModel(userToken, userId);
  const { skillsRequired = [] } = profileData || {}; 
  const { personalName } = useContext(UserContext);

  useFocusEffect(
    useCallback(() => {
      let isActive = true; 
      const fetchData = async () => {
        await fetchTestStatus(userId, userToken);  
      };
      loadSkillBadges();
      fetchData();
      return () => {
        isActive = false;
      };
    }, [userId, userToken])
  );
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#F46F16" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
      </View>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Badges</Text>
      </View>
      <ScrollView horizontal={false} style={styles.mainScroll}>
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Verified Badges</Text>
          </View>
          <View style={selectedStep === 3 ? null : styles.box1}>
            {selectedStep === 3 ? (
              <View style={styles.badge}>
                <LinearGradient
                  colors={['#FFEAC4', '#FFF9D6']}
                  style={styles.gradientBackground1}>
                  <Text style={[styles.content, { marginLeft: 10 }]}>
                    Pre-Screened badge
                  </Text>
                  <View>
                    <Image source={require('@assests/Images/Test/Badge.png')} style={styles.congratulationsImage} />
                  </View>
                  <Text style={styles.congratulationsMessage}>
                    Congratulations, You are now Verified
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                    <Text style={styles.name}>
                      {personalName
                        ? personalName.charAt(0).toUpperCase() + personalName.slice(1)
                        : 'Guest'}
                    </Text>
                    <Image source={require('@assests/Images/Test/verified.png')} style={styles.verified} />
                  </View>
                </LinearGradient>
              </View>
            ) : (
              <View style={styles.badge1}>
                <Text style={styles.content}>Pre-Screened Badge</Text>
                <Text style={styles.matter1}>
                  Achieve your dream job faster by demonstrating your aptitude
                  and technical skills
                </Text>
                <View style={styles.progressContainer}>
                  <StepIndicator step={1} selectedStep={selectedStep} testName={testName} testStatus={testStatus} />
                  <StepIndicator step={2} selectedStep={selectedStep} testName={testName} testStatus={testStatus} />
                  <StepIndicator step={3} selectedStep={selectedStep} testName={testName} testStatus={testStatus} isLast />
                </View>
                <View
                  style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.text1}>
                      General{'\n'}Aptitude Test
                    </Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.text1}>
                      Technical{'\n'}Test
                    </Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.text1}>
                      Verification{'\n'}Done
                    </Text>
                  </View>
                </View>
                <View style={{marginVertical: 30, flexDirection: 'column', alignItems: 'flex-start'}}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.content}>{testName}</Text>
                      <Text style={styles.matter1}>
                        A Comprehensive Assessment to Measure Your Analytical
                        and Reasoning Skills
                      </Text>
                    </View>
                    <View style={{ marginRight: 10 }}>
                      <Image
                        source={require('@assests/Images/boyimage.png')}
                        style={{ height: 100 }}
                      />
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <LinearGradient
                      colors={
                        isButtonDisabled
                          ? ['#d3d3d3', '#d3d3d3']
                          : ['#F97316', '#FAA729']
                      }
                      start={{ x: 0, y: 0 }} 
                      end={{ x: 1, y: 0 }} 
                      style={[
                        styles.gradientBackground,
                        isButtonDisabled &&
                        testName !== 'Technical Test' &&
                        styles.disabledButton]}>
                      <TouchableOpacity style={[styles.progressButton, isButtonDisabled && testName !== 'Technical Test' &&
                        styles.disabledButton,
                      testName === 'General Aptitude Test' &&
                      testStatus === 'F' &&
                      timer &&
                      styles.disabledButton,
                      ]}
                        onPress={() => {
                          if (!isButtonDisabled && selectedStep < 3) {
                            navigation.navigate('TestInstruction');
                          }
                        }}
                        disabled={isButtonDisabled}>
                        <Text style={styles.progressButtonText}>
                          {testStatus === 'F' && timer
                            ? 'Retake Test'
                            : 'Take Test'}
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                    {testName === 'General Aptitude Test' &&
                      testStatus === 'F' &&
                      timer && (
                        <View style={styles.timerContainer}>
                          <Text style={styles.timerText}>
                            Retake test after{'\n'}
                            <Text style={styles.timerNumber}>{timer.days}</Text>
                            <Text style={styles.timerUnit}>d </Text>
                            <Text style={styles.timerNumber}>
                              {timer.hours}
                            </Text>
                            <Text style={styles.timerUnit}>hrs </Text>
                            <Text style={styles.timerNumber}>
                              {timer.minutes}
                            </Text>
                            <Text style={styles.timerUnit}>mins</Text>
                          </Text>
                        </View>
                      )}
                  </View>
                  <View style={{ alignSelf: 'center' }}>
                    {testName === 'Technical Test' &&
                      testStatus === 'F' &&
                      timer && (
                        <View style={styles.timerContainer1}>
                          <Text style={styles.timerText}>
                            Retake test after{'   '}
                            <Text style={styles.timerNumber}>{timer.days}</Text>
                            <Text style={styles.timerUnit}>d </Text>
                            <Text style={styles.timerNumber}>
                              {timer.hours}
                            </Text>
                            <Text style={styles.timerUnit}>hrs </Text>
                            <Text style={styles.timerNumber}>
                              {timer.minutes}
                            </Text>
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
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.horizontalScrollContent}>
            {skillsRequired.map((skill: any, index: any) => (
              <SkillCard
                key={`skill-${index}`}
                skillName={skill.skillName}
                status={null}
                onPress={() => navigation.navigate('TestInstruction', { skillName: skill.skillName, testType: 'SkillBadge' })}
              />
            ))}
            {applicantSkillBadges.filter(badge => badge.status === 'PASSED').map(badge => (
              <SkillCard
                key={`badge-${badge.id}`}
                skillName={badge.skillBadge.name}
                status="PASSED"
                onPress={() => { }}
              />
            ))}
            {applicantSkillBadges.filter(badge => badge.status === 'FAILED').map(badge => {
              const timer = timerState[badge.skillBadge.id];
              return (
                <SkillCard
                  key={`failed-badge-${badge.id}`}
                  skillName={badge.skillBadge.name}
                  status="FAILED"
                  timer={timer}
                  onPress={() => navigation.navigate('TestInstruction', { skillName: badge.skillBadge.name, testType: 'SkillBadge', timer: true })}
                />
              );
            })}
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
    marginTop: 20,
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
  gradientBackground1: {
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 8,
    height: 335,
  },
  badge: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  congratulationsImage: {
    width: 102.95,
    height: 108.75,
    marginLeft: '35%',
    marginTop: 20,
  },
  congratulationsMessage: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 18,
    lineHeight: 26,
    color: '#F67505',
    alignSelf: 'center',
  },
  name: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontWeight: 400,
    fontSize: 24,
    lineHeight: 26,
    color: '#000000',
  },
  verified: {
    width: 36.95,
    height: 37.29,
    marginLeft: 10,
  },
  disabledButton: {
    width: width * 0.3,
    height: 40,
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
    lineHeight: 26,
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
  badgeDate: {
    fontSize: 12,
    color: '#555',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  cardFooter: {
    marginTop: 'auto', // Push the footer to the bottom of the card
    width: '100%',
    alignItems: 'center', // Center the button horizontally
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: 58,
    backgroundColor: '#FFF'
  },
  title: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#495057',
    lineHeight: 25,
    marginLeft: 15
  },
  text1: {
    color: '#434343',
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-Medium',
    textAlign: 'center'
  }
});