import React, { useState, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import Navbar from '../../components/Navigation/Navbar';
import ExploreSection from "../../components/home/ExploreSection";
import { useJobCounts } from '../../viewmodel/DashboardViewModel'; // Hook for fetching job counts
import { useAuth } from '../../context/Authcontext';
import AppliedJobs from '../Jobs/AppliedJobs';
import { useNavigation } from '@react-navigation/native';
import RecommendedJobs from './Jobs';
import { RootStackParamList } from '../../../New';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useRoute, RouteProp, useFocusEffect, useIsFocused } from '@react-navigation/native'; // Updated imports
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Dimensions } from "react-native";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const baseScale = screenWidth < screenHeight ? screenWidth : screenHeight;
import { useProfileViewModel } from '../../viewmodel/Profileviewmodel';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Jobs'>;

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

function Dashboard() {
  const { userId, userToken } = useAuth(); // Retrieve userId and userToken
  const route = useRoute<HomeScreenRouteProp>(); // Handle route params
  useEffect(() => {
    console.log('Dashboard route.params:', route.params); // Debug log
  }, [route.params]);

  const [welcome, setWelcome] = useState(route.params?.welcome ?? 'Welcome Back');

  // Use the useJobCounts hook to fetch job counts
  const { jobCounts, loading, error } = useJobCounts(userId, userToken);

  const { profileData } = useProfileViewModel(userToken, userId);
  const { basicDetails } = profileData || [];
  console.log('prof', basicDetails);

  const navigation = useNavigation<NavigationProp>();

  // Handle loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ color: '#0D0D0D', fontFamily: 'PlusJakartaSans-Bold' }}>Loading job data...</Text>
      </View>
    );
  }

  // Handle error state
  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView
        contentContainerStyle={{ paddingBottom: screenHeight * 0.04 }} // Add bottom padding
      >
        <Text style={styles.textBelowNavbar}>Hello, {basicDetails?.firstName
          ? basicDetails.firstName.charAt(0).toUpperCase() + basicDetails.firstName.slice(1)
          : 'Guest'}</Text>
        <Text style={styles.textBelowNavbar1}>{welcome}</Text>

        <View style={styles.cardContainer}>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.card, { borderColor: "#49C722", borderWidth: 1, backgroundColor: "#F3FFEF" }]} onPress={() => navigation.navigate('Jobs', { tab: 'recommended' })}>
              <View style={[styles.cardLogoContainer, { backgroundColor: "#0A89101A" }]}>
                <Image source={require('../../assests/Images/Recommendedjobs.png')} style={styles.cardLogo} />
              </View>
              <Text style={[styles.cardText, { color: "#096E0E" }]}>Recommended Jobs</Text>
              <Text style={styles.cardNumber}>{jobCounts?.recommendedJobs ?? '0'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.card, { borderColor: "#FFBF4F", borderWidth: 1, backgroundColor: "#FFF7E9" }]} onPress={() => navigation.navigate('Jobs', { tab: 'saved' })}>
              <View style={[styles.cardLogoContainer, { backgroundColor: "#FFB3211A" }]}>
                <Image source={require('../../assests/Images/Savedjobs.png')} style={styles.cardLogo} />
              </View>
              <Text style={[styles.cardText, { color: "#C48916" }]}>Saved Jobs</Text>
              <Text style={styles.cardNumber}>{jobCounts?.savedJobs ?? '0'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TouchableOpacity style={[styles.card, { borderColor: "#FF9F7E", borderWidth: 1, backgroundColor: "#FFEEE9" }]} onPress={() => navigation.navigate('Jobs', { tab: 'applied' })}>
              <View style={[styles.cardLogoContainer, { backgroundColor: "#FFDCD0" }]}>
                <Image source={require('../../assests/Images/Apply.png')} style={styles.cardLogo} />
              </View>
              <Text style={[styles.cardText, { color: "#DE4715" }]}>Applied Jobs</Text>
              <Text style={styles.cardNumber}>{jobCounts?.appliedJobs ?? '0'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.card, { borderColor: "#A075FB", borderWidth: 1, backgroundColor: "#F0E9FF" }]} onPress={() => navigation.navigate('Drives')}>
              <View style={[styles.cardLogoContainer, { backgroundColor: "#E5D9FF" }]}>
                <Image source={require('../../assests/Images/Drive.png')} style={styles.cardLogo} />
              </View>
              <Text style={[styles.cardText, { color: "#360D8D" }]}>Drive Invites</Text>
              <Text style={styles.cardNumber}>0</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ExploreSection />
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: screenHeight * 0.01, // 2% of screen height
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#0D0D0D'

  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: screenWidth * 0.05, // 5% of screen width
    backgroundColor: "#fff",
    height: screenHeight * 0.095, // 10% of screen height
  },

  logo1Image: {
    width: screenWidth * 0.4,
    height: screenHeight * 0.04,
    resizeMode: "contain",
    top: screenHeight * 0.01,
    alignSelf: 'flex-start', // Aligns the logo to the left
  },

  logoContainer: {
    flex: 1,
    width: screenWidth * 0.1, // 10% of screen width
    height: screenWidth * 0.1, // 10% of screen width
    paddingRight: screenWidth * 0.05, // Reduce padding-right to move image more to the left
    marginLeft: -screenWidth * 0.05, // Adjust left margin to move further left
  },

  profilePic: {
    width: screenWidth * 0.08, // Reduced to 8% of screen width
    height: screenWidth * 0.08, // Match height to width for a square shape
    borderRadius: (screenWidth * 0.08) / 2, // Make it circular
    position: "absolute",
    right: screenWidth * 0.05, // Adjust to 5% from the right
    top: screenHeight * 0.04, // Adjust to 3% from the top
    backgroundColor: "#ccc", // Optional: placeholder background for testing
  },

  textBelowNavbar: {
    textAlign: "left",
    fontSize: 24, // Fixed font size of 24px
    color: "#2F2F2F",
    marginLeft: screenWidth * 0.03,
    fontFamily: "PlusJakartaSans-Bold",
    marginTop: screenHeight * 0.025,
  },
  textBelowNavbar1: {
    textAlign: "left",
    fontSize: 14, // Fixed font size of 14px

    color: "#2F2F2F",
    marginBottom: screenHeight * 0.01,
    marginLeft: screenWidth * 0.03,
    fontFamily: "PlusJakartaSans-Regular",
  },


  cardContainer: {
    paddingHorizontal: screenWidth * 0.03, // Dynamic horizontal padding based on screen width
    marginTop: screenHeight * 0.01, // Dynamic top margin based on screen height
  },

  row: {
    flexDirection: "row", // Align cards horizontally
    justifyContent: "space-between", // Space between cards in a row
    marginBottom: screenHeight * 0.02, // Dynamic spacing between rows
  },

  card: {
    width: "48%", // Fit two cards in a row
    aspectRatio: 1.09, // Adjusted aspect ratio to increase card height
    backgroundColor: "#fff",
    padding: screenWidth * 0.04, // Scales padding with screen width
    borderRadius: screenWidth * 0.03, // Rounded corners scale
    alignItems: "flex-start", // Align content to the left within the card
    justifyContent: "flex-start", // Align content to the top (vertical alignment)
    //marginBottom: screenHeight * 0.01, // Space between cards
    overflow: "hidden", // Prevent overflow of content
  },

  cardLogoContainer: {
    width: screenWidth * 0.15, // Scaled logo container width
    height: screenWidth * 0.15, // Scaled logo container height
    borderRadius: (screenWidth * 0.15) / 2, // Circular logo container
    backgroundColor: "#f0f0f0",
    justifyContent: "center", // Center the logo inside its container
    alignItems: "center", // Align logo in the center of the container
    marginBottom: screenHeight * 0.02, // Space between logo and text/number
  },

  cardLogo: {
    width: "40%", // Logo size within its container
    height: "40%",
    resizeMode: "contain",
  },

  cardContent: {
    flexDirection: "column", // Stack text and number vertically
    alignItems: "flex-start", // Align content to the left
    justifyContent: "flex-start", // Align text and number to the top
    marginLeft: screenWidth * 0.03, // Space between logo and text
    flex: 1, // Ensure the content takes available space
  },

  cardText: {
    fontSize: 15, // Set text size to 14px
    color: "#333", // Text color
    fontFamily: "PlusJakartaSans-Medium", // Font family
    textAlign: "left", // Align text to the left
    marginBottom: screenHeight * 0.006, // Space between text and number
  },


  cardNumber: {
    fontSize: screenWidth * 0.04, // Scales number size with screen width
    fontFamily: "PlusJakartaSans-Bold",
    color: "#000",
    textAlign: "left", // Align number to the left
  },


});
export default Dashboard;