import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image,BackHandler } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import uuid from 'react-native-uuid';
import * as ImageManipulator from 'expo-image-manipulator';
import { MaterialIcons } from '@expo/vector-icons';
import CameraPreview from '../Components/CameraPreview';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import VideoRecorder from '../Components/VideoRecorder';
import * as FileSystem from 'expo-file-system';
import { AntDesign } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
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

const DemoScreen = ({navigation}) => {



  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPressButton);

    return () => {
      // Remove the event listener when the component is unmounted
      backHandler.remove();
    };
  }, []);

  const handleBackPressButton = () => {
    handleBackPress()

    return true;
  }; 


  const [cameraRef, setCameraRef] = useState(null);
  const [location, setLocation] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [imageArray, setImageArray] = useState([]);
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [startCamera, setStartCamera] = React.useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  const [videoArray,setVideoArray] = useState(null)


  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const locationSubscription = await Location.watchPositionAsync(
          {
            enableHighAccuracy: true,
            accuracy: Location.Accuracy.BestForNavigation

          },
          (newLocation) => {
            // console.log("Location:", newLocation.coords);
            // console.log("Accuracy:", newLocation.coords.accuracy);
            setLocation(newLocation.coords);
          }
        );
  
       
      } else {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };
  
  useEffect(() => {
    getLocation();
  
  }, []);
  

  const takePicture = async () => {



    // console.log("107", imageArray.length)

    if (imageArray.length >= 4) {
      Alert.alert(
        'Maximum 4 photos allowed',
        'You already took 4 photos.'
      );
      return;
    }

    if (cameraRef) {
      try {

        const accuracyThreshold = 10; // Set your desired accuracy threshold in meters

        if (location.accuracy <= accuracyThreshold) {
          const photo = await cameraRef.takePictureAsync();


          const imageWithLocation = await addLocationToImage(photo.uri);

          // Resize and compress image to approximately 1 MB
          const resizedImage = await resizeImage(imageWithLocation);

          // Check resized photo size
          const fileSizeInBytes = await getPhotoSize(resizedImage.uri);
          const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

          if (fileSizeInMB < 1) {
            Alert.alert('Photo Size Limit Exceeded', 'Photo size should be 1 MB or less.');
            return;
          }

          setPreviewVisible(true)
          setCapturedImage(photo)

          // Add the image information to the array
          setImageArray([
            ...imageArray,
            {
              uri: resizedImage.uri,
              latitude: location.latitude,
              longitude: location.longitude,
              accuracy:location.accuracy,
              dateTime: new Date(),
            },
          ]);
        }
        else {
          // Location accuracy does not meet the threshold, consider waiting for a more accurate location
          Alert.alert(
            'Location Accuracy Warning',
            'Location accuracy should be within 10 meters. Please wait for a more accurate location.'
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
  
      // Log the size of the resized image
      const resizedSize = await getPhotoSize(resizedImage.uri);
      console.log('Resized Image Size (bytes):', resizedSize, 'bytes');
      console.log('Resized Image Size (KB):', resizedSize / 1024, 'KB');
  
      await MediaLibrary.saveToLibraryAsync(resizedImage.uri);
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



  const handleSubmitForm = async (values) => {

    // console.log(imageArray.length)
    // console.log("Form submitted:", values);
    if (values.district == "" || values.nameOfActivity == "" || imageArray.length == 0) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }



    // console.log("Form submitted:", values);

    // console.log(values.district, values.nameOfActivity, imageArray.length)
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

      const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryStatus === 'granted');

      const audioStatus = await Camera.requestMicrophonePermissionsAsync();
      setHasAudioPermission(audioStatus.status === 'granted');


    })();
  }, []);
  useEffect(() => {
    setStartCamera(false)
    setCapturedImage(null)
    setPreviewVisible(false)
  }, [])


  const __startCamera = async () => {
    if (imageArray.length >= 4)
     {
      Alert.alert(
        'Maximum 4 photos allowed',
        'You already took 4 photos.'
      );
      return;
    }

    const { status } = await Camera.requestCameraPermissionsAsync()
    if (status === 'granted') {
      // start the camera
      setStartCamera(true)

    } else {
      Alert.alert('Access denied')
    }
  }

  const __retakePicture = (uri) => {
    // console.log(uri)

    const newArr = imageArray.filter((image) => {
      console.log(image.uri, uri)
    })
    console.log("344", newArr)
    setCapturedImage(null)
    setPreviewVisible(false)
    __startCamera()
  }

  const handleBackPress = ()=>{
    setStartCamera(false)
    setCapturedImage(null)
    setPreviewVisible(false)
  }


  const saveToGallery = async (uri) => {
    setStartCamera(false)
    setCapturedImage(null)
    setPreviewVisible(false)
    try {
      if (!hasMediaLibraryPermission) {
        throw new Error('Missing MEDIA_LIBRARY permissions.');
      }

      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync('YourAlbumName');

      if (album === null) {
        await MediaLibrary.createAlbumAsync('YourAlbumName', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
    } catch (error) {
      console.error('Error saving to gallery:', error);
    }
  };






 

  return (

    startCamera ?
      previewVisible && capturedImage ? (
        <CameraPreview photo={capturedImage} savePhoto={saveToGallery} retakePicture={__retakePicture} handleBack ={handleBackPress} />
      ) : <>

        <Camera
          ref={(ref) => setCameraRef(ref)}
          style={{ flex: 1, width: "100%" }}
          type={Camera.Constants.Type.back}
        />
        <Text style={{ position: "absolute", top: 60, left: 10, color: "white" }}>
          Lat: {location?.latitude}, Long: {location?.longitude}, Accuracy : {location?.accuracy.toFixed(2)}
        </Text>

        <TouchableOpacity style={{position:"absolute",right:10,top:25}} onPress={()=>handleBackPress()}>

        <AntDesign name="close" size={30} color="white"  />
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
            <TouchableOpacity
              onPress={takePicture}
              style={{
                width: 70,
                height: 70,
                bottom: 0,
                borderRadius: 50,
                backgroundColor: '#fff',
                borderColor:"#9d0208",
                borderWidth:4
              }}
            />
          </View>
        </View>

      </>




      :
      //  <VideoRecorder></VideoRecorder>
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

            <View style={{ marginBottom: 60 }}>

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



              <TouchableOpacity
                onPress={__startCamera}
                style={{
                  width: 180,
                  borderRadius: 4,
                  backgroundColor: '#14274e',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 50,
                  marginBottom: 20
                }}
              >

                <MaterialCommunityIcons name="camera" size={24} color="white" />
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginLeft: 5
                  }}
                >
                  Take picture
                </Text>
              </TouchableOpacity>


              <View style={{ flexDirection: "row" }}>
                {/* {console.log(imageArray[0])} */}
                {imageArray.map((photo, index) => (
                  <View key={index} style={{ marginVertical: 10, marginRight: 5 }}>
                    <Image source={{ uri: photo.uri }} style={{ width: 80, height: 80 }} />
                
                    <Text>Accuracy: {photo.accuracy.toFixed(2)}</Text>
                    <TouchableOpacity onPress={() => deletePhoto(index)} style={styles.deleteButton}>
                      <MaterialIcons name="delete" size={24} color="#e9ecef" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>



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



              {/* <VideoRecorder></VideoRecorder> */}


              {/* <TouchableOpacity
                onPress={()=>navigation.navigate("video")}
                style={{
                  width: 180,
                  borderRadius: 4,
                  backgroundColor: '#14274e',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 50,
                  marginBottom: 20
                }}
              >

                <MaterialCommunityIcons name="camera" size={24} color="white" />
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginLeft: 5
                  }}
                >
                  Take Video
                </Text>
              </TouchableOpacity> */}


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

export default DemoScreen;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
    padding: 20,
    paddingTop: 50,
    paddingBottom: 50

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



// {imageArray.length !== 0 && (
//   <>
    
//     <MapView
//       style={{ flex: 1, height: 200 }}
//       initialRegion={{
//         latitude: imageArray[0].latitude,
//         longitude: imageArray[0].longitude,
//         latitudeDelta: 0.01, // Adjust as needed
//         longitudeDelta: 0.01, // Adjust as needed
//       }}
//     >
     
//       <Marker
//         coordinate={{
//           latitude: imageArray[0].latitude,
//           longitude: imageArray[0].longitude,
//         }}
//         title="Image Location"
//         description="This is where the image was taken."
//       />
//     </MapView>

 
//   </>
// )}
