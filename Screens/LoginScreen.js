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
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [flag, setFlag] = useState(false);
  const [error, setErr] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [user, setUser] = useState("");



  useEffect(() => {
    validateForm();
  }, [email, password]);

  const validateForm = () => {
    let errors = {};

    if (!email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setErr(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  const handleSubmit = () => {
    if (isFormValid) {
      auth
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          setUser(user);

          if (user !== null) {
            alert("Login successfully 🎉!");
            setEmail("");
            setPassword("");
            navigation.replace("Main");
          }
        })
        .catch((error) => {
          const errorMessage = error.message;
          setErr(errorMessage);
        });
    } else {
      setFlag(true);
      alert("Form has errors. Please correct them.");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <SafeAreaView style={styles.safeArea}>
      

        <KeyboardAvoidingView>

          
          <View style={{ alignItems: "center" }}>
            <Text style={styles.heading}>Employee Login</Text>
          </View>

          <View style={{ marginTop: 35 }}>
            <View style={styles.inputBoxCont}>
              <MaterialIcons
                style={{ marginLeft: 8 }}
                name="email"
                size={24}
                color="gray"
              />

              <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: email ? 16 : 16,
                }}
                placeholder="enter your Email"
              />
            </View>
            {error.email && flag && <Text>{error.email}</Text>}
          </View>

          <View style={{ marginTop: 1 }}>
            <View style={styles.inputBoxCont}>
              <AntDesign
                name="lock1"
                size={24}
                color="gray"
                style={{ marginLeft: 8 }}
              />

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
                placeholder="enter your Password"
              />
            </View>
            {error.password && flag && <Text>{error.password}</Text>}
          </View>

          <View style={styles.forgotCont}>
            <Text>Keep me logged in</Text>

            <Text style={{ color: "#00008b", fontWeight: "500" }}>
              Forgot Password
            </Text>
          </View>

          <View style={{ marginTop: 85 }} />

          <Pressable style={styles.button} >
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
          </Pressable>

          {/* <Pressable
          
            style={{ marginTop: 15 }}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
            Sign in with <Text style={{fontSize:20, color:"#0652DD", fontWeight:"bold"}}>Google</Text>
            </Text>

          </Pressable> */}

          <Pressable
            onPress={() => navigation.navigate("Register")}
            style={{ marginTop: 15 }}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
              Don't have an account? Sign Up
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    marginTop: 100,
  },
  img: {
    width: 160,
    height: 100,
    resizeMode:"contain"
  },
  heading: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 10,
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
  },
  forgotCont: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    width: 200,
    backgroundColor: "#001349",
    borderRadius: 6,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 15,
  },
});
