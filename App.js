import React, {useState,useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, StatusBar } from 'react-native';
import { AppNavigator } from './navigation/AppNavigatior';
import {View, Text} from 'react-native'
import { Provider } from 'react-redux';
import { useSelector, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '././redux/store';
import LoginPage from './Screens/LoginPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider } from './Screens/AuthContext';

export default function App() {
 

  

  return (
       <View style={styles.container}>
        
          <Provider store={store}>
          <PersistGate  persistor={persistor}>

           
     <AuthProvider>
     <AppNavigator></AppNavigator>
     </AuthProvider>
       

          </PersistGate>


 
      <StatusBar
        backgroundColor='white'
        barStyle={"dark-content"}
        translucent={false}
      />
          </Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
});
