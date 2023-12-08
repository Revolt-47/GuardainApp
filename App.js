import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './Components/Login';
import HomeScreen from './Components/Home';
import StudentDetailScreen from './Components/StudentDetails';


const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <View style={styles.container}>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen}  options={{ headerShown: false }}/>
            <Stack.Screen name="Home" component={HomeScreen}  options={{ headerShown: false }}/>
            <Stack.Screen name="StudentDetails" component={StudentDetailScreen}  options={{ headerShown: false }}/>
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
