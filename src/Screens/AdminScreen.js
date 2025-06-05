import { View, Text } from "react-native";
import React from "react";
import NavbarScreen from "../Screens/NavbarScreen"; // Assuming NavbarScreen is a reusable component

const AdminScreen = () => {
  return (
    <View>
      <NavbarScreen />
      <Text>AdminScreen</Text>
    </View>
  );
};

export default AdminScreen;
