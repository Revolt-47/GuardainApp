import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text, Input, Avatar } from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Snackbar } from "react-native-paper";

const UpdateProfileScreen = ({ route }) => {
  const [contactNumber, setContactNumber] = useState(
    route.params.user.contactNumber
  );
  const [address, setAddress] = useState(route.params.user.address);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleUpdateProfile = async () => {
    try {
      const result = await AsyncStorage.multiGet(["guardianId", "token"]);
      const [guardianId, token] = result;

      const guardianIdValue = guardianId[1];
      const tokenValue = token[1];

      if (!tokenValue) {
        console.error("Authentication token not found in local storage.");
        return;
      }

      const response = await fetch(
        `http://172.17.44.214:3000/guardian/${guardianIdValue}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: address,
            token: tokenValue,
            contactNumber: contactNumber,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setSnackbarMessage("Profile Updated Successfully");
      setSnackbarVisible(true);
    } catch (error) {
      console.error("Error updating profile:", error);
      setSnackbarMessage("Failed to update profile");
      setSnackbarVisible(true);
    }
  };

  const onDismissSnackbar = () => {
    setSnackbarVisible(false);
  };

  return (
    <View style={styles.container}>
      <Avatar
        style={styles.avatar}
        size="giant"
        source={{ uri: "https://placekitten.com/200/200" }} // Provide a valid image URI
      />

      <Text category="h6" style={styles.label}>
        Name
      </Text>
      <Input value={route.params.user.name} style={styles.input} disabled />

      <Text category="h6" style={styles.label}>
        Email
      </Text>
      <Input value={route.params.user.email} style={styles.input} disabled />

      <Text category="h6" style={styles.label}>
        CNIC
      </Text>
      <Input value={route.params.user.cnic} style={styles.input} disabled />

      <Text category="h6" style={styles.label}>
        Contact Number
      </Text>
      <Input
        value={contactNumber}
        onChangeText={(text) => setContactNumber(text)}
        style={styles.input}
        placeholder="Enter Contact Number"
      />

      <Text category="h6" style={styles.label}>
        Address
      </Text>
      <Input
        value={address}
        onChangeText={(text) => setAddress(text)}
        style={styles.input}
        placeholder="Enter Address"
      />

      <Button onPress={handleUpdateProfile} style={styles.button}>
        Update Profile
      </Button>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackbar}
        duration={3000} // You can adjust the duration as needed
        action={{
          label: "OK",
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
    backgroundColor: "white",
  },
  avatar: {
    marginBottom: 20,
    alignSelf: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "black",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    backgroundColor: "black",
  },
});

export default UpdateProfileScreen;
