import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  ImageBackground,
  Dimensions,
  BackHandler,
  Alert,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from '@expo/vector-icons';
import Header from "../Components/Header";

import axios from 'axios'
import { useAuth } from './AuthContext'

const ProjectsScreen = ({navigation}) => {

  const {employeeId} = useAuth()

  const [projects,setProjects] = useState([])

  const getProjectDetails = async()=>{

    try{
      const res= await axios.get(`https://geolocation-backend-1.onrender.com/projectDetails`, {
        params: {
            empId: employeeId
        }
    })
  
    const data = res.data;
    setProjects(data)
    
    // console.log("project details data",data)

    }
    catch(error){
      console.log("26",error)
    }

  }


  useEffect(()=>{ 
     getProjectDetails()

  },[])
  return (

    <ScrollView style={{backgroundColor:"#fff",height:Dimensions.get('screen').height}}>

      <View >

      <Text
    style={{
      height: 1,
      borderColor: "#001349",
      borderWidth: 1,
      marginTop: 10,
      
    }}
  />

      <Text style={{textAlign:"center",fontSize:25,color:"#DA5050",marginTop:20,fontWeight:800}}><MaterialIcons name="assignment-turned-in" size={30} color="#001349" /> Your Projects</Text>
      <Text
    style={{
      height: 1,
      borderColor: "#001349",
      borderWidth: 1,
      marginTop: 20,
    }}
  />
 

<View>
{ projects.length==0 ? <ActivityIndicator style={{marginTop:20}}></ActivityIndicator>
        :
       projects.map((project)=>(
      
        
      

        <View style={{width:Dimensions.get('screen').width,paddingBottom:20}}>
        
   

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    
    <ImageBackground
      style={{ width:Dimensions.get('screen').width, height:350, marginTop: 20, resizeMode: "contain" }}
      source={{ uri: `https://geolocation-backend-1.onrender.com/uploads/${project.image_url}` }}
      key={project.id}
      imageStyle={{borderRadius:20}}
    >
     
        
    </ImageBackground>

</ScrollView>

<View style={{ padding: 10, paddingTop: 10,paddingLeft:15 }}>
  <Text  allowFontScaling={false} style={{ fontSize: 15, fontWeight: "600" }}>
  District: {project.dist}
  </Text>
  <Text
    style={{
      height: 1,
      borderColor: "#D0D0D0",
      borderWidth: 0.5,
      marginTop: 10,
    }}
  />
  <Text  allowFontScaling={false} style={{ fontSize: 15, fontWeight: "600" }}>
  Block: {project.block}

  </Text>
  <Text
    style={{
      height: 1,
      borderColor: "#D0D0D0",
      borderWidth: 0.5,
      marginTop: 10,
    }}
  />
  <Text  allowFontScaling={false} style={{ fontSize: 15, fontWeight: "600" }}>
  Village: {project.village}
  </Text>
  <Text
    style={{
      height: 1,
      borderColor: "#D0D0D0",
      borderWidth: 0.5,
      marginTop: 10,
    }}
  />
  <Text  allowFontScaling={false} style={{ fontSize: 15, fontWeight: "600" }}>
 Panchayat: {project.panchayat}
  </Text>
  <Text
    style={{
      height: 1,
      borderColor: "#D0D0D0",
      borderWidth: 0.5,
      marginTop: 10,
    }}
  />
  <Text  allowFontScaling={false} style={{ fontSize: 15, fontWeight: "600" }}>
 Project Area: {project.project_area}
  </Text>
  <Text
    style={{
      height: 1,
      borderColor: "#D0D0D0",
      borderWidth: 0.5,
      marginTop: 10,
    }}
  />
  <Text  allowFontScaling={false} style={{ fontSize: 15, fontWeight: "600" }}>
 Activity Type: {project.activity_type}
  </Text>
  <Text
    style={{
      height: 1,
      borderColor: "#D0D0D0",
      borderWidth: 0.5,
      marginTop: 10,
    }}
  />
  <Text  allowFontScaling={false} style={{ fontSize: 15, fontWeight: "600" }}>
  Activity Name: {project.activity_name}
  </Text>
  <Text
    style={{
      height: 1,
      borderColor: "#D0D0D0",
      borderWidth: 0.5,
      marginTop: 10,
    }}
  />
  <Text  allowFontScaling={false} style={{ fontSize: 15, fontWeight: "600" }}>
 Latitude: {project.image_lat}
  </Text>
  <Text
    style={{
      height: 1,
      borderColor: "#D0D0D0",
      borderWidth: 0.5,
      marginTop: 10,
    }}
  />
  <Text  allowFontScaling={false} style={{ fontSize: 15, fontWeight: "600" }}>
  Longitude: {project.image_longitude}
  </Text>
  <Text
    style={{
      height: 1,
      borderColor: "#D0D0D0",
      borderWidth: 0.5,
      marginTop: 10,
    }}
  />


  {
    project.image_description && 
    <>
   

  <View
    style={{
      flexDirection: "column",
      alignItems: "flex-start",
      padding: 2,
    }}
  >
    <Text>Description: </Text>
    <Text  allowFontScaling={false} style={{ fontSize: 12, textAlign: "justify", color: "gray" }}>
      {project.image_description}
    </Text>
  </View>

  <Text
    style={{
      height: 1,
      borderColor: "#D0D0D0",
      borderWidth: 0.5,
      marginTop: 10,
    }}
  />
  </>
  }

 

  
</View>


<TouchableOpacity
  style={{
    backgroundColor: "#001349",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 60,
    marginTop:10
  }}

>
  <Text allowFontScaling={false} style={{color:"white",fontSize:18}}>View On Map</Text>
</TouchableOpacity>
    
        </View>
      
       ))
      }
   
</View>
   
   </View>
    </ScrollView>
    
  )
}

export default ProjectsScreen