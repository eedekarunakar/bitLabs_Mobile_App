import React, { useContext } from "react";
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Linking } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from '../../../New';
import UserContext from "../../context/UserContext";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Badges'>;

interface ExploreSectionProps {
  navigateToBadge: () => void; // Prop to handle navigation to Badge screen
}
const ExploreSection = () => {
  const { verifiedStatus } = useContext(UserContext)
  const navigation = useNavigation<NavigationProp>();


  return (
    <View>
      <Text style={styles.textBelowCard}>Explore</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
        {/* Second Section - Larger Cards */}
        <View style={styles.largeCard}>
          <Text style={styles.cardTitle}>
            Build your professional{"\n"}
            {"        "}resume for free
          </Text>
          <Image
            source={{ uri: "https://d1sq67t1c2pewz.cloudfront.net/static/media/Resume.ec41b4fde8cfb61ed302.png" }}
            style={styles.cardImage}
          />
          <TouchableOpacity
            onPress={() => { navigation.navigate('ResumeBuilder') }} // Use the navigateToBadge function here
            style={styles.touchableContainer}
          >
            <LinearGradient
              colors={['#F97316', '#FAA729']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.cardButton}
            >
              {/* Ensure Text is wrapped correctly */}
              <Text style={styles.buttonText}>Create Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        {!verifiedStatus && (
          <View style={styles.largeCard}>
            <View style={{ borderColor: 'red', borderRadius: 10, borderWidth: 1.5, paddingHorizontal: 5, marginLeft: '80%' }}>
              <Text style={{ fontFamily: "PlusJakartaSans-Medium", color: 'red', fontSize: 12 }}>New</Text>
            </View>
            <Text style={styles.cardTitle}>Earn Pre-Screened{"\n"}             Badge</Text>
            <Image
              source={{ uri: "https://d1sq67t1c2pewz.cloudfront.net/static/media/Taketest.f9b04fc56b4d85d488be.png" }}
              style={styles.cardImage}
            />
            <TouchableOpacity
              onPress={() => { navigation.navigate('Badges') }} // Use the navigateToBadge function here
              style={styles.touchableContainer}
            >
              <LinearGradient
                colors={['#F97316', '#FAA729']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cardButton}
              >
                {/* Ensure Text is wrapped correctly */}
                <Text style={styles.buttonText}>Take Test</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.largeCard, styles.lastCard]}>
          <Text style={styles.cardTitle}>Get Certified on Advanced{"\n"}{"                 "}Technologies</Text>
          <Image
            source={{ uri: "https://d1sq67t1c2pewz.cloudfront.net/static/media/Certificate.cf13aa641913a67cb502.png" }}
            style={styles.cardImage}
          />
          <TouchableOpacity
            onPress={() => Linking.openURL('https://upskill.bitlabs.in/login/index.php')}// Use the navigateToBadge function here
            style={styles.touchableContainer}
          >
            <LinearGradient
              colors={['#F97316', '#FAA729']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.cardButton}
            >
              {/* Ensure Text is wrapped correctly */}
              <Text style={styles.buttonText}>Start Learning</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  textBelowCard: {
    textAlign: "left",
    fontSize: screenWidth * 0.04,
    color: "#000000",
    marginBottom: screenHeight * 0.02,
    marginLeft: screenWidth * 0.07,
    fontFamily: "PlusJakartaSans-Bold",
    marginTop: screenHeight * 0.025,

  },
  scrollContainer: {
    width: "100%",
    paddingHorizontal: screenWidth * 0.05,
  },
  largeCard: {
    backgroundColor: "#FFFFFF",
    padding: screenWidth * 0.05,
    marginRight: screenWidth * 0.03,
    borderRadius: screenWidth * 0.04,

    fontFamily: "PlusJakartaSans-Bold",
    width: screenWidth * 0.7,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-between",
    height: screenHeight * 0.37,
  },
  cardImage: {
    width: "85%",
    height: screenHeight * 0.15,
    borderRadius: screenWidth * 0.02,
    marginBottom: screenHeight * 0.08,
    resizeMode: "contain",
  },
  cardTitle: {
    fontSize: screenWidth * 0.042,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#000000",
    marginBottom: screenHeight * 0.01,
  },
  cardButton: {
    marginTop: screenHeight * 0.02,
    paddingVertical: screenHeight * 0.015,
    backgroundColor: "#fa9020",
    width: screenWidth * 0.7,
    alignSelf: "center",
    position: "absolute",
    bottom: 0,
    borderBottomLeftRadius: screenWidth * 0.03,
    borderBottomRightRadius: screenWidth * 0.025,
    height: screenHeight * 0.06,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: screenWidth * 0.035,
  },
  lastCard: {
    marginRight: screenWidth * 0.09,
  },
  touchableContainer: {
    position: "absolute", // Ensure the TouchableOpacity is positioned absolutely within the card
    bottom: 0, // Position it at the bottom of the card
    left: 0, // Align it to the left edge
    right: 0, // Align it to the right edge
    width: screenWidth * 0.7, // Match the width of the card
    height: screenHeight * 0.075, // Same height as the button
  },
});

export default ExploreSection;