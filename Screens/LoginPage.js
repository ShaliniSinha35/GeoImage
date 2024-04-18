import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    KeyboardAvoidingView,
    TextInput,
    Pressable,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { SET_EMPLOYEE_VALUE } from "../redux/actions/Employee";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from "./AuthContext";
const LoginPage = ({navigation}) => {
    const [empId, setEmpId] = useState('');
    const [password, setPassword] = useState("");

    const [flag, setFlag] = useState(false);
    const [error, setErr] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);
    const [user, setUser] = useState("");


    const { login } = useAuth();


    const dispatch = useDispatch();
    // const employeeValue = useSelector(state => state.EmployeeReducer.value);
    // console.log(employeeValue)

    useEffect(() => {
        validateForm();
    }, [empId, password]);

    const validateForm = () => {
        let errors = {};

        if (!empId) {
            errors.empId = "Employee ID is required.";
        }

        if (!password) {
            errors.password = "Password is required.";
        }
        setErr(errors);
        setIsFormValid(Object.keys(errors).length === 0);
    };

    const handleSubmit = async () => {
        if (isFormValid) {


            axios.get(`https://geolocation-backend-1.onrender.com/verify`, {
                params: {
                    empId: empId,
                    password: password
                }
            })
                .then(response => {
                    const data = response.data;
                    if (data.length != 0) {
                        console.log("Successfully Login", data);
                        const storeData = async (value) => {
                            try {
                              await AsyncStorage.setItem('employee', JSON.stringify(value))
                            } catch (e) {
                               console.log("error",e)
                            }
                          }
                          storeData(data[0])
                        setUser(data[0])
                        login()
                        dispatch({ type: SET_EMPLOYEE_VALUE, payload: data[0] });
                        navigation.navigate("Home")

                    }
                })
                .catch(error => {
                    console.error("Error:", error);

                });
        } else {
            setFlag(true);
            alert("you have entered the wrong Employee ID and Password. Please correct them.");
            setEmpId("");
            setPassword("");
        }
    };

    return (

        <View style={{ backgroundColor: "#001349" }}>

            <View style={{width:Dimensions.get('screen').width, alignItems:"center",height:Dimensions.get('screen').height}}>
            <View style={styles.safeArea}>


<Image source={require("../assets/logo.png")} style={{height:80, width:200,resizeMode:"contain"}}></Image>

    <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
            <Text style={styles.heading}>Employee Login</Text>
        </View>

        <View style={{  }}>
            <View style={styles.inputBoxCont}>


                <TextInput
                    value={empId}
                    onChangeText={(text) => setEmpId(text)}
                    style={{
                        color: "gray",
                        marginVertical: 10,
                        width: 300,
                        fontSize: empId ? 16 : 16,
                    }}
                    placeholder="Enter your Employee ID"
                />
            </View>
            {error.empId && flag && <Text>{error.empId}</Text>}
        </View>

        <View style={{ marginTop: 1 }}>
            <View style={styles.inputBoxCont}>


                <TextInput
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={true}
                    style={{
                        color: "gray",
                        marginVertical: 10,
                        width: 300,
                        fontSize: password ? 16 : 16,
                    }}
                    placeholder="Password"
                />
            </View>
            {error.password && flag && <Text>{error.password}</Text>}
        </View>



        <View style={{ marginTop: 25 }} />

        <TouchableOpacity onPress={() => handleSubmit()} style={styles.button} >
            <Text
                style={{
                    textAlign: "center",
                    color: "white",
                    fontSize: 16,
                    fontWeight: "bold",
                }}
            >
                Login
            </Text>
        </TouchableOpacity>




    </KeyboardAvoidingView>
            </View>
            </View>

          
        </View>


    );
};

export default LoginPage;

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: "white",
        alignItems: "center",
        borderRadius:50,
        width:Dimensions.get('screen').width ,
        opacity:0.9,
        paddingBottom:20,
        marginTop:150
    },
    img: {
        width: 160,
        height: 100,
        resizeMode: "contain"
    },
    heading: {
        fontSize: 17,
        fontWeight: "bold",
        marginTop: 20,
        color: "#041E42",
    },
    inputBoxCont: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        backgroundColor: "#D0D0D0",
        paddingVertical: 5,
        borderRadius: 5,
        marginTop: 30,
        paddingHorizontal: 15
    },
    forgotCont: {
        marginTop: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    button: {
        width: 140,
        backgroundColor: "#DA5050",
        borderRadius: 6,
        marginLeft: "auto",
        marginRight: "auto",
        padding: 15,
    },
});
