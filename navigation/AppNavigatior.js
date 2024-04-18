import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/HomeScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';
import VideoRecorder from '../Components/VideoRecorder';
import LoginScreen from '../Screens/LoginScreen';
import { FontAwesome } from '@expo/vector-icons';
import HomePage from '../Screens/HomePage';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StyleSheet, ScrollView, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import ProfileScreen from '../Screens/ProfileScreen';
import ProjectsScreen from '../Screens/ProjectsScreen';
import LoginPage from '../Screens/LoginPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../Screens/AuthContext';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();





export const AppNavigator = () => {



    // const [isLoginValue, setIsLogin] = useState(false)
    const { isLoginValue , isAlreadyLogin,logout} = useAuth();

  
    useEffect(() => {
        isLogin();
    }, [isLoginValue]); 




    const handleLogout=async()=>{
     await AsyncStorage.clear()
      logout();
    }

    // Ensure setIsLogin(true) triggers a re-render
    const isLogin = async () => {
        try {
            const value = await AsyncStorage.getItem('employee');
            if (value !== null) {
              isAlreadyLogin()
            }
        } catch (e) {
            console.log("error", e);
        }
    };


    const drawerMenu = [

        {
            id: 1,
            name: "My Profile",
            url: "profile",
            icon: <FontAwesome name="user" size={24} color="white" />,
        },
        {
            id: 2,
            name: "Projects",
            url: "projects",
            icon: <MaterialIcons name="work" size={22} color="white" />,
        },

        {
            id: 3,
            name: "Add Projects",
            url: "addProject",
            icon: <MaterialIcons name="assignment-add" size={24} color="white" />,
        },

        
        {
            id: 4,
            name: "Logout",
            url: "Logout",
            icon:  <FontAwesome name="sign-out" size={24} color="white" />,
        },








    ];



    function StackNavigator() {
        return (
            <Stack.Navigator>


                {
                    isLoginValue ? <Stack.Screen
                        name="Home"
                        component={HomePage}
                        options={{ headerShown: false }}
                    />
                        :
                        <Stack.Screen
                            name="Login"
                            component={LoginPage}
                            options={{ headerShown: false }}
                        />

                }


              
              

                <Stack.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="projects"
                    component={ProjectsScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="addProject"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />


            </Stack.Navigator>
        );
    }

    const DrawerContent = ({ navigation }) => {
        const [submenuVisible, setSubmenuVisible] = useState(false);

        const toggleSubmenu = () => {
            setSubmenuVisible(!submenuVisible);
        };
        return (
            <ScrollView style={{ flex: 1, paddingTop: 10 }}>
                <Entypo
                    name="cross"
                    size={35}
                    color="white"
                    onPress={() => navigation.closeDrawer()}
                    style={{ marginLeft: 10 }}
                />
                <View style={{ alignItems: "center", marginTop: 30 }}>
                    <FlatList
                        keyExtractor={(item) => item.id.toString() + item.name}

                        data={drawerMenu}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <View
                                key={item.id}
                                style={{ justifyContent: "center", gap: 5, padding: 5 }}
                            >
                                {item.submenu ? (
                                    <>
                                        <TouchableOpacity
                                            onPress={toggleSubmenu}
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                padding: 15,
                                                gap: 12,
                                            }}
                                        >
                                            {item.icon}
                                            <Text allowFontScaling={false} style={{ fontSize: 17, color: "white" }}>
                                                {item.name}
                                            </Text>
                                            <View style={{ marginLeft: 10 }}>
                                                {item.dropdownIcon}
                                            </View>
                                        </TouchableOpacity>
                                        {submenuVisible && (
                                            <View style={styles.submenu}>
                                                {item.submenu.map((subitem) => (
                                                    <TouchableOpacity
                                                        key={subitem.id}
                                                        onPress={() => navigation.navigate(subitem.url)}
                                                        style={{
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                            padding: 15,
                                                            gap: 12,
                                                        }}
                                                    >
                                                        <AntDesign
                                                            name="arrowright"
                                                            size={24}
                                                            color="white"
                                                        />
                                                        <Text allowFontScaling={false} style={{ fontSize: 15, color: "white" }}>
                                                            {subitem.name}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        )}
                                    </>
                                ) : (
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            padding: 15,
                                            gap: 12,
                                        }}
                                        onPress={() => {
                                            item.name == "Logout"
                                                ? handleLogout()

                                            
                                                :
                                                navigation.navigate(item.url);
                                        }}
                                    >
                                        {item.icon}
                                        <Text allowFontScaling={false} style={{ fontSize: 17, color: "white" }}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                <Text allowFontScaling={false}
                                    style={{
                                        height: 1,
                                        borderColor: "#ffe4c4",
                                        borderWidth: 0.2,
                                        marginTop: 0,
                                    }}
                                />
                            </View>
                        )}


                    />
                </View>
            </ScrollView>
        );
    };

    const BottomNavigator = () => {
        if (!isLoginValue) {
            return null;
        }

        return (
            <Tab.Navigator
                screenOptions={{ tabBarStyle: { elevation: 15, height: 65, borderTopWidth: 1, backgroundColor: "#DA5050", opacity: 1, borderColor: "#DA5050" } }}

            >




                <Tab.Screen
                    name="Home"
                    component={StackNavigator}

                    options={{
                        tabBarLabel: "Home",
                        tabBarLabelStyle: { color: "white", fontSize: 15 },
                        headerShown: false,
                        tabBarIcon: ({ focused }) =>
                            focused ? (
                                <Entypo name="home" size={24} color="white" />) : (
                                <AntDesign name="home" size={24} color="#e9e8e4" />),
                    }}
                />


                <Tab.Screen
                    name="Add Projects"
                    component={HomeScreen}
                    options={{
                        tabBarLabel: "Add Your Project",
                        tabBarLabelStyle: { color: "white", fontSize: 15 },
                        headerShown: false,
                        tabBarIcon: ({ focused }) =>
                            focused ? (
                                <Ionicons name="bag-add-sharp" size={24} color="white" />) : (
                                <Ionicons name="bag-add-sharp" size={24} color="#a9a59a" />),
                    }}
                />


                {/* <Tab.Screen
    name="Logout"
    options={{
        tabBarLabel: "Logout",
        tabBarLabelStyle: { color: "white",fontSize:15 },
        headerShown: false,
        tabBarIcon: ({ focused }) =>
            focused ? (
              <FontAwesome name="sign-out" size={24} color="white" />) : (
                <FontAwesome name="sign-out" size={24} color="#a9a59a" />),
    }}
/> */}






            </Tab.Navigator>
        )
    }


    return (
        <NavigationContainer>
            {console.log(isLoginValue)}

            {isLoginValue ? (
                <Drawer.Navigator
                    screenOptions={{
                        drawerStyle: {
                            backgroundColor: "#001349",
                            width: 240,
                            opacity: 0.8,
                        },
                    }}
                    drawerContent={(props) => <DrawerContent {...props} />}
                >
                    <Drawer.Screen
                        name="Home"
                        component={BottomNavigator}
                        options={{ headerShown: false }}
                    />
                </Drawer.Navigator>
            ) : (

                <StackNavigator>

               

                </StackNavigator>
            )}
        </NavigationContainer>
    );
};



const styles = StyleSheet.create({
    drawerItem: {
        padding: 10,

    },
    submenu: {
        borderColor: "#ffe4c4",
        borderTopWidth: 0.2,
    },
    submenuItem: {
        padding: 10,

    },
});
