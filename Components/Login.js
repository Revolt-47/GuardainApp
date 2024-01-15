import React, { useState,useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Image } from 'react-native';
import { TextInput, Button, Snackbar, Text } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const backgroundImage = require('../assets/logo.jpeg'); // Import the background image
const logoImage = require('../assets/logo.jpeg'); // Import the circular logo image

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPasswordModalVisible, setIsForgotPasswordModalVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');


  useEffect(() => {
    // Retrieve guardianId and token from AsyncStorage
    AsyncStorage.multiGet(['guardianId', 'token']).then((result) => {
      const [guardianId, token] = result;

      // Extract the values from the key-value pairs
      const guardianIdValue = guardianId[1];
      const tokenValue = token[1];

      if(guardianIdValue && tokenValue){
          navigation.navigate('Home')
      }
    });
  }, []);

  const handleLogin = async () => {
    try {
      console.log(email, password);
  
      const response = await fetch('http://192.168.18.51:3000/guardian/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
  
      if (!response.ok) {
        // Handle non-successful response
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log(responseData)
      const token = responseData.token;
      const guardianId = responseData.guradianId;
  
// Store the token and guardianId in local storage
await AsyncStorage.setItem('token', token);
await AsyncStorage.setItem('guardianId', guardianId);

  
      // Display a success snackbar
      setSnackbarMessage('Login Successful');
      setSnackbarVisible(true);
  
      // Navigate to the Home screen
      navigation.navigate('Home');
    } catch (error) {
      console.error('Login failed:', error);

      // Display an error snackbar
      setSnackbarMessage(
        'Login Failed. Please check your credentials and try again.'
      );
      setSnackbarVisible(true);
    }
  };

  const handleForgotPassword = () => {
    // Add logic to handle the "Forgot Password" action, e.g., navigate to a reset password screen.
    // For now, you can display a simple alert.
    navigation.navigate('ForgotPassword');
  }
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImage} style={styles.logo} />
        <Text style={styles.heading}>Parent/Guardian App</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
        />
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Login
        </Button>
        <Text style={styles.forgotPasswordLink} onPress={handleForgotPassword}>
          Forgot Password?
        </Text>
      </View>
      <Text style={styles.credentialsText}>
        Your credentials were sent to your email by the School Administrator when you signed up your child.
      </Text>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000} // 2 seconds
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    backgroundColor: '#F7F7F7',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40, // Make it circular
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white background
  },
  button: {
    marginTop: 16,
    backgroundColor: '#000', // Black button background
  },
  credentialsText: {
    marginTop: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 10,
  },
  forgotPasswordLink: {
    textAlign: 'center',
    color: '#0000FF', // Blue color for the link
    textDecorationLine: 'underline',
    marginTop: 8,
  },
});

export default LoginScreen;