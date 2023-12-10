import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, Button, Avatar,Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UpdateProfileScreen = ({ route }) => {
  const [contactNumber, setContactNumber] = useState(route.params.user.contactNumber);
  const [address, setAddress] = useState(route.params.user.address);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleUpdateProfile = async () => {
    try {
      const result = await AsyncStorage.multiGet(['guardianId', 'token']);
      const [guardianId, token] = result;

      const guardianIdValue = guardianId[1];
      const tokenValue = token[1];

      if (!tokenValue) {
        console.error('Authentication token not found in local storage.');
        return;
      }

      const response = await fetch(`http://192.168.18.51:3000/guardian/${guardianIdValue}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: address,
          token: tokenValue,
          contactNumber: contactNumber,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setSnackbarMessage('Profile Updated Successfully');
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbarMessage('Failed to update profile');
      setSnackbarVisible(true);
    }
  };

  const onDismissSnackbar = () => {
    setSnackbarVisible(false);
  };


  return (
    <View style={styles.container}>
      <Avatar.Icon size={80} icon="account" style={styles.avatar} />

      <Text style={styles.label}>Name</Text>
      <TextInput mode="outlined" value={route.params.user.name} style={styles.input} disabled />

      <Text style={styles.label}>Email</Text>
      <TextInput mode="outlined" value={route.params.user.email} style={styles.input} disabled />

      <Text style={styles.label}>CNIC</Text>
      <TextInput mode="outlined" value={route.params.user.cnic} style={styles.input} disabled />

      <Text style={styles.label}>Contact Number</Text>
      <TextInput
        mode="outlined"
        value={contactNumber}
        onChangeText={(text) => setContactNumber(text)}
        style={styles.input}
        placeholder="Enter Contact Number"
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        mode="outlined"
        value={address}
        onChangeText={(text) => setAddress(text)}
        style={styles.input}
        placeholder="Enter Address"
      />

      <Button mode="contained" style={styles.button} onPress={handleUpdateProfile}>
        Update Profile
      </Button>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackbar}
        duration={3000} // You can adjust the duration as needed
        action={{
          label: 'OK',
          onPress: onDismissSnackbar,
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  avatar: {
    backgroundColor: 'black',
    marginBottom: 20,
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: 'black',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    backgroundColor: 'black',
  },
});

export default UpdateProfileScreen;
