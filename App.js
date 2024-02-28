import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './navigation/AppNavigation';
import { StyleSheet } from 'react-native';

const App = () => {
  return (
    <NavigationContainer>
      <AppNavigation></AppNavigation>
    </NavigationContainer>
  );
};

export default App;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
