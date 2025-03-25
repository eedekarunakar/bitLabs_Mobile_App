import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-gesture-handler';

const API_LOGO_URL = 'https://bitlabs-web-application.onrender.com/image/getImage/bitLabLogo';

const ApiLogo = () => {
  const [logoData, setLogoData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch(API_LOGO_URL, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiaGFpcGF0ZWw3MjU1QGdtYWlsLmNvbSIsImV4cCI6MTc0MjkzMzE4OSwiaWF0IjoxNzQyODk3MTg5fQ.jTOsH-7iebM2eFjYApCKS5mlpYP5XGOpCBW_dGwHbyI`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64data = reader.result as string;
          setLogoData(base64data);
          setLoading(false);
        };

        reader.onerror = () => {
          throw new Error('Failed to convert blob to base64');
        };

        reader.readAsDataURL(blob); 
      } catch (err: any) {
        console.error('Error fetching logo:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLogo();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  }

  if (error || !logoData) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: logoData }}
        style={styles.logoImage}
        resizeMode="contain"
        onError={() => {
          setError('Failed to load image');
          setLogoData('');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',  // White background
  },
  logoImage: {
    width: 150,
    height: 50,
  },
});

export default ApiLogo;
