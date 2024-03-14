import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { registerIndieID, unregisterIndieDevice } from 'native-notify';
import { Button, Icon, DrawerItem, Layout } from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SideMenu = ({ navigation }) => {
  useEffect(() => {
    handleLogout();
  }, []);

  const handleLogout = async () => {
    // Perform logout logic, such as clearing the AsyncStorage and navigating to the login screen.
    unregisterIndieDevice(guardianId, 19959, 'tOGmciFdfRxvdPDp3MiotN');
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("guardianId");
    navigation.navigate("Login");
  };

  return (
    <Layout style={styles.container}>
      <DrawerItem
        title="Logout"
        accessoryLeft={(props) => <Icon {...props} name="log-out-outline" />}
        onPress={handleLogout}
      />
      {/* Add other DrawerItems as needed */}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SideMenu;
