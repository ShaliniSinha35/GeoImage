import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import uuid from 'react-native-uuid';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { MaterialIcons } from '@expo/vector-icons';

const validationSchema = yup.object().shape({
  district: yup.string().required('District is required'),
  // block: yup.string().required('Block is required'),
  // panchayat: yup.string().required('Panchayat is required'),
  // village: yup.string().required('Village is required'),
  // projectArea: yup.string().required('Project Area is required'),
  // activity: yup.string().required('Activity is required'),
  nameOfActivity: yup.string().required('Name of Activity is required'),
  uniqueCode: yup.string().required('Unique Code is required'),
  // latLong: yup.string().required('Lat & Long is required'),
  shortDetail: yup.string().max(250, 'Short Detail should be at most 250 characters'),

   
});
// "react-native-formik": "^1.7.8",

const initialValues = {
  district: '',
  block: '',
  panchayat: '',
  village: '',
  projectArea: '',
  activity: '',
  nameOfActivity: '',
  uniqueCode: uuid.v4(),
  latLong: '',
  shortDetail: '',
 
};

const HomeScreen = () => {


  const [openCamera, setOpenCamera]= useState(false)
  const [cameraRef, setCameraRef] = useState(null);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [location, setLocation] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [imageArray, setImageArray] = useState([]);
  const [videoArray, setVideoArray] = useState([]);
  const [value,setValue] = useState(null);
  const [recording, setRecording] = useState(false);
  const [videoUri, setVideoUri] = useState('');



  

  const [hasPermission, setHasPermission] = useState(null);
  const videoRef = useRef(null);






  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
      const locationData = await Location.getCurrentPositionAsync({enableHighAccuracy: true,
        accuracy: Location.Accuracy.High});

        console.log("85",locationData.coords)
        // console.log('Location Data:', locationData);
        // console.log(locationData)
        setLocation(locationData.coords);
      } else {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.error('Error getting location:', error);
    } 
  };



  useEffect(() => {
    getLocation()
  },[])



  const takePicture = async () => {

    console.log("107",imageArray.length)

    if (imageArray.length >= 4) {
      Alert.alert(
        'Maximum 4 photos allowed',
        'You already took 4 photos.'
      );
      return;
    }
  
    if (cameraRef) {
      try {
        // Request foreground location permissions
        // const { status } = await Location.requestForegroundPermissionsAsync();
        // if (status !== 'granted') {
        //   console.log('Location permission denied');
        //   return;
        // }
  
        // // Get current location data with the highest accuracy setting
        // const locationData = await Location.getCurrentPositionAsync({
        //   accuracy: Location.Accuracy.BestForNavigation,
        // });
  
        // Check if location accuracy is within the acceptable range
        const accuracyThreshold = 20; // Set your desired accuracy threshold in meters
  
        if (location.accuracy <= accuracyThreshold) {
          const photo = await cameraRef.takePictureAsync();
          const imageWithLocation = await addLocationToImage(photo.uri);
  
          // Resize and compress image to approximately 1 MB
          const resizedImage = await resizeImage(imageWithLocation);
  
          // Check resized photo size
          const fileSizeInBytes = await getPhotoSize(resizedImage.uri);
          const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
  
          if (fileSizeInMB > 1) {
            Alert.alert('Photo Size Limit Exceeded', 'Photo size should be 1 MB or less.');
            return;
          }
  
          // Add the image information to the array
          setImageArray([
            ...imageArray,
            {
              uri: resizedImage.uri,
              latitude: location.latitude,
              longitude: location.longitude,
              dateTime: new Date(),
            },
          ]);
        } else {
          // Location accuracy does not meet the threshold, consider waiting for a more accurate location
          Alert.alert(
            'Location Accuracy Warning',
            'Location accuracy should be within 5 meters. Please wait for a more accurate location.'
          );
        }
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };
  
  
  


  const addLocationToImage = async (uri) => {
    try {
      const { latitude, longitude } = location;
      // You can add the latitude and longitude to the image metadata here
      return uri;
    } catch (error) {
      console.error('Error adding location to image:', error);
      return uri;
    }
  };

  const getPhotoSize = async (uri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri, { size: true });

      return fileInfo.size;
    } catch (error) {

      console.error('Error getting photo size:', error);

      return 0;
    }
  };


  const resizeImage = async (uri) => {
    try {
      const resizedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      return resizedImage;
    } catch (error) {
      console.error('Error resizing image:', error);
      return { uri };
    }
  };


  const districts = [
    {
      id: 1,
      name: "Arwal"
    },
    {
      id: 2,
      name: "Aurangabad"
    },
    {
      id: 3,
      name: "Banka"
    },
    {
      id: 4,
      name: "Bhagalpur"

    },
    {
      id: 5,
      name: "Bhojpur"
    },
    {
      id: 6,
      name: "Buxar"
    },
    {
      id: 7,
      name: "Gaya"
    },
    {
      id: 8,
      name: "Jamui"
    },
    {
      id: 9,
      name: "Jehanabad"
    },
    {
      id: 10,
      name: "Kaimur"
    },
    {
      id: 11,
      name: "Lakhisarai"
    },
    {
      id: 12,
      name: "Munger"
    },
    {
      id: 13,
      name: "Nalanda"
    },
    {
      id: 14,
      name: "Nawada"
    },
    {
      id: 15,
      name: "Patna"
    },
    {
      id: 16,
      name: "Rohtas"
    },
    {
      id: 17,
      name: "Shiekpura"
    },

  ]



  const takeVideo = async () => {
    if (videoArray.length >= 1) {
      Alert.alert('Maximum 1 video allowed', 'You already took 1 video.');
      return;
    }
  
    if (cameraRef) {
      try {
        const { uri } = await cameraRef.recordAsync({ maxDuration: 120 }); // Maximum duration: 2 minutes
  
        // Check video size
        const videoSize = await getVideoSize(uri);
  
        if (videoSize > 10 * 1024 * 1024) {
          Alert.alert('Video Size Limit Exceeded', 'Video size should not exceed 10 MB.');
          return;
        }
  
        // Check video duration
        const videoDuration = await getVideoDuration(uri);
  
        if (videoDuration < 4 * 60 || videoDuration > 20 * 60) {
          Alert.alert('Invalid Video Duration', 'Video duration should be between 4 and 20 minutes.');
          return;
        }
  
        // Add the video information to the array
        setVideoArray([
          ...videoArray,
          {
            uri,
            duration: videoDuration,
          },
        ]);
      } catch (error) {
        console.error('Error taking video:', error);
      }
    }
  };
  
  
  
    
  const handleSubmitForm = async (values) => {

console.log(imageArray.length)
console.log("Form submitted:", values);
if(values.district == "" || values.nameOfActivity == "" || imageArray.length == 0){
  Alert.alert('Validation Error', 'Please fill in all required fields.');
  return;
}

  

    console.log("Form submitted:", values);

    console.log(values.district, values.nameOfActivity, imageArray.length)
    // try {
    //   // Validate other fields
    //   validationSchema.validateSync(values, { abortEarly: false });
    //   console.log("Form submitted:", values);
    // }
    
    // catch (error) {
    //   console.error("Error submitting form:", error);
  
    //   // Log detailed validation errors
    //   if (error.name === 'ValidationError' && error.errors) {
    //     console.log("Validation errors:", error.errors);
    //   }

  
      
    // }
  };
  
  const deletePhoto = (index) => {
    
    const updatedImageArray = [...imageArray];
    updatedImageArray.splice(index, 1);
    setImageArray(updatedImageArray);
  };

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus === 'granted');


    })();
  }, []);


  const startRecording = async () => {
    if (cameraRef.current) {
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

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


  return (
    <ScrollView style={styles.container}>
      <Text allowFontScaling={false}
        style={{
          height: 1,
          borderColor: "#D0D0D0",
          borderWidth: 2,
          marginTop: 10,
          marginBottom: 10,

        }}
      />

      <Text style={{ textAlign: "center", fontSize: 18 }}>Create New Project</Text>
      <Text allowFontScaling={false}
        style={{
          height: 1,
          borderColor: "#D0D0D0",
          borderWidth: 2,
          marginTop: 10,
          marginBottom: 20,

        }}
      />
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          // Manually check for validation errors
          validationSchema.validate(values, { abortEarly: false })
            .then(() => {
              // Validation successful, proceed with form submission
              // console.log("Form submitted:", values);
            })
            .catch(errors => {
              // Validation failed, update UI with errors
              // console.log("Validation errors:", errors);
              Alert.alert('Validation Error', 'Please fill in all required fields.');
            })
            .finally(() => setSubmitting(false));
        }}
        validationSchema={validationSchema}
    

      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, isSubmitting }) => (
          
          <View style={{marginBottom:60}}>
         
            {/* District dropdown */}
            <View style={{ margin: 5 }}>

              <Text>District*</Text>
              <View style={styles.inputBox}>
                <Picker
                  selectedValue={values.district}
                  onValueChange={handleChange('district')}
                  onBlur={handleBlur('district')
                }
                >
                  <Picker.Item label="Select District" value="" />
                  {
                    districts.map((item) => (
                      <Picker.Item key={item.key} label={item.name} value={item.name} />
                    ))
                  }



                  {/* Add other district options similarly */}
                </Picker>
                {errors.district && <Text style={{ color: 'red' }}>{errors.district}</Text>}
              </View>

            </View>


            {/* name of Activity */}
            <View style={{ margin: 5 }}>

              <Text>Name of Activity*</Text>
              <View style={styles.inputBox}>
                <Picker
                  selectedValue={values.nameOfActivity}
                  onValueChange={handleChange('nameOfActivity')}
                  onBlur={handleBlur('nameOfActivity')}
                >
                  <Picker.Item label="Select Activity" value="" />
                  <Picker.Item label="Structure" value="Structure" />
                  <Picker.Item label="Training" value="Training" />
                  <Picker.Item label="Interview" value="Interview" />
                  <Picker.Item label="Livestock" value="Livestock" />
                  <Picker.Item label="Seeds" value="Seeds" />
                </Picker>
                {errors.nameOfActivity && <Text style={{ color: 'red' }}>{errors.nameOfActivity}</Text>}
              </View>

            </View>


            {/* Auto unique code */}

            <View style={{ margin: 5 }} >
              <Text>Code*</Text>
              <TextInput
                onChangeText={handleChange('uniqueCode')}
                onBlur={handleBlur('uniqueCode')}
                value={values.uniqueCode}
                style={{ padding: 20, backgroundColor: "#fdfcfc" }}
              />
            </View>

        

            {/* Photo Upload */}
            {hasCameraPermission === null ? (
              <Text>Requesting camera permission</Text>
            ) : hasCameraPermission === false ? (
              <Text>No access to camera</Text>
            ) : (
              <View style={styles.cameraContainer}>
                <Camera
                  ref={(ref) => setCameraRef(ref)}
                  style={styles.camera}
                  type={Camera.Constants.Type.back}
                  
                />
          <Text>
        Lat: {location?.latitude}, Long: {location?.longitude}, Accuracy : {location?.accuracy}
      </Text>
                <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
                  <Ionicons name="camera" size={24} color="white" />
                </TouchableOpacity>
                <View style={{ flexDirection: "row" }}>
                  {console.log(imageArray)}
                  {imageArray.map((photo, index) => (
                    <View key={index} style={{ marginVertical: 10, marginRight: 5 }}>
                      <Image source={{ uri: photo.uri }} style={{ width: 80, height: 80 }} />
                      <TouchableOpacity onPress={() => deletePhoto(index)} style={styles.deleteButton}>
                      <MaterialIcons name="delete" size={24} color="#c1121f" />
                </TouchableOpacity>
                    </View>
                  ))}
                </View>


                {errors.photos && <Text style={{ color: 'red' }}>{errors.photos}</Text>}

              </View>
              )}




            {imageArray.length != 0 &&
              <>

                {/* latitude */}
                <View style={{ margin: 5 }} >
                  <Text>Latitude *</Text>
                  <TextInput
                    placeholder="Latitude"

                    defaultValue={String(imageArray[0].latitude)}


                    style={{ padding: 20, backgroundColor: "#fdfcfc" }}

                  />


                </View>


                {/* longitude */}

                <View style={{ margin: 5 }} >
                  <Text>Longitude*</Text>
                  <TextInput
                    placeholder="Longitude"
                    defaultValue={String(imageArray[0].longitude)}
                    style={{ padding: 20, backgroundColor: "#fdfcfc" }}

                  />

                </View>


                {/* short Details */}
                <View style={{ margin: 5 }} >
                  <Text>Short Details*</Text>
                  <TextInput
                    placeholder="Enter Short Details"
                    onChangeText={handleChange('shortDetail')}
                    onBlur={handleBlur('shortDetail')}
                    value={values.shortDetail}
                    style={{ padding: 20, backgroundColor: "#fdfcfc" }}
                    numberOfLines={4}

                  />
                  {errors.shortDetail && <Text style={{ color: 'red' }}>{errors.shortDetail}</Text>}
                </View>
              </>
             }



<Button
  onPress={() => {
    if (Object.keys(errors).length === 0 || !errors.photos) {
      handleSubmitForm(values);
    } else {
      // Handle validation errors, e.g., show an alert or update UI
      Alert.alert('Validation Error', 'Please fill in all required fields.');
    }
  }}
  title="Submit"
  disabled={Object.keys(errors).length > 0 && !!errors.photos}
/>


     


          </View>
           
        )}
      </Formik>

    </ScrollView>


  );
};

export default HomeScreen;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
    padding: 20,
    paddingTop: 50,
    paddingBottom:50

  },
  inputBox: {
    backgroundColor: "#fdfcfc",

  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
  },

 
  captureButton: {
    alignSelf: 'center',
    margin: 20,
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'transparent',
    padding: 5,
  },

});




     {/* video Upload */}
//      {hasCameraPermission === null ? (
//       <Text>Requesting camera permission</Text>
//     ) : hasCameraPermission === false ? (
//       <Text>No access to camera</Text>
//     ) : (
//       <View style={styles.cameraContainer}>
//         <Camera
//           ref={(ref) => setCameraRef(ref)}
//           style={styles.camera}
//           type={Camera.Constants.Type.back}
//         />
//       <TouchableOpacity onPress={recording ? stopRecording : startRecording} style={styles.captureButton}>
//       <Ionicons name="videocam" size={24} color="white" />
//   {/* <Ionicons name={recording ? 'square' : 'camera'} size={24} color="white" /> */}
// </TouchableOpacity>
       
//       </View>)}