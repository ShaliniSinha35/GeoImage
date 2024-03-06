import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/HomeScreen';
import DemoScreen from '../Screens/DemoScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';
import VideoRecorder from '../Components/VideoRecorder';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const AppNavigation = () => {
    return (


        <Stack.Navigator>
        <Stack.Screen name="Home" component={DemoScreen} options={{headerShown:false}} />
        <Stack.Screen name="video" component={VideoRecorder} options={{headerShown:false}} />
      </Stack.Navigator>
        // <Tab.Navigator>
        //     <Tab.Screen
        //         name="Home"
        //         component={DemoScreen}
        //         options={{
        //             tabBarLabel: "Home",
        //             tabBarLabelStyle: { color: "black" },
        //             headerShown: false,
        //             tabBarIcon: ({ focused }) =>
        //                 focused ? (
        //                     <AntDesign name="home" size={24} color="black" />) : (
        //                     <AntDesign name="home" size={24} color="gray" />),
        //         }}
        //     />
         

        // </Tab.Navigator>
    );
};

export default AppNavigation;
