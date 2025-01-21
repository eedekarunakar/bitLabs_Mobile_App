import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashBoard from '../screens/HomePage/Home';
import Jobs from '../screens/HomePage/Jobs';
import Notification from '../screens/HomePage/Badge';
import Resume from '../screens/HomePage/MyResume';
import Drives from '../screens/HomePage/Drives';

import HomeIconSolid from '../assests/icons/HomeSolid';
import HomeIconOutline from '../assests/icons/HomeOutline';
import JobsIconSolid from '../assests/icons/BriefcaseSolid';
import JobsIconOutline from '../assests/icons/BriefcaseOutline';
import NotificationIconSolid from '../assests/icons/BellSolid';
import NotificationIconOutline from '../assests/icons/BellOutline';
import ResumeIconSolid from '../assests/icons/NewpaperSolid';
import ResumeIconOutline from '../assests/icons/NewpaperOutline';
import DrivesIconSolid from '../assests/icons/RocketSolid';
import DrivesIconOutline from '../assests/icons/RocketOutline';
import { RootStackParamList } from '../../new';
import { RouteProp } from '@react-navigation/native';

import { createTabScreenOptions } from '../components/Navigation/TabConfig';

const Tabs = createBottomTabNavigator<RootStackParamList>();
type BottomTabRouteProp = RouteProp<RootStackParamList, 'BottomTab'>;
const BottomTab = ({ route }: { route: BottomTabRouteProp }) => {
  const welcome = route.params;
    return (
          <Tabs.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarActiveTintColor: '',
              tabBarInactiveTintColor: 'grey',
              tabBarLabelStyle: { fontSize: 12 },
              tabBarStyle: {
                height: 77,
                paddingBottom: 10,
                paddingTop: 12,
                paddingLeft: 8,
                paddingRight: 8,
                gap: 7,
                boxShadow: '0px 0px 5px 0px #7F8EAA26',
              },
              tabBarLabel: ({ focused }) => (
                <Text
                  style={{
                    color: focused ? 'black' : 'grey',
                    fontSize: 10,
                    marginBottom: 30,
                  }}
                >
                  {route.name}
                </Text>
              ),
            })}
          >
            <Tabs.Screen
              name="Home"
              component={DashBoard}
              initialParams={welcome}
              {...createTabScreenOptions(HomeIconOutline, HomeIconSolid)}
            />
            <Tabs.Screen
              name="Jobs"
              component={Jobs}
              {...createTabScreenOptions(JobsIconOutline, JobsIconSolid)}
            />
            <Tabs.Screen
              name="Drives"
              component={Drives}
              {...createTabScreenOptions(DrivesIconOutline, DrivesIconSolid)}
            />
            <Tabs.Screen
              name="Badge"
              component={Notification}
              {...createTabScreenOptions(NotificationIconOutline, NotificationIconSolid)}
            />
            <Tabs.Screen
              name="MyResume"
              component={Resume}
              {...createTabScreenOptions(ResumeIconOutline, ResumeIconSolid)}
            />
          </Tabs.Navigator>
      );
    };
export default BottomTab;
  

