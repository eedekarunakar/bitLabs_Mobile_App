import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useAuth } from '../../context/Authcontext';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../../services/login/ApiClient';
import axios from 'axios';
 
const ResumeBuilder = () => {
    const [loginUrl, setLoginUrl] = useState('');
    const { userId } = useAuth();
    const navigation = useNavigation();
 
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching user data...');
                const response = await apiClient.get(`/applicant/getApplicantById/${userId}`);
                console.log('User data fetched:', response.data);
 
                const newData = {
                    identifier: response.data.email,
                    password: response.data.password,
                };
                console.log('Prepared newData:', newData);
 
                const apiUrl1 = 'https://resume.bitlabs.in:5173/api/auth/login';
                console.log('Starting fetch request to:', apiUrl1);
                console.log('Payload:', JSON.stringify(newData));
 
                const loginResponse = await axios.post(apiUrl1, newData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
 
                console.log('Fetch request completed.');
                console.log('Status:', loginResponse.status);
                console.log('Data:', loginResponse.data);
 
                if (loginResponse.status === 200) {
                    const loginUrl = `https://resume.bitlabs.in:5173/auth/login?identifier=${encodeURIComponent(newData.identifier)}&password=${encodeURIComponent(newData.password)}`;
                    console.log('Login URL:', loginUrl);
                    setLoginUrl(loginUrl);
                } else {
                    console.error('Login failed:', loginResponse.data);
                }
            } catch (error) {
                console.error('Error during fetch:', error);
                if (axios.isAxiosError(error)) {
                    console.error('Response error:', error.response?.data);
                } else if (error instanceof Error) {
                    console.error('Instance error:', error.message);
                } else {
                    console.error('Unknown error type:', error);
                }
            }
        };
 
        fetchData();
    }, [userId]);
 
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setLoginUrl(''); // Clear the WebView URL to disable the WebView
        });
 
        return unsubscribe;
    }, [navigation]);
 
    const handleWebViewMessage = async (event: WebViewMessageEvent) => {
        const message = event.nativeEvent.data;
        console.log('Received message from WebView:', message);
 
        if (message === 'close-modal-saveexit') {
            try {
                const response = await apiClient.put(`/applicantprofile/updateResumeSource/${userId}`);
                console.log('API call successful:', response.data);
                // Navigate back to Profile component
                navigation.goBack();
                Alert.alert('Save and Exit', 'Resume source updated successfully.');
            } catch (error) {
                console.error('API call failed:', error);
                Alert.alert('Error', 'Failed to update resume source.');
            }
        }
    };
 
    return (
        <View style={styles.container}>
            {loginUrl ? (
                <WebView
                    source={{ uri: loginUrl }}
                    style={styles.webview}
                    onMessage={handleWebViewMessage}
                />
            ) : null}
        </View>
    );
};
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
});
 
export default ResumeBuilder;