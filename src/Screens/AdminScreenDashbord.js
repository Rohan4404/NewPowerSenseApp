// // // new card render

// import { useState, useEffect, useCallback } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   Image,
//   ActivityIndicator,
//   SafeAreaView,
//   StatusBar,
//   Modal,
//   Platform,
//   ScrollView,
//   ImageBackground,
//   FlatList,
// } from "react-native";
// import { useNavigation, useFocusEffect } from "@react-navigation/native";
// import { Picker } from "@react-native-picker/picker";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import AddMachineModal from "../PopUp/AddMachine";
// import RegisterModelPopup from "../PopUp/RegisterModelPopup";
// import Toast from "react-native-toast-message";
// import { getAllClients, getMachineById } from "../api/Service";
// import Sidebar from "../Components/Sidebar";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const { width, height } = Dimensions.get("window");

// const AdminScreen = ({ route }) => {
//   const [isAddMachineModalVisible, setIsAddMachineModalVisible] =
//     useState(false);
//   const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
//   const [showDeleteModalVisible, setShowDeleteModalVisible] = useState(false);
//   const [machines, setMachines] = useState([]);
//   const [clients, setClients] = useState([]);
//   const [selectedClientId, setSelectedClientId] = useState(""); // Empty by default to show all
//   const [isLoadingMachines, setIsLoadingMachines] = useState(true);
//   const [isLoadingClients, setIsLoadingClients] = useState(true);
//   const [apiCall, setApiCall] = useState(false);
//   const [machineToDelete, setMachineToDelete] = useState(null);
//   const [isSidebarVisible, setIsSidebarVisible] = useState(false);
//   const [refreshTrigger, setRefreshTrigger] = useState(0);
//   const navigation = useNavigation();

//   const handleHomeNavigationClick = () => {
//     setIsSidebarVisible(false);
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
//     setIsSidebarVisible(false);
//   };

//   // Handle refresh when navigating from AddMachine
//   useEffect(() => {
//     if (route?.params?.refresh) {
//       // console.log("Refreshing SuperAdmin data due to new machine addition");
//       setRefreshTrigger((prev) => prev + 1);
//       navigation.setParams({ refresh: false });
//     }
//   }, [route?.params?.refresh, navigation]);

//   // Use useFocusEffect to refresh data when screen comes into focus
//   useFocusEffect(
//     useCallback(() => {
//       // console.log("SuperAdmin screen focused, refreshing data");
//       setRefreshTrigger((prev) => prev + 1);
//     }, [])
//   );

//   // Fetch clients data
//   useEffect(() => {
//     let isMounted = true;

//     const fetchClientsData = async () => {
//       setIsLoadingClients(true);
//       try {
//         // console.log("🔄 Fetching clients...");
//         const clientsResponse = await getAllClients();
//         // console.log("📊 Clients response:", clientsResponse);

//         if (clientsResponse.success && Array.isArray(clientsResponse.data)) {
//           if (!isMounted) return;
//           // console.log(
//           //   "✅ Clients loaded:",
//           //   clientsResponse.data.length,
//           //   "clients"
//           // );
//           setClients(clientsResponse.data);
//           return;
//         }

//         throw new Error(clientsResponse?.message || "Failed to fetch clients");
//       } catch (error) {
//         if (!isMounted) return;
//         console.error("❌ Error fetching clients:", error);
//         Toast.show({
//           type: "error",
//           text1: error.message || "Error fetching clients",
//           position: "top",
//           visibilityTime: 3000,
//           topOffset: height * 0.1,
//         });
//       } finally {
//         if (isMounted) setIsLoadingClients(false);
//       }
//     };

//     fetchClientsData();

//     return () => {
//       isMounted = false;
//     };
//   }, [apiCall, refreshTrigger]);

//   // Fetch machines based on selected client
//   useEffect(() => {
//     const fetchMachines = async () => {
//       if (clients.length === 0) {
//         // console.log("⏳ No clients available yet, skipping machine fetch");
//         return;
//       }

//       // console.log("🔄 Starting machine fetch...");
//       // console.log("👥 Available clients:", clients.length);
//       // console.log("🎯 Selected client ID:", selectedClientId);

//       setIsLoadingMachines(true);
//       try {
//         let allMachinesData = [];

//         if (!selectedClientId) {
//           // Fetch machines from all clients
//           // console.log("🌐 Fetching machines from ALL clients");

//           for (const client of clients) {
//             try {
//               // console.log(
//               //   `🔍 Fetching machines for client: ${client.client_id} (${client.organization_name})`
//               // );
//               const machinesResponse = await getMachineById(client.client_id);
//               // console.log(
//               //   `📋 Response for client ${client.client_id}:`,
//               //   machinesResponse
//               // );

//               if (
//                 machinesResponse.success &&
//                 Array.isArray(machinesResponse?.data)
//               ) {
//                 const clientMachines = machinesResponse.data.map((machine) => ({
//                   ...machine,
//                   client_name: client.organization_name,
//                   client_id: client.client_id,
//                 }));
//                 // console.log(
//                 //   `✅ Found ${clientMachines.length} machines for ${client.organization_name}`
//                 // );
//                 allMachinesData.push(...clientMachines);
//               } else {
//                 // console.log(
//                 //   `⚠️ No machines found for client ${client.client_id}`
//                 // );
//               }
//             } catch (error) {
//               console.error(
//                 `❌ Error fetching machines for client ${client.client_id}:`,
//                 error
//               );
//             }
//           }
//         } else {
//           // Fetch machines for specific client
//           // console.log(
//           //   "🎯 Fetching machines for specific client:",
//           //   selectedClientId
//           // );
//           const machinesResponse = await getMachineById(selectedClientId);
//           // console.log("📋 Specific client response:", machinesResponse);

//           if (
//             machinesResponse.success &&
//             Array.isArray(machinesResponse?.data)
//           ) {
//             const selectedClient = clients.find(
//               (client) => client.client_id === selectedClientId
//             );
//             allMachinesData = machinesResponse.data.map((machine) => ({
//               ...machine,
//               client_name: selectedClient?.organization_name || "Unknown",
//               client_id: selectedClientId,
//             }));
//             // console.log(
//             //   `✅ Found ${allMachinesData.length} machines for selected client`
//             // );
//           }
//         }

//         // console.log("🎉 TOTAL MACHINES LOADED:", allMachinesData.length);
//         // console.log("📊 Machines data sample:", allMachinesData.slice(0, 2));

//         setMachines(allMachinesData);
//       } catch (error) {
//         console.error("❌ Error fetching machines:", error);
//         Toast.show({
//           type: "error",
//           text1: "Failed to fetch machines",
//           position: "top",
//           visibilityTime: 3000,
//           topOffset: height * 0.1,
//         });
//         setMachines([]);
//       } finally {
//         setIsLoadingMachines(false);
//         // console.log("✅ Machine loading completed");
//       }
//     };

//     fetchMachines();
//   }, [selectedClientId, clients, refreshTrigger]);

//   const handleMachineCardClick = useCallback(
//     (machine) => {
//       console.log("🖱️ Machine card clicked:", machine.machine_name);
//       const fullApiUrl = `https://api1.systaldyn.xyz:6901/api/sensor/data/${machine.table_name}`;

//       navigation.navigate("MachineDetailPage", {
//         lat: machine.lat || null,
//         lon: machine.lon || null,
//         endPoint: fullApiUrl,
//       });
//     },
//     [navigation]
//   );

//   const handleAddMachineClick = () => setIsAddMachineModalVisible(true);
//   const handleAddMachineModalClose = () => {
//     setIsAddMachineModalVisible(false);
//     setRefreshTrigger((prev) => prev + 1);
//   };
//   const handleOpenRegisterClick = () => setIsRegisterModalVisible(true);
//   const handleCloseRegisterModal = () => {
//     setIsRegisterModalVisible(false);
//     setRefreshTrigger((prev) => prev + 1);
//   };

//   const selectedClientOrgName = selectedClientId
//     ? clients.find((client) => client.client_id === selectedClientId)
//         ?.organization_name || "Selected Organization"
//     : "All Organizations";

//   const deleteMachineData = async (machineId, clientId) => {
//     try {
//       const response = await fetch(
//         `https://api1.systaldyn.xyz:6901/api/machine/${machineId}`,
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ client_id: clientId }),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => null);
//         const errorMsg =
//           errorData?.message ||
//           `Failed to delete machine (Status: ${response.status})`;
//         throw new Error(errorMsg);
//       }

//       try {
//         return await response.json();
//       } catch {
//         return {};
//       }
//     } catch (error) {
//       console.error("Delete Machine Error:", error);
//       throw error;
//     }
//   };

//   const renderMachineCard = ({ item: machine, index }) => {
//     // console.log(
//     //   "🎨 Rendering machine card:",
//     //   machine.machine_name,
//     //   "Index:",
//     //   index
//     // );
//     return (
//       <TouchableOpacity
//         style={styles.machineCard}
//         onPress={() => handleMachineCardClick(machine)}
//         activeOpacity={0.8}
//       >
//         <View style={styles.machineCardContent}>
//           <View style={styles.machineIconContainer}>
//             <MaterialIcons
//               name="precision-manufacturing"
//               size={width * 0.08}
//               color="#00C4B4"
//             />
//           </View>
//           <View style={styles.machineTextContainer}>
//             <Text style={styles.machineNameText}>{machine.machine_name}</Text>
//             {!selectedClientId && (
//               <Text style={styles.clientNameText}>
//                 {machine.client_name || "Unknown Client"}
//               </Text>
//             )}
//           </View>
//         </View>
//         {/* Only show delete button when a specific client is selected */}
//         {selectedClientId && (
//           <TouchableOpacity
//             style={styles.deleteButton}
//             onPress={() => {
//               setMachineToDelete(machine);
//               setShowDeleteModalVisible(true);
//             }}
//             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//           >
//             <MaterialIcons name="delete" style={styles.deleteIcon} />
//           </TouchableOpacity>
//         )}
//       </TouchableOpacity>
//     );
//   };

//   const renderTableRow = (machine, index) => (
//     <View
//       key={`table_${machine.machine_id}_${index}`}
//       style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}
//     >
//       <View style={styles.tableCell}>
//         <Text style={styles.tableCellText} numberOfLines={2}>
//           {machine.machine_name}
//         </Text>
//         {!selectedClientId && (
//           <Text style={styles.tableCellSubText} numberOfLines={1}>
//             {machine.client_name || "Unknown Client"}
//           </Text>
//         )}
//       </View>
//       <View style={[styles.tableCell, styles.apiCell]}>
//         <Text style={styles.apiText} numberOfLines={3}>
//           https://api1.systaldyn.svc:8080/api/v1/data/{machine.table_name}
//         </Text>
//       </View>
//     </View>
//   );

//   return (
//     <ImageBackground
//       source={require("../../assets/Rectangle.jpg")}
//       style={styles.container}
//       resizeMode="cover"
//     >
//       <SafeAreaView style={styles.safeAreaContainer}>
//         <StatusBar barStyle="light-content" backgroundColor="#2C2C2C" />
//         <Toast />

//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity
//             onPress={() => setIsSidebarVisible(true)}
//             style={styles.menuButton}
//           >
//             <Ionicons name="menu" style={styles.menuIcon} />
//           </TouchableOpacity>

//           <View style={styles.headerCenter}>
//             <Image
//               source={require("../../assets/Pslogo.png")}
//               style={styles.logoImage}
//               resizeMode="contain"
//             />
//           </View>
//         </View>

//         {/* Sidebar */}
//         <Sidebar
//           visible={isSidebarVisible}
//           onClose={() => setIsSidebarVisible(false)}
//           handleHomeClick={handleHomeNavigationClick}
//           handleLogoutClick={handleLogoutClick}
//         />

//         {/* Main Content with Vertical Scroll */}
//         <View style={{ flex: 1 }}>
//           <ScrollView
//             style={styles.scrollContainer}
//             contentContainerStyle={styles.scrollContent}
//             showsVerticalScrollIndicator={false}
//             nestedScrollEnabled={true}
//           >
//             {/* Title Section */}
//             <View style={styles.titleSection}>
//               <Text style={styles.mainTitle}>Admin Dashboard</Text>

//               {/* Organization Picker */}
//               <View style={styles.pickerWrapper}>
//                 <View style={styles.pickerContainer}>
//                   <Picker
//                     selectedValue={selectedClientId}
//                     onValueChange={(value) => {
//                       // console.log(
//                       //   "🎯 Picker changed - Selected client ID:",
//                       //   value
//                       // );
//                       setSelectedClientId(value);
//                     }}
//                     style={styles.picker}
//                     enabled={!isLoadingClients}
//                     mode="dropdown"
//                     dropdownIconColor="transparent"
//                   >
//                     <Picker.Item label="Select Organization" value="" />
//                     {isLoadingClients ? (
//                       <Picker.Item
//                         label="Loading..."
//                         value=""
//                         enabled={false}
//                       />
//                     ) : (
//                       clients.map((client, index) => (
//                         <Picker.Item
//                           key={client.client_id}
//                           label={
//                             client.organization_name || `Client ${index + 1}`
//                           }
//                           value={client.client_id}
//                         />
//                       ))
//                     )}
//                   </Picker>
//                 </View>
//               </View>
//             </View>

//             {/* List of Machines Section */}
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>
//                 List of Machines
//                 {/* ({machines.length}) */}
//               </Text>

//               {isLoadingMachines ? (
//                 <View style={styles.loadingContainer}>
//                   <ActivityIndicator size="large" color="#00C4B4" />
//                   <Text style={styles.loadingText}>Loading machines...</Text>
//                 </View>
//               ) : machines?.length === 0 ? (
//                 <View style={styles.emptyContainer}>
//                   <Text style={styles.emptyText}>
//                     No machines found for {selectedClientOrgName}
//                   </Text>
//                 </View>
//               ) : (
//                 <View style={styles.machinesContainer}>
//                   <FlatList
//                     data={machines}
//                     renderItem={renderMachineCard}
//                     keyExtractor={(item, index) =>
//                       `machine_${item.machine_id}_${index}`
//                     }
//                     showsVerticalScrollIndicator={true}
//                     nestedScrollEnabled={true}
//                     style={styles.machinesList}
//                     contentContainerStyle={styles.machinesListContent}
//                     scrollEnabled={true}
//                     removeClippedSubviews={false}
//                     initialNumToRender={10}
//                     maxToRenderPerBatch={10}
//                     windowSize={10}
//                   />
//                 </View>
//               )}
//             </View>

//             {/* API Table Section */}
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>
//                 List of Machines and APIs for Hardware
//                 {/* ({machines.length}) */}
//               </Text>

//               {/* Table Header */}
//               <View style={styles.tableHeader}>
//                 <View style={styles.tableHeaderCell}>
//                   <Text style={styles.tableHeaderText}>List of machines</Text>
//                 </View>
//                 <View style={[styles.tableHeaderCell, styles.apiHeaderCell]}>
//                   <Text style={styles.tableHeaderText}>API for hardware</Text>
//                 </View>
//               </View>

//               {isLoadingMachines ? (
//                 <View style={styles.loadingContainer}>
//                   <ActivityIndicator size="large" color="#00C4B4" />
//                   <Text style={styles.loadingText}>Loading...</Text>
//                 </View>
//               ) : machines?.length === 0 ? (
//                 <View style={styles.emptyContainer}>
//                   <Text style={styles.emptyText}>
//                     No machines found for {selectedClientOrgName}
//                   </Text>
//                 </View>
//               ) : (
//                 <ScrollView
//                   style={styles.apiTable}
//                   contentContainerStyle={styles.apiTableContent}
//                   showsVerticalScrollIndicator={true}
//                   nestedScrollEnabled={true}
//                 >
//                   {machines.map((machine, index) =>
//                     renderTableRow(machine, index)
//                   )}
//                 </ScrollView>
//               )}
//             </View>
//           </ScrollView>
//         </View>

//         {/* Modals */}
//         <Modal
//           visible={isAddMachineModalVisible}
//           transparent
//           animationType="slide"
//           onRequestClose={handleAddMachineModalClose}
//         >
//           <View style={styles.modalOverlay}>
//             <AddMachineModal
//               visible={isAddMachineModalVisible}
//               onClose={handleAddMachineModalClose}
//               setApiCall={setApiCall}
//             />
//           </View>
//         </Modal>

//         <Modal
//           visible={isRegisterModalVisible}
//           transparent
//           animationType="slide"
//           onRequestClose={handleCloseRegisterModal}
//         >
//           <View style={styles.modalOverlay}>
//             <RegisterModelPopup
//               onClose={handleCloseRegisterModal}
//               setApiCall={setApiCall}
//             />
//           </View>
//         </Modal>

//         <Modal
//           visible={showDeleteModalVisible}
//           transparent
//           animationType="fade"
//           onRequestClose={() => setShowDeleteModalVisible(false)}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.deleteModal}>
//               <Text style={styles.deleteModalTitle}>Confirm Deletion</Text>
//               <Text style={styles.deleteModalText}>
//                 Are you sure you want to delete{" "}
//                 <Text style={styles.deleteModalBold}>
//                   {machineToDelete?.machine_name}
//                 </Text>
//                 ?
//               </Text>
//               <View style={styles.deleteModalButtons}>
//                 <TouchableOpacity
//                   style={[styles.deleteModalButton, styles.cancelButton]}
//                   onPress={() => setShowDeleteModalVisible(false)}
//                 >
//                   <Text style={styles.cancelButtonText}>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[styles.deleteModalButton, styles.confirmButton]}
//                   onPress={async () => {
//                     try {
//                       await deleteMachineData(
//                         machineToDelete.machine_id,
//                         machineToDelete.client_id || selectedClientId
//                       );
//                       Toast.show({
//                         type: "success",
//                         text1: "Machine deleted successfully",
//                         position: "top",
//                         visibilityTime: 2000,
//                         topOffset: height * 0.1,
//                       });
//                       setRefreshTrigger((prev) => prev + 1);
//                     } catch (error) {
//                       console.error("Delete error:", error);
//                       Toast.show({
//                         type: "error",
//                         text1: "Failed to delete machine",
//                         position: "top",
//                         visibilityTime: 3000,
//                         topOffset: height * 0.1,
//                       });
//                     } finally {
//                       setShowDeleteModalVisible(false);
//                       setMachineToDelete(null);
//                     }
//                   }}
//                 >
//                   <Text style={styles.confirmButtonText}>Yes, Delete</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </SafeAreaView>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   safeAreaContainer: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "transparent",
//     paddingHorizontal: width * 0.03,
//     paddingTop: Platform.OS === "ios" ? 0 : height * 0.029,
//   },
//   logoImage: {
//     width: width * 0.13,
//     height: width * 0.13,
//   },
//   menuButton: {
//     padding: width * 0.02,
//     borderRadius: width * 0.01,
//   },
//   menuIcon: {
//     fontSize: width * 0.07,
//     color: "#00D1D1",
//   },
//   headerCenter: {
//     flex: 1,
//     alignItems: "center",
//   },
//   scrollContainer: {
//     flex: 1,
//     backgroundColor: "transparent",
//   },
//   scrollContent: {
//     paddingBottom: 40,
//     paddingHorizontal: 16,
//     flexGrow: 1,
//   },
//   titleSection: {
//     paddingHorizontal: width * 0.04,
//     paddingVertical: height * 0.015,
//     alignItems: "center",
//   },
//   mainTitle: {
//     fontSize: width * 0.06,
//     fontWeight: "bold",
//     color: "#FFFFFF",
//     textAlign: "center",
//     marginBottom: height * 0.015,
//   },
//   pickerWrapper: {
//     width: "100%",
//     maxWidth: width * 0.55,
//   },
//   pickerContainer: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: width * 0.02,
//     borderWidth: 1,
//     borderColor: "#CCCCCC",
//     flexDirection: "row",
//     alignItems: "center",
//     paddingRight: width * 0.02,
//     height: height * 0.045,
//   },
//   picker: {
//     flex: 1,
//     color: "#000000",
//     backgroundColor: "transparent",
//     height: height * 0.07,
//     paddingLeft: width * 0.02,
//   },
//   section: {
//     marginBottom: height * 0.008,
//     backgroundColor: "rgba(60, 60, 60, 0.9)",
//     borderRadius: width * 0.03,
//     padding: width * 0.04,
//   },
//   sectionTitle: {
//     fontSize: width * 0.045 > 18 ? 18 : width * 0.045,
//     fontWeight: "600",
//     color: "#FFFFFF",
//     textAlign: "center",
//     marginBottom: height * 0.015,
//   },
//   loadingContainer: {
//     alignItems: "center",
//     paddingVertical: height * 0.04,
//     minHeight: height * 0.15,
//   },
//   loadingText: {
//     color: "#BBBBBB",
//     marginTop: height * 0.01,
//     fontSize: width * 0.035,
//   },
//   emptyContainer: {
//     alignItems: "center",
//     paddingVertical: height * 0.04,
//     minHeight: height * 0.15,
//   },
//   emptyText: {
//     color: "#BBBBBB",
//     fontSize: width * 0.04,
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   machinesContainer: {
//     height: height * 0.23, // Fixed height instead of maxHeight
//     backgroundColor: "transparent",
//   },
//   machinesList: {
//     flex: 1,
//     backgroundColor: "transparent",
//   },
//   machinesListContent: {
//     paddingBottom: height * 0.01,
//     flexGrow: 1,
//   },
//   machineCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "rgba(128, 232, 232, 0.3)",
//     borderRadius: width * 0.02,
//     padding: width * 0.01,
//     marginBottom: height * 0.01,
//     borderWidth: 1,
//     borderColor: "#00C4B4",
//     minHeight: height * 0.07,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   machineCardContent: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   machineIconContainer: {
//     width: width * 0.12,
//     height: width * 0.12,
//     backgroundColor: "rgba(0, 196, 180, 0.2)",
//     borderRadius: width * 0.06,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: width * 0.03,
//     borderWidth: 2,
//     borderColor: "#00C4B4",
//   },
//   machineTextContainer: {
//     flex: 1,
//   },
//   machineNameText: {
//     fontSize: width * 0.042,
//     color: "#FFFFFF",
//     fontWeight: "600",
//     marginBottom: 2,
//   },
//   clientNameText: {
//     fontSize: width * 0.032,
//     color: "#BBBBBB",
//     fontStyle: "italic",
//   },
//   deleteButton: {
//     padding: width * 0.02,
//     borderRadius: width * 0.01,
//     backgroundColor: "rgba(255, 107, 107, 0.2)",
//   },
//   deleteIcon: {
//     fontSize: width * 0.06,
//     color: "#FF6B6B",
//   },
//   tableHeader: {
//     flexDirection: "row",
//     backgroundColor: "#4C4C4C",
//     borderRadius: width * 0.02,
//     marginBottom: height * 0.01,
//     paddingVertical: height * 0.015,
//   },
//   tableHeaderCell: {
//     flex: 1,
//     paddingHorizontal: width * 0.03,
//   },
//   apiHeaderCell: {
//     flex: 1.5,
//   },
//   tableHeaderText: {
//     fontSize: width * 0.035,
//     fontWeight: "600",
//     color: "#00C4B4",
//     textAlign: "center",
//   },
//   apiTable: {
//     maxHeight: height * 0.22,
//   },
//   apiTableContent: {
//     paddingBottom: height * 0.01,
//   },
//   tableRow: {
//     flexDirection: "row",
//     backgroundColor: "#4C4C4C",
//     borderRadius: width * 0.015,
//     marginBottom: height * 0.008,
//     paddingVertical: height * 0.015,
//     minHeight: height * 0.06,
//   },
//   tableRowEven: {
//     backgroundColor: "#454545",
//   },
//   tableCell: {
//     flex: 1,
//     paddingHorizontal: width * 0.03,
//     justifyContent: "center",
//   },
//   apiCell: {
//     flex: 1.5,
//   },
//   tableCellText: {
//     fontSize: width * 0.035,
//     color: "#FFFFFF",
//     fontWeight: "500",
//   },
//   tableCellSubText: {
//     fontSize: width * 0.03,
//     color: "#BBBBBB",
//     fontStyle: "italic",
//     marginTop: 2,
//   },
//   apiText: {
//     fontSize: width * 0.03,
//     color: "#BBBBBB",
//     lineHeight: width * 0.04,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.8)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   deleteModal: {
//     backgroundColor: "#3C3C3C",
//     borderRadius: width * 0.04,
//     padding: width * 0.06,
//     width: width * 0.85,
//     maxWidth: 400,
//   },
//   deleteModalTitle: {
//     fontSize: width * 0.05,
//     fontWeight: "bold",
//     color: "#FFFFFF",
//     textAlign: "center",
//     marginBottom: height * 0.02,
//   },
//   deleteModalText: {
//     fontSize: width * 0.04,
//     color: "#BBBBBB",
//     textAlign: "center",
//     marginBottom: height * 0.03,
//     lineHeight: width * 0.055,
//   },
//   deleteModalBold: {
//     fontWeight: "bold",
//     color: "#FFFFFF",
//   },
//   deleteModalButtons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: width * 0.03,
//   },
//   deleteModalButton: {
//     flex: 1,
//     paddingVertical: height * 0.015,
//     borderRadius: width * 0.02,
//     alignItems: "center",
//   },
//   cancelButton: {
//     backgroundColor: "#5C5C5C",
//   },
//   confirmButton: {
//     backgroundColor: "#FF6B6B",
//   },
//   cancelButtonText: {
//     color: "#FFFFFF",
//     fontSize: width * 0.04,
//     fontWeight: "600",
//   },
//   confirmButtonText: {
//     color: "#FFFFFF",
//     fontSize: width * 0.04,
//     fontWeight: "600",
//   },
// });

// export default AdminScreen;

import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Modal,
  Platform,
  ScrollView,
  ImageBackground,
  FlatList,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import AddMachineModal from "../PopUp/AddMachine";
import RegisterModelPopup from "../PopUp/RegisterModelPopup";
import Toast from "react-native-toast-message";
import { getAllClients, getMachineById } from "../api/Service";
import Sidebar from "../Components/Sidebar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const AdminScreen = ({ route }) => {
  const [isAddMachineModalVisible, setIsAddMachineModalVisible] =
    useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [showDeleteModalVisible, setShowDeleteModalVisible] = useState(false);
  const [machines, setMachines] = useState([]);
  const [clients, setClients] = useState([]);
  const [userId, setUserId] = useState(null); // Store userId from AsyncStorage
  const [isLoadingMachines, setIsLoadingMachines] = useState(true);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [apiCall, setApiCall] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigation = useNavigation();

  // Fetch userId from AsyncStorage on mount
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("clientId");
        console.log(storedUserId, "clientID");
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          console.warn("No userId found in AsyncStorage");
          Toast.show({
            type: "error",
            text1: "No user ID found",
            text2: "Please log in again",
            position: "top",
            visibilityTime: 3000,
            topOffset: height * 0.1,
            text1Style: {
              fontSize: width * 0.04,
              color: "#FFFFFF",
              fontWeight: "600",
            },
            text2Style: {
              fontSize: width * 0.035,
              color: "#FFFFFF",
            },
            style: {
              backgroundColor: "#000000",
              borderWidth: 1,
              borderColor: "#FF5555",
              borderRadius: 8,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching userId from AsyncStorage:", error);
        Toast.show({
          type: "error",
          text1: "Error fetching user ID",
          text2: String(error.message || "An unexpected error occurred"),
          position: "top",
          visibilityTime: 3000,
          topOffset: height * 0.1,
          text1Style: {
            fontSize: width * 0.04,
            color: "#FFFFFF",
            fontWeight: "600",
          },
          text2Style: {
            fontSize: width * 0.035,
            color: "#FFFFFF",
          },
          style: {
            backgroundColor: "#000000",
            borderWidth: 1,
            borderColor: "#FF5555",
            borderRadius: 8,
          },
        });
      }
    };

    fetchUserId();
  }, []);

  const handleHomeNavigationClick = () => {
    setIsSidebarVisible(false);
  };

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
  //     setIsSidebarVisible(false);
  //   };

  // Handle refresh when navigating from AddMachine

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

  useEffect(() => {
    if (route?.params?.refresh) {
      setRefreshTrigger((prev) => prev + 1);
      navigation.setParams({ refresh: false });
    }
  }, [route?.params?.refresh, navigation]);

  // Use useFocusEffect to refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setRefreshTrigger((prev) => prev + 1);
    }, [])
  );

  // Fetch clients data (optional, if needed for other logic)
  useEffect(() => {
    let isMounted = true;

    const fetchClientsData = async () => {
      setIsLoadingClients(true);
      try {
        const clientsResponse = await getAllClients();
        if (clientsResponse.success && Array.isArray(clientsResponse.data)) {
          if (!isMounted) return;
          setClients(clientsResponse.data);
          return;
        }
        throw new Error(clientsResponse?.message || "Failed to fetch clients");
      } catch (error) {
        if (!isMounted) return;
        console.error("Error fetching clients:", error);
        Toast.show({
          type: "error",
          text1: "Error fetching clients",
          text2: String(error.message || "An unexpected error occurred"),
          position: "top",
          visibilityTime: 3000,
          topOffset: height * 0.1,
          text1Style: {
            fontSize: width * 0.04,
            color: "#FFFFFF",
            fontWeight: "600",
          },
          text2Style: {
            fontSize: width * 0.035,
            color: "#FFFFFF",
          },
          style: {
            backgroundColor: "#000000",
            borderWidth: 1,
            borderColor: "#FF5555",
            borderRadius: 8,
          },
        });
      } finally {
        if (isMounted) setIsLoadingClients(false);
      }
    };

    fetchClientsData();

    return () => {
      isMounted = false;
    };
  }, [apiCall, refreshTrigger]);

  // Fetch machines for userId
  useEffect(() => {
    const fetchMachines = async () => {
      if (!userId) {
        setIsLoadingMachines(false);
        return;
      }

      setIsLoadingMachines(true);
      try {
        const machinesResponse = await getMachineById(userId);

        console.log(userId, "userID fetched");

        console.log(machinesResponse, "machine response");
        if (machinesResponse.success && Array.isArray(machinesResponse?.data)) {
          const client = clients.find((c) => c.client_id === userId) || {};
          const allMachinesData = machinesResponse.data.map((machine) => ({
            ...machine,
            client_name: client.organization_name || "Unknown",
            client_id: userId,
          }));
          setMachines(allMachinesData);
        } else {
          setMachines([]);
        }
      } catch (error) {
        console.error("Error fetching machines:", error);
        Toast.show({
          type: "error",
          text1: "Failed to fetch machines",
          text2: String(error.message || "An unexpected error occurred"),
          position: "top",
          visibilityTime: 3000,
          topOffset: height * 0.1,
          text1Style: {
            fontSize: width * 0.04,
            color: "#FFFFFF",
            fontWeight: "600",
          },
          text2Style: {
            fontSize: width * 0.035,
            color: "#FFFFFF",
          },
          style: {
            backgroundColor: "#000000",
            borderWidth: 1,
            borderColor: "#FF5555",
            borderRadius: 8,
          },
        });
        setMachines([]);
      } finally {
        setIsLoadingMachines(false);
      }
    };

    fetchMachines();
  }, [userId, clients, refreshTrigger]);

  const handleMachineCardClick = useCallback(
    (machine) => {
      const fullApiUrl = `https://api1.systaldyn.xyz:6901/api/sensor/data/${machine.table_name}`;
      navigation.navigate("MachineDetailPage", {
        lat: machine.lat || null,
        lon: machine.lon || null,
        endPoint: fullApiUrl,
      });
    },
    [navigation]
  );

  const handleAddMachineClick = () => setIsAddMachineModalVisible(true);
  const handleAddMachineModalClose = () => {
    setIsAddMachineModalVisible(false);
    setRefreshTrigger((prev) => prev + 1);
  };
  const handleOpenRegisterClick = () => setIsRegisterModalVisible(true);
  const handleCloseRegisterModal = () => {
    setIsRegisterModalVisible(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  const deleteMachineData = async (machineId, clientId) => {
    try {
      const response = await fetch(
        `https://api1.systaldyn.xyz:6901/api/machine/${machineId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ client_id: userId }), // Always use userId
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMsg =
          errorData?.message ||
          `Failed to delete machine (Status: ${response.status})`;
        throw new Error(errorMsg);
      }

      try {
        return await response.json();
      } catch {
        return {};
      }
    } catch (error) {
      console.error("Delete Machine Error:", error);
      throw error;
    }
  };

  const renderMachineCard = ({ item: machine, index }) => {
    return (
      <TouchableOpacity
        style={styles.machineCard}
        onPress={() => handleMachineCardClick(machine)}
        activeOpacity={0.8}
      >
        <View style={styles.machineCardContent}>
          <View style={styles.machineIconContainer}>
            <MaterialIcons
              name="precision-manufacturing"
              size={width * 0.08}
              color="#00C4B4"
            />
          </View>
          <View style={styles.machineTextContainer}>
            <Text style={styles.machineNameText}>
              {String(machine.machine_name || "Unknown Machine")}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            setMachineToDelete(machine);
            setShowDeleteModalVisible(true);
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="delete" style={styles.deleteIcon} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderTableRow = (machine, index) => (
    <View
      key={`table_${machine.machine_id}_${index}`}
      style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}
    >
      <View style={styles.tableCell}>
        <Text style={styles.tableCellText} numberOfLines={2}>
          {String(machine.machine_name || "Unknown Machine")}
        </Text>
      </View>
      <View style={[styles.tableCell, styles.apiCell]}>
        <Text style={styles.apiText} numberOfLines={3}>
          {`https://api1.systaldyn.xyz:6901/api/sensor/data/${String(
            machine.table_name || "unknown"
          )}`}
        </Text>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require("../../assets/Rectangle.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeAreaContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#2C2C2C" />
        <Toast />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setIsSidebarVisible(true)}
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
          visible={isSidebarVisible}
          onClose={() => setIsSidebarVisible(false)}
          handleHomeClick={handleHomeNavigationClick}
          handleLogoutClick={handleLogoutClick}
        />

        {/* Main Content with Vertical Scroll */}
        <View style={{ flex: 1 }}>
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.mainTitle}>Admin Dashboard</Text>
            </View>

            {/* List of Machines Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>List of Machines</Text>
              {isLoadingMachines ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#00C4B4" />
                  <Text style={styles.loadingText}>Loading machines...</Text>
                </View>
              ) : !userId ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No user ID found. Please log in.
                  </Text>
                </View>
              ) : machines?.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No machines found</Text>
                </View>
              ) : (
                <View style={styles.machinesContainer}>
                  <FlatList
                    data={machines}
                    renderItem={renderMachineCard}
                    keyExtractor={(item, index) =>
                      `machine_${item.machine_id}_${index}`
                    }
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                    style={styles.machinesList}
                    contentContainerStyle={styles.machinesListContent}
                    scrollEnabled={true}
                    removeClippedSubviews={false}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                  />
                </View>
              )}
            </View>

            {/* API Table Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                List of Machines and APIs for Hardware
              </Text>
              <View style={styles.tableHeader}>
                <View style={styles.tableHeaderCell}>
                  <Text style={styles.tableHeaderText}>List of machines</Text>
                </View>
                <View style={[styles.tableHeaderCell, styles.apiHeaderCell]}>
                  <Text style={styles.tableHeaderText}>API for hardware</Text>
                </View>
              </View>
              {isLoadingMachines ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#00C4B4" />
                  <Text style={styles.loadingText}>Loading...</Text>
                </View>
              ) : !userId ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No user ID found. Please log in.
                  </Text>
                </View>
              ) : machines?.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No machines found</Text>
                </View>
              ) : (
                <ScrollView
                  style={styles.apiTable}
                  contentContainerStyle={styles.apiTableContent}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  {machines.map((machine, index) =>
                    renderTableRow(machine, index)
                  )}
                </ScrollView>
              )}
            </View>
          </ScrollView>
        </View>

        {/* Modals */}
        <Modal
          visible={isAddMachineModalVisible}
          transparent
          animationType="slide"
          onRequestClose={handleAddMachineModalClose}
        >
          <View style={styles.modalOverlay}>
            <AddMachineModal
              visible={isAddMachineModalVisible}
              onClose={handleAddMachineModalClose}
              setApiCall={setApiCall}
            />
          </View>
        </Modal>
        <Modal
          visible={isRegisterModalVisible}
          transparent
          animationType="slide"
          onRequestClose={handleCloseRegisterModal}
        >
          <View style={styles.modalOverlay}>
            <RegisterModelPopup
              onClose={handleCloseRegisterModal}
              setApiCall={setApiCall}
            />
          </View>
        </Modal>
        <Modal
          visible={showDeleteModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDeleteModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.deleteModal}>
              <Text style={styles.deleteModalTitle}>Confirm Deletion</Text>
              <Text style={styles.deleteModalText}>
                Are you sure you want to delete{" "}
                <Text style={styles.deleteModalBold}>
                  {String(machineToDelete?.machine_name || "Unknown Machine")}
                </Text>
                ?
              </Text>
              <View style={styles.deleteModalButtons}>
                <TouchableOpacity
                  style={[styles.deleteModalButton, styles.cancelButton]}
                  onPress={() => setShowDeleteModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.deleteModalButton, styles.confirmButton]}
                  onPress={async () => {
                    try {
                      await deleteMachineData(
                        machineToDelete.machine_id,
                        userId
                      );
                      Toast.show({
                        type: "success",
                        text1: "Machine deleted successfully",
                        text2: "",
                        position: "top",
                        visibilityTime: 2000,
                        topOffset: height * 0.1,
                        text1Style: {
                          fontSize: width * 0.04,
                          color: "#000000",
                          fontWeight: "600",
                        },
                        text2Style: {
                          fontSize: width * 0.035,
                          color: "#000000",
                        },
                        style: {
                          backgroundColor: "#00FFD1",
                          borderWidth: 1,
                          borderColor: "#2BFFFF",
                          borderRadius: 8,
                        },
                      });
                      setRefreshTrigger((prev) => prev + 1);
                    } catch (error) {
                      console.error("Delete error:", error);
                      Toast.show({
                        type: "error",
                        text1: "Failed to delete machine",
                        text2: String(
                          error.message || "An unexpected error occurred"
                        ),
                        position: "top",
                        visibilityTime: 3000,
                        topOffset: height * 0.1,
                        text1Style: {
                          fontSize: width * 0.04,
                          color: "#FFFFFF",
                          fontWeight: "600",
                        },
                        text2Style: {
                          fontSize: width * 0.035,
                          color: "#FFFFFF",
                        },
                        style: {
                          backgroundColor: "#000000",
                          borderWidth: 1,
                          borderColor: "#FF5555",
                          borderRadius: 8,
                        },
                      });
                    } finally {
                      setShowDeleteModalVisible(false);
                      setMachineToDelete(null);
                    }
                  }}
                >
                  <Text style={styles.confirmButtonText}>Yes, Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeAreaContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingHorizontal: width * 0.03,
    paddingTop: Platform.OS === "ios" ? 0 : height * 0.029,
  },
  logoImage: {
    width: width * 0.13,
    height: width * 0.13,
  },
  menuButton: {
    padding: width * 0.02,
    borderRadius: width * 0.01,
  },
  menuIcon: {
    fontSize: width * 0.07,
    color: "#00D1D1",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  titleSection: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.002,
    alignItems: "center",
  },
  mainTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: height * 0.015,
  },
  section: {
    marginBottom: height * 0.008,
    backgroundColor: "rgba(60, 60, 60, 0.9)",
    borderRadius: width * 0.03,
    padding: width * 0.04,
  },
  sectionTitle: {
    fontSize: width * 0.045 > 18 ? 18 : width * 0.041,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: height * 0.015,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: height * 0.04,
    minHeight: height * 0.15,
  },
  loadingText: {
    color: "#BBBBBB",
    marginTop: height * 0.01,
    fontSize: width * 0.035,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: height * 0.04,
    minHeight: height * 0.15,
  },
  emptyText: {
    color: "#BBBBBB",
    fontSize: width * 0.04,
    textAlign: "center",
    marginBottom: 10,
  },
  machinesContainer: {
    height: height * 0.23,
    backgroundColor: "transparent",
  },
  machinesList: {
    flex: 1,
    backgroundColor: "transparent",
  },
  machinesListContent: {
    paddingBottom: height * 0.01,
    flexGrow: 1,
  },
  machineCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(128, 232, 232, 0.3)",
    borderRadius: width * 0.02,
    padding: width * 0.01,
    marginBottom: height * 0.01,
    borderWidth: 1,
    borderColor: "#00C4B4",
    minHeight: height * 0.07,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  machineCardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  machineIconContainer: {
    width: width * 0.12,
    height: width * 0.12,
    backgroundColor: "rgba(0, 196, 180, 0.2)",
    borderRadius: width * 0.06,
    justifyContent: "center",
    alignItems: "center",
    marginRight: width * 0.03,
    borderWidth: 2,
    borderColor: "#00C4B4",
  },
  machineTextContainer: {
    flex: 1,
  },
  machineNameText: {
    fontSize: width * 0.042,
    color: "#FFFFFF",
    fontWeight: "600",
    marginBottom: 2,
  },
  clientNameText: {
    fontSize: width * 0.032,
    color: "#BBBBBB",
    fontStyle: "italic",
  },
  deleteButton: {
    padding: width * 0.02,
    borderRadius: width * 0.01,
    backgroundColor: "rgba(255, 107, 107, 0.2)",
  },
  deleteIcon: {
    fontSize: width * 0.06,
    color: "#FF6B6B",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#4C4C4C",
    borderRadius: width * 0.02,
    marginBottom: height * 0.01,
    paddingVertical: height * 0.015,
  },
  tableHeaderCell: {
    flex: 1,
    paddingHorizontal: width * 0.03,
  },
  apiHeaderCell: {
    flex: 1.5,
  },
  tableHeaderText: {
    fontSize: width * 0.035,
    fontWeight: "600",
    color: "#00C4B4",
    textAlign: "center",
  },
  apiTable: {
    maxHeight: height * 0.233,
  },
  apiTableContent: {
    paddingBottom: height * 0.01,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#4C4C4C",
    borderRadius: width * 0.015,
    marginBottom: height * 0.008,
    paddingVertical: height * 0.015,
    minHeight: height * 0.06,
  },
  tableRowEven: {
    backgroundColor: "#454545",
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: width * 0.03,
    justifyContent: "center",
  },
  apiCell: {
    flex: 1.5,
  },
  tableCellText: {
    fontSize: width * 0.035,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  tableCellSubText: {
    fontSize: width * 0.03,
    color: "#BBBBBB",
    fontStyle: "italic",
    marginTop: 2,
  },
  apiText: {
    fontSize: width * 0.03,
    color: "#BBBBBB",
    lineHeight: width * 0.04,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteModal: {
    backgroundColor: "#3C3C3C",
    borderRadius: width * 0.04,
    padding: width * 0.06,
    width: width * 0.85,
    maxWidth: 400,
  },
  deleteModalTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: height * 0.02,
  },
  deleteModalText: {
    fontSize: width * 0.04,
    color: "#BBBBBB",
    textAlign: "center",
    marginBottom: height * 0.03,
    lineHeight: width * 0.055,
  },
  deleteModalBold: {
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  deleteModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: width * 0.03,
  },
  deleteModalButton: {
    flex: 1,
    paddingVertical: height * 0.015,
    borderRadius: width * 0.02,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#5C5C5C",
  },
  confirmButton: {
    backgroundColor: "#FF6B6B",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: width * 0.04,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: width * 0.04,
    fontWeight: "600",
  },
});

export default AdminScreen;
