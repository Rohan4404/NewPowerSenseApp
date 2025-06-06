// import { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   Dimensions,
//   ActivityIndicator,
//   SafeAreaView,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { getOnboardClient } from "../api/Service";
// import Sidebar from "../Components/Sidebar";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const { width, height } = Dimensions.get("window");

// const ShowAllClientData = () => {
//   const [clients, setClients] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [sidebarVisible, setSidebarVisible] = useState(false);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const fetchClients = async () => {
//       try {
//         const response = await getOnboardClient();
//         console.log(response, "response of show all is");

//         let clientData = [];
//         if (Array.isArray(response)) {
//           clientData = response;
//         } else if (response?.data && Array.isArray(response.data)) {
//           clientData = response.data;
//         } else {
//           console.warn("Unexpected response format:", response);
//         }

//         const sortedClients = clientData.sort((a, b) => {
//           return new Date(b.createdAt) - new Date(a.createdAt);
//         });

//         setClients(sortedClients);
//       } catch (error) {
//         console.error("Failed to fetch clients:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchClients();
//   }, []);

//   const handleHomeClick = async () => {
//     try {
//       const role = await AsyncStorage.getItem("role");
//       if (role === "admin") {
//         navigation.navigate("AdminDashboard");
//       } else if (role === "manager") {
//         navigation.navigate("SuperAdminDashboard");
//       } else {
//         navigation.navigate("Login");
//       }
//     } catch (err) {
//       console.error("Error reading role:", err);
//       navigation.navigate("Login");
//     }
//     setSidebarVisible(false);
//   };

//   const handleLogoutClick = async () => {
//     try {
//       await AsyncStorage.multiRemove([
//         "token",
//         "sessionToken",
//         "userId",
//         "role",
//         "userID",
//         "clientId",
//         "savedEmailOrPhone",
//       ]);
//       navigation.replace("Login");
//     } catch (err) {
//       console.error("Logout error:", err);
//     }
//     setSidebarVisible(false);
//   };

//   const renderTableHeader = () => (
//     <View style={styles.tableHeaderRow}>
//       <Text style={[styles.headerCell, { width: width * 0.2 }]}>Client ID</Text>
//       <Text style={[styles.headerCell, { width: width * 0.35 }]}>
//         Organization Name
//       </Text>
//       <Text style={[styles.headerCell, { width: width * 0.3 }]}>
//         Organization Type
//       </Text>
//       <Text style={[styles.headerCell, { width: width * 0.3 }]}>
//         Admin Name
//       </Text>
//       <Text style={[styles.headerCell, { width: width * 0.35 }]}>Email</Text>
//       <Text style={[styles.headerCell, { width: width * 0.25 }]}>Phone No</Text>
//       <Text style={[styles.headerCell, { width: width * 0.4 }]}>Address</Text>
//       <Text style={[styles.headerCell, { width: width * 0.25 }]}>GST No</Text>
//       <Text style={[styles.headerCell, { width: width * 0.2 }]}>Verified</Text>
//     </View>
//   );

//   const renderClient = ({ item, index }) => (
//     <View
//       style={[
//         styles.row,
//         { backgroundColor: index % 2 === 0 ? "#494949" : "#3a3a3a" },
//       ]}
//     >
//       <Text style={[styles.cell, { width: width * 0.2 }]}>
//         {item.client_id || "N/A"}
//       </Text>
//       <Text style={[styles.cell, { width: width * 0.35 }]}>
//         {item.organization_name || "N/A"}
//       </Text>
//       <Text style={[styles.cell, { width: width * 0.3 }]}>
//         {item.organisation_type || item.organization_type || "N/A"}
//       </Text>
//       <Text style={[styles.cell, { width: width * 0.3 }]}>
//         {item.admin_name || "N/A"}
//       </Text>
//       <Text style={[styles.cell, { width: width * 0.35 }]}>
//         {item.email || "N/A"}
//       </Text>
//       <Text style={[styles.cell, { width: width * 0.25 }]}>
//         {item.phone_no || "N/A"}
//       </Text>
//       <Text style={[styles.cell, { width: width * 0.4 }]}>
//         {item.address || "N/A"}
//       </Text>
//       <Text style={[styles.cell, { width: width * 0.25 }]}>
//         {item.gst_no || "N/A"}
//       </Text>
//       <Text style={[styles.cell, { width: width * 0.2 }]}>
//         {item.verified ? "Yes" : "No"}
//       </Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       {/* Custom Header */}
//       <View style={styles.customHeader}>
//         <TouchableOpacity onPress={() => setSidebarVisible(true)}>
//           <Ionicons name="menu" size={width * 0.07} color="#00D1D1" />
//         </TouchableOpacity>
//         <View style={styles.centeredTitleContainer}>
//           <Text style={styles.psLogo}>PS</Text>
//         </View>
//       </View>

//       {/* Sidebar */}
//       <Sidebar
//         visible={sidebarVisible}
//         onClose={() => setSidebarVisible(false)}
//         handleHomeClick={handleHomeClick}
//         handleLogoutClick={handleLogoutClick}
//       />

//       <View style={styles.container}>
//         <Text style={styles.pageTitle}>List of Clients</Text>

//         <View style={styles.tableContainer}>
//           {loading ? (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color="#00D1D1" />
//               <Text style={styles.loadingText}>Loading...</Text>
//             </View>
//           ) : clients.length === 0 ? (
//             <View style={styles.emptyContainer}>
//               <Text style={styles.emptyText}>No clients found</Text>
//             </View>
//           ) : (
//             <ScrollView
//               horizontal={true}
//               showsHorizontalScrollIndicator={true}
//               style={styles.horizontalScroll}
//               contentContainerStyle={styles.scrollContent}
//             >
//               <View style={styles.tableWrapper}>
//                 {renderTableHeader()}
//                 <ScrollView
//                   style={styles.verticalScroll}
//                   showsVerticalScrollIndicator={true}
//                   nestedScrollEnabled={true}
//                 >
//                   <FlatList
//                     data={clients}
//                     renderItem={renderClient}
//                     keyExtractor={(item, index) =>
//                       item.client_id?.toString() || index.toString()
//                     }
//                     scrollEnabled={false}
//                     contentContainerStyle={styles.flatListContent}
//                   />
//                 </ScrollView>
//               </View>
//             </ScrollView>
//           )}
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#393939",
//   },
//   customHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: width * 0.05,
//     paddingVertical: height * 0.02,
//     backgroundColor: "#393939",
//     borderBottomWidth: 1,
//     borderBottomColor: "#4a4a4a",
//   },
//   centeredTitleContainer: {
//     flex: 1,
//     alignItems: "center",
//   },
//   psLogo: {
//     fontSize: width * 0.08,
//     fontWeight: "bold",
//     color: "#00D1D1",
//     letterSpacing: 2,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#393939",
//     paddingHorizontal: width * 0.04,
//   },
//   pageTitle: {
//     fontSize: width * 0.055,
//     fontWeight: "600",
//     color: "#FFFFFF",
//     textAlign: "center",
//     marginVertical: height * 0.02,
//   },
//   tableContainer: {
//     flex: 1,
//     backgroundColor: "#494949",
//     borderRadius: width * 0.02,
//     marginBottom: height * 0.02,
//     overflow: "hidden",
//   },
//   horizontalScroll: {
//     flex: 1,
//   },
//   scrollContent: {
//     minWidth: width * 2.5,
//   },
//   tableWrapper: {
//     flex: 1,
//     minWidth: width * 2.5,
//   },
//   verticalScroll: {
//     flex: 1,
//     maxHeight: height * 0.7,
//   },
//   tableHeaderRow: {
//     flexDirection: "row",
//     backgroundColor: "#00D1D1",
//     paddingVertical: height * 0.015,
//     borderBottomWidth: 2,
//     borderBottomColor: "#00A1A1",
//   },
//   headerCell: {
//     fontSize: width * 0.035,
//     fontWeight: "700",
//     color: "#000000",
//     textAlign: "center",
//     paddingHorizontal: width * 0.02,
//     paddingVertical: height * 0.01,
//   },
//   row: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#5a5a5a",
//     paddingVertical: height * 0.012,
//     minHeight: height * 0.06,
//   },
//   cell: {
//     fontSize: width * 0.032,
//     color: "#FFFFFF",
//     textAlign: "center",
//     paddingHorizontal: width * 0.02,
//     paddingVertical: height * 0.008,
//     textAlignVertical: "center",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: height * 0.1,
//   },
//   loadingText: {
//     fontSize: width * 0.04,
//     color: "#FFFFFF",
//     marginTop: height * 0.015,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: height * 0.1,
//   },
//   emptyText: {
//     fontSize: width * 0.04,
//     color: "#FFFFFF",
//   },
//   flatListContent: {
//     paddingBottom: height * 0.02,
//   },
// });

// export default ShowAllClientData;

import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
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

  const renderTableHeader = () => (
    <View style={styles.tableHeaderRow}>
      <Text style={[styles.headerCell, { width: width * 0.2 }]}>Client ID</Text>
      <Text style={[styles.headerCell, { width: width * 0.35 }]}>
        Organization Name
      </Text>
      <Text style={[styles.headerCell, { width: width * 0.3 }]}>
        Organization Type
      </Text>
      <Text style={[styles.headerCell, { width: width * 0.3 }]}>
        Admin Name
      </Text>
      <Text style={[styles.headerCell, { width: width * 0.35 }]}>Email</Text>
      <Text style={[styles.headerCell, { width: width * 0.25 }]}>Phone No</Text>
      <Text style={[styles.headerCell, { width: width * 0.4 }]}>Address</Text>
      <Text style={[styles.headerCell, { width: width * 0.25 }]}>GST No</Text>
      <Text style={[styles.headerCell, { width: width * 0.2 }]}>Verified</Text>
    </View>
  );

  const renderClient = ({ item, index }) => (
    <View
      style={[
        styles.row,
        { backgroundColor: index % 2 === 0 ? "#494949" : "#3a3a3a" },
      ]}
    >
      <Text style={[styles.cell, { width: width * 0.2 }]}>
        {item.client_id || "N/A"}
      </Text>
      <Text style={[styles.cell, { width: width * 0.35 }]}>
        {item.organization_name || "N/A"}
      </Text>
      <Text style={[styles.cell, { width: width * 0.3 }]}>
        {item.organisation_type || item.organization_type || "N/A"}
      </Text>
      <Text style={[styles.cell, { width: width * 0.3 }]}>
        {item.admin_name || "N/A"}
      </Text>
      <Text style={[styles.cell, { width: width * 0.35 }]}>
        {item.email || "N/A"}
      </Text>
      <Text style={[styles.cell, { width: width * 0.25 }]}>
        {item.phone_no || "N/A"}
      </Text>
      <Text style={[styles.cell, { width: width * 0.4 }]}>
        {item.address || "N/A"}
      </Text>
      <Text style={[styles.cell, { width: width * 0.25 }]}>
        {item.gst_no || "N/A"}
      </Text>
      <Text style={[styles.cell, { width: width * 0.2 }]}>
        {item.verified ? "Yes" : "No"}
      </Text>
    </View>
  );

  return (
    <ImageBackground
      source={require("../../assets/Rectangle.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.innerContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setSidebarVisible(true)}
              style={styles.menuButton}
            >
              <Ionicons name="menu" style={styles.menuIcon} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Image
                source={require("../../assets/Pslogo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Sidebar */}
          <Sidebar
            visible={sidebarVisible}
            onClose={() => setSidebarVisible(false)}
            handleHomeClick={handleHomeClick}
            handleLogoutClick={handleLogoutClick}
          />

          <View style={styles.contentContainer}>
            <Text style={styles.pageTitle}>List of Clients</Text>

            <View style={styles.tableContainer}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#00D1D1" />
                  <Text style={styles.loadingText}>Loading...</Text>
                </View>
              ) : clients.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No clients found</Text>
                </View>
              ) : (
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={true}
                  style={styles.horizontalScroll}
                  contentContainerStyle={styles.scrollContent}
                >
                  <View style={styles.tableWrapper}>
                    {renderTableHeader()}
                    <ScrollView
                      style={styles.verticalScroll}
                      showsVerticalScrollIndicator={true}
                      nestedScrollEnabled={true}
                    >
                      <FlatList
                        data={clients}
                        renderItem={renderClient}
                        keyExtractor={(item, index) =>
                          item.client_id?.toString() || index.toString()
                        }
                        scrollEnabled={false}
                        contentContainerStyle={styles.flatListContent}
                      />
                    </ScrollView>
                  </View>
                </ScrollView>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: "transparent", // Semi-transparent overlay for readability
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent", // Semi-transparent header for readability
    paddingHorizontal: width * 0.04,
    paddingTop: Platform.OS === "ios" ? 0 : height * 0.04, // Adjust for SafeAreaView on iOS
  },
  logoImage: {
    width: width * 0.13,
    height: width * 0.13,
  },
  menuButton: {
    padding: width * 0.02,
    borderRadius: 5,
  },
  menuIcon: {
    fontSize: width * 0.07,
    fontSize: width * 0.07,
    color: "#00D1D1",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: width * 0.04,
  },
  pageTitle: {
    fontSize: width * 0.055,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginVertical: height * 0.02,
  },
  tableContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Slight background for visibility
    borderRadius: width * 0.02,
    marginBottom: height * 0.02,
    overflow: "hidden",
  },
  horizontalScroll: {
    flex: 1,
  },
  scrollContent: {
    minWidth: width * 2.5,
  },
  tableWrapper: {
    flex: 1,
    minWidth: width * 2.5,
  },
  verticalScroll: {
    flex: 1,
    maxHeight: height * 0.7,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#00D1D1",
    paddingVertical: height * 0.015,
    borderBottomWidth: 2,
    borderBottomColor: "#00A1A1",
  },
  headerCell: {
    fontSize: width * 0.035,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.01,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#5a5a5a",
    paddingVertical: height * 0.012,
    minHeight: height * 0.06,
  },
  cell: {
    fontSize: width * 0.032,
    color: "#FFFFFF",
    textAlign: "center",
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.008,
    textAlignVertical: "center",
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
    marginTop: height * 0.015,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: height * 0.1,
  },
  emptyText: {
    fontSize: width * 0.04,
    color: "#FFFFFF",
  },
  flatListContent: {
    paddingBottom: height * 0.02,
  },
});

export default ShowAllClientData;
