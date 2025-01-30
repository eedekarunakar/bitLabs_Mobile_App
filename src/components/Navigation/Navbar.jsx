import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Modal, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/Authcontext";
import { useJobAlerts } from '../../viewmodel/Alert/Notificationmodel';
import ProfileService from '../../services/profile/ProfileService';
import { useProfilePhoto } from '../../context/ProfilePhotoContext';
import useGoogleSignIn from '../../services/google/google';
import Notification from "../../assests/icons/notification";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
 
const Navbar = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    // const [photo, setPhoto] = useState('');
    const { authData, logout, userId, userToken } = useAuth();
    const { unseenCount, handleMarkAsSeen } = useJobAlerts();
    const {photo} = useProfilePhoto();
    const{signOut} = useGoogleSignIn();

 
    const handleProfilePress = () => {
        setModalVisible(true);
    };
 
    const handleLogout = () => {logout(); signOut();};    
    return (
        <View style={styles.navbar}>
 
            <View style={styles.logoContainer}>
                <Image
                    source={require('../../assests/LandingPage/logo.png')}
                    style={styles.logo1Image}
                />
            </View>
            <View style={styles.rightContainer}>
                {/* Notification Bell */}
                <View style={styles.notificationContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
                    <Notification width={28} heigth={22}/>
                    </TouchableOpacity>
                    {unseenCount > 0 && (
                        <View style={styles.notificationBadge}>
                            <Text style={styles.notificationText}>{unseenCount}</Text>
                        </View>
                    )}
                </View>
                <TouchableOpacity onPress={handleProfilePress} style={styles.profilePicContainer}>
                    <Image
                        source={photo ? { uri: photo } : require('../../assests/profile/profile.png')}
                        style={styles.profilePic}
                    />
                </TouchableOpacity>
                {/* Modal */}
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setModalVisible(false)}
                    >
                        <View style={styles.modalView5}>
                            <View style={styles.modalCard5}>
                                <TouchableOpacity style={styles.customButton} onPress={() => navigation.navigate("Profile")} >
                                    <Text style={styles.buttonText1}>View Profile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.customButton1} onPress={() => navigation.navigate('ChangePassword')} >
                                    <Text style={styles.buttonText1}>Change password</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.modalCard6,{marginTop:10,}]}>
                                <TouchableOpacity style={styles.modalButton7} onPress={handleLogout} >
                                    <Text style={styles.modalButtonText7}>Logout</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        </View>
    );
};
 
 
 
const styles = StyleSheet.create({
    navbar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: screenWidth * 0.02,
        backgroundColor: "#fff",
   
        height: screenHeight * 0.08,
      },
      logo1Image: {
        width: screenWidth * 0.4,
        height: screenHeight * 0.04,
        resizeMode: "contain",
       
      },
      logoContainer: {
        flex: 1,
      },
      rightContainer: {
        flexDirection: "row",
        alignItems: "center",
      },
      notificationContainer: {
        position: "relative",
        marginRight: 15, // Space between notification and profile picture
      },
      notification: {
        width: 24,
        height: 24,
        resizeMode: "contain",
      },
      notificationBadge: {
        position: "absolute",
        top: -5, // Adjust position of the badge
        right: -5,
        backgroundColor: "#FFA726", // Orange color
        borderRadius: 12, // Circular shape
        height: 18,
        width: 18
       
        ,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#fff", // Optional: Border to make it stand out
      },
      notificationText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
      },
      profilePic: {
        width: screenWidth * 0.08,
        height: screenWidth * 0.08,
        borderRadius: (screenWidth * 0.08) / 2,
        backgroundColor: "#ccc",
      },
    modalView5: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalCard5: {
        width: '95%',
        marginHorizontal: '5%',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 2,
        paddingHorizontal: 3,
        paddingLeft:5
       
    },
    modalCard6:{
        width:'95%',
        marginHorizontal:'5%',
        backgroundColor:'white',
        borderRadius: 10,
        paddingVertical: 2,
        paddingHorizontal: 3,
        marginBottom:10,
        paddingLeft:5
    },
    customButton: {
        width: '100%',
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
    },
    customButton1: {
        width: '100%',
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 0,
        borderColor: '#ccc',
        justifyContent: 'center',
    },
    modalButton7: {
        width: '100%',
        fontSize: 18,
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    modalButtonText7: {
        color: '#E35D6A', // Text color for the Cancel button
        fontWeight:400,
        fontSize: 18,
        fontFamily: 'PlusJakartaSans-Medium', // Set font to Jakarta Sans
    },
 
    buttonText1: {
        fontWeight:400,
        fontSize: 18,
        fontFamily: 'PlusJakartaSans-Medium', // Set font to Jakarta Sans
        color:'#2f2f2f'
    },
    buttonText: {
        color: 'black',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
    },
});
 
export default Navbar;