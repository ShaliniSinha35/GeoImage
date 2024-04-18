// AuthContext.js

import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoginValue, setIsLoginValue] = useState(false);
  const [employee,setEmployee]= useState(null)
  const [employeeId, setEmployeeId]=useState('')



  const isAlreadyLogin =async()=>{
    setIsLoginValue(true);
    try {
      const value = await AsyncStorage.getItem('employee')
      if(value !== null) {
       
        const data= JSON.parse(value)
         setEmployee(data)
         setEmployeeId(data.emp_id)
      }
  
    } catch(e) {
      console.log("38 error",e)
    }
  }

  const login = async() => {
    setIsLoginValue(true);
    try {
      const value = await AsyncStorage.getItem('employee')
      if(value !== null) {
       
        const data= JSON.parse(value)
         setEmployee(data)
      }
  
    } catch(e) {
      console.log("38 error",e)
    }

  };

  const logout = () => {
    setIsLoginValue(false);
  };

  return (
    <AuthContext.Provider value={{ isLoginValue, login, logout,isAlreadyLogin,employee,employeeId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
