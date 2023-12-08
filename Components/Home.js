import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Avatar, Title, Caption, Drawer, TouchableRipple, Switch } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddGuardianComponent from './CreateGuardian';
import SideMenu from './SideMenu';
import ChangePasswordScreen from './ChangePassword';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import StudentDetailScreen from './StudentDetails'

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Retrieve guardianId and token from AsyncStorage
    AsyncStorage.multiGet(['guardianId', 'token']).then((result) => {
      const [guardianId, token] = result;

      // Extract the values from the key-value pairs
      const guardianIdValue = guardianId[1];
      const tokenValue = token[1];

      console.log(result);

      // Check if guardianIdValue and tokenValue are not null before making the API call
      if (guardianIdValue !== null && tokenValue !== null) {
        // Fetch user details and student list based on guardianId and token
        fetchData(guardianIdValue, tokenValue);
      } else {
        // Handle the case where either guardianIdValue or tokenValue is null
        console.error('guardianIdValue or tokenValue is null');
      }
    });
  }, []);

  const fetchData = async (guardianId, token) => {
    try {
      // Fetch user data
      const userResponse = await fetch(`http://172.17.120.180:3000/guardian/details/${guardianId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
        }),
      });

      if (!userResponse.ok) {
        throw new Error(`HTTP error! Status: ${userResponse.status}`);
      }

      const userData = await userResponse.json();
      const guardianData = userData.guardian;
      const studentData = guardianData.children;

      setUser(guardianData);
      setStudents(studentData || []); // Set an empty array if children is null or undefined
      console.log(studentData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderStudentList = () => {
    return students.map((student) => (
      <DrawerItem
        key={student.child._id}
        label={student.child.name}
        onPress={() => navigation.navigate('StudentDetails', { studentName: student.child.name })}
        icon={({ color, size }) => (
          <Avatar.Icon size={size} icon="account-child" color={color} style={{ backgroundColor: 'white' }} />
        )}
      />
    ));
  };
  

  

  const Drawer = createDrawerNavigator();

  const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props}>
        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <Image source={require('../assets/logo.jpeg')} style={{ width: 80, height: 80, borderRadius: 40 }} />
        </View>
        <ScrollView>{renderStudentList()}</ScrollView>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    );
  };


  function MyDrawer() {
    return (
      <Drawer.Navigator initialRouteName="ChangePassword" drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="lock" size={size} color={color} />
            ),
          }}
        />
        {/* Conditionally render AddGuardianComponent only if students data is available */}
        {students.length > 0 && (
          <Drawer.Screen
            name="Add Guardian"
            component={AddGuardianComponent}
            initialParams={{ students: students }} // Ensure that students is not undefined
            options={{
              drawerIcon: ({ color, size }) => (
                <Avatar.Icon size={size} icon="account-plus" color={color} style={{ backgroundColor: 'white' }} />
              ),
            }}
          />
        )}


        <Drawer.Screen
          name="Logout"
          component={SideMenu}
          options={{
            drawerIcon: ({ color, size }) => (
              <Avatar.Icon size={size} icon="logout" color={color} style={{ backgroundColor: 'white' }} />
            ),
          }}
        />
      </Drawer.Navigator>
    );
  }

  return <>{MyDrawer()}</>;
};

export default HomeScreen;
