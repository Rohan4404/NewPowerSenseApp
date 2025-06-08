import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

const NavbarPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigation = useNavigation();

  // Cleanup toast on unmount
  useEffect(() => {
    return () => {
      Toast.hide();
    };
  }, []);

  const handleHomeClick = async () => {
    try {
      const role = await AsyncStorage.getItem("role");
      if (role === "admin") {
        navigation.navigate("AdminTabBar");
      } else if (role === "manager") {
        navigation.navigate("SuperAdminTabBar");
      } else {
        navigation.navigate("Login");
      }
    } catch (err) {
      console.error("Error reading role:", err);
      navigation.navigate("Login");
    }
    setIsSidebarOpen(false);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLogoutClick = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.multiRemove([
        "token",
        "sessionToken",
        "userId",
        "role",
        "userID",
        "clientId",
        "savedEmailOrPhone",
      ]);
      Toast.show({
        type: "success",
        text1: "Logged out successfully!",
        position: "top",
        autoHide: true,
        visibilityTime: 2000,
      });
      navigation.replace("Login");
    } catch (err) {
      console.error("Logout error:", err);
      Toast.show({
        type: "error",
        text1: "Error logging out.",
        position: "top",
        autoHide: true,
        visibilityTime: 3000,
      });
    }
    setIsSidebarOpen(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.statusBarBackground} />
      <View style={styles.navbar}>
        {/* Left Icons */}
        <View style={styles.leftContainer}>
          {/* Back Button (hidden on small screens) */}
          <TouchableOpacity
            style={[styles.iconButton, styles.backButton]}
            onPress={handleBack}
          >
            <MaterialIcons
              name="arrow-back"
              size={width * 0.06}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          {/* Hamburger Menu (visible on small screens) */}
          <TouchableOpacity
            style={[styles.iconButton, styles.hamburgerButton]}
            onPress={() => setIsSidebarOpen(true)}
          >
            <MaterialIcons name="menu" size={width * 0.06} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Center Title */}
        <Text style={styles.title}>Current & Power Monitoring</Text>

        {/* Right Icons (hidden on small screens) */}
        <View style={styles.rightContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={handleHomeClick}>
            <MaterialIcons name="home" size={width * 0.06} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleLogoutClick}
          >
            <MaterialIcons name="logout" size={width * 0.06} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sidebar for Mobile */}
      {isSidebarOpen && (
        <View style={styles.sidebar}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsSidebarOpen(false)}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          {/* Sidebar Items */}
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={handleHomeClick}
          >
            <MaterialIcons name="home" size={width * 0.06} color="#FFFFFF" />
            <Text style={styles.sidebarText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sidebarItem}>
            <MaterialIcons
              name="settings"
              size={width * 0.06}
              color="#FFFFFF"
            />
            <Text style={styles.sidebarText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={handleLogoutClick}
          >
            <MaterialIcons name="logout" size={width * 0.06} color="#FFFFFF" />
            <Text style={styles.sidebarText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default NavbarPage;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#191919",
  },
  statusBarBackground: {
    height: StatusBar.currentHeight,
    backgroundColor: "#191919",
  },
  navbar: {
    width: "100%",
    height: height * 0.08,
    backgroundColor: "#191919",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.04,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.02,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.02,
    display: width < 640 ? "none" : "flex", // Hide on small screens
  },
  iconButton: {
    width: width * 0.1,
    height: width * 0.1,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    backgroundColor: "#00D1D133",
    borderRadius: width * 0.05,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    display: width < 640 ? "none" : "flex", // Hide on small screens
  },
  hamburgerButton: {
    display: width < 640 ? "flex" : "none", // Show on small screens
  },
  title: {
    fontSize: width * 0.05 > 22 ? 22 : width * 0.05,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width * 0.6,
    height: "100%",
    backgroundColor: "#393939",
    padding: width * 0.04,
    zIndex: 90,
    flexDirection: "column",
    gap: height * 0.02,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  closeButtonText: {
    fontSize: width * 0.08,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.02,
    padding: width * 0.02,
    borderRadius: 4,
  },
  sidebarText: {
    fontSize: width * 0.04 > 16 ? 16 : width * 0.04,
    color: "#FFFFFF",
  },
});
