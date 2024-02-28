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
const validationSchema = yup.object().shape({
  district: yup.string().required('District is required'),
  block: yup.string().required('Block is required'),
  panchayat: yup.string().required('Panchayat is required'),
  village: yup.string().required('Village is required'),
  projectArea: yup.string().required('Project Area is required'),
  activity: yup.string().required('Activity is required'),
  nameOfActivity: yup.string().required('Name of Activity is required'),
  uniqueCode: yup.string().required('Unique Code is required'),
  latLong: yup.string().required('Lat & Long is required'),
  shortDetail: yup.string().max(250, 'Short Detail should be at most 250 characters'),
  photos: yup
    .array()
    .min(1, 'Minimum 1 photo is required')
    .max(4, 'Maximum 4 photos are allowed'),
  videos: yup.array().max(1, 'Only one video is allowed'),
});

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
  photos: [],
  videos: [],
};

const createProjectScreen = () => {

  const [cameraRef, setCameraRef] = useState(null);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [location, setLocation] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [imageArray, setImageArray] = useState([]);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const locationData = await Location.getCurrentPositionAsync({});
        console.log('Location Data:', locationData);
        console.log(locationData)
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
  }, [])
  const takePicture = async () => {

    if (imageArray.length >= 4) {
      Alert.alert(
        'Maximum 4 photos allowed',
        'You already take 4 photos.'
      )
      return;
    }
    if (cameraRef) {
      try {
        console.log(location.accuracy)
        // Ensure location data is available
        if (!location || !location.accuracy || location.accuracy > 500) {
          Alert.alert(
            'Location Accuracy Warning',
            'Location accuracy should be within 5 meters. Please wait for a more accurate location.'
          );
          return;
        }

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



  const handleVideoUpload = () => {
    // Your existing video upload logic here
  };
  const handleSubmit = (values) => {
    // Handle form submission here
    console.log(values);
  };


  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus === 'granted');


    })();
  }, []);

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
        onSubmit={handleSubmit}
        validationSchema={validationSchema}

      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View>
            {/* District dropdown */}

            <View style={{ margin: 5 }}>

              <Text>District*</Text>
              <View style={styles.inputBox}>
                <Picker
                  selectedValue={values.district}
                  onValueChange={handleChange('district')}
                  onBlur={handleBlur('district')}
                >
                  <Picker.Item label="Select District" value="" />
                  {
                    districts.map((item) => (
                      <Picker.Item label={item.name} value={item.name} />
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
                  selectedValue={values.activity}
                  onValueChange={handleChange('activity')}
                  onBlur={handleBlur('activity')}
                >
                  <Picker.Item label="Select Activity" value="" />
                  <Picker.Item label="Structure" value="Structure" />
                  <Picker.Item label="Training" value="Training" />
                  <Picker.Item label="Interview" value="Interview" />
                  <Picker.Item label="Livestock" value="Livestock" />
                  <Picker.Item label="Seeds" value="Seeds" />
                </Picker>
                {errors.activity && <Text style={{ color: 'red' }}>{errors.activity}</Text>}
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
                <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
                  <Ionicons name="camera" size={24} color="white" />
                </TouchableOpacity>
                <View style={{ flexDirection: "row" }}>
                  {imageArray.map((photo, index) => (
                    <View key={index} style={{ marginVertical: 10, marginRight: 5 }}>
                      <Image source={{ uri: photo.uri }} style={{ width: 80, height: 80 }} />
                    </View>
                  ))}
                </View>

                {errors.photos && <Text style={{ color: 'red' }}>{errors.photos}</Text>}
              </View>)}






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












            {/* Your submit button */}
            <Button onPress={handleSubmit} title="Submit" />
          </View>
        )}
      </Formik>

    </ScrollView>


  );
};

export default createProjectScreen;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
    padding: 20,
    paddingTop: 50,

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

});