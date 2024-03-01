import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/HomeScreen';
import DemoScreen from '../Screens/DemoScreen';
import createProjectScreen from '../Screens/createProjectScreen';
import { AntDesign } from '@expo/vector-icons';
const Tab = createBottomTabNavigator();

const AppNavigation = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Home"
                component={DemoScreen}
                options={{
                    tabBarLabel: "Home",
                    tabBarLabelStyle: { color: "black" },
                    headerShown: false,
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <AntDesign name="home" size={24} color="black" />) : (
                            <AntDesign name="home" size={24} color="gray" />),
                }}
            />
            {/* <Tab.Screen
                name="Projects"
                component={createProjectScreen}
                options={{
                    tabBarLabel: "Projects",
                    tabBarLabelStyle: { color: "black" },
                    headerShown: false,
                    tabBarIcon: ({ focused }) =>
                        focused ? (
                            <AntDesign name="addfile" size={24} color="black" />) : (
                            <AntDesign name="addfile" size={24} color="gray" />),
                }}
            /> */}

        </Tab.Navigator>
    );
};

export default AppNavigation;
