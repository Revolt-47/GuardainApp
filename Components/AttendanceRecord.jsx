import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { Snackbar } from "react-native-paper";
import axios from 'axios';

const AttendanceComponent = ({ studentId, schoolId, navigation }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day}`;

      const response = await axios.post('http://192.168.18.53:3000/attendance/getAttendance', {
        studentId,
        schoolId,
        startDate: '2024-01-01',
        endDate: currentDate,
      });
      // Get the last 5 records
      const lastFiveRecords = response.data.attendance.slice(-5);
      setAttendanceData(lastFiveRecords);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setSnackbarMessage('Failed to fetch attendance. Please try again.');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };
  

  const handleViewDetails = () => {
    // Navigate to the details page
    navigation.navigate('AttendanceDetails', { attendanceData });
  };

  return (
    <View style={styles.container}>
      <Button title="Fetch Attendance" onPress={fetchData} />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <>
          {attendanceData.length > 0 ? (
            <>
              <Text style={styles.heading}>Last 5 Attendance Records:</Text>
              {attendanceData.map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                  <Text>Date: {item.date}</Text>
                  <Text>Day: {item.day}</Text>
                  <Text>Status: {item.status}</Text>
                </View>
              ))}
              <Button title="View Details" onPress={handleViewDetails} />
            </>
          ) : (
            <Text style={styles.noRecordText}>No attendance records found.</Text>
          )}
        </>
      )}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 10,
  },
  loader: {
    marginTop: 20,
  },
  noRecordText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AttendanceComponent;
