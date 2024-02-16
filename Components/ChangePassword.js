import React, { useState } from "react";
import { ScrollView, Image, StyleSheet } from "react-native";
import { Button, Input, Text } from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Snackbar } from "react-native-paper";

const ChangePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSnackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChangePassword = async () => {
    try {
      // Retrieve guardianId and token from AsyncStorage
      const result = await AsyncStorage.multiGet(["guardianId", "token"]);
      const [guardianId, token] = result;

      // Extract the values from the key-value pairs
      const guardianIdValue = guardianId[1];
      const tokenValue = token[1];

      // Check if the authentication token is available
      if (!tokenValue) {
        console.error("Authentication token not found in local storage.");
        return;
      }

      // Prepare the request body
      const requestBody = {
        guardianId: guardianIdValue,
        token: tokenValue,
        oldPassword: oldPassword,
        newPassword: newPassword,
      };

      // Make a POST request to change password
      const response = await fetch(
        "http://172.17.44.214:3000/guardian/changepw",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      // Handle the response
      const responseData = await response.json();
      console.log("Password change response:", responseData);

      // Check if password change was successful
      if (responseData.message === "Password changed successfully.") {
        setSnackbarMessage("Password changed successfully.");
        setSnackbarVisible(true);
        setOldPassword("");
        setNewPassword("");
      } else {
        setSnackbarMessage(
          "Failed to change password. Please check your old password."
        );
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
      <Image source={require("../assets/logo.png")} style={styles.logo} />

      <Text category="h5" style={styles.title}>
        Change Password
      </Text>

      <Input
        style={styles.input}
        placeholder="Enter Old Password"
        secureTextEntry={!showPassword}
        value={oldPassword}
        onChangeText={setOldPassword}
      />

      <Input
        style={styles.input}
        placeholder="Enter New Password"
        secureTextEntry={!showPassword}
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <Button
        onPress={() => setShowPassword(!showPassword)}
        style={styles.toggleButton}
      >
        {showPassword ? "Hide Password" : "Show Password"}
      </Button>

      <Button
        onPress={handleChangePassword}
        style={styles.submitButton}
        disabled={!oldPassword || !newPassword}
      >
        Change Password
      </Button>

      <Snackbar
        visible={isSnackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000} // Adjust the duration as needed
        action={{
          label: "OK",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    color: "black",
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  toggleButton: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 16,
  },
});

export default ChangePasswordScreen;
