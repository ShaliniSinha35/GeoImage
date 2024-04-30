import { View, Text, Dimensions,TouchableOpacity, ImageBackground } from 'react-native'
import React, {useState, useEffect} from 'react'
import { useAuth } from './AuthContext'
import axios from 'axios'
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const ProjectAssign = ({navigation}) => {

    const width=Dimensions.get('screen').width

    const {employeeId}= useAuth()


    const [assignProjects,setProject]= useState([])
    const [districts,setDistricts]= useState([])


    const getAssignProjects = async()=>{
        try{
            const res= await axios.get(`https://geolocation-backend-1.onrender.com/projectAssign`, {
              params: {
                  empId: employeeId
              }
          })
        
          const data = res.data;
        
   


          for(let i=0;i<data.length;i++){
           
            
            const res= await axios.get(`https://geolocation-backend-1.onrender.com/districtAssign`, {
                params: {
                    did: data[i].district
                }
            })

            const data1= res.data
            // console.log("district data",data1)
            setDistricts(data1)

          }

          setProject(data)
    }
    catch(err){
        console.log("err",err)
    }

}

useEffect(()=>{
    getAssignProjects()
},[])



   

  return (
    <ImageBackground style={{height:Dimensions.get('screen').height,width:width,backgroundColor:"#b9d6f2",opacity:1}}>
    <Text
    style={{
      height: 1,
      borderColor: "#001349",
      borderWidth: 1,
      marginTop: 10,
      width:width
      
    }}
  />

      <Text style={{textAlign:"center",fontSize:25,color:"#DA5050",marginTop:20,fontWeight:800}}><MaterialIcons name="assignment" size={30} color="#001349" /> Assign Districts</Text>
      <Text
    style={{
      height: 1,
      borderColor: "#001349",
      borderWidth: 1,
      marginTop: 20,
      width:width
    }}
  />

  <View style={{width:width,alignItems:"center",marginTop:20}}>
  {
    districts.map((item)=>(
        <View key={item.id} style={{alignItems:"center",justifyContent:"center",height:180,width:250,borderColor:"#001349",borderWidth:2,borderRadius:20,marginTop:10,backgroundColor:"#fff"}}>
            <Entypo name="location" size={24} color="#DA5050" />
                    <Text allowFontScaling={false} style={{fontSize:12,marginTop:10,}}>District</Text>
        <Text allowFontScaling={false} style={{fontSize:20,fontWeight:500,marginTop:5,}}>{item.name}</Text>

        <TouchableOpacity onPress={()=>navigation.navigate("Add Projects",{district:item.name})} style={{padding:10, borderRadius:25, backgroundColor:"#DA5050",alignItems:"center",marginTop:25,marginHorizontal:20}}>

            <Text allowFontScaling={false} style={{fontSize:16,color:"white"}}>Add your Project</Text>
          </TouchableOpacity>
      </View>
    ))
}
     
  </View>




     
    </ImageBackground>
  )
}

export default ProjectAssign