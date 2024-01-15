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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Snackbar } from "react-native-paper";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [isSnackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleForgotPassword = async () => {
    try {
      // request to server aur reset password link bhejo
      const response = await fetch("http://localhost:3000/guardian/forget-pw", {
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
      <Image source={require("../assets/logo.jpeg")} style={styles.logo} />

      <Text style={styles.title}>Forgot Password</Text>

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
    backgroundColor: "white",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "black",
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
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
    borderRadius: 8,
    marginTop: 16,
  },
  submitButtonText: {
    color: "white",
    textAlign: "center",
  },
});

export default ForgotPasswordScreen;