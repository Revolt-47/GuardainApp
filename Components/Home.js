import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Avatar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddGuardianComponent from './CreateGuardian';
import SideMenu from './SideMenu';
import ChangePasswordScreen from './ChangePassword';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import StudentDetailsScreen from './StudentDetails';
import UpdateProfileScreen from './UpdateProfile';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      }
    });
  }, []);

  const fetchData = async (guardianId, token) => {
    try {
      // Fetch user data
      const userResponse = await fetch(`http://172.17.44.214:3000/guardian/details/${guardianId}`, {
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
      console.log(guardianData)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const Drawer = createDrawerNavigator();

  const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props}>
        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <Image source={require('../assets/logo.jpeg')} style={{ width: 80, height: 80, borderRadius: 40 }} />
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    );
  };

  function MyDrawer() {
    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    return (
      <Drawer.Navigator initialRouteName="Students" drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name="Students"
          component={StudentDetailsScreen}
          initialParams={{ students: students }}
          options={{
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-child" size={size} color={color} />
            ),
          }}
        />
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
          name="UpdateProfile"
          component={UpdateProfileScreen}
          initialParams={{ user: user }}
          options={{
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-edit" size={size} color={color} />
            ),
          }}
        />

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
