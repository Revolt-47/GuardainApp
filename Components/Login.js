import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Input, Text, Layout } from "@ui-kitten/components";
import { Snackbar } from "react-native-paper";
import { registerIndieID, unregisterIndieDevice } from 'native-notify';

const logoImage = require("../assets/logo.png");
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    // Retrieve guardianId and token from AsyncStorage
    AsyncStorage.multiGet(["guardianId", "token"]).then((result) => {
      const [guardianId, token] = result;

      // Extract the values from the key-value pairs
      const guardianIdValue = guardianId[1];
      const tokenValue = token[1];

      if (guardianIdValue && tokenValue) {
        navigation.navigate("Home");
      }
    });
  }, []);

  const handleLogin = async () => {
    try {
      console.log(email, password);

      const response = await fetch("http://192.168.18.53:3000/guardians/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      console.log(responseData);
      const token = responseData.token;
      const guardianId = responseData.guradianId;
      registerIndieID(guardianId, 19959, 'tOGmciFdfRxvdPDp3MiotN');
      // Store the token and guardianId in local storage
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("guardianId", guardianId);

      // Display a success snackbar
      setSnackbarMessage("Login Successful");
      setSnackbarVisible(true);

      // Navigate to the Home screen
      navigation.navigate("Home");
    } catch (error) {
      console.error("Login failed:", error);

      // Display an error snackbar
      setSnackbarMessage(
        "Login Failed. Please check your credentials and try again."
      );
      setSnackbarVisible(true);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Layout style={styles.container}>
        <Image source={logoImage} style={styles.logo} />
        <Text category="h4" style={styles.heading}>
          Parent/Guardian App
        </Text>
        <View style={styles.formContainer}>
          <View style={styles.formShapeContainer}>
            <Input
              label="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
              placeholder="Enter your email"
            />
            <Input
              label="Password"
              value={password}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
              style={styles.input}
              placeholder="Enter your password"
            />
            <Button
              onPress={handleLogin}
              style={styles.button}
              appearance="filled"
            >
              Login
            </Button>
            <Text
              style={styles.forgotPasswordLink}
              onPress={handleForgotPassword}
            >
              Forgot Password?
            </Text>
          </View>
          <Text style={styles.credentialsText}>
            Your credentials were sent to your email by the School Administrator
            when you signed up your child.
          </Text>
        </View>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2000}
        >
          {snackbarMessage}
        </Snackbar>
      </Layout>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  formShapeContainer: {
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },
  heading: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  input: {
    marginBottom: 16,
    borderRadius: 25,
  },
  button: {
    marginTop: 16,
    borderRadius: 25,
    borderColor: "#7e7e7e",
    backgroundColor: "#7e7e7e",
  },
  credentialsText: {
    marginTop: 16,
    textAlign: "center",
    fontStyle: "italic",
    fontSize: 10,
  },
  forgotPasswordLink: {
    textAlign: "center",
    color: "#000000",
    textDecorationLine: "underline",
    marginTop: 8,
  },
});

export default LoginScreen;
