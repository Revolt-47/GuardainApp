import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  TextInput,
  Button,
  Modal as UIKittenModal,
  Card,
} from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Snackbar } from "react-native-paper";
import Modal from "react-native-modal";
import { myTheme } from "../theme";
//import Snackbar from "react-native-paper";

const AddGuardianComponent = ({ route }) => {
  const { students } = route.params;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cnic, setCNIC] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [address, setAddress] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [contactNumber, setContactNumber] = useState("");
  const [selectedChild, setSelectedChild] = useState(
    students.length > 0 ? students[0] : null
  );
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [cnicError, setCnicError] = useState("");
  const [loading, setLoading] = useState(false); // New state for loading indicator

  // Validation functions
  const validateName = (text) => {
    setNameError(
      /^[a-zA-Z ]+$/.test(text)
        ? ""
        : "Invalid name. Please enter only alphabets."
    );
  };

  const validateEmail = (text) => {
    setEmailError(
      /\S+@\S+\.\S+/.test(text)
        ? ""
        : "Invalid email. Please enter a valid email address."
    );
  };

  const validateCnic = (text) => {
    setCnicError(
      /^\d{5}-\d{7}-\d{1}$/.test(text)
        ? ""
        : "Invalid CNIC. Please enter in the format: xxxxx-xxxxxxx-x"
    );
  };

  useEffect(() => {
    console.log("Students data:", students);
  }, [students]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleChildSelection = (child) => {
    setSelectedChild(child);
    toggleModal();
  };

  const handleAddGuardian = async () => {
    // Check if all required fields are filled
    if (
      !name ||
      !email ||
      !cnic ||
      !address ||
      !contactNumber ||
      !selectedChild
    ) {
      // Handle validation error, e.g., display an alert
      console.error("Please fill in all required fields.");
      console.log(selectedChild.child._id);
      return;
    }

    try {
      const result = await AsyncStorage.multiGet(["guardianId", "token"]);
      const [guardianId, token] = result;

      // Extract the values from the key-value pairs
      const guardianIdValue = guardianId[1];
      const tokenValue = token[1];

      if (!tokenValue) {
        console.error("Authentication token not found in local storage.");
        return;
      }

      const body = {
        token: tokenValue,
        name,
        email,
        cnic,
        address,
        contactNumber,
        children: [
          {
            child: selectedChild.child._id,
            relation: "guardian",
          },
        ],
      };

      console.log(body);

      // Show loading indicator
      setLoading(true);

      // Make a POST request to the server
      const response = await fetch(
        "http://172.17.44.214:3000/guardian/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Check if the response indicates an error
      if (data.error) {
        setSnackbarMessage(`Error: ${data.error}`);
        setSnackbarVisible(true);
        // Handle other error scenarios if needed
      } else {
        setSnackbarMessage(
          "Guardian Created: The guardian has been successfully added."
        );
        setSnackbarVisible(true);
        // Reset form fields
        setName("");
        setEmail("");
        setCNIC("");
        setAddress("");
        setContactNumber("");
        setSelectedChild(students.length > 0 ? students[0] : null);
      }
    } catch (error) {
      console.error("Error creating guardian:", error);
      setSnackbarMessage("Error: Failed to add guardian. Please try again.");
      setSnackbarVisible(true);
    } finally {
      // Hide loading indicator
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text category="h5" style={styles.title}>
        Add Guardian
      </Text>

      <Card style={styles.formContainer}>
        <TextInput
          label="Name*"
          value={name}
          onChangeText={(text) => {
            setName(text);
            validateName(text);
          }}
          style={styles.input}
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

        <TextInput
          label="Email*"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            validateEmail(text);
          }}
          style={styles.input}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <TextInput
          label="CNIC*"
          value={cnic}
          onChangeText={(text) => {
            setCNIC(text);
            validateCnic(text);
          }}
          style={styles.input}
        />

        {cnicError ? <Text style={styles.errorText}>{cnicError}</Text> : null}

        <TextInput
          label="Address*"
          value={address}
          onChangeText={(text) => setAddress(text)}
          style={styles.input}
        />

        <TextInput
          label="Contact Number*"
          value={contactNumber}
          onChangeText={(text) => setContactNumber(text)}
          style={styles.input}
        />

        <Button
          onPress={toggleModal}
          appearance="outline"
          style={styles.selectChildButton}
        >
          {selectedChild
            ? `Child: ${selectedChild.child.name}`
            : "Select Child*"}
        </Button>
      </Card>

      <Text style={styles.note}>
        Note: The added guardian will be able to pick your child from school.
      </Text>

      <Button
        onPress={handleAddGuardian}
        style={styles.addGuardianButton}
        disabled={loading}
      >
        {loading ? "Adding Guardian..." : "Add Guardian"}
      </Button>

      <UIKittenModal
        visible={isModalVisible}
        backdropStyle={styles.modalBackdrop}
        onBackdropPress={toggleModal}
      >
        <Card disabled={true}>
          {students.map((student) => (
            <Button
              key={student.child._id}
              onPress={() => handleChildSelection(student)}
              style={styles.modalButton}
            >
              {student.child.name} - School: {student.child.school.branchName},
              Class: {student.child.class}
            </Button>
          ))}
          <Button onPress={toggleModal} style={styles.modalCancelButton}>
            Cancel
          </Button>
        </Card>
      </UIKittenModal>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000} // Adjust the duration as needed
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  formContainer: {
    width: "80%",
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  selectChildButton: {
    marginTop: 10,
  },
  addGuardianButton: {
    marginVertical: 10,
  },
  note: {
    marginBottom: 20,
    textAlign: "center",
  },
  modalBackdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalButton: {
    marginBottom: 10,
  },
  modalCancelButton: {
    marginTop: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 5,
  },
});

export default AddGuardianComponent;
