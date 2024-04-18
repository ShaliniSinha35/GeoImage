// store.js
import { legacy_createStore as createStore } from "redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import EmployeeReducer from "./reducers/EmployeeReducer";

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, EmployeeReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);






export default store;
