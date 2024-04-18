import { View, Text, Dimensions, TouchableOpacity, Image } from 'react-native'
import React, {useState,useEffect} from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { ResizeMode } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import Section1 from '../Components/Section1';
const width = Dimensions.get('screen').width
const height= Dimensions.get('screen').height
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';




const HomePage = ({navigation}) => {


  const {employee,employeeId} = useAuth()
  // console.log("employee",employee)
  const [empId,setEmpId] = useState(employeeId)








  return (

<View style={{backgroundColor:"#b9d6f2",height:height,width:width}}>
       <View style={{width:width, backgroundColor:"#001349"}}>

<View style={{width:width, flexDirection:"row",alignItems:"center",padding:10,justifyContent:"space-around"}}>


<TouchableOpacity    onPress={() => navigation.openDrawer()} style={{}}>
<MaterialCommunityIcons  name="menu" size={34} color="#fff" />
</TouchableOpacity>

<Image source={require("../assets/logo.png")} style={{width:190,height:80,resizeMode:"contain"}}></Image>
<TouchableOpacity style={{alignItems:"center"}} onPress={()=>navigation.navigate("profile")}>
<FontAwesome name="user-circle-o" size={28} color="white" /> 
{empId && <Text style={{color:"#fff",marginTop:5}}>{empId}</Text>}

</TouchableOpacity>

</View>

</View>

<Section1></Section1>
    </View>
 
  )
}

export default HomePage