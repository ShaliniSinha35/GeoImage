import { View, Text, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CameraPreview = ({ photo, savePhoto, retakePicture }) => {
    console.log('sdsfds', photo)

    return (
        <View
            style={{
                backgroundColor: 'transparent',
                flex: 1,
                width: '100%',
                height: '100%'
            }}
        >
            <ImageBackground
                source={{ uri: photo && photo.uri }}
                style={{
                    flex: 1
                }}
            />

            <View style={{position:"absolute",bottom:10, flexDirection:"row",justifyContent:"space-around",width:"100%"}}>
                {/* <TouchableOpacity onPress={() => retakePicture(photo.uri)} style={{alignItems:"center",justifyContent:"center"}}>
                <MaterialCommunityIcons name="camera-retake-outline" size={24} color="white" />
                     <Text style={{color:"white"}}>ReTake Photos</Text>
                     </TouchableOpacity> */}
                  <TouchableOpacity onPress={() => savePhoto(photo.uri)} style={{alignItems:"center",justifyContent:"center"}}>
                    <MaterialCommunityIcons name="download" size={24} color="white" />
                     <Text style={{color:"white"}}>Save Photo</Text>
                     </TouchableOpacity>
            </View>
        </View>
    )
}

export default CameraPreview