import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons';
const width = Dimensions.get('screen').width

const Section1 = () => {
  return (
    <View style={{marginTop:20, alignItems:"center"}}>
   
       <View style={{width:300,backgroundColor:"#f7f7f5",borderRadius:25,elevation:5,alignItems:"center",justifyContent:"center",padding:20}}>
       <MaterialIcons name="assignment" size={24} color="#DA5050" />
          <Text allowFontScaling={false}  style={{color:"#1c68c4",fontSize:18,fontWeight:900,marginTop:10}}>Total Projects</Text>
          <Text style={{marginTop:5,fontSize:15}}>10 </Text>
          <TouchableOpacity style={{padding:12, borderRadius:25, backgroundColor:"#DA5050",alignItems:"center",marginTop:10,opacity:0.9}}>
            <Text allowFontScaling={false} style={{fontSize:16,color:"white"}}>View Your Projects</Text>
          </TouchableOpacity>
       </View>


       <View style={{width:300,backgroundColor:"#f7f7f5",borderRadius:25,elevation:5,alignItems:"center",justifyContent:"center",marginTop:15,padding:20}}>
       <MaterialIcons name="assignment-turned-in" size={24} color="#DA5050" />
       <Text allowFontScaling={false}  style={{color:"#1c68c4",fontSize:18,fontWeight:900,marginTop:10}}>Completed Projects</Text>
       <Text style={{marginTop:5,fontSize:15}}>5 </Text>
          <TouchableOpacity style={{padding:12, borderRadius:25, backgroundColor:"#DA5050",alignItems:"center",marginTop:10,opacity:0.9}}>
            <Text allowFontScaling={false} style={{fontSize:16,color:"white"}}>View Completed Projects</Text>
          </TouchableOpacity>
       </View>



       <View style={{width:300,height:150,backgroundColor:"#f7f7f5",borderRadius:25,elevation:5,alignItems:"center",justifyContent:"center",marginTop:15}}>
       <MaterialIcons name="pending-actions" size={24} color="#DA5050" />
       <Text allowFontScaling={false}  style={{color:"#1c68c4",fontSize:18,fontWeight:900,marginTop:10}}>Pending Projects</Text>
       <Text style={{marginTop:5,fontSize:15}}>5 </Text>
          <TouchableOpacity style={{padding:12, borderRadius:25, backgroundColor:"#DA5050",alignItems:"center",marginTop:10,opacity:0.9}}>
            <Text allowFontScaling={false} style={{fontSize:16,color:"white"}}>View Pending Projects</Text>
          </TouchableOpacity>
       </View>
    </View>
  )
}

export default Section1