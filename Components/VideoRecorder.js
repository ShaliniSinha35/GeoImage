import React, { useState, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { View, Button, BackHandler, TouchableOpacity,Text, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';


const VideoRecorder = ({ navigation }) => {


  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      // Remove the event listener when the component is unmounted
      backHandler.remove();
    };
  }, []);

  const handleBackPress = () => {
    navigation.navigate("Home")

    return true;
  };
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [record, setRecord] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [startRec, setRec] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerIntervalId, setTimerIntervalId] = useState(null); 
  const [url,setUrl]= useState(null)

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus === 'granted');

    
      const audioStatus = await Camera.requestMicrophonePermissionsAsync();
      setHasAudioPermission(audioStatus.status === 'granted');

      
    })();
  }, []);

  const takeVideo = async () => {
    Alert.alert("Recording Start");
    setRec(true);
    startTimer();
  
    if (camera) {
      const maxDuration = 20 * 60; // Maximum duration in seconds (20 minutes)
      const minDuration = 4 * 60;  // Minimum duration in seconds (4 minutes)
      
      const data = await camera.recordAsync({
        quality: Camera.Constants.VideoQuality['2160p'],
        maxDuration: maxDuration,
        mute: false,
        videoBitrate: 5000000,
      });


    
  
      const duration = Math.floor(data.duration);
      console.log("67",duration)
      
      if (duration >= minDuration && duration <= maxDuration) {
        setRecord(data.uri);
        setUrl(data.uri);
        stopTimer();
        console.log(data.uri);
      } else {
        // Video duration is not within the allowed range
        stopTimer();
        setRec(false);
        setRecord(null);
        setUrl(null);
        Alert.alert(
          'Invalid Video Duration',
          `Video duration must be between ${minDuration / 60} and ${maxDuration / 60} minutes.`
        );
      }
    }
  };
  






const stopVideo = () => {
  setRec(false);
  console.log(url)
  saveToGallery(url)
  stopTimer();
  camera.stopRecording();
  Alert.alert('Recording Stopped');

};

const startTimer = () => {
  const intervalId = setInterval(() => {
    setTimer((prevTimer) => prevTimer + 1);
  }, 1000);

  setTimerIntervalId(intervalId);
};

const stopTimer = () => {
  clearInterval(timerIntervalId);
  setTimer(0);
  setTimerIntervalId(null); // Resetting the interval ID when the timer stops
};


const saveToGallery = async (uri) => {
  try {
    const asset = await MediaLibrary.createAssetAsync(uri);
    await MediaLibrary.saveToLibraryAsync(asset);
    Alert.alert('Success', 'Media saved to gallery!');
  } catch (error) {
    Alert.alert('Error', 'Failed to save media to gallery.');
    console.error('Error saving media to gallery:', error);
  }
};


  return (

    <View style={{ flex: 1 }}>

      <View style={{ flex: 1 }}>
        <Camera
          ref={(ref) => setCamera(ref)}
          style={{ flex: 1, width: '100%' }}
          type={type}
        />

{startRec && <Text style={{ color: 'white', position:"absolute",bottom:30,right:40 }}>{` ${timer}s`}</Text>}

<TouchableOpacity style={{position:"absolute",top:40,left:10}}  onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}>

<FontAwesome6 name="camera-rotate" size={24} color="white" />
</TouchableOpacity>


      
       <View
          style={{
            position: 'absolute',
            bottom: 0,
            flexDirection: 'row',
            flex: 1,
            width: '100%',
            padding: 20,
            justifyContent: 'space-between'
          }}
        >
          <View
            style={{
              alignSelf: 'center',
              flex: 1,
              alignItems: 'center'
            }}
          >

            {startRec ?    <TouchableOpacity
              onPress={stopVideo}
              // style={{
              //   width: 70,
              //   height: 70,
              //   bottom: 0,
              //   borderRadius: 50,
              //   backgroundColor: '#fff',
              //   borderColor:"#9d0208",
              //   borderWidth:4,
              //   alignItems:"center"
              // }}
            >
              <AntDesign name="pausecircle" size={62} color="white" />
            </TouchableOpacity> :
             <TouchableOpacity
             onPress={takeVideo}
           
           >
            <AntDesign name="play" size={62} color="white" />
           </TouchableOpacity> 
            }
          

          </View>
        </View>

        {/* <TouchableOpacity style={{position:"absolute",bottom:30,right:20}} onPress={() => stopVideo()}  ><Text style={{color:"white"}}>Stop Recording</Text></TouchableOpacity> */}

      </View>



    </View>
  );
};

export default VideoRecorder;
