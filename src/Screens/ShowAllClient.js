// import { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   Dimensions,
//   Image,
//   Platform,
//   ActivityIndicator,
//   SafeAreaView,
//   TouchableOpacity,
//   ScrollView,
//   ImageBackground,
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

//   const handleHomeNavigationClick = () => {
//     navigation.goBack();
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
//     <ImageBackground
//       source={require("../../assets/Rectangle.jpg")}
//       style={styles.container}
//       resizeMode="cover"
//     >
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.innerContainer}>
//           {/* Header */}
//           <View style={styles.header}>
//             <TouchableOpacity
//               onPress={() => setSidebarVisible(true)}
//               style={styles.menuButton}
//             >
//               <Ionicons name="menu" style={styles.menuIcon} />
//             </TouchableOpacity>
//             <View style={styles.headerCenter}>
//               <Image
//                 source={require("../../assets/Pslogo.png")}
//                 style={styles.logoImage}
//                 resizeMode="contain"
//               />
//             </View>
//           </View>

//           {/* Sidebar */}
//           <Sidebar
//             visible={sidebarVisible}
//             onClose={() => setSidebarVisible(false)}
//             handleHomeClick={handleHomeNavigationClick}
//             handleLogoutClick={handleLogoutClick}
//             navigation={navigation} // Added for Sidebar compatibility
//           />

//           <View style={styles.contentContainer}>
//             <Text style={styles.pageTitle}>List of Clients</Text>

//             <View style={styles.tableContainer}>
//               {loading ? (
//                 <View style={styles.loadingContainer}>
//                   <ActivityIndicator size="large" color="#00D1D1" />
//                   <Text style={styles.loadingText}>Loading...</Text>
//                 </View>
//               ) : clients.length === 0 ? (
//                 <View style={styles.emptyContainer}>
//                   <Text style={styles.emptyText}>No clients found</Text>
//                 </View>
//               ) : (
//                 <ScrollView
//                   horizontal={true}
//                   showsHorizontalScrollIndicator={true}
//                   style={styles.horizontalScroll}
//                   contentContainerStyle={styles.scrollContent}
//                 >
//                   <View style={styles.tableWrapper}>
//                     {renderTableHeader()}
//                     <ScrollView
//                       style={styles.verticalScroll}
//                       showsVerticalScrollIndicator={true}
//                       nestedScrollEnabled={true}
//                     >
//                       <FlatList
//                         data={clients}
//                         renderItem={renderClient}
//                         keyExtractor={(item, index) =>
//                           item.client_id?.toString() || index.toString()
//                         }
//                         scrollEnabled={false}
//                         contentContainerStyle={styles.flatListContent}
//                       />
//                     </ScrollView>
//                   </View>
//                 </ScrollView>
//               )}
//             </View>
//           </View>
//         </View>
//       </SafeAreaView>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   safeArea: {
//     flex: 1,
//   },
//   innerContainer: {
//     flex: 1,
//     backgroundColor: "transparent",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "transparent",
//     paddingHorizontal: width * 0.04,
//     paddingTop: Platform.OS === "ios" ? 0 : height * 0.029,
//   },
//   logoImage: {
//     width: width * 0.13,
//     height: width * 0.13,
//   },
//   menuButton: {
//     padding: width * 0.02,
//     borderRadius: 5,
//   },
//   menuIcon: {
//     fontSize: width * 0.07,
//     color: "#00D1D1",
//   },
//   headerCenter: {
//     flex: 1,
//     alignItems: "center",
//   },
//   contentContainer: {
//     flex: 1,
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
//     flex: 0.9, // Reduced from flex: 1 to slightly decrease height
//     backgroundColor: "rgba(255, 255, 255, 0.1)",
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
//     maxHeight: height * 0.9, // Reduced from height * 0.7
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

import { useEffect, useState, useCallback } from "react";
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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const ShowAllClientData = ({ route, onClose }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigation = useNavigation();

  // Handle refresh when navigating from Register
  useEffect(() => {
    if (route?.params?.refresh) {
      console.log(
        "Refreshing ShowAllClient data due to new organization registration"
      );
      setRefreshTrigger((prev) => prev + 1);
      // Clear the refresh parameter to prevent multiple refreshes
      navigation.setParams({ refresh: false });
    }
  }, [route?.params?.refresh, navigation]);

  // Use useFocusEffect to refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log("ShowAllClient screen focused, refreshing data");
      setRefreshTrigger((prev) => prev + 1);
    }, [])
  );

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
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
  }, [refreshTrigger]); // Added refreshTrigger dependency

  const handleHomeNavigationClick = () => {
    navigation.goBack();
    setSidebarVisible(false);
  };

  // const handleLogoutClick = async () => {
  //   try {
  //     await AsyncStorage.multiRemove([
  //       "token",
  //       "sessionToken",
  //       "userId",
  //       "role",
  //       "userID",
  //       "clientId",
  //       "savedEmailOrPhone",
  //     ]);
  //     navigation.replace("Login");
  //   } catch (err) {
  //     console.error("Logout error:", err);
  //   }
  //   setSidebarVisible(false);
  // };

  const handleClearSavedLogin = async () => {
    try {
      await AsyncStorage.removeItem("savedEmailOrPhone");
      Toast.show({
        type: "info",
        text1: "Saved login credentials cleared",
        position: "top",
        visibilityTime: 2000,
      });
    } catch (err) {
      console.error("Error clearing saved login:", err);
    }
  };

  // Regular logout - keeps saved email/phone
  const handleLogoutClick = async () => {
    try {
      await AsyncStorage.multiRemove([
        "token",
        "sessionToken",
        "userId",
        "role",
        "userID",
        "clientId",
      ]);
      navigation.replace("Login");
    } catch (err) {
      console.error("Logout error:", err);
    }
    setIsSidebarVisible(false);
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
            handleHomeClick={handleHomeNavigationClick}
            handleLogoutClick={handleLogoutClick}
            navigation={navigation} // Added for Sidebar compatibility
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
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingHorizontal: width * 0.04,
    paddingTop: Platform.OS === "ios" ? 0 : height * 0.029,
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
    flex: 0.89, // Reduced from flex: 1 to slightly decrease height
    backgroundColor: "rgba(255, 255, 255, 0.1)",
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
    maxHeight: height * 0.7, // Reduced from height * 0.7
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
