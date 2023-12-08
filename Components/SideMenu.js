import React, { useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';



const SideMenu = ({ navigation }) => {


  useEffect(()=>{
    handleLogout();
  })


  const handleLogout = async () => {
    // Perform logout logic, such as clearing the AsyncStorage and navigating to the login screen.
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('guardianId');
    navigation.navigate('Login');
  };

  return (
    <>
      <DrawerItem
        label="Logout"
        onPress={handleLogout}
      />
      {/* Add other DrawerItems as needed */}
</>
  );
};



export default SideMenu;
