// Import necessary modules
import React from 'react';
import { View, Text } from 'react-native';

// StudentDetailScreen component
const StudentDetailScreen = ({ route }) => {
  // Extract student details from the route params
  const { student } = route.params;

  console.log(student)

  // TODO: Fetch additional student details based on the name from your data source

  // Mocked student details (replace this with actual data fetching logic)
  const studentDetails = {
    name: 'cakse',
    class: '10th Grade', // Replace with actual class data
    school: 'ABC School', // Replace with actual school data
    // Add more details as needed
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{`Name: ${studentDetails.name}`}</Text>
      <Text>{`Class: ${studentDetails.class}`}</Text>
      <Text>{`School: ${studentDetails.school}`}</Text>
      {/* Add more details as needed */}
    </View>
  );
};

export default StudentDetailScreen;
