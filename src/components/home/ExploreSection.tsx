import React, { useContext } from "react";
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, Linking } from "react-native";
import GradientButton from "../styles/GradientButton";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@models/Model";
import UserContext from "../../context/UserContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Badges">;

const ExploreSection = () => {
  const { verifiedStatus } = useContext(UserContext);
  const navigation = useNavigation<NavigationProp>();

  return (
    <View>
      <Text style={styles.textBelowCard}>Explore</Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        {/* Second Section - Larger Cards */}
        {/* <View style={styles.largeCard}>
          <Text style={styles.cardTitle}>
            Build your professional{"\n"}
            {"        "}resume for free
          </Text>
          <Image
            source={{ uri: "https://d1sq67t1c2pewz.cloudfront.net/static/media/Resume.ec41b4fde8cfb61ed302.png" }}
            style={styles.cardImage}
          />
          <GradientButton
            title="Create Now"
            onPress={() => navigation.navigate('ResumeBuilder')}
            style={styles.cardButton}
           
          />
        </View> */}
        {!verifiedStatus && (
          <View style={styles.largeCard}>
            <View
              style={{
                borderColor: "red",
                borderRadius: 10,
                borderWidth: 1.5,
                paddingHorizontal: 5,
                marginLeft: "80%",
              }}
            >
              <Text style={{ fontFamily: "PlusJakartaSans-Medium", color: "red", fontSize: 12 }}>
                New
              </Text>
            </View>
            <Text style={styles.cardTitle}>Earn Pre-Screened{"\n"} Badge</Text>
            <Image
              source={require("../../assests/Images/Earn_badge.png")}
              style={styles.cardImage}
            />

            <GradientButton
              title="Take Test"
              onPress={() => navigation.navigate("Badges")}
              style={styles.cardButton}
            />
          </View>
        )}

        <View style={[styles.largeCard, styles.lastCard]}>
          <Text style={styles.cardTitle}>
            Get Certified on Advanced{"\n"}
            {"                 "}Technologies
          </Text>
          <Image
            source={require("../../assests/Images/Certificate.png")}
            style={styles.cardImage}
          />
          <GradientButton
            title="Start Learning"
            onPress={() => Linking.openURL("https://upskill.bitlabs.in/login/index.php")}
            style={styles.cardButton}
          />
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
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
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
