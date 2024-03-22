import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { List, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getIndieNotificationInbox, deleteIndieNotificationInbox } from 'native-notify';
import { ScrollView } from "react-native-gesture-handler";

const NotificationListScreen = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guardianId, setGuardianId] = useState('');

  useEffect(() => {
    const fetchGuardianId = async () => {
      try {
        const guardianIdValue = await AsyncStorage.getItem('guardianId');
        setGuardianId(guardianIdValue || '');
      } catch (error) {
        console.error('Error fetching guardian ID:', error);
      }
    };
  
    fetchGuardianId();
  }, []);

  useEffect(() => {
    

    fetchNotifications();
  }, [guardianId]);

  const refreshNotifications = async () => {
    setLoading(true);
    await fetchNotifications();
  };

  const fetchNotifications = async () => {
    try {
      const guardianID = guardianId;
      const appId = 19959;
      const appToken = 'tOGmciFdfRxvdPDp3MiotN';
  
      const fetchedNotifications = await getIndieNotificationInbox(guardianID, appId, appToken);
      setData(Array.isArray(fetchedNotifications) ? fetchedNotifications : []);
      console.log(fetchedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 }}>
        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Inbox</Text>
        <TouchableOpacity onPress={refreshNotifications}>
          <Text style={{ fontSize: 16, color: 'blue' }}>Refresh</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : !data || data.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>No notifications available</Text>
        </View>
      ) : (
        <>
          {data.map((item, index) => (
            <View key={index}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 }}>{item.date}</Text>
              <Divider />
              <TouchableOpacity >
                <List.Item
                  title={item.title}
                  description={item.message}
                  titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
                  descriptionStyle={{ fontSize: 14 }}
                  left={props => <List.Icon {...props} icon="email" />}
                />
                <Divider />
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
};

export default NotificationListScreen;
