import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Register from './src/screens/Register/Register';
import Login from './src/screens/Login/Login';
import HomeMenu from './src/components/HomeMenu/HomeMenu'
// import Profile from './src/screens/Profile/Profile'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Login" component={ Login } options={{headerShown: false}}/>
      <Stack.Screen name="Register" component={ Register } options={{headerShown: false}}/>
      <Stack.Screen name="HomeMenu" component={ HomeMenu } options={{headerShown: false}}/> 
    </Stack.Navigator>
  </NavigationContainer>
  );
}
