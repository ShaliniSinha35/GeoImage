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
import { FontAwesome,Entypo } from '@expo/vector-icons';
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { SET_EMPLOYEE_VALUE } from "../redux/actions/Employee";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from "./AuthContext";

const LoginPage = ({navigation}) => {
    const [empId, setEmpId] = useState('');
    const [password, setPassword] = useState("");
    const [hidePass, setHidePass] = useState(true);

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

            let errors = {};
            axios.get(`https://geolocation-backend-1.onrender.com/verify`, {
                params: {
                    empId: empId,
                    password: password
                }
            })
                .then(response => {
                    const data = response.data;
                    console.log(data,"data")
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

                    else{
                        errors.incorrect="You have entered wrong credentials"
                        setErr(errors);
                        setTimeout(() => {
                            setErr("")
                        },5000);
                       
                    }
                })
                .catch(error => {
                    console.error("Error:", error);

                });
        } else {
            setFlag(true);
            // alert("you have entered the wrong Employee ID and Password. Please correct them.");
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

        {error.incorrect && <Text style={{color:"#DA5050",margin:5,alignItems:"center",textAlign:"center"}}>{error.incorrect}</Text>}

        <View style={{  }}>
            <View style={styles.inputBoxCont}>
            <FontAwesome name="user" size={24} color="#403d39" style={{marginRight:8}} />

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
            {error.empId && flag && <Text style={{color:"#DA5050"}}>{error.empId}</Text>}
        </View>

        <View style={{ marginTop: 1 }}>
            <View style={styles.inputBoxCont}>

            {
                    hidePass ?   <Entypo name="eye-with-line" onPress={()=>setHidePass(!hidePass)}  size={24}   color="black"
                    style={{ marginRight: 8 }} />: <Entypo name="eye" onPress={()=>setHidePass(!hidePass)} size={24} color="black"  style={{ marginRight: 8 }} />
                 
                }

                <TextInput
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={hidePass ? true : false}
                    style={{
                        color: "gray",
                        marginVertical: 10,
                        width: 300,
                        fontSize: password ? 16 : 16,
                    }}
                    placeholder="Password"
                />
            </View>
            {error.password && flag && <Text style={{color:"#DA5050"}}>{error.password}</Text>}
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
