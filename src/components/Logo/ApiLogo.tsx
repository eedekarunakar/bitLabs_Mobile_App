import React from 'react';
import { Image, View, ActivityIndicator, Text } from 'react-native';
import { useApiLogoViewModel } from '@viewmodel/Logo/ApiLogoViewModel';
const ApiLogo = ({ style }: any) => {
  const { logoData, loading, error } = useApiLogoViewModel();

  if (loading) return <ActivityIndicator size="small" color="#0000ff" />;
  if (error || !logoData) return <Text>{error}</Text>;

  return <Image source={{ uri: logoData }} style={style} resizeMode="contain" />;
};

export default ApiLogo;
