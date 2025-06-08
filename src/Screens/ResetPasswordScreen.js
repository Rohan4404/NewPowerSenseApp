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
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getOnboardClient } from "../api/Service";
import Sidebar from "../Components/Sidebar";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const ShowAllClientData = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigation = useNavigation();

  // Define table columns with proper mapping
  const tableColumns = [
    { key: "client_id", title: "Client ID", width: width * 0.25 },
    { key: "organization_name", title: "Organization", width: width * 0.35 },
    { key: "organisation_type", title: "Type", width: width * 0.25 },
    { key: "admin_name", title: "Admin", width: width * 0.3 },
    { key: "email", title: "Email", width: width * 0.4 },
    { key: "phone_no", title: "Phone", width: width * 0.3 },
    { key: "address", title: "Address", width: width * 0.4 },
    { key: "gst_no", title: "GST No", width: width * 0.3 },
    { key: "verified", title: "Verified", width: width * 0.2 },
  ];

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await getOnboardClient();
        // console.log(response, "response of show all is");

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

  const getCellValue = (item, key) => {
    switch (key) {
      case "client_id":
        return item.client_id || "N/A";
      case "organization_name":
        return item.organization_name || "N/A";
      case "organisation_type":
        return item.organisation_type || item.organization_type || "N/A";
      case "admin_name":
        return item.admin_name || "N/A";
      case "email":
        return item.email || "N/A";
      case "phone_no":
        return item.phone_no || "N/A";
      case "address":
        return item.address || "N/A";
      case "gst_no":
        return item.gst_no || "N/A";
      case "verified":
        return item.verified ? "Yes" : "No";
      default:
        return "N/A";
    }
  };

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      {tableColumns.map((column, index) => (
        <Text key={index} style={[styles.headerCell, { width: column.width }]}>
          {column.title}
        </Text>
      ))}
    </View>
  );

  const renderClient = ({ item }) => (
    <View style={styles.row}>
      {tableColumns.map((column, index) => (
        <Text key={index} style={[styles.cell, { width: column.width }]}>
          {getCellValue(item, column.key)}
        </Text>
      ))}
    </View>
  );

  const totalTableWidth = tableColumns.reduce((sum, col) => sum + col.width, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <Ionicons name="menu" size={width * 0.07} color="#00E6E6" />
        </TouchableOpacity>
        <View style={styles.centeredTitleContainer}>
          <Text style={styles.headerTittleMachineMonitoring}>
            List of Clients
          </Text>
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
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00E6E6" />
              <Text style={styles.loadingText}>Loading clients...</Text>
            </View>
          ) : clients.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No clients found</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View style={{ width: totalTableWidth }}>
                {renderTableHeader()}
                <FlatList
                  data={clients}
                  renderItem={renderClient}
                  keyExtractor={(item) =>
                    item.client_id?.toString() || Math.random().toString()
                  }
                  showsVerticalScrollIndicator={true}
                  contentContainerStyle={styles.flatListContent}
                />
              </View>
            </ScrollView>
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
  headerTittleMachineMonitoring: {
    fontSize: width * 0.05,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#1C2526",
    paddingHorizontal: width * 0.02,
  },
  tableContainer: {
    flex: 1,
    marginTop: height * 0.02,
    backgroundColor: "#D9D9D91A",
    borderRadius: width * 0.03,
    padding: width * 0.03,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#4B5EAA",
    paddingVertical: height * 0.015,
    borderBottomWidth: 2,
    borderBottomColor: "#00E6E6",
    borderTopLeftRadius: width * 0.02,
    borderTopRightRadius: width * 0.02,
  },
  headerCell: {
    fontSize: width * 0.032,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    paddingHorizontal: width * 0.01,
    paddingVertical: height * 0.01,
    textAlignVertical: "center",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#4B5EAA40",
    paddingVertical: height * 0.012,
    backgroundColor: "#1C252680",
    minHeight: height * 0.06,
  },
  cell: {
    fontSize: width * 0.03,
    color: "#FFFFFF",
    textAlign: "center",
    paddingHorizontal: width * 0.01,
    paddingVertical: height * 0.008,
    textAlignVertical: "center",
    flexWrap: "wrap",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: height * 0.1,
  },
  loadingText: {
    fontSize: width * 0.04,
    color: "#FFFFFF",
    marginTop: height * 0.02,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: height * 0.1,
  },
  emptyText: {
    fontSize: width * 0.045,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  flatListContent: {
    paddingBottom: height * 0.02,
  },
});

export default ShowAllClientData;
