import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getOnboardClient } from "../api/Service";
import Sidebar from "../Components/Sidebar"; // Adjust path as needed
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const ShowAllClientData = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await getOnboardClient();
        console.log(response, "response of show all is");

        let clientData = [];
        if (Array.isArray(response)) {
          clientData = response;
        } else if (response?.data && Array.isArray(response.data)) {
          clientData = response.data;
        } else {
          console.warn("Unexpected response format:", response);
        }

        const sortedClients = clientData.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setClients(sortedClients);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleHomeClick = async () => {
    try {
      const role = await AsyncStorage.getItem("role");
      if (role === "admin") {
        navigation.navigate("AdminDashboard");
      } else if (role === "manager") {
        navigation.navigate("SuperAdminDashboard");
      } else {
        navigation.navigate("Login");
      }
    } catch (err) {
      console.error("Error reading role:", err);
      navigation.navigate("Login");
    }
    setSidebarVisible(false);
  };

  const handleLogoutClick = async () => {
    try {
      await AsyncStorage.multiRemove([
        "token",
        "sessionToken",
        "userId",
        "role",
        "userID",
        "clientId",
        "savedEmailOrPhone",
      ]);
      navigation.replace("Login");
    } catch (err) {
      console.error("Logout error:", err);
    }
    setSidebarVisible(false);
  };

  const renderClient = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { width: width * 0.15 }]}>
        {item.client_id || "N/A"}
      </Text>
      <Text style={[styles.cell, { width: width * 0.2 }]}>
        {item.organization_name || "N/A"}
      </Text>
      <Text style={[styles.cell, { width: width * 0.18 }]}>
        {item.organisation_type || item.organization_type || "N/A"}
      </Text>
      <Text style={[styles.cell, { width: width * 0.18 }]}>
        {item.admin_name || "N/A"}
      </Text>
      <Text style={[styles.cell, { width: width * 0.2 }]}>
        {item.email || "N/A"}
      </Text>
      <Text style={[styles.cell, { width: width * 0.18 }]}>
        {item.phone_no || "N/A"}
      </Text>
      <Text style={[styles.cell, { width: width * 0.2 }]}>
        {item.address || "N/A"}
      </Text>
      <Text style={[styles.cell, { width: width * 0.18 }]}>
        {item.gst_no || "N/A"}
      </Text>
      <Text style={[styles.cell, { width: width * 0.12 }]}>
        {item.verified ? "Yes" : "No"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <Ionicons name="menu" size={width * 0.07} color="#00E6E6" />
        </TouchableOpacity>
        <View style={styles.centeredTitleContainer}>
          <Text style={styles.headerTitle}>List of Clients</Text>
        </View>
      </View>

      {/* Sidebar */}
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        handleHomeClick={handleHomeClick}
        handleLogoutClick={handleLogoutClick}
      />

      <View style={styles.container}>
        <View style={styles.tableContainer}>
          <Text style={styles.header}>List of Clients</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00E6E6" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : clients.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No clients found</Text>
            </View>
          ) : (
            <FlatList
              data={clients}
              renderItem={renderClient}
              keyExtractor={(item) =>
                item.client_id?.toString() || Math.random().toString()
              }
              ListHeaderComponent={() => (
                <View style={styles.tableHeader}>
                  <Text style={[styles.headerCell, { width: width * 0.15 }]}>
                    Client ID
                  </Text>
                  <Text style={[styles.headerCell, { width: width * 0.2 }]}>
                    Organization Name
                  </Text>
                  <Text style={[styles.headerCell, { width: width * 0.18 }]}>
                    Organization Type
                  </Text>
                  <Text style={[styles.headerCell, { width: width * 0.18 }]}>
                    Admin Name
                  </Text>
                  <Text style={[styles.headerCell, { width: width * 0.2 }]}>
                    Email
                  </Text>
                  <Text style={[styles.headerCell, { width: width * 0.18 }]}>
                    Phone No
                  </Text>
                  <Text style={[styles.headerCell, { width: width * 0.2 }]}>
                    Address
                  </Text>
                  <Text style={[styles.headerCell, { width: width * 0.18 }]}>
                    GST No
                  </Text>
                  <Text style={[styles.headerCell, { width: width * 0.12 }]}>
                    Verified
                  </Text>
                </View>
              )}
              stickyHeaderIndices={[0]}
              horizontal={true}
              contentContainerStyle={styles.flatListContent}
              showsHorizontalScrollIndicator={true}
              showsVerticalScrollIndicator={true}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1C2526",
  },
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    backgroundColor: "#1C2526",
  },
  centeredTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: width * 0.05,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#1C2526",
  },
  tableContainer: {
    marginTop: height * 0.04,
    marginHorizontal: width * 0.05,
    backgroundColor: "#D9D9D91A",
    borderRadius: width * 0.03,
    padding: width * 0.04,
    maxWidth: width * 0.9,
    minWidth: width * 1.79,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    fontSize: width * 0.05,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: height * 0.02,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#4B5EAA",
    paddingVertical: height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: "#4B5EAA",
    zIndex: 1,
  },
  headerCell: {
    fontSize: width * 0.035,
    fontWeight: "600",
    color: "#D1D5DB",
    textAlign: "center",
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.01,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#4B5EAA",
    paddingVertical: height * 0.015,
    backgroundColor: "#1C2526",
  },
  cell: {
    fontSize: width * 0.035,
    color: "#FFFFFF",
    textAlign: "center",
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.01,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: height * 0.05,
  },
  loadingText: {
    fontSize: width * 0.04,
    color: "#FFFFFF",
    marginTop: height * 0.015,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: height * 0.05,
  },
  emptyText: {
    fontSize: width * 0.04,
    color: "#FFFFFF",
  },
  flatListContent: {
    paddingBottom: height * 0.03,
    minWidth: width * 1.79,
  },
});

export default ShowAllClientData;
