import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Snackbar } from "react-native-paper";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [isSnackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleForgotPassword = async () => {
    try {
      // request to server aur reset password link bhejo
      const response = await fetch("http://localhost:3000/guardians/forget-pw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        // successful
        setSnackbarMessage(
          "Password reset link sent successfully. Check your email."
        );
        setSnackbarVisible(true);
      } else {
        // failed
        setSnackbarMessage(
          "Failed to send reset password link. Please check your email address."
        );
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error("Error sending reset password link:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
      <Image source={require("../assets/logo.png")} style={styles.logo} />

      <Text category="h5" style={styles.title}>
        Forgot Password
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Email Address"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity onPress={handleForgotPassword} disabled={!email}>
        <View style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Send Reset Link</Text>
        </View>
      </TouchableOpacity>

      <Snackbar
        visible={isSnackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
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
    backgroundColor: "#F7F7F7",
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
    borderRadius: 25, // Make input fields circular
    padding: 8,
    color: "black",
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "black",
    padding: 16,
    marginTop: 16,
    borderRadius: 25,
    borderColor: "#7e7e7e", // Set border color
    backgroundColor: "#7e7e7e",
  },
  submitButtonText: {
    color: "white",
    textAlign: "center",
  },
});

export default ForgotPasswordScreen;
