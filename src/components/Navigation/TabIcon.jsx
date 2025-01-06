import React from 'react';
import { View } from 'react-native';

const TabIcon = ({ focused, IconOutline, IconSolid, color }) => {
  return (
    <View style={{ alignItems: 'center', marginBottom: 18 }}>
      {focused ? <IconSolid width={24} height={24} color={color} /> : <IconOutline width={24} height={24} color={color} /> }
    </View>
  );
};

export default TabIcon;
