import React, {useState, useEffect,useContext} from 'react';
 
import Navbar from '@components/Navigation/Navbar';
import NetInfo from '@react-native-community/netinfo';
import ExploreSection from "@components/home/ExploreSection"; // Hook for fetching job counts
import { useAuth } from '@context/Authcontext';
import { RootStackParamList } from '@models/Model';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
 
import { useMessageContext, } from '../../context/welcome';

import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'; // Updated imports
import Icon5 from 'react-native-vector-icons/MaterialIcons'


 
import UserContext from '@context/UserContext';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
 
 
import LinearGradient from 'react-native-linear-gradient';
import { Use } from 'react-native-svg';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
 
const baseScale = screenWidth < screenHeight ? screenWidth : screenHeight;
 
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Jobs'>;
 
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

 
function Dashboard() {
  const {refreshJobCounts , refreshPersonalName , refreshVerifiedStatus} = useContext(UserContext)
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [verified, setVerified] = useState(false)
  const [loading,setIsLoading] = useState(false);
  
  const { verifiedStatus, personalName, isLoading , jobCounts } = useContext(UserContext);
  const route = useRoute<HomeScreenRouteProp>(); // Handle route params


  useEffect(()=>{
    const unsubscribe = NetInfo.addEventListener((state)=>{
      if(state.isConnected && !isConnected){
        // Internet is back online, refetch data
       
        refetchData();
      }

      setIsConnected(state.isConnected)
    })
    return () => {
      unsubscribe();
    }

  },[isConnected])

  const refetchData = async ()=>{
    refreshJobCounts();
    refreshPersonalName();
    refreshVerifiedStatus();
  }

 
 
 
 
  // Use the useJobCounts hook to fetch job counts
  // const { jobCounts, loading, error } = useJobCounts(userId, userToken);
  const { setmsg } = useMessageContext();
 
 
 
 
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    setVerified(verifiedStatus);
  }, [verifiedStatus]);
  // Handle loading state
  if ( loading || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F46F16" style={{flex:1,justifyContent:'center',alignItems:'center'}} />
        <Text style={{ color: '#0D0D0D', fontFamily: 'PlusJakartaSans-Bold' }}>
          Loading job data...
        </Text>
      </View>
    );
  }
 
  // Handle error state
  // if (error) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <Text>{error}</Text>
  //     </View>
  //   );
  // }
 
  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView
        contentContainerStyle={{ paddingBottom: screenHeight * 0.04 }} // Add bottom padding
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.textBelowNavbar}>Hello, {personalName
            ? personalName.charAt(0).toUpperCase() + personalName.slice(1)
            : 'Guest'}
          </Text>
          {verified && <Icon5 name="verified" size={25} color="#F46F16" style={{ marginLeft: 4, marginTop: screenHeight * 0.025, }} />}
        </View>
        <Text style={styles.textBelowNavbar1}>
          {setmsg ? 'Welcome' : 'Welcome back'} {/* Conditional rendering */}
        </Text>
 
 
        <View style={styles.cardContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Jobs', { tab: 'recommended' })}
          >
            <LinearGradient
              colors={['#E6F5FF', '#E1EEFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }} // 90-degree (horizontal) gradient
              style={[styles.card,{borderColor:'#B5DAFF',borderWidth:1}]}
            >
              {/* Row container for Image and Text */}
              <View style={styles.rowContainer}>
                {/* Image */}
                <View style={[styles.cardLogoContainer, { backgroundColor: '#D3EDFE' }]}>
                  <Image
                    source={require('../../assests/Images/Recommendedjobs.png')}
                    style={styles.cardLogo}
                  />
                </View>
 
                {/* Column container for Texts */}
                <View style={styles.textContainer}>
                  <Text style={[styles.cardText]}>
                    Recommended Jobs
                  </Text>
                  <Text style={styles.cardNumber}>{jobCounts?.recommendedJobs ?? '0'}</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
 
 
          <TouchableOpacity
            onPress={() => navigation.navigate('Jobs', { tab: 'saved' })}
          >
            <LinearGradient
              colors={['#FFF9EE', '#FFECE7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }} // 90-degree (horizontal) gradient
              style={[styles.card,{borderColor:'#FECBB6',borderWidth:1}]}
            >
 
              <View style={styles.rowContainer}>
                <View style={[styles.cardLogoContainer, { backgroundColor: '#FFF3E0' }]}>
                  <Image
                    source={require('../../assests/Images/Savedjobs.png')}
                    style={styles.cardLogo}
                  />
                </View>
 
                <View style={styles.textContainer}>
                  <Text style={[styles.cardText, { color: '#F08F6E' }]}>Saved Jobs</Text>
                  <Text style={styles.cardNumber}>{jobCounts?.savedJobs ?? '0'}</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
 
 
          <TouchableOpacity
            onPress={() => navigation.navigate('Jobs', { tab: 'applied' })}
          >
            <LinearGradient
              colors={['#F7FFED', '#E4FFED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }} // 90-degree (horizontal) gradient
              style={[styles.card,{borderColor:'#A6D995',borderWidth:1}]}
            >
              <View style={[styles.rowContainer,]}>
                <View style={[styles.cardLogoContainer, { backgroundColor: '#EEF9D5' }]}>
                  <Image
                    source={require('../../assests/Images/Apply.png')}
                    style={styles.cardLogo}
                  />
                </View>
 
                <View style={styles.textContainer}>
                  <Text style={[styles.cardText, { color: '#228950' }]}>Applied Jobs</Text>
                  <Text style={styles.cardNumber}>{jobCounts?.appliedJobs ?? '0'}</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
 
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
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#0D0D0D',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: screenWidth * 0.05, // 5% of screen width
    backgroundColor: '#fff',
    height: screenHeight * 0.095, // 10% of screen height
  },
 
  logo1Image: {
    width: screenWidth * 0.4,
    height: screenHeight * 0.04,
    resizeMode: 'contain',
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
    position: 'absolute',
    right: screenWidth * 0.05, // Adjust to 5% from the right
    top: screenHeight * 0.04, // Adjust to 3% from the top
    backgroundColor: '#ccc', // Optional: placeholder background for testing
  },
 
  textBelowNavbar: {
    textAlign: 'left',
    fontSize: 24, // Fixed font size of 24px
    color: '#2F2F2F',
    marginLeft: screenWidth * 0.03,
    fontFamily: 'PlusJakartaSans-Bold',
    marginTop: screenHeight * 0.025,
  },
  textBelowNavbar1: {
    textAlign: 'left',
    fontSize: 14, // Fixed font size of 14px
 
    color: '#2F2F2F',
    marginBottom: screenHeight * 0.01,
    marginLeft: screenWidth * 0.03,
    fontFamily: 'PlusJakartaSans-Regular',
  },
 
  cardContainer: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center', // Center align items in the column
  },
 
  row: {
    flexDirection: 'row', // Align cards horizontally
    justifyContent: 'space-between', // Space between cards in a row
    marginBottom: screenHeight * 0.02, // Dynamic spacing between rows
  },
 
  card: {
    width: '100%', // Full width to make them appear in a column
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12, // Add spacing between cards
    backgroundColor: '#fff',
  },
 
  cardLogoContainer: {
    width: screenWidth * 0.15, // Scaled logo container width
    height: screenWidth * 0.15, // Scaled logo container height
    borderRadius: (screenWidth * 0.15) / 2, // Circular logo container
    backgroundColor: '#f0f0f0',
    justifyContent: 'center', // Center the logo inside its container
    alignItems: 'center', // Align logo in the center of the container
    marginBottom: screenHeight * 0.012, // Space between logo and text/number
  },
 
  cardLogo: {
    width: '31%', // Logo size within its container
    height: '31%',
    resizeMode: 'contain',
  },
 
  cardContent: {
    flexDirection: 'column', // Stack text and number vertically
    alignItems: 'flex-start', // Align content to the left
    justifyContent: 'flex-start', // Align text and number to the top
    marginLeft: screenWidth * 0.03, // Space between logo and text
    flex: 1, // Ensure the content takes available space
  },
 
  cardText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    textAlign: 'left',
    gap: 10,
    color: '#909090',
  },
 
  cardNumber: {
    fontSize: 24, // Scales number size with screen width
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#000',
    textAlign: 'left', // Align number to the left
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Allows content to expand properly
  },
  textContainer: {
    alignItems: 'flex-start',
    marginLeft: 20, // Space between image and text
  },
});
export default Dashboard;
