import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Navbar = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          await AsyncStorage.clear();
          navigation.replace("Login");
        },
      },
    ]);
  };

  return (
    <View style={styles.navbarContainer}>
      <Text style={styles.logoText}>
        Current <Text style={styles.logoSub}> & Power Monitoring</Text>
      </Text>

      <View style={styles.searchBox}>
        <FontAwesome name="search" size={18} color="#ccc" />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#ccc"
          style={styles.searchInput}
        />
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Ionicons name="home-outline" size={22} color="#fff" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("AddCard")}
        >
          <MaterialCommunityIcons name="robot" size={22} color="#fff" />
          <Text style={styles.navText}>Machine</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.navText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  navbarContainer: {
    backgroundColor: "#222",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  logoText: {
    fontSize: 18,
    color: "#00E6E6",
    fontWeight: "bold",
    textAlign: "center",
  },
  logoSub: {
    color: "#fff",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 8,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchInput: {
    color: "#fff",
    flex: 1,
    marginLeft: 8,
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
});
