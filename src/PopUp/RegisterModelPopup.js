import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Image,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import Toast from "react-native-toast-message";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Sidebar from "../Components/Sidebar";
import { Picker } from "@react-native-picker/picker";
import { onboard } from "../api/Service";

const { width, height } = Dimensions.get("window");

const RegisterModal = ({ onClose, setApiCall }) => {
  const navigation = useNavigation();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await onboard(data);

      console.log("Response from onboard API:", response, response.success);
      if (response && response.success) {
        Toast.show({
          type: "success",
          text1: response.message || "Registered successfully ✅",
          position: "top",
          visibilityTime: 3000,
          topOffset: height * 0.05,
          text1Style: {
            fontSize: width * 0.04,
            color: "#000000",
          },
          style: {
            backgroundColor: "#009D9D",
            borderWidth: 1,
            borderColor: "#2BFFFF",
          },
        });

        await AsyncStorage.setItem(
          "userId",
          response.user?.id?.toString() || ""
        );

        // 👇 Reset form fields
        reset({
          organization_name: "",
          gst_no: "",
          address: "",
          organization_type: "",
          admin_name: "",
          email: "",
          phone_no: "",
        });

        // setTimeout(() => {
        //   onClose();
        // }, 3000);
      } else {
        Toast.show({
          type: "error",
          text1: response?.error || "Registration failed ❌",
          position: "top",
          visibilityTime: 3000,
          topOffset: height * 0.05,
          text1Style: {
            fontSize: width * 0.04,
            color: "#000000",
          },
          style: {
            backgroundColor: "#009D9D",
            borderWidth: 1,
            borderColor: "#2BFFFF",
          },
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: `Error: ${error.message}`,
        position: "top",
        visibilityTime: 3000,
        topOffset: height * 0.05,
        text1Style: {
          fontSize: width * 0.04,
          color: "#000000",
        },
        style: {
          backgroundColor: "#009D9D",
          borderWidth: 1,
          borderColor: "#2BFFFF",
        },
      });
    } finally {
      setIsLoading(false);
      setApiCall((prev) => !prev);
    }
  };

  const handleHomeNavigationClick = () => {
    // navigation.goBack();
    navigation.goBack();
    setIsSidebarVisible(false);
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

  return (
    <ImageBackground
      source={require("../../assets/Rectangle.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.innerContainer}>
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

          <Sidebar
            visible={isSidebarVisible}
            onClose={() => setIsSidebarVisible(false)}
            handleHomeClick={handleHomeNavigationClick}
            handleLogoutClick={handleLogoutClick}
          />

          <KeyboardAvoidingView
            style={styles.formContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.titleSection}>
                <Text style={styles.mainTitle}>
                  Onboarding A New Organization
                </Text>
              </View>
              <View style={styles.form}>
                <Text style={styles.sectionTitle}>
                  Organization Details <Text style={styles.required}>*</Text>
                </Text>
                {[
                  {
                    name: "organization_name",
                    placeholder: "Enter organization name",
                    label: "Organization Name",
                  },
                  {
                    name: "gst_no",
                    placeholder: "Enter GST number",
                    label: "GST No",
                  },
                  {
                    name: "address",
                    placeholder: "Enter address",
                    label: "Address",
                  },
                  {
                    name: "organization_type",
                    label: "Organization Type",
                    type: "select",
                    options: [
                      "Manufacturing",
                      "Trading",
                      "Hardware",
                      "Software",
                      "Agriculture",
                      "Construction",
                      "Retail",
                      "Healthcare",
                      "Education",
                      "Monopoly",
                    ],
                  },
                ].map(
                  ({ name, placeholder, label, type = "text", options }) => (
                    <View key={name} style={styles.inputContainer}>
                      {type === "select" ? (
                        <View style={styles.pickerContainer}>
                          <Controller
                            control={control}
                            name={name}
                            rules={{ required: `${label} is required` }}
                            render={({ field: { onChange, value } }) => (
                              <>
                                <Picker
                                  selectedValue={value}
                                  onValueChange={onChange}
                                  style={styles.picker}
                                  itemStyle={styles.pickerItem}
                                >
                                  <Picker.Item
                                    label={`Select ${label}`}
                                    value=""
                                  />
                                  {options.map((opt) => (
                                    <Picker.Item
                                      key={opt}
                                      label={opt}
                                      value={opt}
                                    />
                                  ))}
                                </Picker>
                                <MaterialIcons
                                  name="arrow-drop-down"
                                  size={width * 0.05}
                                  color="#FFFFFF"
                                  style={styles.pickerIcon}
                                />
                              </>
                            )}
                          />
                        </View>
                      ) : (
                        <Controller
                          control={control}
                          name={name}
                          rules={{ required: `${label} is required` }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                              style={styles.input}
                              placeholder={placeholder}
                              placeholderTextColor="#ACACAC"
                              value={value}
                              onChangeText={onChange}
                              onBlur={onBlur}
                            />
                          )}
                        />
                      )}
                      {errors[name] && (
                        <Text style={styles.errorText}>
                          {errors[name].message}
                        </Text>
                      )}
                    </View>
                  )
                )}

                <Text style={styles.sectionTitle}>
                  Contact Details <Text style={styles.required}>*</Text>
                </Text>
                {[
                  {
                    name: "admin_name",
                    placeholder: "Enter admin name",
                    label: "Admin Name",
                  },
                  {
                    name: "email",
                    placeholder: "Enter email",
                    label: "Email",
                    type: "email",
                  },
                  {
                    name: "phone_no",
                    placeholder: "Enter phone number",
                    label: "Phone Number",
                    type: "tel",
                  },
                ].map(({ name, placeholder, label, type = "text" }) => (
                  <View key={name} style={styles.inputContainer}>
                    <Controller
                      control={control}
                      name={name}
                      rules={{ required: `${label} is required` }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={styles.input}
                          placeholder={placeholder}
                          placeholderTextColor="#ACACAC"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          keyboardType={
                            type === "email"
                              ? "email-address"
                              : type === "tel"
                              ? "phone-pad"
                              : "default"
                          }
                        />
                      )}
                    />
                    {errors[name] && (
                      <Text style={styles.errorText}>
                        {errors[name].message}
                      </Text>
                    )}
                  </View>
                ))}

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    isLoading && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmit(onSubmit)}
                  disabled={isLoading}
                >
                  <Text style={styles.submitButtonText}>
                    {isLoading ? "Submitting..." : "Submit"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
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
    backgroundColor: "rgba(0, 0, 0, 0.255)", // Semi-transparent overlay for readability
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent", // Semi-transparent header for readability
    paddingHorizontal: width * 0.04,
    paddingTop: Platform.OS === "ios" ? 0 : height * 0.029, // Adjust padding for SafeAreaView on iOS
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
  },
  scrollContent: {
    paddingBottom: height * 0.1,
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
    paddingHorizontal: width * 0.04,
  },
  sectionTitle: {
    fontSize: width * 0.04,
    fontWeight: "600",
    color: "#FFFFFF",
    alignSelf: "flex-start",
    paddingTop: height * 0.005,
  },
  required: {
    color: "#FF5555",
  },
  inputContainer: {
    width: "100%",
    maxWidth: width * 0.9,
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
  pickerIcon: {
    position: "absolute",
    right: width * 0.04,
    top: "50%",
    transform: [{ translateY: -height * 0.015 }],
  },
  errorText: {
    fontSize: width * 0.03,
    color: "#FF5555",
    marginTop: height * 0.005,
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
  submitButtonDisabled: {
    backgroundColor: "#6B7280",
  },
  submitButtonText: {
    fontSize: width * 0.05,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default RegisterModal;

// import { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   StyleSheet,
//   Dimensions,
//   Image,
//   Platform,
//   KeyboardAvoidingView,
//   ScrollView,
//   ImageBackground,
//   SafeAreaView,
// } from "react-native";
// import { useForm, Controller } from "react-hook-form";
// import Toast from "react-native-toast-message";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";
// import Sidebar from "../Components/Sidebar";
// import { Picker } from "@react-native-picker/picker";
// import { onboard } from "../api/Service";

// const { width, height } = Dimensions.get("window");

// const RegisterModal = ({ onClose, setApiCall }) => {
//   const navigation = useNavigation();
//   const [sidebarVisible, setSidebarVisible] = useState(false);
//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm();
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSidebarVisible, setIsSidebarVisible] = useState(false);

//   // const onSubmit = async (data) => {
//   //   setIsLoading(true);
//   //   try {
//   //     const response = await onboard(data);

//   //     console.log("Response from onboard API:", response, response.success);
//   //     if (response && response.success) {
//   //       Toast.show({
//   //         type: "success",
//   //         text1: response.message || "Registered successfully ✅",
//   //         position: "top",
//   //         visibilityTime: 3000,
//   //         topOffset: height * 0.05,
//   //         text1Style: {
//   //           fontSize: width * 0.04,
//   //           color: "#000000", // Changed to black for better contrast
//   //           fontWeight: "600",
//   //         },
//   //         text2Style: {
//   //           fontSize: width * 0.035,
//   //           color: "#000000", // Changed to black for better contrast
//   //         },
//   //         style: {
//   //           backgroundColor: "#4CAF50", // Changed to standard green
//   //           borderWidth: 1,
//   //           borderColor: "#2E7D32",
//   //           borderRadius: 8,
//   //         },
//   //       });

//   //       await AsyncStorage.setItem(
//   //         "userId",
//   //         response.user?.id?.toString() || ""
//   //       );

//   //       // Reset form fields
//   //       reset({
//   //         organization_name: "",
//   //         gst_no: "",
//   //         address: "",
//   //         organization_type: "",
//   //         admin_name: "",
//   //         email: "",
//   //         phone_no: "",
//   //       });

//   //       // Navigate to ShowAllClient with refresh parameter
//   //       setTimeout(() => {
//   //         navigation.navigate("ShowAllClient", {
//   //           refresh: true,
//   //           timestamp: Date.now(),
//   //         });

//   //         // Only call onClose if it's a function
//   //         if (typeof onClose === "function") {
//   //           onClose();
//   //         }
//   //       }, 3000);
//   //     } else {
//   //       Toast.show({
//   //         type: "error",
//   //         text1: response?.error || "Registration failed ❌",
//   //         position: "top",
//   //         visibilityTime: 3000,
//   //         topOffset: height * 0.05,
//   //         text1Style: {
//   //           fontSize: width * 0.04,
//   //           color: "#FFFFFF", // White text on red background
//   //           fontWeight: "600",
//   //         },
//   //         text2Style: {
//   //           fontSize: width * 0.035,
//   //           color: "#FFFFFF",
//   //         },
//   //         style: {
//   //           backgroundColor: "#F44336", // Standard red background
//   //           borderWidth: 1,
//   //           borderColor: "#D32F2F",
//   //           borderRadius: 8,
//   //         },
//   //       });
//   //     }
//   //   } catch (error) {
//   //     Toast.show({
//   //       type: "error",
//   //       text1: `Error: ${error.message}`,
//   //       position: "top",
//   //       visibilityTime: 3000,
//   //       topOffset: height * 0.05,
//   //       text1Style: {
//   //         fontSize: width * 0.04,
//   //         color: "#FFFFFF", // White text on red background
//   //         fontWeight: "600",
//   //       },
//   //       text2Style: {
//   //         fontSize: width * 0.035,
//   //         color: "#FFFFFF",
//   //       },
//   //       style: {
//   //         backgroundColor: "#F44336", // Standard red background
//   //         borderWidth: 1,
//   //         borderColor: "#D32F2F",
//   //         borderRadius: 8,
//   //       },
//   //     });
//   //   } finally {
//   //     setIsLoading(false);
//   //     // Only call setApiCall if it's a function
//   //     if (typeof setApiCall === "function") {
//   //       setApiCall((prev) => !prev);
//   //     }
//   //   }
//   // };

//   const onSubmit = async (data) => {
//     setIsLoading(true);
//     try {
//       const response = await onboard(data);

//       console.log("Response from onboard API:", response, response.success);
//       if (response && response.success) {
//         Toast.show({
//           type: "success",
//           text1: response.message || "Registered successfully ✅",
//           position: "top",
//           visibilityTime: 3000,
//           topOffset: height * 0.05,
//           text1Style: {
//             fontSize: width * 0.04,
//             color: "#000000",
//             fontWeight: "600",
//           },
//           text2Style: {
//             fontSize: width * 0.035,
//             color: "#000000",
//           },
//           style: {
//             backgroundColor: "#00FFD1",
//             borderWidth: 1,
//             borderColor: "#2BFFFF",
//             borderRadius: 8,
//           },
//         });

//         await AsyncStorage.setItem(
//           "userId",
//           response.user?.id?.toString() || ""
//         );

//         // Reset form fields
//         reset({
//           organization_name: "",
//           gst_no: "",
//           address: "",
//           organization_type: "",
//           admin_name: "",
//           email: "",
//           phone_no: "",
//         });

//         // Navigate to ShowAllClient with refresh parameter
//         setTimeout(() => {
//           navigation.navigate("ShowAllClient", {
//             refresh: true,
//             timestamp: Date.now(),
//           });

//           // Only call onClose if it's a function
//           if (typeof onClose === "function") {
//             onClose();
//           }
//         }, 3000);
//       } else {
//         Toast.show({
//           type: "error",
//           text1: response?.error || "Registration failed ❌",
//           position: "top",
//           visibilityTime: 3000,
//           topOffset: height * 0.05,
//           text1Style: {
//             fontSize: width * 0.04,
//             color: "#000000", // Changed to black for visibility
//           },
//           text2Style: {
//             fontSize: width * 0.035,
//             color: "#000000", // Changed to black for visibility
//           },
//           style: {
//             backgroundColor: "#000000",
//             borderWidth: 1,
//             borderColor: "#FF5555",
//           },
//         });
//       }
//     } catch (error) {
//       Toast.show({
//         type: "error",
//         text1: `Error: ${error.message}`,
//         position: "top",
//         visibilityTime: 3000,
//         topOffset: height * 0.05,
//         text1Style: {
//           fontSize: width * 0.04,
//           color: "#000000", // Changed to black for visibility
//         },
//         text2Style: {
//           fontSize: width * 0.035,
//           color: "#000000", // Changed to black for visibility
//         },
//         style: {
//           backgroundColor: "#000000",
//           borderWidth: 1,
//           borderColor: "#FF5555",
//         },
//       });
//     } finally {
//       setIsLoading(false);
//       // Only call setApiCall if it's a function
//       if (typeof setApiCall === "function") {
//         setApiCall((prev) => !prev);
//       }
//     }
//   };

//   const handleHomeNavigationClick = () => {
//     navigation.goBack();
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
//     setSidebarVisible(false);
//   };

//   return (
//     <ImageBackground
//       source={require("../../assets/Rectangle.jpg")}
//       style={styles.container}
//       resizeMode="cover"
//     >
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.innerContainer}>
//           <Toast />
//           <View style={styles.header}>
//             <TouchableOpacity
//               onPress={() => setIsSidebarVisible(true)}
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

//           <Sidebar
//             visible={isSidebarVisible}
//             onClose={() => setIsSidebarVisible(false)}
//             handleHomeClick={handleHomeNavigationClick}
//             handleLogoutClick={handleLogoutClick}
//           />

//           <KeyboardAvoidingView
//             style={styles.formContainer}
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//             keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
//           >
//             <ScrollView
//               contentContainerStyle={styles.scrollContent}
//               showsVerticalScrollIndicator={false}
//             >
//               <View style={styles.titleSection}>
//                 <Text style={styles.mainTitle}>
//                   Onboarding A New Organization
//                 </Text>
//               </View>
//               <View style={styles.form}>
//                 <Text style={styles.sectionTitle}>
//                   Organization Details <Text style={styles.required}>*</Text>
//                 </Text>
//                 {[
//                   {
//                     name: "organization_name",
//                     placeholder: "Enter organization name",
//                     label: "Organization Name",
//                   },
//                   {
//                     name: "gst_no",
//                     placeholder: "Enter GST number",
//                     label: "GST No",
//                   },
//                   {
//                     name: "address",
//                     placeholder: "Enter address",
//                     label: "Address",
//                   },
//                   {
//                     name: "organization_type",
//                     label: "Organization Type",
//                     type: "select",
//                     options: [
//                       "Manufacturing",
//                       "Trading",
//                       "Hardware",
//                       "Software",
//                       "Agriculture",
//                       "Construction",
//                       "Retail",
//                       "Healthcare",
//                       "Education",
//                       "Monopoly",
//                     ],
//                   },
//                 ].map(
//                   ({ name, placeholder, label, type = "text", options }) => (
//                     <View key={name} style={styles.inputContainer}>
//                       {type === "select" ? (
//                         <View style={styles.pickerContainer}>
//                           <Controller
//                             control={control}
//                             name={name}
//                             rules={{ required: `${label} is required` }}
//                             render={({ field: { onChange, value } }) => (
//                               <>
//                                 <Picker
//                                   selectedValue={value}
//                                   onValueChange={onChange}
//                                   style={styles.picker}
//                                   itemStyle={styles.pickerItem}
//                                 >
//                                   <Picker.Item
//                                     label={`Select ${label}`}
//                                     value=""
//                                   />
//                                   {options.map((opt) => (
//                                     <Picker.Item
//                                       key={opt}
//                                       label={opt}
//                                       value={opt}
//                                     />
//                                   ))}
//                                 </Picker>
//                                 <MaterialIcons
//                                   name="arrow-drop-down"
//                                   size={width * 0.05}
//                                   color="#FFFFFF"
//                                   style={styles.pickerIcon}
//                                 />
//                               </>
//                             )}
//                           />
//                         </View>
//                       ) : (
//                         <Controller
//                           control={control}
//                           name={name}
//                           rules={{ required: `${label} is required` }}
//                           render={({ field: { onChange, onBlur, value } }) => (
//                             <TextInput
//                               style={styles.input}
//                               placeholder={placeholder}
//                               placeholderTextColor="#ACACAC"
//                               value={value}
//                               onChangeText={onChange}
//                               onBlur={onBlur}
//                             />
//                           )}
//                         />
//                       )}
//                       {errors[name] && (
//                         <Text style={styles.errorText}>
//                           {errors[name].message}
//                         </Text>
//                       )}
//                     </View>
//                   )
//                 )}

//                 <Text style={styles.sectionTitle}>
//                   Contact Details <Text style={styles.required}>*</Text>
//                 </Text>
//                 {[
//                   {
//                     name: "admin_name",
//                     placeholder: "Enter admin name",
//                     label: "Admin Name",
//                   },
//                   {
//                     name: "email",
//                     placeholder: "Enter email",
//                     label: "Email",
//                     type: "email",
//                   },
//                   {
//                     name: "phone_no",
//                     placeholder: "Enter phone number",
//                     label: "Phone Number",
//                     type: "tel",
//                   },
//                 ].map(({ name, placeholder, label, type = "text" }) => (
//                   <View key={name} style={styles.inputContainer}>
//                     <Controller
//                       control={control}
//                       name={name}
//                       rules={{ required: `${label} is required` }}
//                       render={({ field: { onChange, onBlur, value } }) => (
//                         <TextInput
//                           style={styles.input}
//                           placeholder={placeholder}
//                           placeholderTextColor="#ACACAC"
//                           value={value}
//                           onChangeText={onChange}
//                           onBlur={onBlur}
//                           keyboardType={
//                             type === "email"
//                               ? "email-address"
//                               : type === "tel"
//                               ? "phone-pad"
//                               : "default"
//                           }
//                         />
//                       )}
//                     />
//                     {errors[name] && (
//                       <Text style={styles.errorText}>
//                         {errors[name].message}
//                       </Text>
//                     )}
//                   </View>
//                 ))}

//                 <TouchableOpacity
//                   style={[
//                     styles.submitButton,
//                     isLoading && styles.submitButtonDisabled,
//                   ]}
//                   onPress={handleSubmit(onSubmit)}
//                   disabled={isLoading}
//                 >
//                   <Text style={styles.submitButtonText}>
//                     {isLoading ? "Submitting..." : "Submit"}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </ScrollView>
//           </KeyboardAvoidingView>
//         </View>
//       </SafeAreaView>
//     </ImageBackground>
//   );
// };

// // Add default props to prevent errors
// RegisterModal.defaultProps = {
//   onClose: () => {},
//   setApiCall: () => {},
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
//     backgroundColor: "rgba(0, 0, 0, 0.255)", // Semi-transparent overlay for readability
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "transparent", // Semi-transparent header for readability
//     paddingHorizontal: width * 0.04,
//     paddingTop: Platform.OS === "ios" ? 0 : height * 0.029, // Adjust padding for SafeAreaView on iOS
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
//     fontWeight: "600",
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
//   sectionTitle: {
//     fontSize: width * 0.04,
//     fontWeight: "600",
//     color: "#FFFFFF",
//     alignSelf: "flex-start",
//     paddingTop: height * 0.005,
//   },
//   required: {
//     color: "#FF5555",
//   },
//   inputContainer: {
//     width: "100%",
//     maxWidth: width * 0.9,
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
//     backgroundColor: "rgba(255, 255, 255, 0.1)", // Slight background for visibility
//   },
//   pickerContainer: {
//     position: "relative",
//     width: "100%",
//     borderRadius: width * 0.03,
//     borderWidth: 1,
//     borderColor: "#FFFFFF",
//     backgroundColor: "rgba(255, 255, 255, 0.1)", // Slight background for visibility
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
//   pickerIcon: {
//     position: "absolute",
//     right: width * 0.04,
//     top: "50%",
//     transform: [{ translateY: -height * 0.015 }],
//   },
//   errorText: {
//     fontSize: width * 0.03,
//     color: "#FF5555",
//     marginTop: height * 0.005,
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
//   submitButtonDisabled: {
//     backgroundColor: "#6B7280",
//   },
//   submitButtonText: {
//     fontSize: width * 0.05,
//     fontWeight: "700",
//     color: "#FFFFFF",
//   },
// });

// export default RegisterModal;
