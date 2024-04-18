
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
import * as MediaLibrary from 'expo-media-library';
import axios from "axios";
import { useAuth } from './AuthContext';






const HomeScreen = ({navigation}) => {


const {employeeId} = useAuth()
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


  const [dist,setDist] = useState(null)
  const [block, setBlock] = useState(null)
  const [panchayat, setPanchayat] = useState(null)
  const [village, setVillage] = useState(null)
  const [projectArea, setProjectArea] = useState(null)
  const [activityType, setActivityType] = useState(null)
  const [activityName, setActivityName] = useState(null)


  const [errors, setErrors] = useState(
    {
      district: '',
      block: '',
      panchayat: '',
      village: '',
      projectArea: '',
      activity: '',
      nameOfActivity: '',
      shortDetail: '',
    
  }); 

  const getDistrict = async()=>{

    try{
      const res= await axios.get("https://geolocation-backend-1.onrender.com/district")
      const data = res.data;
      setDist(data)
    }
    catch(err){
      console.log(err)
    }
 
  }


  const getBlock = async()=>{

    try{
      const res= await axios.get("https://geolocation-backend-1.onrender.com/block")
      const data = res.data;
      setBlock(data)
    }
    catch(err){
      console.log(err)
    }
 
  }


  const getPanchayat = async()=>{

    try{
      const res= await axios.get("https://geolocation-backend-1.onrender.com/panchayat")
      const data = res.data;
      setPanchayat(data)
    }
    catch(err){
      console.log(err)
    }
 
  }

  const getVillage = async()=>{

    try{
      const res= await axios.get("https://geolocation-backend-1.onrender.com/village")
      const data = res.data;
      setVillage(data)
    }
    catch(err){
      console.log(err)
    }
 
  }


  const getProjectArea = async()=>{

    try{
      const res= await axios.get("https://geolocation-backend-1.onrender.com/projectArea")
      const data = res.data;
    setProjectArea(data)
    }
    catch(err){
      console.log(err)
    }
 
  }

  const getActivityType = async()=>{

    try{
      const res= await axios.get("https://geolocation-backend-1.onrender.com/activity")
      const data = res.data;
      setActivityType(data)
    }
    catch(err){
      console.log(err)
    }
 
  }

  const getActivityName = async()=>{

    try{
      const res= await axios.get("https://geolocation-backend-1.onrender.com/activityName")
      const data = res.data;
      setActivityName(data)
    }
    catch(err){
      console.log(err)
    }
 
  }




  useEffect(()=>{
     getDistrict()
     getBlock()
     getPanchayat()
     getVillage()
     getProjectArea()
     getActivityType()
     getActivityName()
  },[])




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
          const fileSizeInKB = fileSizeInBytes / 1024;
          // console.log(fileSizeInKB,"fileSizeInKB")

          if (fileSizeInKB > 240) {
            Alert.alert('Photo Size Limit Exceeded', 'Photo size should be 250 KB or less.');
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
              imageDesc:values.shortDetail,
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


  
  const resizeImage = async (uri, maxSizeKB = 240) => {
    try {
      const targetSizeBytes = maxSizeKB * 1024; // Convert KB to bytes
  
     
      let compressionQuality = 1.0;
      let resizedImage, resizedSize;
  
      do {
        resizedImage = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 1024 } }],
          { compress: compressionQuality, format: ImageManipulator.SaveFormat.JPEG }
        );
  
        resizedSize = await getPhotoSize(resizedImage.uri);
  
    
        compressionQuality -= 0.1;
  
      } while (resizedSize > targetSizeBytes && compressionQuality > 0);
  
      console.log('Resized Image Size (bytes):', resizedSize, 'bytes');
      console.log('Resized Image Size (KB):', resizedSize / 1024, 'KB');
      return resizedImage;
    } catch (error) {
      console.error('Error resizing image:', error);
      return { uri };
    }
  };
  

  const [values, setValues] = useState(
    {
    district: '',
    block: '',
    panchayat: '',
    village: '',
    projectArea: '',
    activity: '',
    nameOfActivity: '',
    shortDetail: '',
  }
);



  const handleChange = (field) => (value) => {
    setValues({ ...values, [field]: value });
 
  };

  const handleBlur = (field) => () => {
    // Implement validation logic for onBlur event if needed
  };

  const handleSubmit = async() => {

      if(values.district == ""){
         errors.district = "District is Required"
       
      }
      if(values.block == ""){
        errors.block = "Block is Required"
       
      }
      if(values.panchayat == ""){
      errors.panchayat = "Panchayat is Required"

      }
      if(values.village == ""){
       errors.village = "Village is Required"
      }
      if(values.projectArea == ""){
       errors.projectArea = "Project area is Required"
      }
      if(values.activity == ""){
       errors.activity = "Activity is Required"
       }
      if(values.nameOfActivity == ""){
        errors.nameOfActivity = "Activity Name is Required"
      }


setErrors({ ...errors})
setTimeout(() => {
  setErrors({  
    district: '',
    block: '',
    panchayat: '',
    village: '',
    projectArea: '',
    activity: '',
    nameOfActivity: '',
    shortDetail: '',
 })
},3000);


if( values.block!="" && values.district !="" && values.panchayat!="" &&
   values.village!="" && values.projectArea!= "" && values.activity!="" && values.nameOfActivity!="" && imageArray.length >= 1){

  console.log('Form submitted with values:', values, imageArray);
    
  try {

    // https://geolocation-backend-1.onrender.com/
    // https://geolocation-backend-1.onrender.com/
    const response = await axios.post('https://geolocation-backend-1.onrender.com/addProject', {
      emp_id: employeeId,
      dist:values.district,
      block:values.block,
      panchayat:values.panchayat,
      village:values.village,
      projectArea:values.projectArea,
      activityType:values.activity,
      activityName:values.nameOfActivity,
      imageArray:imageArray,
      desc:values.shortDetail
    });

    console.log('Post successful:', response.data);
    Alert.alert('Success', 'Project submitted successfully');


    setValues( {
      district: '',
      block: '',
      panchayat: '',
      village: '',
      projectArea: '',
      activity: '',
      nameOfActivity: '',
      shortDetail: '',
    })
    setImageArray([])

    navigation.navigate("Home")


  } catch (error) {

    console.error('Error posting data:', error); 
    Alert.alert('Error', 'Failed to submit data');

  }
 
 

}
    
 
   
 
  };



  const uploadImage = async (imageUri) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri, 
      type: 'image/jpeg', // Adjust according to your image type
      name: 'photo.jpg', // Use any desired file name here
    });
  
    try {
      const response = await axios.post('http://your-server-ip:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Upload success:', response.data);
    } catch (error) {
      console.error('Upload failed:', error);
    }
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

    const resizedImage = await resizeImage(uri);


    try {
      if (!hasMediaLibraryPermission) {
        throw new Error('Missing MEDIA_LIBRARY permissions.');
      }

      const asset = await MediaLibrary.createAssetAsync(resizedImage.uri);
      const album = await MediaLibrary.getAlbumAsync('Images');

      if (album === null) {
        await MediaLibrary.createAlbumAsync('Images', asset, false);
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
            borderColor: "#001349",
            borderWidth: 2,
            marginTop: 10,
            marginBottom: 10,

          }}
        />

        <Text allowFontScaling={false} style={{ textAlign: "center", fontSize: 20,color:"#DA5050" }}><MaterialIcons name="assignment-add" size={24} color="#001349" /> Add New Project</Text>
        <Text allowFontScaling={false}
          style={{
            height: 1,
            borderColor: "#001349",
            borderWidth: 2,
            marginTop: 10,
            marginBottom: 20,

          }}
        />
        <View>

            <View style={{ marginBottom: 60 }}>

              {/* District dropdown */}
              <View style={{ margin: 5 }}>

                <Text>District*</Text>
                <View style={styles.inputBox}>
                  <Picker
             selectedValue={values.district}
             onValueChange={(itemValue, itemIndex) => {
               setValues({ ...values, district: itemValue }); // Update district value
             }}
           
                  >
                    <Picker.Item label="Select District" value="" />
                    {
                       dist!= null &&  dist.map((item) => (
                        <Picker.Item key={item.key} label={item.name} value={item.name} />
                      ))
                    }



                    {/* Add other district options similarly */}
                  </Picker>
                  {errors.district && <Text style={{ color: 'red' }}>{errors.district}</Text>}
                </View>

              </View>


                {/* block dropdown */}
                <View style={{ margin: 5 }}>

<Text>Block*</Text>
<View style={styles.inputBox}>
  <Picker
      selectedValue={values.block}
      onValueChange={(itemValue, itemIndex) => {
       
        setValues({ ...values, block: itemValue });
      }}
 
  >
    <Picker.Item label="Select Block" value="" />
    {
      block!=null &&  block.map((item) => (
        <Picker.Item key={item.key} label={item.name} value={item.name} />
      ))
    }



   
  </Picker>
  {errors.block && <Text style={{ color: 'red' }}>{errors.block}</Text>}
</View>

                </View>


                          {/* panchayat dropdown */}
                          <View style={{ margin: 5 }}>

<Text>Panchayat*</Text>
<View style={styles.inputBox}>
  <Picker
  selectedValue={values.panchayat}
  onValueChange={(itemValue, itemIndex) => {
   
    setValues({ ...values, panchayat: itemValue });
  }}

  >
    <Picker.Item label="Select Panchayat" value="" />
    {
         panchayat!=null &&  panchayat.map((item)=> (
        <Picker.Item key={item.key} label={item.name} value={item.name} />
      ))
    }



   
  </Picker>
  {errors.panchayat && <Text style={{ color: 'red' }}>{errors.panchayat}</Text>}
</View>

                </View>



                
                          {/* Village dropdown */}
                          <View style={{ margin: 5 }}>

<Text>Village*</Text>
<View style={styles.inputBox}>
  <Picker
     selectedValue={values.village}
     onValueChange={(itemValue, itemIndex) => {
      
      setValues({ ...values, village: itemValue });
     }}
 
  >
    <Picker.Item label="Select Village" value="" />
    {
      village!=null &&  village.map((item) => (
        <Picker.Item key={item.key} label={item.name} value={item.name} />
      ))
    }



   
  </Picker>
  {errors.village && <Text style={{ color: 'red' }}>{errors.village}</Text>}
</View>

                         </View>


                              {/* Project Area dropdown */}
                              <View style={{ margin: 5 }}>

<Text>Project Area*</Text>
<View style={styles.inputBox}>
  <Picker
   selectedValue={values.projectArea}
   onValueChange={(itemValue, itemIndex) => {
    
    setValues({ ...values, projectArea: itemValue });
   }}

  >
    <Picker.Item label="Select Project Area" value="" />
    {
      projectArea!=null &&  projectArea.map((item) => (
        <Picker.Item key={item.key} label={item.name} value={item.name} />
      ))
    }



   
  </Picker>
  {errors.projectArea && <Text style={{ color: 'red' }}>{errors.projectArea}</Text>}
</View>

                         </View>



                              {/* Activity dropdown */}
                              <View style={{ margin: 5 }}>

<Text>Activity*</Text>
<View style={styles.inputBox}>
  <Picker
  selectedValue={values.activity}
  onValueChange={(itemValue, itemIndex) => {
   
    setValues({ ...values, activity: itemValue });
  }}

  >
    <Picker.Item label="Select Activity" value="" />
    {
       activityType!=null && activityType.map((item) => (
        <Picker.Item key={item.key} label={item.name} value={item.name} />
      ))
    }



   
  </Picker>
  {errors.activity && <Text style={{ color: 'red' }}>{errors.activity}</Text>}
</View>

                         </View>


              {/* name of Activity */}
              <View style={{ margin: 5 }}>

                <Text>Name of Activity*</Text>
                <View style={styles.inputBox}>
                  <Picker
                selectedValue={values.nameOfActivity}
                onValueChange={(itemValue, itemIndex) => {
                 
                  setValues({ ...values, nameOfActivity: itemValue });
                }}
        
                  >
                  {
       activityName!=null && activityName.map((item) => (
        <Picker.Item key={item.key} label={item.name} value={item.name} />
      ))}
                  </Picker>
                  {errors.nameOfActivity && <Text style={{ color: 'red' }}>{errors.nameOfActivity}</Text>}
                </View>

              </View>


          



              <TouchableOpacity
                onPress={__startCamera}
                style={{
                  width: 180,
                  borderRadius: 4,
                  backgroundColor: '#b9d6f2',
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






             

              <View style={{width:Dimensions.get("screen").width * 0.9 , alignItems:"center"}}>
              <TouchableOpacity   onPress={()=>handleSubmit()} style={{width:250,padding:15,backgroundColor:"#001349",alignItems:"center",justifyContent:"center"}}>
                  <Text style={{color:"white",fontSize:18}}>Submit Your Project</Text>
              </TouchableOpacity>
              </View>


         


            



            </View>

    
        </View>


 




        
         
        

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



