import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import LinearGradient from 'react-native-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const ExploreSection = () => {
    return (
        <View>
            <Text style={styles.textBelowCard}>Explore</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
  {/* Second Section - Larger Cards */}
  <View style={styles.largeCard}>
    <Text style={styles.cardTitle}>Build your professional{"\n"}{"        "}resume for free</Text>
    <Image
      source={{ uri: "https://d1sq67t1c2pewz.cloudfront.net/static/media/Resume.ec41b4fde8cfb61ed302.png" }}
      style={styles.cardImage}
    />
    <LinearGradient
      colors={['#F97316', '#FAA729']}  // Gradient colors
      start={{ x: 0, y: 0 }}  // Start of gradient
      end={{ x: 1, y: 0 }}    // End of gradient (horizontal direction)
      style={styles.cardButton}  // Apply gradient to button style
    >
      <Text style={styles.buttonText}>Create Now</Text>
    </LinearGradient>
  </View>

  <View style={styles.largeCard}>
    <Text style={styles.cardTitle}>Earn Pre-Screened Badges</Text>
    <Image
      source={{ uri: "https://d1sq67t1c2pewz.cloudfront.net/static/media/Taketest.f9b04fc56b4d85d488be.png" }}
      style={styles.cardImage}
    />
    <LinearGradient
      colors={['#F97316', '#FAA729']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.cardButton}
    >
      <Text style={styles.buttonText}>Take Test</Text>
    </LinearGradient>
  </View>

  <View style={[styles.largeCard, styles.lastCard]}>
    <Text style={styles.cardTitle}>Get Certified on Advanced{"\n"}{"        "}Technologies</Text>
    <Image
      source={{ uri: "https://d1sq67t1c2pewz.cloudfront.net/static/media/Certificate.cf13aa641913a67cb502.png" }}
      style={styles.cardImage}
    />
    <LinearGradient
      colors={['#F97316', '#FAA729']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.cardButton}
    >
      <Text style={styles.buttonText}>Start Learning</Text>
    </LinearGradient>
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
        fontFamily: "PlusJakartaSans",
        marginTop: screenHeight * 0.025,
        fontWeight: "700",
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
        elevation: 4,
        shadowColor: "#000",
       shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        fontFamily: "PlusJakartaSans",
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
        fontSize: screenWidth * 0.045,
        fontWeight: "700",
        fontFamily: "PlusJakartaSans",
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
        fontWeight: "700",
        textAlign: "center",
        fontFamily: "PlusJakartaSans",
        fontSize: screenWidth * 0.035,
    },
    lastCard: {
        marginRight: screenWidth * 0.09,
    },
});

export default ExploreSection;