import { View, Text, Dimensions, TouchableOpacity, Image } from 'react-native'
import React, {useState,useEffect} from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { ResizeMode } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
const width = Dimensions.get('screen').width
const height= Dimensions.get('screen').height
import { useAuth } from '../Screens/AuthContext';



  

const Header = ({navigation}) => {
    const {employee,employeeId} = useAuth()
  const [empId,setEmpId] = useState(employeeId)

  return (
    <View>
      <View style={{width:width, backgroundColor:"#001349"}}>

<View style={{width:width, flexDirection:"row",alignItems:"center",padding:10,justifyContent:"space-around"}}>


<TouchableOpacity    onPress={() => navigation.openDrawer()} style={{}}>
<MaterialCommunityIcons  name="menu" size={34} color="#fff" />
</TouchableOpacity>

<Image source={require("../assets/logo.png")} style={{width:190,height:80,resizeMode:"contain"}}></Image>
<TouchableOpacity style={{alignItems:"center"}} onPress={()=>navigation.navigate("Profile")}>
<FontAwesome name="user-circle-o" size={28} color="white" /> 
{empId && <Text style={{color:"#fff",marginTop:5}}>{empId}</Text>}

</TouchableOpacity>

</View>

       </View>
    </View>
  )
}

export default Header