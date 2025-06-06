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
//   ImageBackground,
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
//     <ImageBackground
//       source={require("../../assets/Rectangle.jpg")}
//       style={styles.container}
//       resizeMode="cover"
//     >
//       <SafeAreaView style={styles.innerContainer}>
//         <Toast />
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
//         <KeyboardAvoidingView
//           style={styles.formContainer}
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//           keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 80}
//         >
//           <ScrollView
//             contentContainerStyle={styles.scrollContent}
//             showsVerticalScrollIndicator={false}
//           >
//             <View style={styles.titleSection}>
//               <Text style={styles.mainTitle}>Add Machine</Text>
//             </View>
//             <View style={styles.form}>
//               {/* Client Picker */}
//               <View style={styles.inputContainer}>
//                 <TouchableOpacity
//                   onPress={openPicker}
//                   style={[
//                     styles.pickerContainer,
//                     errors.clientId && styles.errorBorder,
//                   ]}
//                   disabled={isLoadingClients || clients.length === 0}
//                 >
//                   {isLoadingClients ? (
//                     <View style={styles.loaderContainer}>
//                       <ActivityIndicator size="small" color="#FFFFFF" />
//                       <Text style={styles.loaderText}>Loading clients...</Text>
//                     </View>
//                   ) : (
//                     <Picker
//                       ref={pickerRef}
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
//                   )}
//                 </TouchableOpacity>
//                 {errors.clientId && (
//                   <Text style={styles.errorText}>{errors.clientId}</Text>
//                 )}
//               </View>

//               {/* Machine Name Input */}
//               <View style={styles.inputContainer}>
//                 <TextInput
//                   style={[
//                     styles.input,
//                     errors.machine_name && styles.errorBorder,
//                   ]}
//                   value={formData.machine_name}
//                   onChangeText={(text) => handleChange("machine_name", text)}
//                   placeholder="Enter Machine Name"
//                   placeholderTextColor="#ACACAC"
//                 />
//                 {errors.machine_name && (
//                   <Text style={styles.errorText}>{errors.machine_name}</Text>
//                 )}
//               </View>

//               {/* Address Input */}
//               <View style={styles.inputContainer}>
//                 <TextInput
//                   style={[styles.input, errors.address && styles.errorBorder]}
//                   value={formData.address}
//                   onChangeText={(text) => handleChange("address", text)}
//                   placeholder="Enter Address (e.g., Hapur, Uttar Pradesh, India)"
//                   placeholderTextColor="#ACACAC"
//                 />
//                 {errors.address && (
//                   <Text style={styles.errorText}>{errors.address}</Text>
//                 )}
//               </View>

//               {/* Submit Button */}
//               <TouchableOpacity
//                 style={[
//                   styles.submitButton,
//                   isSubmitting && styles.disabledButton,
//                 ]}
//                 onPress={handleSubmit}
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <ActivityIndicator size="small" color="#FFFFFF" />
//                 ) : (
//                   <Text style={styles.submitButtonText}>Submit</Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         </KeyboardAvoidingView>
//         <Sidebar
//           visible={isSidebarVisible}
//           onClose={() => setIsSidebarVisible(false)}
//           handleHomeClick={handleHomeNavigationClick}
//           navigation={navigation}
//         />
//       </SafeAreaView>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   innerContainer: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional semi-transparent overlay for readability
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "transparent", // Semi-transparent header for readability
//     paddingHorizontal: width * 0.04,
//     paddingTop: height * 0.04,
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
//     width: width * 0.9,
//     alignSelf: "center",
//   },
//   scrollContent: {
//     paddingBottom: height * 0.1,
//     flexGrow: 1,
//     width: width * 0.9,
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
//     width: "100%",
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
            topOffset: height * 0.05,
            text1Style: {
              fontSize: width * 0.04,
              color: "#FFFFFF",
            },
            style: {
              backgroundColor: "#000000",
              borderWidth: 1,
              borderColor: "#FF5555",
            },
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
          topOffset: height * 0.05,
          text1Style: {
            fontSize: width * 0.04,
            color: "#FFFFFF",
          },
          style: {
            backgroundColor: "#000000",
            borderWidth: 1,
            borderColor: "#FF5555",
          },
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
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill in all required fields",
        position: "top",
        visibilityTime: 3000,
        topOffset: height * 0.05,
        text1Style: {
          fontSize: width * 0.04,
          color: "#FFFFFF",
        },
        text2Style: {
          fontSize: width * 0.035,
          color: "#FFFFFF",
        },
        style: {
          backgroundColor: "#000000",
          borderWidth: 1,
          borderColor: "#FF5555",
        },
      });
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
          topOffset: height * 0.05,
          text1Style: {
            fontSize: width * 0.04,
            color: "#FFFFFF",
          },
          text2Style: {
            fontSize: width * 0.035,
            color: "#FFFFFF",
          },
          style: {
            backgroundColor: "#000000",
            borderWidth: 1,
            borderColor: "#FF5555",
          },
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
          text1: "Success",
          text2: "Machine added successfully!",
          position: "top",
          visibilityTime: 2000,
          topOffset: height * 0.05,
          text1Style: {
            fontSize: width * 0.04,
            color: "#000000",
          },
          text2Style: {
            fontSize: width * 0.035,
            color: "#000000",
          },
          style: {
            backgroundColor: "#009D9D",
            borderWidth: 1,
            borderColor: "#2BFFFF",
          },
        });
        setFormData({ clientId: "", machine_name: "", address: "" }); // Reset form fields
        setErrors({}); // Clear any existing errors
        // navigation.goBack();
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to add machine",
          text2: response.message || "Please try again.",
          position: "top",
          visibilityTime: 3000,
          topOffset: height * 0.05,
          text1Style: {
            fontSize: width * 0.04,
            color: "#000000",
          },
          text2Style: {
            fontSize: width * 0.035,
            color: "#000000",
          },
          style: {
            backgroundColor: "#000000",
            borderWidth: 1,
            borderColor: "#FF5555",
          },
        });
      }
    } catch (error) {
      console.error("Submit error:", error.message);
      Toast.show({
        type: "error",
        text1: "Error adding machine",
        text2: error.message || "An unexpected error occurred.",
        position: "top",
        visibilityTime: 3000,
        topOffset: height * 0.05,
        text1Style: {
          fontSize: width * 0.04,
          color: "#FFFFFF",
        },
        text2Style: {
          fontSize: width * 0.035,
          color: "#FFFFFF",
        },
        style: {
          backgroundColor: "#000000",
          borderWidth: 1,
          borderColor: "#FF5555",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHomeNavigationClick = () => {
    navigation.goBack();
    setIsSidebarVisible(false);
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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay for readability
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
    fontWeight: "600",
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
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Slight background for visibility
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
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Slight background for visibility
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
    fontWeight: "600",
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
