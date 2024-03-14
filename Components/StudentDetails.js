import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal as UIKittenModal,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { Button, Card, Title, Paragraph } from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Snackbar } from "react-native-paper";
import { Modal } from "@ui-kitten/components";

const StudentDetailsScreen = ({ route }) => {
  const { students } = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(students[0]);
  const [guardians, setGuardians] = useState([]);
  const [isGuardianModalVisible, setIsGuardianModalVisible] = useState(false);
  const [loadingGuardians, setLoadingGuardians] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Check if the selected student's relationship is "father" or "mother"
  const isParent =
    selectedStudent &&
    (selectedStudent.relation === "father" ||
      selectedStudent.relation === "mother");

  const handleGuardianButtonPress = async () => {
    try {
      setLoadingGuardians(true);

      // Fetch guardians only if students array is not empty
      if (students.length > 0) {
        const result = await AsyncStorage.multiGet(["guardianId", "token"]);
        const [guardianId, token] = result;

        const guardianIdValue = guardianId[1];
        const tokenValue = token[1];

        if (!tokenValue) {
          console.error("Authentication token not found in local storage.");
          return;
        }

        const response = await fetch(
          `http://172.17.68.225:3000/guardians/getguardian/${selectedStudent.child._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}` ,
            },
            body: JSON.stringify({
              token: tokenValue,
            }),
          }
        );

        const data = await response.json();
        console.log(data);
        setGuardians(data);
        setIsGuardianModalVisible(true);
      } else {
        // Handle the case when students array is empty
        setSnackbarMessage("No Students: There are no students available.");
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error("Error fetching guardians:", error);
      // Handle error, show an alert, or any other error handling logic
    } finally {
      setLoadingGuardians(false);
    }
  };

  const handleDeleteGuardian = async (guardianId2) => {
    console.log(guardianId2, selectedStudent.child._id);

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
        "http://172.17.68.225:3000/guardians/remove-child",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` ,
          },
          body: JSON.stringify({
            guardianId: guardianId2,
            childId: selectedStudent.child._id,
            token: tokenValue,
          }),
        }
      );

      if (response.ok) {
        // If the request is successful, update the guardians state or perform any other necessary action
        console.log("Child removed successfully.");

        // Show success snackbar
        setSnackbarMessage("Success: Child removed successfully.");
        setSnackbarVisible(true);

        // You may want to reload the guardians after removal
        // Call handleGuardianButtonPress() or any other suitable function here
      } else {
        console.error("Failed to remove child:", response.status);

        // Show error snackbar
        setSnackbarMessage("Error: Failed to remove child. Please try again.");
        setSnackbarVisible(true);

        // Handle the error, show an alert, or perform other error handling logic
      }
    } catch (error) {
      console.error("Error removing child:", error);

      // Show error snackbar
      setSnackbarMessage("Error: An error occurred. Please try again.");
      setSnackbarVisible(true);

      // Handle the error, show an alert, or perform other error handling logic
    }
  };

  const renderGuardians = () => {
    if (!guardians || !Array.isArray(guardians)) {
      return <Text>No guardians available.</Text>;
    }

    return guardians.map((guardian) => (
      <View key={guardian._id} style={styles.guardianModalItem}>
        <View>
          <Text style={styles.modalItemText}>{guardian.name}</Text>
          <Text>Contact: {guardian.contactNumber}</Text>
          <Text>Address: {guardian.address}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            handleDeleteGuardian(guardian._id);
          }}
          style={styles.removeButton}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    ));
  };

  const handleStudentSelection = (student) => {
    setSelectedStudent(student);
    setIsModalVisible(false);
  };

  useEffect(() => {
    console.log(route.params);
  });

  // return (
  //   <View style={styles.container}>
  //     <Image
  //       source={require("../assets/logo.png")}
  //       style={styles.backgroundImage}
  //     />

  //     {/* Select Children button in top right corner */}
  //     <TouchableOpacity
  //       onPress={() => setIsModalVisible(true)}
  //       style={styles.selectChildrenButton}
  //     >
  //       <Text style={styles.selectChildrenText}>Select Student</Text>
  //       <FontAwesome name="child" size={30} color="black" style={styles.icon} />
  //     </TouchableOpacity>

  //     {/* Conditional rendering based on whether students array is empty or not */}
  //     {students.length > 0 ? (
  //       <>
  //         <Card style={styles.studentDetailsCard}>
  //           <Card.Content>
  //             <TouchableOpacity
  //               onPress={() => setIsModalVisible(true)}
  //               style={styles.studentDetailsContainer}
  //             >
  //               <FontAwesome
  //                 name="user"
  //                 size={30}
  //                 color="black"
  //                 style={styles.icon}
  //               />
  //               <Title>{selectedStudent.child.name}</Title>
  //             </TouchableOpacity>

  //             <View style={styles.detailContainer}>
  //               <FontAwesome5
  //                 name="fingerprint"
  //                 size={30}
  //                 color="black"
  //                 style={styles.icon}
  //               />
  //               <Paragraph>RFID Tag: {selectedStudent.child.rfidTag}</Paragraph>
  //             </View>

  //             <View style={styles.detailContainer}>
  //               <FontAwesome
  //                 name="credit-card"
  //                 size={30}
  //                 color="black"
  //                 style={styles.icon}
  //               />
  //               <Paragraph>
  //                 Roll Number: {selectedStudent.child.rollNumber}
  //               </Paragraph>
  //             </View>
  //             <View style={styles.rowContainer}>
  //               <View style={styles.detailContainer}>
  //                 <FontAwesome
  //                   name="institution"
  //                   size={30}
  //                   color="black"
  //                   style={styles.icon}
  //                 />
  //                 <Paragraph>
  //                   School: {selectedStudent.child.school.branchName}, Class:{" "}
  //                   {selectedStudent.child.class}, Section:{" "}
  //                   {selectedStudent.child.section}
  //                 </Paragraph>
  //               </View>
  //             </View>
  //           </Card.Content>
  //         </Card>

  //         <Card style={styles.attendanceCard}>
  //           <Card.Content>
  //             <Title>Attendance Record</Title>
  //             {/* Add your attendance record components here */}
  //           </Card.Content>
  //         </Card>

  //         {/* Call button */}
  //         <Button
  //           icon="phone"
  //           status="success"
  //           onPress={() => handleCallButtonPress(selectedStudent.child.name)}
  //           style={styles.callButton}
  //         >
  //           Call {selectedStudent.child.name}
  //         </Button>

  //         {/* Guardian button */}
  //         {isParent && (
  //           <Button
  //             onPress={handleGuardianButtonPress}
  //             status="warning"
  //             style={styles.guardianButton}
  //           >
  //             {loadingGuardians ? "Loading Guardians..." : "Guardians"}
  //           </Button>
  //         )}
  //       </>
  //     ) : (
  //       // Display a message or UI component when students array is empty
  //       <Text>No students available.</Text>
  //     )}

  //     {/* Modal for selecting a student */}
  //     <UIKittenModal
  //       visible={isModalVisible}
  //       backdropStyle={styles.modalContainer}
  //       onBackdropPress={() => setIsModalVisible(false)}
  //     >
  //       <View>
  //         {students.map((student) => (
  //           <TouchableOpacity
  //             key={student.child._id}
  //             onPress={() => handleStudentSelection(student)}
  //             style={styles.modalItem}
  //           >
  //             <Text style={styles.modalItemText}>{student.child.name}</Text>
  //           </TouchableOpacity>
  //         ))}
  //         {/* Add a cancel button or tap outside to close the modal */}
  //         <TouchableOpacity
  //           onPress={() => setIsModalVisible(false)}
  //           style={styles.modalCancelButton}
  //         >
  //           <Text style={styles.modalCancelText}>Cancel</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </UIKittenModal>

  //     {/* Modal for displaying guardians */}
  //     <UIKittenModal
  //       visible={isGuardianModalVisible}
  //       backdropStyle={styles.modalContainer}
  //       onBackdropPress={() => setIsGuardianModalVisible(false)}
  //     >
  //       <View>
  //         {renderGuardians()}
  //         <TouchableOpacity
  //           onPress={() => setIsGuardianModalVisible(false)}
  //           style={styles.modalCancelButton}
  //         >
  //           <Text style={styles.modalCancelText}>Close</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </UIKittenModal>

  //     {/* Snackbar for success or error messages */}
  //     <Snackbar
  //       visible={snackbarVisible}
  //       onDismiss={() => setSnackbarVisible(false)}
  //       duration={3000}
  //       style={snackbarVisible ? styles.snackbarVisible : styles.snackbarHidden} // Adjust styles
  //     >
  //       {snackbarMessage}
  //     </Snackbar>
  //   </View>
  // );
  return(<Text>Hello umer</Text>)
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.3,
  },
  selectChildrenButton: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  selectChildrenText: {
    fontSize: 18,
    marginRight: 10,
    color: "black",
  },
  studentDetailsCard: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    marginTop: "10%",
  },
  attendanceCard: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    marginTop: "5%",
  },
  studentDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginLeft: -6,
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    marginRight: 10,
  },
  callButton: {
    marginTop: 20,
    backgroundColor: "black",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalItem: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    width: "100%",
  },
  modalItemText: {
    fontSize: 18,
    color: "black",
  },
  modalCancelButton: {
    padding: 20,
    backgroundColor: "white",
    width: "100%",
  },
  modalCancelText: {
    fontSize: 18,
    color: "red",
  },
  guardianButton: {
    marginTop: 20,
    backgroundColor: "black",
  },
  guardianModalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    width: "100%",
  },
  removeButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "white",
  },
  snackbarVisible: {
    backgroundColor: "green", // Change to your desired color
    marginBottom: 20,
  },
  snackbarHidden: {
    display: "none",
  },
});

export default StudentDetailsScreen;
