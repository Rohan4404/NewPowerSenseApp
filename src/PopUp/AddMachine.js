// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   Modal,
//   TextInput,
//   ActivityIndicator,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// import Toast from "react-native-toast-message";
// import { getAllClients, addMachine } from "../api/Service";

// const { width, height } = Dimensions.get("window");

// const AddMachineModal = ({ visible, onClose, setApiCall }) => {
//   const role = AsyncStorage.getItem("role");
//   const userID = AsyncStorage.getItem("userID");

//   console.log("Role:", role);
//   console.log("UserID:", userID);

//   const [clients, setClients] = useState([]);

//   console.log("Clients state:", clients);
//   const [formData, setFormData] = useState({
//     clientId: "",
//     machine_name: "",
//     address: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // useEffect(() => {
//   //   const fetchClients = async () => {
//   //     try {
//   //       const response = await getAllClients();
//   //       console.log("Clients response data:", response.data);
//   //       if (response.success && Array.isArray(response.data)) {
//   //         setClients(response.data);

//   //         console.log("Fetched clients:", response.data);
//   //       } else {
//   //         console.error(
//   //           "Failed to fetch clients:",
//   //           response?.message || "Invalid response"
//   //         );
//   //         Toast.show({
//   //           type: "error",
//   //           text1: "Failed to fetch clients",
//   //           position: "top",
//   //           visibilityTime: 3000,
//   //         });
//   //       }
//   //     } catch (error) {
//   //       console.error("Error fetching clients:", error);
//   //       Toast.show({
//   //         type: "error",
//   //         text1: "Error fetching clients",
//   //         position: "top",
//   //         visibilityTime: 3000,
//   //       });
//   //     }
//   //   };

//   //   if (visible) {
//   //     fetchClients();
//   //   }
//   // }, [visible]);

//   useEffect(() => {
//     console.log("Visible changed to:", visible); // Debug log for visibility state

//     const fetchClients = async () => {
//       try {
//         const response = await getAllClients();
//         console.log("Full clients response add machine:", response); // Log full API response

//         // Check response structure
//         if (response.success && Array.isArray(response.data)) {
//           setClients(response.data);
//           console.log("Fetched clients:", response.data);
//         } else {
//           console.error(
//             "Failed to fetch clients:",
//             response?.message || "Invalid response"
//           );

//           Toast.show({
//             type: "error",
//             text1: "Failed to fetch clients",
//             position: "top",
//             visibilityTime: 3000,
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching clients:", error);

//         Toast.show({
//           type: "error",
//           text1: "Error fetching clients",
//           position: "top",
//           visibilityTime: 3000,
//         });
//       }
//     };

//     // Only fetch if visible is true
//     if (visible) {
//       fetchClients();
//     }
//   }, [visible]);

//   const handleChange = (name, value) => {
//     setFormData({ ...formData, [name]: value });
//     setErrors({ ...errors, [name]: "" });
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.clientId) newErrors.clientId = "Client is required";
//     if (!formData.machine_name)
//       newErrors.machine_name = "Machine Name is required";
//     if (!formData.address) newErrors.address = "Address is required";
//     return newErrors;
//   };

//   const getLatLonFromAddress = async (address) => {
//     if (!address || address.trim() === "") {
//       console.log("Empty or invalid address provided");
//       return null;
//     }

//     const tryGeocode = async (query) => {
//       try {
//         const encodedQuery = encodeURIComponent(query.trim());
//         const apiKey = "a321107d1af841a3bb48f539f65e78dd"; // Replace with a valid OpenCage API key
//         const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodedQuery}&key=${apiKey}&limit=1&no_annotations=1`;
//         console.log(`Fetching geocode for query: ${query}, URL: ${url}`);
//         const response = await fetch(url, {
//           method: "GET",
//           headers: {
//             Accept: "application/json",
//             "User-Agent": "AddMachineApp/1.0 (your-email@example.com)",
//           },
//         });
//         if (!response.ok) {
//           console.error(
//             `OpenCage API error: ${response.status} ${response.statusText}`
//           );
//           const errorText = await response.text();
//           console.error(`Error response: ${errorText}`);
//           return null;
//         }
//         const data = await response.json();
//         console.log(`OpenCage API Response for "${query}":`, data);
//         if (data.status.code !== 200) {
//           console.error(`OpenCage API status error: ${data.status.message}`);
//           return null;
//         }
//         if (data.results.length > 0) {
//           const { lat, lng } = data.results[0].geometry;
//           return { lat: parseFloat(lat), lon: parseFloat(lng) };
//         } else {
//           console.log(`No results found for query: ${query}`);
//           return null;
//         }
//       } catch (error) {
//         console.error(`Error fetching geolocation for "${query}":`, error);
//         return null;
//       }
//     };

//     // Try the full address first
//     let geoData = await tryGeocode(address);
//     if (geoData) {
//       console.log(`Geocoded full address:`, geoData);
//       return geoData;
//     }

//     // Fallback 1: Remove plot numbers, house numbers, and postal codes
//     const simplifiedAddress = address
//       .replace(/Khasra-\d+,?\s*/, "")
//       .replace(/^\d+,\s*/, "")
//       .replace(/,\s*\d{6}/, "");
//     console.log(`Trying simplified address: ${simplifiedAddress}`);
//     geoData = await tryGeocode(simplifiedAddress);
//     if (geoData) {
//       console.log(`Geocoded simplified address:`, geoData);
//       return geoData;
//     }

//     // Fallback 2: Extract city and state dynamically
//     const addressParts = address.split(",").map((part) => part.trim());
//     const postalCodeRegex = /\d{6}$/;
//     let city = null;
//     let state = null;

//     if (postalCodeRegex.test(addressParts[addressParts.length - 1])) {
//       if (addressParts.length >= 3) {
//         state = addressParts[addressParts.length - 2];
//         city = addressParts[addressParts.length - 3];
//       } else if (addressParts.length === 2) {
//         city = addressParts[0];
//       }
//     } else {
//       if (addressParts.length >= 2) {
//         state = addressParts[addressParts.length - 1];
//         city = addressParts[addressParts.length - 2];
//       } else if (addressParts.length === 1) {
//         city = addressParts[0];
//       }
//     }

//     if (city && state) {
//       console.log(`Trying city and state: ${city}, ${state}`);
//       geoData = await tryGeocode(`${city}, ${state}`);
//       if (geoData) {
//         console.log(`Geocoded city and state:`, geoData);
//         return geoData;
//       }
//     }
//     if (city) {
//       console.log(`Trying city only: ${city}`);
//       geoData = await tryGeocode(city);
//       if (geoData) {
//         console.log(`Geocoded city:`, geoData);
//         return geoData;
//       }
//     }

//     console.log("All geocoding attempts failed");
//     return null;
//   };

//   const handleSubmit = async () => {
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const geoData = await getLatLonFromAddress(formData.address);
//       if (!geoData) {
//         Toast.show({
//           type: "error",
//           text1: "Unable to geocode address",
//           text2:
//             "Please ensure the address is valid (e.g., Hapur, Uttar Pradesh, India).",
//           position: "top",
//           visibilityTime: 3000,
//         });
//         setIsSubmitting(false);
//         return;
//       }

//       const payload = {
//         client_id: formData.clientId,
//         machine_name: formData.machine_name,
//         lat: geoData.lat,
//         lon: geoData.lon,
//       };

//       console.log("Submitting payload:", payload);
//       const response = await addMachine(payload);
//       console.log("addMachine response:", response);
//       if (response.success) {
//         Toast.show({
//           type: "success",
//           text1: "Machine added successfully!",
//           position: "top",
//           visibilityTime: 2000,
//         });
//         setApiCall((prev) => !prev);
//         onClose();
//       } else {
//         Toast.show({
//           type: "error",
//           text1: response.message || "Failed to add machine",
//           position: "top",
//           visibilityTime: 3000,
//         });
//       }
//     } catch (error) {
//       console.error("Submit error:", error);
//       Toast.show({
//         type: "error",
//         text1: "An error occurred while adding the machine",
//         position: "top",
//         visibilityTime: 3000,
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Modal
//       visible={visible}
//       transparent={true}
//       animationType="fade"
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//             <MaterialIcons name="close" size={width * 0.07} color="#FFFFFF" />
//           </TouchableOpacity>

//           <Text style={styles.modalTitle}>Add Machine</Text>

//           <View style={styles.formContainer}>
//             {/* Client Picker */}
//             <View style={styles.inputContainer}>
//               <View
//                 style={[
//                   styles.pickerContainer,
//                   errors.clientId && styles.errorBorder,
//                 ]}
//               >
//                 <Picker
//                   selectedValue={formData.clientId}
//                   onValueChange={(value) => handleChange("clientId", value)}
//                   style={styles.picker}
//                 >
//                   <Picker.Item label="Select Client" value="" enabled={false} />
//                   {clients.length === 0 ? (
//                     <Picker.Item
//                       label="No clients available"
//                       value=""
//                       enabled={false}
//                     />
//                   ) : (
//                     clients.map((client) => (
//                       <Picker.Item
//                         key={client.client_id}
//                         label={client.organization_name || "Unnamed Client"}
//                         value={client.client_id}
//                       />
//                     ))
//                   )}
//                 </Picker>
//               </View>
//               {errors.clientId && (
//                 <Text style={styles.errorText}>{errors.clientId}</Text>
//               )}
//             </View>

//             {/* Machine Name Input */}
//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={[
//                   styles.input,
//                   errors.machine_name && styles.errorBorder,
//                 ]}
//                 value={formData.machine_name}
//                 onChangeText={(text) => handleChange("machine_name", text)}
//                 placeholder="Enter the Machine Name"
//                 placeholderTextColor="#A0A0A0"
//               />
//               {errors.machine_name && (
//                 <Text style={styles.errorText}>{errors.machine_name}</Text>
//               )}
//             </View>

//             {/* Address Input */}
//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={[styles.input, errors.address && styles.errorBorder]}
//                 value={formData.address}
//                 onChangeText={(text) => handleChange("address", text)}
//                 placeholder="Enter Address (e.g., Hapur, Uttar Pradesh, India)"
//                 placeholderTextColor="#A0A0A0"
//               />
//               {errors.address && (
//                 <Text style={styles.errorText}>{errors.address}</Text>
//               )}
//             </View>

//             {/* Submit Button */}
//             <TouchableOpacity
//               style={[
//                 styles.submitButton,
//                 isSubmitting && styles.disabledButton,
//               ]}
//               onPress={handleSubmit}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <ActivityIndicator size="small" color="#000000" />
//               ) : (
//                 <Text style={styles.submitButtonText}>Submit</Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default AddMachineModal;

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(55, 55, 55, 0.6)", // Equivalent to bg-[#37373766] with opacity
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: width * 0.05, // Responsive padding (px-4 sm:px-6)
//   },
//   modalContent: {
//     width: width * 0.9, // max-w-[90vw] sm:max-w-[80vw] md:max-w-[40rem]
//     maxWidth: 400, // Approximate 40rem in pixels
//     minHeight: height * 0.5, // min-h-[50vh] sm:min-h-[22rem]
//     maxHeight: height * 0.6, // lg:max-h-[24rem]
//     backgroundColor: "#000000", // Base color for gradient
//     borderWidth: 2,
//     borderColor: "#2BFFFF",
//     borderRadius: 12,
//     padding: width * 0.05, // p-4 sm:p-6 md:p-8
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.5,
//     shadowRadius: 15,
//     elevation: 10,
//   },
//   closeButton: {
//     position: "absolute",
//     top: width * 0.03, // top-3 sm:top-4
//     right: width * 0.03, // right-3 sm:right-4
//     padding: 5,
//   },
//   modalTitle: {
//     fontSize: width * 0.06 > 24 ? 24 : width * 0.06, // sm:text-2xl md:text-3xl
//     fontWeight: "bold",
//     color: "#FFFFFF",
//     textAlign: "center",
//     marginBottom: height * 0.03, // mb-4 sm:mb-6
//   },
//   formContainer: {
//     marginTop: height * 0.02,
//     gap: height * 0.02, // space-y-3 sm:space-y-4
//   },
//   inputContainer: {
//     width: "100%",
//     alignItems: "center",
//   },
//   pickerContainer: {
//     width: "90%", // max-w-[95%] sm:max-w-[80%]
//     borderWidth: 1,
//     borderColor: "#FFFFFF",
//     borderRadius: 12,
//     backgroundColor: "transparent",
//   },
//   picker: {
//     height: height * 0.07, // Approximate py-3 sm:py-4
//     color: "#FFFFFF",
//   },
//   input: {
//     width: "90%", // max-w-[95%] sm:max-w-[80%]
//     height: height * 0.07, // Approximate py-3 sm:py-3
//     borderWidth: 1,
//     borderColor: "#FFFFFF",
//     borderRadius: 12,
//     paddingHorizontal: width * 0.04, // px-3 sm:px-4
//     color: "#FFFFFF",
//     fontSize: width * 0.04 > 16 ? 16 : width * 0.04, // text-sm sm:text-base
//   },
//   errorBorder: {
//     borderColor: "#FF4444",
//   },
//   errorText: {
//     color: "#FF4444",
//     fontSize: width * 0.035 > 12 ? 12 : width * 0.035, // text-xs
//     marginTop: 5,
//     textAlign: "left",
//     width: "90%",
//   },
//   submitButton: {
//     width: "90%", // max-w-[95%] sm:max-w-[80%]
//     height: height * 0.07, // Approximate py-3 sm:py-3
//     backgroundColor: "#00D1D1",
//     borderRadius: 12,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: height * 0.03, // mt-6
//   },
//   disabledButton: {
//     opacity: 0.6,
//   },
//   submitButtonText: {
//     fontSize: width * 0.05 > 20 ? 20 : width * 0.05, // text-xl
//     fontWeight: "bold",
//     color: "#000000",
//   },
// });

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   Modal,
//   TextInput,
//   ActivityIndicator,
//   Platform,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";

// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import Toast from "react-native-toast-message";
// import { getAllClients, addMachine } from "../api/Service";

// const { width } = Dimensions.get("window");

// const AddMachineModal = ({ visible, onClose, setApiCall }) => {
//   const [clients, setClients] = useState([]);
//   const [formData, setFormData] = useState({
//     clientId: "",
//     machine_name: "",
//     address: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoadingClients, setIsLoadingClients] = useState(false);

//   useEffect(() => {
//     const fetchClients = async () => {
//       setIsLoadingClients(true);
//       try {
//         const response = await getAllClients();
//         console.log(
//           "API Response (getAllClients):",
//           JSON.stringify(response, null, 2)
//         );

//         if (response.success && Array.isArray(response.data)) {
//           console.log("Clients fetched:", response.data);
//           setClients(response.data);
//         } else {
//           console.error("Invalid response:", response?.message || "No data");
//           Toast.show({
//             type: "error",
//             text1: "Failed to load clients",
//             position: "top",
//             visibilityTime: 3000,
//           });
//           setClients([]);
//         }
//       } catch (error) {
//         console.error("Error fetching clients:", error.message);
//         Toast.show({
//           type: "error",
//           text1: "Error loading clients",
//           position: "top",
//           visibilityTime: 3000,
//         });
//         setClients([]);
//       } finally {
//         setIsLoadingClients(false);
//       }
//     };

//     if (visible) {
//       fetchClients();
//     } else {
//       setClients([]);
//       setFormData({ clientId: "", machine_name: "", address: "" });
//       setErrors({});
//     }
//   }, [visible]);

//   const handleChange = (name, value) => {
//     console.log(`Picker change: ${name} = ${value}`);
//     setFormData({ ...formData, [name]: value });
//     setErrors({ ...errors, [name]: "" });
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.clientId) newErrors.clientId = "Client is required";
//     if (!formData.machine_name)
//       newErrors.machine_name = "Machine Name is required";
//     if (!formData.address) newErrors.address = "Address is required";
//     return newErrors;
//   };

//   const getLatLonFromAddress = async (address) => {
//     if (!address || address.trim() === "") {
//       console.log("Invalid address provided");
//       return null;
//     }

//     const tryGeocode = async (query) => {
//       try {
//         const encodedQuery = encodeURIComponent(query.trim());
//         const apiKey = "YOUR_VALID_OPENCAGE_API_KEY"; // Replace with your valid OpenCage API key
//         const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodedQuery}&key=${apiKey}&limit=1&no_annotations=1`;
//         console.log(`Geocoding query: ${query}`);
//         const response = await fetch(url, {
//           method: "GET",
//           headers: {
//             Accept: "application/json",
//             "User-Agent": "AddMachineApp/1.0",
//           },
//         });
//         if (!response.ok) {
//           console.error(`OpenCage API error: ${response.status}`);
//           return null;
//         }
//         const data = await response.json();
//         if (data.status.code === 200 && data.results.length > 0) {
//           const { lat, lng } = data.results[0].geometry;
//           return { lat: parseFloat(lat), lon: parseFloat(lng) };
//         }
//         return null;
//       } catch (error) {
//         console.error(`Geocoding error for "${query}":`, error.message);
//         return null;
//       }
//     };

//     let geoData = await tryGeocode(address);
//     if (geoData) return geoData;

//     const simplifiedAddress = address
//       .replace(/Khasra-\d+,?\s*/, "")
//       .replace(/^\d+,\s*/, "")
//       .replace(/,\s*\d{6}/, "");
//     geoData = await tryGeocode(simplifiedAddress);
//     if (geoData) return geoData;

//     const addressParts = address.split(",").map((part) => part.trim());
//     const postalCodeRegex = /\d{6}$/;
//     let city = null;
//     let state = null;

//     if (postalCodeRegex.test(addressParts[addressParts.length - 1])) {
//       if (addressParts.length >= 3) {
//         state = addressParts[addressParts.length - 2];
//         city = addressParts[addressParts.length - 3];
//       } else if (addressParts.length === 2) {
//         city = addressParts[0];
//       }
//     } else {
//       if (addressParts.length >= 2) {
//         state = addressParts[addressParts.length - 1];
//         city = addressParts[addressParts.length - 2];
//       } else if (addressParts.length === 1) {
//         city = addressParts[0];
//       }
//     }

//     if (city && state) {
//       geoData = await tryGeocode(`${city}, ${state}`);
//       if (geoData) return geoData;
//     }
//     if (city) {
//       geoData = await tryGeocode(city);
//       if (geoData) return geoData;
//     }

//     return null;
//   };

//   const handleSubmit = async () => {
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const geoData = await getLatLonFromAddress(formData.address);
//       if (!geoData) {
//         Toast.show({
//           type: "error",
//           text1: "Invalid address",
//           text2:
//             "Please enter a valid address (e.g., Hapur, Uttar Pradesh, India).",
//           position: "top",
//           visibilityTime: 3000,
//         });
//         return;
//       }

//       const payload = {
//         client_id: formData.clientId,
//         machine_name: formData.machine_name,
//         lat: geoData.lat,
//         lon: geoData.lon,
//       };
//       console.log("Submitting payload:", payload);

//       const response = await addMachine(payload);
//       if (response.success) {
//         Toast.show({
//           type: "success",
//           text1: "Machine added successfully!",
//           position: "top",
//           visibilityTime: 2000,
//         });
//         setApiCall((prev) => !prev);
//         onClose();
//       } else {
//         Toast.show({
//           type: "error",
//           text1: response.message || "Failed to add machine",
//           position: "top",
//           visibilityTime: 3000,
//         });
//       }
//     } catch (error) {
//       console.error("Submit error:", error.message);
//       Toast.show({
//         type: "error",
//         text1: "Error adding machine",
//         position: "top",
//         visibilityTime: 3000,
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Modal
//       visible={visible}
//       transparent={true}
//       animationType="fade"
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//             <MaterialIcons name="close" size={width * 0.06} color="#FFFFFF" />
//           </TouchableOpacity>

//           <Text style={styles.modalTitle}>Add Machine</Text>

//           <View style={styles.formContainer}>
//             {/* Client Picker */}
//             <View style={styles.inputContainer}>
//               <View
//                 style={[
//                   styles.pickerContainer,
//                   errors.clientId && styles.errorBorder,
//                 ]}
//               >
//                 {isLoadingClients ? (
//                   <View style={styles.loaderContainer}>
//                     <ActivityIndicator size="small" color="#007AFF" />
//                     <Text style={styles.loaderText}>Loading clients...</Text>
//                   </View>
//                 ) : (
//                   <Picker
//                     selectedValue={formData.clientId}
//                     onValueChange={(value) => handleChange("clientId", value)}
//                     style={styles.picker}
//                     dropdownIconColor="#000000"
//                     mode="dropdown"
//                     enabled={!isLoadingClients && clients.length > 0}
//                     prompt="Select a Client"
//                   >
//                     <Picker.Item
//                       label="Select Client"
//                       value=""
//                       enabled={false}
//                     />
//                     {clients.length > 0 ? (
//                       clients.map((client) => (
//                         <Picker.Item
//                           key={client.client_id}
//                           label={
//                             client.organization_name ||
//                             `Client ${client.client_id}`
//                           }
//                           value={client.client_id}
//                           style={styles.pickerItem}
//                         />
//                       ))
//                     ) : (
//                       <Picker.Item
//                         label="No clients available"
//                         value=""
//                         enabled={false}
//                       />
//                     )}
//                   </Picker>
//                 )}
//               </View>
//               {errors.clientId && (
//                 <Text style={styles.errorText}>{errors.clientId}</Text>
//               )}
//             </View>

//             {/* Machine Name Input */}
//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={[
//                   styles.input,
//                   errors.machine_name && styles.errorBorder,
//                 ]}
//                 value={formData.machine_name}
//                 onChangeText={(text) => handleChange("machine_name", text)}
//                 placeholder="Enter Machine Name"
//                 placeholderTextColor="#A0A0A0"
//               />
//               {errors.machine_name && (
//                 <Text style={styles.errorText}>{errors.machine_name}</Text>
//               )}
//             </View>

//             {/* Address Input */}
//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={[styles.input, errors.address && styles.errorBorder]}
//                 value={formData.address}
//                 onChangeText={(text) => handleChange("address", text)}
//                 placeholder="Enter Address (e.g., Hapur, Uttar Pradesh, India)"
//                 placeholderTextColor="#A0A0A0"
//               />
//               {errors.address && (
//                 <Text style={styles.errorText}>{errors.address}</Text>
//               )}
//             </View>

//             {/* Submit Button */}
//             <TouchableOpacity
//               style={[
//                 styles.submitButton,
//                 isSubmitting && styles.disabledButton,
//               ]}
//               onPress={handleSubmit}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <ActivityIndicator size="small" color="#FFFFFF" />
//               ) : (
//                 <Text style={styles.submitButtonText}>Submit</Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     width: width * 0.9,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 10,
//     padding: 20,
//     alignItems: "center",
//     maxHeight: "80%", // Prevent content from overflowing
//   },
//   closeButton: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     backgroundColor: "#FF3B30",
//     borderRadius: 15,
//     padding: 5,
//     zIndex: 2000,
//   },
//   modalTitle: {
//     fontSize: width * 0.05,
//     fontWeight: "bold",
//     color: "#000000",
//     marginBottom: 20,
//   },
//   formContainer: {
//     width: "100%",
//   },
//   inputContainer: {
//     marginBottom: 15,
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     zIndex: 10,
//     borderColor: "#A0A0A0",
//     borderRadius: 5,
//     backgroundColor: "#FFFFFF",
//     ...Platform.select({
//       ios: {
//         height: 150, // Increased for iOS wheel
//       },
//       android: {
//         height: 50, // Standard for Android dropdown
//         elevation: 10, // Higher elevation for dropdown
//       },
//     }),
//     zIndex: 1000, // Ensure dropdown is above other elements
//     overflow: "visible", // Prevent clipping of dropdown
//   },
//   picker: {
//     backgroundColor: "#fff",
//     borderColor: "#ccc",
//     borderWidth: 1,
//     width: "100%",
//     color: "#000000",
//     ...Platform.select({
//       ios: {
//         height: 150,
//       },
//       android: {
//         height: 50,
//       },
//     }),
//   },
//   pickerItem: {
//     fontSize: width * 0.04,
//     color: "#000000",
//   },
//   loaderContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 10,
//   },
//   loaderText: {
//     marginLeft: 10,
//     color: "#000000",
//     fontSize: width * 0.04,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#A0A0A0",
//     borderRadius: 5,
//     padding: 10,
//     fontSize: width * 0.04,
//     color: "#000000",
//     backgroundColor: "#FFFFFF",
//   },
//   errorBorder: {
//     borderColor: "#FF3B30",
//   },
//   errorText: {
//     color: "#FF3B30",
//     fontSize: width * 0.035,
//     marginTop: 5,
//   },
//   submitButton: {
//     backgroundColor: "#007AFF",
//     borderRadius: 5,
//     padding: 15,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   submitButtonText: {
//     color: "#FFFFFF",
//     fontSize: width * 0.04,
//     fontWeight: "bold",
//   },
//   disabledButton: {
//     backgroundColor: "#A0A0A0",
//   },
// });

// export default AddMachineModal;

// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   TextInput,
//   ActivityIndicator,
//   Platform,
//   Image,
//   ScrollView,
//   KeyboardAvoidingView,
//   Animated,
//   PanResponder,
//   TouchableWithoutFeedback,
//   SafeAreaView,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import Toast from "react-native-toast-message";
// import { getAllClients, addMachine } from "../api/Service";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const { width, height } = Dimensions.get("window");

// const Sidebar = ({ visible, onClose, handleHomeClick, navigation }) => {
//   const slideAnim = useRef(new Animated.Value(-width * 0.75)).current;
//   const overlayOpacity = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     if (visible) {
//       Animated.parallel([
//         Animated.timing(slideAnim, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: false,
//         }),
//         Animated.timing(overlayOpacity, {
//           toValue: 1,
//           duration: 300,
//           useNativeDriver: false,
//         }),
//       ]).start();
//     } else {
//       Animated.parallel([
//         Animated.timing(slideAnim, {
//           toValue: -width * 0.75,
//           duration: 300,
//           useNativeDriver: false,
//         }),
//         Animated.timing(overlayOpacity, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: false,
//         }),
//       ]).start();
//     }
//   }, [visible]);

//   const panResponder = useRef(
//     PanResponder.create({
//       onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
//       onPanResponderMove: (_, gesture) => {
//         if (gesture.dx < 0) {
//           slideAnim.setValue(Math.max(gesture.dx, -width * 0.75));
//         }
//       },
//       onPanResponderRelease: (_, gesture) => {
//         if (gesture.dx < -50) {
//           onClose();
//         } else {
//           Animated.timing(slideAnim, {
//             toValue: 0,
//             duration: 200,
//             useNativeDriver: false,
//           }).start();
//         }
//       },
//     })
//   ).current;

//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.removeItem("token");
//       await AsyncStorage.removeItem("sessionToken");
//       await AsyncStorage.removeItem("userId");
//       await AsyncStorage.removeItem("userID");
//       await AsyncStorage.removeItem("clientId");
//       await AsyncStorage.removeItem("role");
//       await AsyncStorage.removeItem("savedEmailOrPhone");

//       Toast.show({
//         type: "success",
//         text1: "Logged out successfully!",
//         position: "top",
//         autoHide: true,
//         visibilityTime: 2000,
//       });

//       navigation.replace("Login");
//     } catch (error) {
//       Toast.show({
//         type: "error",
//         text1: "Error logging out. Please try again.",
//         position: "top",
//         autoHide: true,
//         visibilityTime: 3000,
//       });
//     } finally {
//       onClose();
//     }
//   };

//   return visible ? (
//     <View style={StyleSheet.absoluteFill}>
//       <TouchableWithoutFeedback onPress={onClose}>
//         <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
//       </TouchableWithoutFeedback>

//       <Animated.View
//         style={[styles.sidebar, { left: slideAnim }]}
//         {...panResponder.panHandlers}
//       >
//         <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
//           <MaterialIcons name="close" size={28} color="#FFFFFF" />
//         </TouchableOpacity>

//         <ScrollView contentContainerStyle={styles.content}>
//           <Text style={styles.logo}>⚡ Power Sense</Text>

//           <TouchableOpacity style={styles.navItem} onPress={handleHomeClick}>
//             <MaterialIcons name="home" size={22} color="#00E6E6" />
//             <Text style={styles.navText}>Home</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.navItem}>
//             <MaterialIcons name="settings" size={22} color="#00E6E6" />
//             <Text style={styles.navText}>Settings</Text>
//           </TouchableOpacity>

//           <View style={styles.bottomSpacer} />

//           <TouchableOpacity style={styles.navItem} onPress={handleLogout}>
//             <MaterialIcons name="logout" size={22} color="#00E6E6" />
//             <Text style={styles.navText}>Logout</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </Animated.View>
//     </View>
//   ) : null;
// };

// const AddMachinePage = ({ navigation }) => {
//   const [clients, setClients] = useState([]);
//   const [formData, setFormData] = useState({
//     clientId: "",
//     machine_name: "",
//     address: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoadingClients, setIsLoadingClients] = useState(false);
//   const [isSidebarVisible, setIsSidebarVisible] = useState(false);

//   useEffect(() => {
//     const fetchClients = async () => {
//       setIsLoadingClients(true);
//       try {
//         const response = await getAllClients();
//         console.log(
//           "API Response (getAllClients):",
//           JSON.stringify(response, null, 2)
//         );

//         if (response.success && Array.isArray(response.data)) {
//           console.log("Clients fetched:", response.data);
//           setClients(response.data);
//         } else {
//           console.error("Invalid response:", response?.message || "No data");
//           Toast.show({
//             type: "error",
//             text1: "Failed to load clients",
//             position: "top",
//             visibilityTime: 3000,
//           });
//           setClients([]);
//         }
//       } catch (error) {
//         console.error("Error fetching clients:", error.message);
//         Toast.show({
//           type: "error",
//           text1: "Error loading clients",
//           position: "top",
//           visibilityTime: 3000,
//         });
//         setClients([]);
//       } finally {
//         setIsLoadingClients(false);
//       }
//     };

//     fetchClients();
//     return () => {
//       setClients([]);
//       setFormData({ clientId: "", machine_name: "", address: "" });
//       setErrors({});
//     };
//   }, []);

//   const handleChange = (name, value) => {
//     console.log(`Picker change: ${name} = ${value}`);
//     setFormData({ ...formData, [name]: value });
//     setErrors({ ...errors, [name]: "" });
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.clientId) newErrors.clientId = "Client is required";
//     if (!formData.machine_name)
//       newErrors.machine_name = "Machine Name is required";
//     if (!formData.address) newErrors.address = "Address is required";
//     return newErrors;
//   };

//   const getLatLonFromAddress = async (address) => {
//     if (!address || address.trim() === "") {
//       console.log("Invalid address provided");
//       return null;
//     }

//     // const tryGeocode = async (query) => {
//     //   try {
//     //     const encodedQuery = encodeURIComponent(query.trim());
//     //     const apiKey = "YOUR_VALID_OPENCAGE_API_KEY";
//     //     const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodedQuery}&key=${apiKey}&limit=1&no_annotations=1`;
//     //     console.log(`Geocoding query: ${query}`);
//     //     const response = await fetch(url, {
//     //       method: "GET",
//     //       headers: {
//     //         Accept: "application/json",
//     //         "User-Agent": "AddMachineApp/1.0",
//     //       },
//     //     });
//     //     if (!response.ok) {
//     //       console.error(`OpenCage API error: ${response.status}`);
//     //       return null;
//     //     }
//     //     const data = await response.json();
//     //     if (data.status.code === 200 && data.results.length > 0) {
//     //       const { lat, lng } = data.results[0].geometry;
//     //       return { lat: parseFloat(lat), lon: parseFloat(lng) };
//     //     }
//     //     return null;
//     //   } catch (error) {
//     //     console.error(`Geocoding error for "${query}":`, error.message);
//     //     return null;
//     //   }
//     // };

//     const tryGeocode = async (query) => {
//       try {
//         const encodedQuery = encodeURIComponent(query.trim());
//         const apiKey = "a321107d1af841a3bb48f539f65e78dd"; // Replace with a valid OpenCage API key
//         const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodedQuery}&key=${apiKey}&limit=1&no_annotations=1`;
//         console.log(`Fetching geocode for query: ${query}, URL: ${url}`);
//         const response = await fetch(url, {
//           method: "GET",
//           headers: {
//             Accept: "application/json",
//             "User-Agent": "AddMachineApp/1.0 (your-email@example.com)", // Optional, for OpenCage
//           },
//         });
//         if (!response.ok) {
//           console.error(
//             `OpenCage API error: ${response.status} ${response.statusText}`
//           );
//           const errorText = await response.text();
//           console.error(`Error response: ${errorText}`);
//           return null;
//         }
//         const data = await response.json();
//         console.log(`OpenCage API Response for "${query}":`, data);
//         if (data.status.code !== 200) {
//           console.error(`OpenCage API status error: ${data.status.message}`);
//           return null;
//         }
//         if (data.results.length > 0) {
//           const { lat, lng } = data.results[0].geometry;
//           return { lat: parseFloat(lat), lon: parseFloat(lng) };
//         } else {
//           console.log(`No results found for query: ${query}`);
//           return null;
//         }
//       } catch (error) {
//         console.error(`Error fetching geolocation for "${query}":`, error);
//         if (
//           error.name === "TypeError" &&
//           error.message.includes("Failed to fetch")
//         ) {
//           // console.error(
//           //   "CORS or network issue. Check Network tab for details."
//           // );
//         }
//         return null;
//       }
//     };

//     let geoData = await tryGeocode(address);
//     if (geoData) return geoData;

//     const simplifiedAddress = address
//       .replace(/Khasra-\d+,?\s*/, "")
//       .replace(/^\d+,\s*/, "")
//       .replace(/,\s*\d{6}/, "");
//     geoData = await tryGeocode(simplifiedAddress);
//     if (geoData) return geoData;

//     const addressParts = address.split(",").map((part) => part.trim());
//     const postalCodeRegex = /\d{6}$/;
//     let city = null;
//     let state = null;

//     if (postalCodeRegex.test(addressParts[addressParts.length - 1])) {
//       if (addressParts.length >= 3) {
//         state = addressParts[addressParts.length - 2];
//         city = addressParts[addressParts.length - 3];
//       } else if (addressParts.length === 2) {
//         city = addressParts[0];
//       }
//     } else {
//       if (addressParts.length >= 2) {
//         state = addressParts[addressParts.length - 1];
//         city = addressParts[addressParts.length - 2];
//       } else if (addressParts.length === 1) {
//         city = addressParts[0];
//       }
//     }

//     if (city && state) {
//       geoData = await tryGeocode(`${city}, ${state}`);
//       if (geoData) return geoData;
//     }
//     if (city) {
//       geoData = await tryGeocode(city);
//       if (geoData) return geoData;
//     }

//     return null;
//   };

//   const handleSubmit = async () => {
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const geoData = await getLatLonFromAddress(formData.address);
//       if (!geoData) {
//         Toast.show({
//           type: "error",
//           text1: "Invalid address",
//           text2:
//             "Please enter a valid address (e.g., Hapur, Uttar Pradesh, India).",
//           position: "top",
//           visibilityTime: 3000,
//         });
//         return;
//       }

//       const payload = {
//         client_id: formData.clientId,
//         machine_name: formData.machine_name,
//         lat: geoData.lat,
//         lon: geoData.lon,
//       };
//       console.log("Submitting payload:", payload);

//       const response = await addMachine(payload);
//       if (response.success) {
//         Toast.show({
//           type: "success",
//           text1: "Machine added successfully!",
//           position: "top",
//           visibilityTime: 2000,
//         });
//         // setApiCall((prev) => !prev);
//         navigation.goBack();
//       } else {
//         Toast.show({
//           type: "error",
//           text1: response.message || "Failed to add machine",
//           position: "top",
//           visibilityTime: 3000,
//         });
//       }
//     } catch (error) {
//       console.error("Submit error:", error.message);
//       Toast.show({
//         type: "error",
//         text1: "Error adding machine",
//         position: "top",
//         visibilityTime: 3000,
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleHomeNavigationClick = () => {
//     navigation.goBack();
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Toast />
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => setIsSidebarVisible(true)}
//           style={styles.menuButton}
//         >
//           <Ionicons name="menu" style={styles.menuIcon} />
//         </TouchableOpacity>
//         <View style={styles.headerCenter}>
//           <Image
//             source={require("../../assets/Pslogo.png")}
//             style={styles.logoImage}
//             resizeMode="contain"
//           />
//         </View>
//       </View>
//       <KeyboardAvoidingView
//         style={styles.formContainer}
//         behavior={Platform.OS === "android" ? "padding" : "height"}
//         keyboardVerticalOffset={Platform.OS === "android" ? 60 : 0}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//         >
//           <View style={styles.titleSection}>
//             <Text style={styles.mainTitle}>Add Machine</Text>
//           </View>
//           <View style={styles.form}>
//             {/* Client Picker */}
//             <View style={styles.inputContainer}>
//               <View
//                 style={[
//                   styles.pickerContainer,
//                   errors.clientId && styles.errorBorder,
//                 ]}
//               >
//                 {isLoadingClients ? (
//                   <View style={styles.loaderContainer}>
//                     <ActivityIndicator size="small" color="#FFFFFF" />
//                     <Text style={styles.loaderText}>Loading clients...</Text>
//                   </View>
//                 ) : (
//                   <>
//                     <Picker
//                       selectedValue={formData.clientId}
//                       onValueChange={(value) => handleChange("clientId", value)}
//                       style={styles.picker}
//                       dropdownIconColor="#FFFFFF"
//                       mode="dropdown"
//                       enabled={!isLoadingClients && clients.length > 0}
//                       prompt="Select a Client"
//                     >
//                       <Picker.Item
//                         label="Select Client"
//                         value=""
//                         enabled={false}
//                       />
//                       {clients.length > 0 ? (
//                         clients.map((client) => (
//                           <Picker.Item
//                             key={client.client_id}
//                             label={
//                               client.organization_name ||
//                               `Client ${client.client_id}`
//                             }
//                             value={client.client_id}
//                             style={styles.pickerItem}
//                           />
//                         ))
//                       ) : (
//                         <Picker.Item
//                           label="No clients available"
//                           value=""
//                           enabled={false}
//                         />
//                       )}
//                     </Picker>
//                     <MaterialIcons
//                       name="arrow-drop-down"
//                       size={width * 0.05}
//                       color="#FFFFFF"
//                       style={styles.pickerIcon}
//                     />
//                   </>
//                 )}
//               </View>
//               {errors.clientId && (
//                 <Text style={styles.errorText}>{errors.clientId}</Text>
//               )}
//             </View>

//             {/* Machine Name Input */}
//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={[
//                   styles.input,
//                   errors.machine_name && styles.errorBorder,
//                 ]}
//                 value={formData.machine_name}
//                 onChangeText={(text) => handleChange("machine_name", text)}
//                 placeholder="Enter Machine Name"
//                 placeholderTextColor="#ACACAC"
//               />
//               {errors.machine_name && (
//                 <Text style={styles.errorText}>{errors.machine_name}</Text>
//               )}
//             </View>

//             {/* Address Input */}
//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={[styles.input, errors.address && styles.errorBorder]}
//                 value={formData.address}
//                 onChangeText={(text) => handleChange("address", text)}
//                 placeholder="Enter Address (e.g., Hapur, Uttar Pradesh, India)"
//                 placeholderTextColor="#ACACAC"
//               />
//               {errors.address && (
//                 <Text style={styles.errorText}>{errors.address}</Text>
//               )}
//             </View>

//             {/* Submit Button */}
//             <TouchableOpacity
//               style={[
//                 styles.submitButton,
//                 isSubmitting && styles.disabledButton,
//               ]}
//               onPress={handleSubmit}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <ActivityIndicator size="small" color="#FFFFFF" />
//               ) : (
//                 <Text style={styles.submitButtonText}>Submit</Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//       <Sidebar
//         visible={isSidebarVisible}
//         onClose={() => setIsSidebarVisible(false)}
//         handleHomeClick={handleHomeNavigationClick}
//         navigation={navigation}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#2C2C2C",
//     background:
//       "radial-gradient(50% 50% at 50% 50%, #23ABAB 0%, #000000 82.21%)",
//     paddingTop: Platform.OS === "android" ? 20 : 20,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#2C2C2C",
//     paddingHorizontal: width * 0.04,
//     paddingVertical: height * 0.02,
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
//   formContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   scrollContent: {
//     paddingBottom: height * 0.1,
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
//   form: {
//     flexDirection: "column",
//     alignItems: "center",
//     gap: height * 0.015,
//     paddingHorizontal: width * 0.04,
//   },
//   inputContainer: {
//     width: "100%",
//     maxWidth: width * 0.9,
//   },
//   pickerContainer: {
//     position: "relative",
//     width: "100%",
//     borderRadius: width * 0.03,
//     borderWidth: 1,
//     borderColor: "#FFFFFF",
//   },
//   picker: {
//     width: "100%",
//     paddingHorizontal: width * 0.02,
//     borderRadius: width * 0.03,
//     borderWidth: 1,
//     borderColor: "#FFFFFF",
//     color: "#FFFFFF",
//     backgroundColor: "transparent",
//     ...Platform.select({
//       ios: {
//         height: 150,
//       },
//       android: {
//         height: 50,
//       },
//     }),
//   },
//   pickerItem: {
//     fontSize: width * 0.04,
//     color: Platform.OS === "ios" ? "#FFFFFF" : "#000000",
//   },
//   pickerIcon: {
//     position: "absolute",
//     right: width * 0.04,
//     top: "50%",
//     transform: [{ translateY: -height * 0.015 }],
//   },
//   loaderContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 10,
//   },
//   loaderText: {
//     marginLeft: 10,
//     color: "#FFFFFF",
//     fontSize: width * 0.04,
//   },
//   input: {
//     width: "100%",
//     paddingHorizontal: width * 0.02,
//     paddingVertical: height * 0.01,
//     borderRadius: width * 0.03,
//     borderWidth: 1,
//     borderColor: "#FFFFFF",
//     color: "#FFFFFF",
//     fontSize: width * 0.04,
//     backgroundColor: "transparent",
//   },
//   errorBorder: {
//     borderColor: "#FF5555",
//   },
//   errorText: {
//     color: "#FF5555",
//     fontSize: width * 0.035,
//     marginTop: 5,
//   },
//   submitButton: {
//     width: "100%",
//     maxWidth: width * 0.9,
//     paddingVertical: height * 0.015,
//     borderRadius: width * 0.03,
//     backgroundColor: "#00D1D1",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   disabledButton: {
//     backgroundColor: "#6B7280",
//   },
//   submitButtonText: {
//     fontSize: width * 0.05,
//     fontWeight: "700",
//     color: "#FFFFFF",
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     zIndex: 9,
//   },
//   sidebar: {
//     position: "absolute",
//     top: 0,
//     bottom: 0,
//     width: width * 0.75,
//     backgroundColor: "#393939",
//     padding: 20,
//     zIndex: 10,
//     elevation: 8,
//   },
//   closeBtn: {
//     marginTop: 10,
//     alignSelf: "flex-end",
//     marginBottom: 10,
//   },
//   content: {
//     paddingBottom: 20,
//   },
//   logo: {
//     color: "#00E6E6",
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 30,
//   },
//   navItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 15,
//     padding: 5,
//     borderRadius: 4,
//   },
//   navText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     marginLeft: 10,
//   },
//   bottomSpacer: {
//     flex: 1,
//   },
// });

// export default AddMachinePage;

// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   TextInput,
//   ActivityIndicator,
//   Platform,
//   Image,
//   ScrollView,
//   KeyboardAvoidingView,
//   Animated,
//   PanResponder,
//   TouchableWithoutFeedback,
//   SafeAreaView,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import Toast from "react-native-toast-message";
// import { getAllClients, addMachine } from "../api/Service";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const { width, height } = Dimensions.get("window");

// const Sidebar = ({ visible, onClose, handleHomeClick, navigation }) => {
//   const slideAnim = useRef(new Animated.Value(-width * 0.75)).current;
//   const overlayOpacity = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     if (visible) {
//       Animated.parallel([
//         Animated.timing(slideAnim, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: false,
//         }),
//         Animated.timing(overlayOpacity, {
//           toValue: 1,
//           duration: 300,
//           useNativeDriver: false,
//         }),
//       ]).start();
//     } else {
//       Animated.parallel([
//         Animated.timing(slideAnim, {
//           toValue: -width * 0.75,
//           duration: 300,
//           useNativeDriver: false,
//         }),
//         Animated.timing(overlayOpacity, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: false,
//         }),
//       ]).start();
//     }
//   }, [visible]);

//   const panResponder = useRef(
//     PanResponder.create({
//       onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
//       onPanResponderMove: (_, gesture) => {
//         if (gesture.dx < 0) {
//           slideAnim.setValue(Math.max(gesture.dx, -width * 0.75));
//         }
//       },
//       onPanResponderRelease: (_, gesture) => {
//         if (gesture.dx < -50) {
//           onClose();
//         } else {
//           Animated.timing(slideAnim, {
//             toValue: 0,
//             duration: 200,
//             useNativeDriver: false,
//           }).start();
//         }
//       },
//     })
//   ).current;

//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.removeItem("token");
//       await AsyncStorage.removeItem("sessionToken");
//       await AsyncStorage.removeItem("userId");
//       await AsyncStorage.removeItem("userID");
//       await AsyncStorage.removeItem("clientId");
//       await AsyncStorage.removeItem("role");
//       await AsyncStorage.removeItem("savedEmailOrPhone");

//       Toast.show({
//         type: "success",
//         text1: "Logged out successfully!",
//         position: "top",
//         autoHide: true,
//         visibilityTime: 2000,
//       });

//       navigation.replace("Login");
//     } catch (error) {
//       Toast.show({
//         type: "error",
//         text1: "Error logging out. Please try again.",
//         position: "top",
//         autoHide: true,
//         visibilityTime: 3000,
//       });
//     } finally {
//       onClose();
//     }
//   };

//   return visible ? (
//     <View style={StyleSheet.absoluteFill}>
//       <TouchableWithoutFeedback onPress={onClose}>
//         <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
//       </TouchableWithoutFeedback>

//       <Animated.View
//         style={[styles.sidebar, { left: slideAnim }]}
//         {...panResponder.panHandlers}
//       >
//         <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
//           <MaterialIcons name="close" size={28} color="#FFFFFF" />
//         </TouchableOpacity>

//         <ScrollView contentContainerStyle={styles.content}>
//           <Text style={styles.logo}>⚡ Power Sense</Text>

//           <TouchableOpacity style={styles.navItem} onPress={handleHomeClick}>
//             <MaterialIcons name="home" size={22} color="#00E6E6" />
//             <Text style={styles.navText}>Home</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.navItem}>
//             <MaterialIcons name="settings" size={22} color="#00E6E6" />
//             <Text style={styles.navText}>Settings</Text>
//           </TouchableOpacity>

//           <View style={styles.bottomSpacer} />

//           <TouchableOpacity style={styles.navItem} onPress={handleLogout}>
//             <MaterialIcons name="logout" size={22} color="#00E6E6" />
//             <Text style={styles.navText}>Logout</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </Animated.View>
//     </View>
//   ) : null;
// };

// const AddMachinePage = ({ navigation }) => {
//   const [clients, setClients] = useState([]);
//   const [formData, setFormData] = useState({
//     clientId: "",
//     machine_name: "",
//     address: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoadingClients, setIsLoadingClients] = useState(false);
//   const [isSidebarVisible, setIsSidebarVisible] = useState(false);
//   const pickerRef = useRef(null);

//   useEffect(() => {
//     const fetchClients = async () => {
//       setIsLoadingClients(true);
//       try {
//         const response = await getAllClients();
//         console.log(
//           "API Response (getAllClients):",
//           JSON.stringify(response, null, 2)
//         );

//         if (response.success && Array.isArray(response.data)) {
//           console.log("Clients fetched:", response.data);
//           setClients(response.data);
//         } else {
//           console.error("Invalid response:", response?.message || "No data");
//           Toast.show({
//             type: "error",
//             text1: "Failed to load clients",
//             position: "top",
//             visibilityTime: 3000,
//           });
//           setClients([]);
//         }
//       } catch (error) {
//         console.error("Error fetching clients:", error.message);
//         Toast.show({
//           type: "error",
//           text1: "Error loading clients",
//           position: "top",
//           visibilityTime: 3000,
//         });
//         setClients([]);
//       } finally {
//         setIsLoadingClients(false);
//       }
//     };

//     fetchClients();
//     return () => {
//       setClients([]);
//       setFormData({ clientId: "", machine_name: "", address: "" });
//       setErrors({});
//     };
//   }, []);

//   const handleChange = (name, value) => {
//     console.log(`Picker change: ${name} = ${value}`);
//     setFormData({ ...formData, [name]: value });
//     setErrors({ ...errors, [name]: "" });
//   };

//   const openPicker = () => {
//     if (pickerRef.current) {
//       pickerRef.current.focus();
//     }
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.clientId) newErrors.clientId = "Client is required";
//     if (!formData.machine_name)
//       newErrors.machine_name = "Machine Name is required";
//     if (!formData.address) newErrors.address = "Address is required";
//     return newErrors;
//   };

//   const getLatLonFromAddress = async (address) => {
//     if (!address || address.trim() === "") {
//       console.log("Invalid address provided");
//       return null;
//     }

//     const tryGeocode = async (query) => {
//       try {
//         const encodedQuery = encodeURIComponent(query.trim());
//         const apiKey = "a321107d1af841a3bb48f539f65e78dd";
//         const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodedQuery}&key=${apiKey}&limit=1&no_annotations=1`;
//         console.log(`Fetching geocode for query: ${query}, URL: ${url}`);
//         const response = await fetch(url, {
//           method: "GET",
//           headers: {
//             Accept: "application/json",
//             "User-Agent": "AddMachineApp/1.0 (your-email@example.com)",
//           },
//         });
//         if (!response.ok) {
//           console.error(
//             `OpenCage API error: ${response.status} ${response.statusText}`
//           );
//           const errorText = await response.text();
//           console.error(`Error response: ${errorText}`);
//           return null;
//         }
//         const data = await response.json();
//         console.log(`OpenCage API Response for "${query}":`, data);
//         if (data.status.code !== 200) {
//           console.error(`OpenCage API status error: ${data.status.message}`);
//           return null;
//         }
//         if (data.results.length > 0) {
//           const { lat, lng } = data.results[0].geometry;
//           return { lat: parseFloat(lat), lon: parseFloat(lng) };
//         } else {
//           console.log(`No results found for query: ${query}`);
//           return null;
//         }
//       } catch (error) {
//         console.error(`Error fetching geolocation for "${query}":`, error);
//         return null;
//       }
//     };

//     let geoData = await tryGeocode(address);
//     if (geoData) return geoData;

//     const simplifiedAddress = address
//       .replace(/Khasra-\d+,?\s*/, "")
//       .replace(/^\d+,\s*/, "")
//       .replace(/,\s*\d{6}/, "");
//     geoData = await tryGeocode(simplifiedAddress);
//     if (geoData) return geoData;

//     const addressParts = address.split(",").map((part) => part.trim());
//     const postalCodeRegex = /\d{6}$/;
//     let city = null;
//     let state = null;

//     if (postalCodeRegex.test(addressParts[addressParts.length - 1])) {
//       if (addressParts.length >= 3) {
//         state = addressParts[addressParts.length - 2];
//         city = addressParts[addressParts.length - 3];
//       } else if (addressParts.length === 2) {
//         city = addressParts[0];
//       }
//     } else {
//       if (addressParts.length >= 2) {
//         state = addressParts[addressParts.length - 1];
//         city = addressParts[addressParts.length - 2];
//       } else if (addressParts.length === 1) {
//         city = addressParts[0];
//       }
//     }

//     if (city && state) {
//       geoData = await tryGeocode(`${city}, ${state}`);
//       if (geoData) return geoData;
//     }
//     if (city) {
//       geoData = await tryGeocode(city);
//       if (geoData) return geoData;
//     }

//     return null;
//   };

//   const handleSubmit = async () => {
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const geoData = await getLatLonFromAddress(formData.address);
//       if (!geoData) {
//         Toast.show({
//           type: "error",
//           text1: "Invalid address",
//           text2:
//             "Please enter a valid address (e.g., Hapur, Uttar Pradesh, India).",
//           position: "top",
//           visibilityTime: 3000,
//         });
//         return;
//       }

//       const payload = {
//         client_id: formData.clientId,
//         machine_name: formData.machine_name,
//         lat: geoData.lat,
//         lon: geoData.lon,
//       };
//       console.log("Submitting payload:", payload);

//       const response = await addMachine(payload);
//       if (response.success) {
//         Toast.show({
//           type: "success",
//           text1: "Machine added successfully!",
//           position: "top",
//           visibilityTime: 2000,
//         });
//         navigation.goBack();
//       } else {
//         Toast.show({
//           type: "error",
//           text1: response.message || "Failed to add machine",
//           position: "top",
//           visibilityTime: 3000,
//         });
//       }
//     } catch (error) {
//       console.error("Submit error:", error.message);
//       Toast.show({
//         type: "error",
//         text1: "Error adding machine",
//         position: "top",
//         visibilityTime: 3000,
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleHomeNavigationClick = () => {
//     navigation.goBack();
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Toast />
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => setIsSidebarVisible(true)}
//           style={styles.menuButton}
//         >
//           <Ionicons name="menu" style={styles.menuIcon} />
//         </TouchableOpacity>
//         <View style={styles.headerCenter}>
//           <Image
//             source={require("../../assets/Pslogo.png")}
//             style={styles.logoImage}
//             resizeMode="contain"
//           />
//         </View>
//       </View>
//       <KeyboardAvoidingView
//         style={styles.formContainer}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 80}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//         >
//           <View style={styles.titleSection}>
//             <Text style={styles.mainTitle}>Add Machine</Text>
//           </View>
//           <View style={styles.form}>
//             {/* Client Picker */}
//             <View style={styles.inputContainer}>
//               <TouchableOpacity
//                 onPress={openPicker}
//                 style={[
//                   styles.pickerContainer,
//                   errors.clientId && styles.errorBorder,
//                 ]}
//                 disabled={isLoadingClients || clients.length === 0}
//               >
//                 {isLoadingClients ? (
//                   <View style={styles.loaderContainer}>
//                     <ActivityIndicator size="small" color="#FFFFFF" />
//                     <Text style={styles.loaderText}>Loading clients...</Text>
//                   </View>
//                 ) : (
//                   <Picker
//                     ref={pickerRef}
//                     selectedValue={formData.clientId}
//                     onValueChange={(value) => handleChange("clientId", value)}
//                     style={styles.picker}
//                     dropdownIconColor="#FFFFFF"
//                     mode="dropdown"
//                     enabled={!isLoadingClients && clients.length > 0}
//                     prompt="Select a Client"
//                   >
//                     <Picker.Item
//                       label="Select Client"
//                       value=""
//                       enabled={false}
//                     />
//                     {clients.length > 0 ? (
//                       clients.map((client) => (
//                         <Picker.Item
//                           key={client.client_id}
//                           label={
//                             client.organization_name ||
//                             `Client ${client.client_id}`
//                           }
//                           value={client.client_id}
//                           style={styles.pickerItem}
//                         />
//                       ))
//                     ) : (
//                       <Picker.Item
//                         label="No clients available"
//                         value=""
//                         enabled={false}
//                       />
//                     )}
//                   </Picker>
//                 )}
//               </TouchableOpacity>
//               {errors.clientId && (
//                 <Text style={styles.errorText}>{errors.clientId}</Text>
//               )}
//             </View>

//             {/* Machine Name Input */}
//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={[
//                   styles.input,
//                   errors.machine_name && styles.errorBorder,
//                 ]}
//                 value={formData.machine_name}
//                 onChangeText={(text) => handleChange("machine_name", text)}
//                 placeholder="Enter Machine Name"
//                 placeholderTextColor="#ACACAC"
//               />
//               {errors.machine_name && (
//                 <Text style={styles.errorText}>{errors.machine_name}</Text>
//               )}
//             </View>

//             {/* Address Input */}
//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={[styles.input, errors.address && styles.errorBorder]}
//                 value={formData.address}
//                 onChangeText={(text) => handleChange("address", text)}
//                 placeholder="Enter Address (e.g., Hapur, Uttar Pradesh, India)"
//                 placeholderTextColor="#ACACAC"
//               />
//               {errors.address && (
//                 <Text style={styles.errorText}>{errors.address}</Text>
//               )}
//             </View>

//             {/* Submit Button */}
//             <TouchableOpacity
//               style={[
//                 styles.submitButton,
//                 isSubmitting && styles.disabledButton,
//               ]}
//               onPress={handleSubmit}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <ActivityIndicator size="small" color="#FFFFFF" />
//               ) : (
//                 <Text style={styles.submitButtonText}>Submit</Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//       <Sidebar
//         visible={isSidebarVisible}
//         onClose={() => setIsSidebarVisible(false)}
//         handleHomeClick={handleHomeNavigationClick}
//         navigation={navigation}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#2C2C2C",
//     background:
//       "radial-gradient(50% 50% at 50% 50%, #23ABAB 0%, #000000 82.21%)",
//     paddingTop: Platform.OS === "android" ? 20 : 20,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#2C2C2C",
//     paddingHorizontal: width * 0.04,
//     paddingVertical: height * 0.02,
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
//   formContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     width: width * 0.9, // Fixed width to prevent shrinking
//     alignSelf: "center",
//   },
//   scrollContent: {
//     paddingBottom: height * 0.1,
//     flexGrow: 1,
//     width: width * 0.9, // Ensure ScrollView content maintains width
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
//   form: {
//     flexDirection: "column",
//     alignItems: "center",
//     gap: height * 0.015,
//     paddingHorizontal: width * 0.01,
//     width: "100%", // Ensure form takes full container width
//   },
//   inputContainer: {
//     width: "100%",
//     maxWidth: width * 1,
//   },
//   pickerContainer: {
//     position: "relative",
//     width: "100%",
//     borderRadius: width * 0.03,
//     borderWidth: 1,
//     borderColor: "#FFFFFF",
//     backgroundColor: "transparent",
//   },
//   picker: {
//     width: "100%",
//     paddingHorizontal: width * 0.02,
//     borderRadius: width * 0.03,
//     color: "#FFFFFF",
//     backgroundColor: "transparent",
//     ...Platform.select({
//       ios: {
//         height: 150,
//       },
//       android: {
//         height: 50,
//       },
//     }),
//   },
//   pickerItem: {
//     fontSize: width * 0.04,
//     color: Platform.OS === "ios" ? "#FFFFFF" : "#000000",
//   },
//   loaderContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 10,
//   },
//   loaderText: {
//     marginLeft: 10,
//     color: "#FFFFFF",
//     fontSize: width * 0.04,
//   },
//   input: {
//     width: "100%",
//     paddingHorizontal: width * 0.02,
//     paddingVertical: height * 0.01,
//     borderRadius: width * 0.03,
//     borderWidth: 1,
//     borderColor: "#FFFFFF",
//     color: "#FFFFFF",
//     fontSize: width * 0.04,
//     backgroundColor: "transparent",
//   },
//   errorBorder: {
//     borderColor: "#FF5555",
//   },
//   errorText: {
//     color: "#FF5555",
//     fontSize: width * 0.035,
//     marginTop: 5,
//   },
//   submitButton: {
//     width: "100%",
//     maxWidth: width * 0.9,
//     paddingVertical: height * 0.015,
//     borderRadius: width * 0.03,
//     backgroundColor: "#00D1D1",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   disabledButton: {
//     backgroundColor: "#6B7280",
//   },
//   submitButtonText: {
//     fontSize: width * 0.05,
//     fontWeight: "700",
//     color: "#FFFFFF",
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     zIndex: 9,
//   },
//   sidebar: {
//     position: "absolute",
//     top: 0,
//     bottom: 0,
//     width: width * 0.75,
//     backgroundColor: "#393939",
//     padding: 20,
//     zIndex: 10,
//     elevation: 8,
//   },
//   closeBtn: {
//     marginTop: 10,
//     alignSelf: "flex-end",
//     marginBottom: 10,
//   },
//   content: {
//     paddingBottom: 20,
//   },
//   logo: {
//     color: "#00E6E6",
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 30,
//   },
//   navItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 15,
//     padding: 5,
//     borderRadius: 4,
//   },
//   navText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     marginLeft: 10,
//   },
//   bottomSpacer: {
//     flex: 1,
//   },
// });

// export default AddMachinePage;

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Platform,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Animated,
  PanResponder,
  TouchableWithoutFeedback,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import { getAllClients, addMachine } from "../api/Service";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const Sidebar = ({ visible, onClose, handleHomeClick, navigation }) => {
  const slideAnim = useRef(new Animated.Value(-width * 0.75)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -width * 0.75,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx < 0) {
          slideAnim.setValue(Math.max(gesture.dx, -width * 0.75));
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -50) {
          onClose();
        } else {
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("sessionToken");
      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("userID");
      await AsyncStorage.removeItem("clientId");
      await AsyncStorage.removeItem("role");
      await AsyncStorage.removeItem("savedEmailOrPhone");

      Toast.show({
        type: "success",
        text1: "Logged out successfully!",
        position: "top",
        autoHide: true,
        visibilityTime: 2000,
      });

      navigation.replace("Login");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error logging out. Please try again.",
        position: "top",
        autoHide: true,
        visibilityTime: 3000,
      });
    } finally {
      onClose();
    }
  };

  return visible ? (
    <View style={StyleSheet.absoluteFill}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[styles.sidebar, { left: slideAnim }]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <MaterialIcons name="close" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.logo}>⚡ Power Sense</Text>

          <TouchableOpacity style={styles.navItem} onPress={handleHomeClick}>
            <MaterialIcons name="home" size={22} color="#00E6E6" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <MaterialIcons name="settings" size={22} color="#00E6E6" />
            <Text style={styles.navText}>Settings</Text>
          </TouchableOpacity>

          <View style={styles.bottomSpacer} />

          <TouchableOpacity style={styles.navItem} onPress={handleLogout}>
            <MaterialIcons name="logout" size={22} color="#00E6E6" />
            <Text style={styles.navText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>
  ) : null;
};

const AddMachinePage = ({ navigation }) => {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    clientId: "",
    machine_name: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoadingClients(true);
      try {
        const response = await getAllClients();
        console.log(
          "API Response (getAllClients):",
          JSON.stringify(response, null, 2)
        );

        if (response.success && Array.isArray(response.data)) {
          console.log("Clients fetched:", response.data);
          setClients(response.data);
        } else {
          console.error("Invalid response:", response?.message || "No data");
          Toast.show({
            type: "error",
            text1: "Failed to load clients",
            position: "top",
            visibilityTime: 3000,
          });
          setClients([]);
        }
      } catch (error) {
        console.error("Error fetching clients:", error.message);
        Toast.show({
          type: "error",
          text1: "Error loading clients",
          position: "top",
          visibilityTime: 3000,
        });
        setClients([]);
      } finally {
        setIsLoadingClients(false);
      }
    };

    fetchClients();
    return () => {
      setClients([]);
      setFormData({ clientId: "", machine_name: "", address: "" });
      setErrors({});
    };
  }, []);

  const handleChange = (name, value) => {
    console.log(`Picker change: ${name} = ${value}`);
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const openPicker = () => {
    if (pickerRef.current) {
      pickerRef.current.focus();
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.clientId) newErrors.clientId = "Client is required";
    if (!formData.machine_name)
      newErrors.machine_name = "Machine Name is required";
    if (!formData.address) newErrors.address = "Address is required";
    return newErrors;
  };

  const getLatLonFromAddress = async (address) => {
    if (!address || address.trim() === "") {
      console.log("Invalid address provided");
      return null;
    }

    const tryGeocode = async (query) => {
      try {
        const encodedQuery = encodeURIComponent(query.trim());
        const apiKey = "a321107d1af841a3bb48f539f65e78dd";
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodedQuery}&key=${apiKey}&limit=1&no_annotations=1`;
        console.log(`Fetching geocode for query: ${query}, URL: ${url}`);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "User-Agent": "AddMachineApp/1.0 (your-email@example.com)",
          },
        });
        if (!response.ok) {
          console.error(
            `OpenCage API error: ${response.status} ${response.statusText}`
          );
          const errorText = await response.text();
          console.error(`Error response: ${errorText}`);
          return null;
        }
        const data = await response.json();
        console.log(`OpenCage API Response for "${query}":`, data);
        if (data.status.code !== 200) {
          console.error(`OpenCage API status error: ${data.status.message}`);
          return null;
        }
        if (data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry;
          return { lat: parseFloat(lat), lon: parseFloat(lng) };
        } else {
          console.log(`No results found for query: ${query}`);
          return null;
        }
      } catch (error) {
        console.error(`Error fetching geolocation for "${query}":`, error);
        return null;
      }
    };

    let geoData = await tryGeocode(address);
    if (geoData) return geoData;

    const simplifiedAddress = address
      .replace(/Khasra-\d+,?\s*/, "")
      .replace(/^\d+,\s*/, "")
      .replace(/,\s*\d{6}/, "");
    geoData = await tryGeocode(simplifiedAddress);
    if (geoData) return geoData;

    const addressParts = address.split(",").map((part) => part.trim());
    const postalCodeRegex = /\d{6}$/;
    let city = null;
    let state = null;

    if (postalCodeRegex.test(addressParts[addressParts.length - 1])) {
      if (addressParts.length >= 3) {
        state = addressParts[addressParts.length - 2];
        city = addressParts[addressParts.length - 3];
      } else if (addressParts.length === 2) {
        city = addressParts[0];
      }
    } else {
      if (addressParts.length >= 2) {
        state = addressParts[addressParts.length - 1];
        city = addressParts[addressParts.length - 2];
      } else if (addressParts.length === 1) {
        city = addressParts[0];
      }
    }

    if (city && state) {
      geoData = await tryGeocode(`${city}, ${state}`);
      if (geoData) return geoData;
    }
    if (city) {
      geoData = await tryGeocode(city);
      if (geoData) return geoData;
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const geoData = await getLatLonFromAddress(formData.address);
      if (!geoData) {
        Toast.show({
          type: "error",
          text1: "Invalid address",
          text2:
            "Please enter a valid address (e.g., Hapur, Uttar Pradesh, India).",
          position: "top",
          visibilityTime: 3000,
        });
        return;
      }

      const payload = {
        client_id: formData.clientId,
        machine_name: formData.machine_name,
        lat: geoData.lat,
        lon: geoData.lon,
      };
      console.log("Submitting payload:", payload);

      const response = await addMachine(payload);
      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Machine added successfully!",
          position: "top",
          visibilityTime: 2000,
        });
        navigation.goBack();
      } else {
        Toast.show({
          type: "error",
          text1: response.message || "Failed to add machine",
          position: "top",
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.error("Submit error:", error.message);
      Toast.show({
        type: "error",
        text1: "Error adding machine",
        position: "top",
        visibilityTime: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHomeNavigationClick = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require("../../assets/Rectangle.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.innerContainer}>
        <Toast />
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
        <KeyboardAvoidingView
          style={styles.formContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 80}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.titleSection}>
              <Text style={styles.mainTitle}>Add Machine</Text>
            </View>
            <View style={styles.form}>
              {/* Client Picker */}
              <View style={styles.inputContainer}>
                <TouchableOpacity
                  onPress={openPicker}
                  style={[
                    styles.pickerContainer,
                    errors.clientId && styles.errorBorder,
                  ]}
                  disabled={isLoadingClients || clients.length === 0}
                >
                  {isLoadingClients ? (
                    <View style={styles.loaderContainer}>
                      <ActivityIndicator size="small" color="#FFFFFF" />
                      <Text style={styles.loaderText}>Loading clients...</Text>
                    </View>
                  ) : (
                    <Picker
                      ref={pickerRef}
                      selectedValue={formData.clientId}
                      onValueChange={(value) => handleChange("clientId", value)}
                      style={styles.picker}
                      dropdownIconColor="#FFFFFF"
                      mode="dropdown"
                      enabled={!isLoadingClients && clients.length > 0}
                      prompt="Select a Client"
                    >
                      <Picker.Item
                        label="Select Client"
                        value=""
                        enabled={false}
                      />
                      {clients.length > 0 ? (
                        clients.map((client) => (
                          <Picker.Item
                            key={client.client_id}
                            label={
                              client.organization_name ||
                              `Client ${client.client_id}`
                            }
                            value={client.client_id}
                            style={styles.pickerItem}
                          />
                        ))
                      ) : (
                        <Picker.Item
                          label="No clients available"
                          value=""
                          enabled={false}
                        />
                      )}
                    </Picker>
                  )}
                </TouchableOpacity>
                {errors.clientId && (
                  <Text style={styles.errorText}>{errors.clientId}</Text>
                )}
              </View>

              {/* Machine Name Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    errors.machine_name && styles.errorBorder,
                  ]}
                  value={formData.machine_name}
                  onChangeText={(text) => handleChange("machine_name", text)}
                  placeholder="Enter Machine Name"
                  placeholderTextColor="#ACACAC"
                />
                {errors.machine_name && (
                  <Text style={styles.errorText}>{errors.machine_name}</Text>
                )}
              </View>

              {/* Address Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, errors.address && styles.errorBorder]}
                  value={formData.address}
                  onChangeText={(text) => handleChange("address", text)}
                  placeholder="Enter Address (e.g., Hapur, Uttar Pradesh, India)"
                  placeholderTextColor="#ACACAC"
                />
                {errors.address && (
                  <Text style={styles.errorText}>{errors.address}</Text>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isSubmitting && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <Sidebar
          visible={isSidebarVisible}
          onClose={() => setIsSidebarVisible(false)}
          handleHomeClick={handleHomeNavigationClick}
          navigation={navigation}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional semi-transparent overlay for readability
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent", // Semi-transparent header for readability
    paddingHorizontal: width * 0.04,
    paddingTop: height * 0.04,
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
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.9,
    alignSelf: "center",
  },
  scrollContent: {
    paddingBottom: height * 0.1,
    flexGrow: 1,
    width: width * 0.9,
  },
  titleSection: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    alignItems: "center",
  },
  mainTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: height * 0.015,
  },
  form: {
    flexDirection: "column",
    alignItems: "center",
    gap: height * 0.015,
    paddingHorizontal: width * 0.01,
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    maxWidth: width * 1,
  },
  pickerContainer: {
    position: "relative",
    width: "100%",
    borderRadius: width * 0.03,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    backgroundColor: "transparent",
  },
  picker: {
    width: "100%",
    paddingHorizontal: width * 0.02,
    borderRadius: width * 0.03,
    color: "#FFFFFF",
    backgroundColor: "transparent",
    ...Platform.select({
      ios: {
        height: 150,
      },
      android: {
        height: 50,
      },
    }),
  },
  pickerItem: {
    fontSize: width * 0.04,
    color: Platform.OS === "ios" ? "#FFFFFF" : "#000000",
  },
  loaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  loaderText: {
    marginLeft: 10,
    color: "#FFFFFF",
    fontSize: width * 0.04,
  },
  input: {
    width: "100%",
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.01,
    borderRadius: width * 0.03,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    color: "#FFFFFF",
    fontSize: width * 0.04,
    backgroundColor: "transparent",
  },
  errorBorder: {
    borderColor: "#FF5555",
  },
  errorText: {
    color: "#FF5555",
    fontSize: width * 0.035,
    marginTop: 5,
  },
  submitButton: {
    width: "100%",
    maxWidth: width * 0.9,
    paddingVertical: height * 0.015,
    borderRadius: width * 0.03,
    backgroundColor: "#00D1D1",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#6B7280",
  },
  submitButtonText: {
    fontSize: width * 0.05,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 9,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: width * 0.75,
    backgroundColor: "#393939",
    padding: 20,
    zIndex: 10,
    elevation: 8,
  },
  closeBtn: {
    marginTop: 10,
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  content: {
    paddingBottom: 20,
  },
  logo: {
    color: "#00E6E6",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    padding: 5,
    borderRadius: 4,
  },
  navText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 10,
  },
  bottomSpacer: {
    flex: 1,
  },
});

export default AddMachinePage;
