import { View, Text, Dimensions,TouchableOpacity } from 'react-native'
import React from 'react'
import { useAuth } from './AuthContext'
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const width=Dimensions.get('screen').width


const ProfileScreen = () => {
  const {employee} = useAuth()

  const { logout} = useAuth();

  





  const handleLogout=async()=>{
   await AsyncStorage.clear()
    logout();
  }
  console.log("Employee",employee)
  return (
    <View style={{width:width,backgroundColor:"#b9d6f2",height:Dimensions.get('screen').height}}>
  <View style={{alignItems:"center",justifyContent:"center",marginTop:20,marginTop:50,width:Dimensions.get('screen').width,backgroundColor:"#b9d6f2"}}>
    


    <FontAwesome name="user-circle-o" size={78} color="#001349" /> 


      <Text style={{fontSize:18,marginTop:25}}>Employee_ID: {employee.emp_id}</Text>
      <Text
    style={{
      height: 1,
      borderColor: "#001349",
      borderWidth: 0.5,
      marginTop: 10,
      width:width
      
    }}
  />
      <Text style={{fontSize:18,marginTop:20}}>Email: {employee.email}</Text>
      <Text
    style={{
      height: 1,
      borderColor: "#001349",
      borderWidth: 0.5,
      marginTop: 10,
      width:width
    }}
  />
      <Text style={{fontSize:18,marginTop:20}}>Name: {employee.name}</Text>
      <Text
    style={{
      height: 1,
      borderColor: "#001349",
      borderWidth: 0.5,
      marginTop: 10,
      width:width
    }}
  />
      <Text style={{fontSize:18,marginTop:20}}>Address: {employee.permanent_address}</Text>
      
      <Text
    style={{
      height: 1,
      borderColor: "#001349",
      borderWidth: 0.5,
      marginTop: 10,
      width:width
    }}
  />
     <Text style={{fontSize:18,marginTop:20}}>City: {employee.city}</Text>
      
      <Text
    style={{
      height: 1,
      borderColor: "#001349",
      borderWidth: 0.5,
      marginTop: 10,
      width:width
    }}
  />

    </View>

<View style={{width:width,alignItems:"center",marginTop:40}}>
<TouchableOpacity onPress={()=>handleLogout()} style={{padding:12, borderRadius:25, backgroundColor:"#DA5050",alignItems:"center",marginTop:10,opacity:1,width:150}}>
            <Text allowFontScaling={false} style={{fontSize:16,color:"white"}}>Logout</Text>
          </TouchableOpacity>
</View>
  
    </View>
  
  )
}

export default ProfileScreen