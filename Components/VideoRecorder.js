import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

import { Audio } from 'expo-av';
const VideoRecorder = () => {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [recording, setRecording] = useState(false);
  const cameraRef = useRef(null);
  const videoRef = useRef(null);


  useEffect(() => {
    const getPermissions = async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const audioStatus = await Audio.requestPermissionsAsync();
      setHasAudioPermission(audioStatus.status === 'granted');
    };

    getPermissions();
  }, []);

  const startRecording = async () => {

    if (cameraRef.current && hasCameraPermission && hasAudioPermission) {
      try {
        const { uri } = await cameraRef.current.recordAsync();
        setRecording(true);
        console.log('Recording started');
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
      setRecording(false);
      console.log('Recording stopped');
    }
  };

  const handleRecordButton = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSaveButton = async () => {
    if (videoRef.current) {
      const info = await videoRef.current.getVideoInfoAsync();
      const newUri = `${FileSystem.documentDirectory}VID_${Date.now()}.mp4`;

      await FileSystem.moveAsync({
        from: info.uri,
        to: newUri,
      });

      console.log('Video saved:', newUri);
    }
  };

//   if (hasPermission === null) {
//     return <View />;
//   }

//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        type={Camera.Constants.Type.back}
        ref={cameraRef}
        useCamera2Api
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}
        >
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              margin: 20,
            }}
            onPress={handleRecordButton}
          >
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
              {recording ? 'Stop Recording' : 'Start Recording'}
            </Text>
          </TouchableOpacity>
        </View>
      </Camera>
      {recording && (
        <TouchableOpacity
          style={{
            alignSelf: 'flex-end',
            alignItems: 'center',
            margin: 20,
          }}
          onPress={handleSaveButton}
        >
          <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
            Save
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoRecorder;
