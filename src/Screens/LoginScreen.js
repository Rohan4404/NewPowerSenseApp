// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   Image,
//   ActivityIndicator,
//   SafeAreaView,
//   StatusBar,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { loginUser } from "../api/Service";
// import jwtDecode from "jwt-decode";
// import Toast from "react-native-toast-message";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// const { width, height } = Dimensions.get("window");

// const LoginPage = () => {
//   const [emailOrPhone, setEmailOrPhone] = useState("");
//   // const [password, setPasswordVisible] = useState("");
//   const [password, setPassword] = useState("");
//   const [isPasswordVisible, setIsPasswordVisible] = useState(false); // New state for password visibility
//   const [rememberMe] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigation = useNavigation();

//   // Cleanup toast on unmount
//   useEffect(() => {
//     return () => {
//       Toast.hide();
//     };
//   }, []);

//   // Load saved emailOrPhone and handle redirect if token is found
//   useEffect(() => {
//     const loadSavedData = async () => {
//       try {
//         /* -------- 1. Load remembered email / phone -------- */
//         const savedValue = await AsyncStorage.getItem("savedEmailOrPhone");

//         if (savedValue) {
//           setEmailOrPhone(savedValue);
//           setRememberMe(true);

//           Toast.show({
//             type: "info",
//             text1: "Loaded saved email or phone",
//             position: "top",
//             visibilityTime: 2000,
//             topOffset: height * 0.05,
//             text1Style: { fontSize: width * 0.04, color: "#333" },
//             style: {
//               backgroundColor: "#FFFFFF",
//               borderWidth: 1,
//               borderColor: "#00FFFF",
//             },
//           });
//         }

//         /* -------- 2. Check for token and redirect -------- */
//         const token =
//           (await AsyncStorage.getItem("token")) ||
//           (await AsyncStorage.getItem("sessionToken"));

//         if (token) {
//           try {
//             const { role } = jwtDecode(token);

//             if (role === "admin") {
//               navigation.replace("AdminTabBar");
//               return;
//             }
//             if (role === "manager") {
//               navigation.replace("SuperAdminTabBar");
//               return;
//             }
//           } catch (decodeErr) {
//             console.error("Token decode error:", decodeErr);
//             await AsyncStorage.multiRemove(["token", "sessionToken"]);
//           }
//         }
//       } catch (err) {
//         /* -------- 3. Generic error handling -------- */
//         console.error("Error loading saved data:", err);
//         Toast.show({
//           type: "error",
//           text1: "Error loading saved data",
//           position: "top",
//           visibilityTime: 3000,
//           topOffset: height * 0.05,
//           text1Style: { fontSize: width * 0.04, color: "#000000" },
//           style: {
//             backgroundColor: "#000000",
//             borderWidth: 1,
//             borderColor: "#FF5555",
//           },
//         });
//       }
//     };

//     loadSavedData();
//   }, [navigation]);

//   const handleLogin = async () => {
//     console.log("handle login started");

//     // Input validation
//     if (!emailOrPhone || !password) {
//       Toast.show({
//         type: "error",
//         text1: "Please enter both email/phone number and password",
//         position: "top",
//         autoHide: true,
//         visibilityTime: 3000,
//         topOffset: height * 0.05,
//         text1Style: {
//           fontSize: width * 0.04,
//           color: "#000000",
//         },
//         style: {
//           backgroundColor: "#000000",
//           borderWidth: 1,
//           borderColor: "#FF5555",
//         },
//       });
//       return;
//     }

//     setIsLoading(true);

//     try {
//       console.log("Calling loginUser with:", { emailOrPhone, password });
//       const response = await loginUser({ emailOrPhone, password });
//       console.log("Login response:", response);

//       if (response.success === true && response.token) {
//         console.log("Token received:", response.token);
//         const decodedToken = jwtDecode(response.token);
//         console.log("Decoded token:", decodedToken);
//         const role = decodedToken.role;
//         const userId = decodedToken.user_id;
//         const userID = response.user?.user_id;
//         const clientId = response.user?.client_id;

//         if (!userId) {
//           throw new Error("User ID is missing in token");
//         }

//         // Store in AsyncStorage
//         await AsyncStorage.setItem("userId", userId.toString());
//         if (userID) await AsyncStorage.setItem("userID", userID.toString());
//         if (clientId)
//           await AsyncStorage.setItem("clientId", clientId.toString());
//         await AsyncStorage.setItem("role", role);

//         const storageKey = rememberMe ? "token" : "sessionToken";
//         await AsyncStorage.setItem(storageKey, response.token);

//         if (rememberMe) {
//           await AsyncStorage.setItem("savedEmailOrPhone", emailOrPhone);
//           console.log("Saved emailOrPhone:", emailOrPhone);
//           Toast.show({
//             type: "info",
//             text1: "Email or phone saved for next login",
//             position: "top",
//             autoHide: true,
//             visibilityTime: 2000,
//             topOffset: height * 0.05,
//             text1Style: {
//               fontSize: width * 0.04,
//               color: "#333",
//             },
//             style: {
//               backgroundColor: "#FFFFFF",
//               borderWidth: 1,
//               borderColor: "#00FFFF",
//             },
//           });
//         } else {
//           await AsyncStorage.removeItem("savedEmailOrPhone");
//           console.log("Removed savedEmailOrPhone");
//         }

//         Toast.show({
//           type: "success",
//           text1: "Login successful",
//           position: "top",
//           autoHide: true,
//           visibilityTime: 2000,
//           topOffset: height * 0.05,
//           text1Style: {
//             fontSize: width * 0.04,
//             color: "#000000",
//           },
//           style: {
//             backgroundColor: "#00FFD1",
//             borderWidth: 1,
//             borderColor: "#2BFFFF",
//           },
//         });

//         console.log(
//           "Ready to navigate to:",
//           role === "admin" ? "AdminTabBar" : "SuperAdminTabBar"
//         );

//         if (role === "admin") {
//           navigation.replace("AdminTabBar");
//         } else if (role === "manager") {
//           navigation.replace("SuperAdminTabBar");
//         } else {
//           Toast.show({
//             type: "error",
//             text1: "Unknown role",
//             position: "top",
//             autoHide: true,
//             visibilityTime: 3000,
//             topOffset: height * 0.05,
//             text1Style: {
//               fontSize: width * 0.04,
//               color: "#000000",
//             },
//             style: {
//               backgroundColor: "#000000",
//               borderWidth: 1,
//               borderColor: "#FF5555",
//             },
//           });
//         }
//       } else {
//         console.log("Login failed or token missing:", response);
//         Toast.show({
//           type: "error",
//           text1: response.error || "Login failed. Please try again",
//           position: "top",
//           autoHide: true,
//           visibilityTime: 3000,
//           topOffset: height * 0.05,
//           text1Style: {
//             fontSize: width * 0.04,
//             color: "#000000",
//           },
//           style: {
//             backgroundColor: "#000000",
//             borderWidth: 1,
//             borderColor: "#FF5555",
//           },
//         });
//       }
//     } catch (error) {
//       console.error("Login error caught:", error);
//       const apiError = error.message || "An unexpected error occurred";
//       Toast.show({
//         type: "error",
//         text1: apiError,
//         position: "top",
//         autoHide: true,
//         visibilityTime: 3000,
//         topOffset: height * 0.05,
//         text1Style: {
//           fontSize: width * 0.04,
//           color: "#000000",
//         },
//         style: {
//           backgroundColor: "#000000",
//           borderWidth: 1,
//           borderColor: "#FF5555",
//         },
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Toggle password visibility
//   const togglePasswordVisibility = () => {
//     setIsPasswordVisible(!isPasswordVisible);
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="light-content" />
//       <View style={styles.statusBarBackground} />
//       <KeyboardAvoidingView
//         style={styles.container}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={
//           Platform.OS === "ios" ? height * 0.1 : height * 0.05
//         }
//       >
//         <View style={styles.formContainer}>
//           <Image
//             source={require("../../assets/Pslogo.png")}
//             style={styles.logo}
//             resizeMode="contain"
//           />
//           <Text style={styles.title}>
//             Power <Text style={styles.sense}>Sense</Text>
//           </Text>
//           <Text style={styles.subtitle}>Login your account as an admin</Text>

//           <TextInput
//             style={styles.input}
//             placeholder="Enter your email or phone number"
//             placeholderTextColor="#888"
//             value={emailOrPhone}
//             onChangeText={setEmailOrPhone}
//             editable={!isLoading}
//             autoCapitalize="none"
//           />

//           <View style={styles.passwordContainer}>
//             <TextInput
//               style={styles.passwordInput}
//               placeholder="Enter your password"
//               placeholderTextColor="#888"
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry={!isPasswordVisible}
//               editable={!isLoading}
//             />
//             <TouchableOpacity
//               style={styles.eyeIcon}
//               onPress={togglePasswordVisibility}
//             >
//               <MaterialIcons
//                 name={isPasswordVisible ? "visibility" : "visibility-off"}
//                 size={width * 0.06}
//                 color="#FFFFFF"
//               />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.optionsContainer}>
//             <View style={styles.rememberMeContainer}>
//               <TouchableOpacity
//                 onPress={() => setRememberMe(!rememberMe)}
//                 style={styles.checkboxContainer}
//               >
//                 <View
//                   style={[
//                     styles.checkbox,
//                     rememberMe && styles.checkboxChecked,
//                   ]}
//                 >
//                   {rememberMe && (
//                     <MaterialIcons
//                       name="check"
//                       size={width * 0.04}
//                       color="#FFFFFF"
//                     />
//                   )}
//                 </View>
//                 <Text style={styles.rememberMeText}>Remember Me</Text>
//               </TouchableOpacity>
//             </View>
//             <Text
//               style={styles.forgotPassword}
//               onPress={() => navigation.navigate("ForgetPassword")}
//               numberOfLines={1}
//               adjustsFontSizeToFit
//               allowFontScaling={false}
//             >
//               Forgot Password?
//             </Text>
//           </View>

//           <TouchableOpacity
//             style={[
//               styles.loginButton,
//               isLoading && styles.loginButtonDisabled,
//             ]}
//             onPress={handleLogin}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <ActivityIndicator size="small" color="#000000" />
//             ) : (
//               <Text style={styles.loginButtonText}>Login</Text>
//             )}
//           </TouchableOpacity>

//           <Text style={styles.signUpText}>
//             Don't have an account?{" "}
//             <Text
//               style={styles.signUpLink}
//               onPress={() => navigation.navigate("SingUp")}
//             >
//               Sign Up
//             </Text>
//           </Text>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default LoginPage;

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#393939",
//   },
//   statusBarBackground: {
//     height: StatusBar.currentHeight || height * 0.05,
//     backgroundColor: "#393939",
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#393939",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: width * 0.05,
//   },
//   formContainer: {
//     width: width * 0.9,
//   },
//   logo: {
//     width: width * 0.25,
//     height: width * 0.25,
//     marginBottom: height * 0.02,
//   },
//   title: {
//     fontSize: width * 0.12 > 48 ? 48 : width * 0.12,
//     fontWeight: "bold",
//     color: "#ffffff",
//     marginBottom: height * 0.01,
//   },
//   sense: {
//     color: "#00D1D1",
//   },
//   subtitle: {
//     fontSize: width * 0.05 > 20 ? 20 : width * 0.05,
//     color: "#ffffff",
//     marginBottom: height * 0.03,
//   },
//   input: {
//     width: "100%",
//     padding: width * 0.04,
//     marginBottom: height * 0.02,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#ffffff",
//     color: "#ffffff",
//     fontSize: width * 0.04 > 16 ? 16 : width * 0.04,
//     backgroundColor: "transparent",
//   },
//   passwordContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "100%",
//     marginBottom: height * 0.02,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#ffffff",
//     backgroundColor: "transparent",
//   },
//   passwordInput: {
//     flex: 1,
//     padding: width * 0.04,
//     color: "#ffffff",
//     fontSize: width * 0.04 > 16 ? 16 : width * 0.04,
//     backgroundColor: "transparent",
//   },
//   eyeIcon: {
//     padding: width * 0.03,
//   },
//   optionsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     width: "100%",
//     marginBottom: height * 0.02,
//   },
//   rememberMeContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   checkboxContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   checkbox: {
//     width: width * 0.05,
//     height: width * 0.05,
//     borderWidth: 1,
//     borderColor: "#ffffff",
//     marginRight: width * 0.02,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   checkboxChecked: {
//     backgroundColor: "#00D1D1",
//   },
//   rememberMeText: {
//     color: "#ffffff",
//     fontSize: width * 0.04 > 14 ? 14 : width * 0.04,
//   },
//   forgotPassword: {
//     color: "#00D1D1",
//     fontSize: width * 0.035 > 12 ? 12 : width * 0.035,
//     textDecorationLine: "underline",
//     flexShrink: 1,
//     maxWidth: "100%",
//   },
//   loginButton: {
//     width: "100%",
//     padding: width * 0.04,
//     backgroundColor: "#00D1D1",
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   loginButtonDisabled: {
//     backgroundColor: "#00A3A3",
//   },
//   loginButtonText: {
//     color: "#000000",
//     fontSize: width * 0.045 > 16 ? 16 : width * 0.045,
//     fontWeight: "600",
//   },
//   signUpText: {
//     color: "#ffffff",
//     fontSize: width * 0.04 > 14 ? 14 : width * 0.04,
//     marginTop: height * 0.02,
//   },
//   signUpLink: {
//     color: "#00D1D1",
//     textDecorationLine: "underline",
//   },
// });

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from "../api/Service";
import jwtDecode from "jwt-decode";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const { width, height } = Dimensions.get("window");

const LoginPage = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // ✅ Fixed: Added setRememberMe
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  // Cleanup toast on unmount
  useEffect(() => {
    return () => {
      Toast.hide();
    };
  }, []);

  // Load saved emailOrPhone and handle redirect if token is found
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        /* -------- 1. Load remembered email / phone -------- */
        const savedValue = await AsyncStorage.getItem("savedEmailOrPhone");

        if (savedValue) {
          setEmailOrPhone(savedValue);
          setRememberMe(true);

          Toast.show({
            type: "info",
            text1: "Loaded saved email or phone",
            position: "top",
            visibilityTime: 2000,
            topOffset: height * 0.05,
            text1Style: { fontSize: width * 0.04, color: "#333" },
            style: {
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#00D1D1", // Updated to match your color scheme
            },
          });
        }

        /* -------- 2. Check for token and redirect -------- */
        const token =
          (await AsyncStorage.getItem("token")) ||
          (await AsyncStorage.getItem("sessionToken"));

        if (token) {
          try {
            const { role } = jwtDecode(token);

            if (role === "admin") {
              navigation.replace("AdminTabBar");
              return;
            }
            if (role === "manager") {
              navigation.replace("SuperAdminTabBar");
              return;
            }
          } catch (decodeErr) {
            console.error("Token decode error:", decodeErr);
            await AsyncStorage.multiRemove(["token", "sessionToken"]);
          }
        }
      } catch (err) {
        /* -------- 3. Generic error handling -------- */
        console.error("Error loading saved data:", err);
        Toast.show({
          type: "error",
          text1: "Error loading saved data",
          position: "top",
          visibilityTime: 3000,
          topOffset: height * 0.05,
          text1Style: { fontSize: width * 0.04, color: "#000000" },
          style: {
            backgroundColor: "#000000",
            borderWidth: 1,
            borderColor: "#FF5555",
          },
        });
      }
    };

    loadSavedData();
  }, [navigation]);

  const handleLogin = async () => {
    console.log("handle login started");

    // Input validation
    if (!emailOrPhone || !password) {
      Toast.show({
        type: "error",
        text1: "Please enter both email/phone number and password",
        position: "top",
        autoHide: true,
        visibilityTime: 3000,
        topOffset: height * 0.05,
        text1Style: {
          fontSize: width * 0.04,
          color: "#000000",
        },
        style: {
          backgroundColor: "#000000",
          borderWidth: 1,
          borderColor: "#FF5555",
        },
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Calling loginUser with:", { emailOrPhone, password });
      const response = await loginUser({ emailOrPhone, password });
      console.log("Login response:", response);

      if (response.success === true && response.token) {
        console.log("Token received:", response.token);
        const decodedToken = jwtDecode(response.token);
        console.log("Decoded token:", decodedToken);
        const role = decodedToken.role;
        const userId = decodedToken.user_id;
        const userID = response.user?.user_id;
        const clientId = response.user?.client_id;

        if (!userId) {
          throw new Error("User ID is missing in token");
        }

        // Store in AsyncStorage
        await AsyncStorage.setItem("userId", userId.toString());
        if (userID) await AsyncStorage.setItem("userID", userID.toString());
        if (clientId)
          await AsyncStorage.setItem("clientId", clientId.toString());
        await AsyncStorage.setItem("role", role);

        const storageKey = rememberMe ? "token" : "sessionToken";
        await AsyncStorage.setItem(storageKey, response.token);

        if (rememberMe) {
          await AsyncStorage.setItem("savedEmailOrPhone", emailOrPhone);
          console.log("Saved emailOrPhone:", emailOrPhone);
          Toast.show({
            type: "info",
            text1: "Email or phone saved for next login",
            position: "top",
            autoHide: true,
            visibilityTime: 2000,
            topOffset: height * 0.05,
            text1Style: {
              fontSize: width * 0.04,
              color: "#333",
            },
            style: {
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#00D1D1", // Updated color
            },
          });
        } else {
          await AsyncStorage.removeItem("savedEmailOrPhone");
          console.log("Removed savedEmailOrPhone");
        }

        Toast.show({
          type: "success",
          text1: "Login successful",
          position: "top",
          autoHide: true,
          visibilityTime: 2000,
          topOffset: height * 0.05,
          text1Style: {
            fontSize: width * 0.04,
            color: "#000000",
          },
          style: {
            backgroundColor: "#00D1D1", // Updated to match your theme
            borderWidth: 1,
            borderColor: "#00A3A3",
          },
        });

        console.log(
          "Ready to navigate to:",
          role === "admin" ? "AdminTabBar" : "SuperAdminTabBar"
        );

        if (role === "admin") {
          navigation.replace("AdminTabBar");
        } else if (role === "manager") {
          navigation.replace("SuperAdminTabBar");
        } else {
          Toast.show({
            type: "error",
            text1: "Unknown role",
            position: "top",
            autoHide: true,
            visibilityTime: 3000,
            topOffset: height * 0.05,
            text1Style: {
              fontSize: width * 0.04,
              color: "#000000",
            },
            style: {
              backgroundColor: "#000000",
              borderWidth: 1,
              borderColor: "#FF5555",
            },
          });
        }
      } else {
        console.log("Login failed or token missing:", response);
        Toast.show({
          type: "error",
          text1: response.error || "Login failed. Please try again",
          position: "top",
          autoHide: true,
          visibilityTime: 3000,
          topOffset: height * 0.05,
          text1Style: {
            fontSize: width * 0.04,
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
      console.error("Login error caught:", error);
      const apiError = error.message || "An unexpected error occurred";
      Toast.show({
        type: "error",
        text1: apiError,
        position: "top",
        autoHide: true,
        visibilityTime: 3000,
        topOffset: height * 0.05,
        text1Style: {
          fontSize: width * 0.04,
          color: "#000000",
        },
        style: {
          backgroundColor: "#000000",
          borderWidth: 1,
          borderColor: "#FF5555",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      {/* ✅ Fixed: Custom status bar background instead of using StatusBar backgroundColor */}
      <View style={styles.statusBarBackground} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={
          Platform.OS === "ios" ? height * 0.1 : height * 0.05
        }
      >
        <View style={styles.formContainer}>
          <Image
            source={require("../../assets/Pslogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>
            Power <Text style={styles.sense}>Sense</Text>
          </Text>
          <Text style={styles.subtitle}>Login your account as an admin</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email or phone number"
            placeholderTextColor="#888"
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
            editable={!isLoading}
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={togglePasswordVisibility}
            >
              <MaterialIcons
                name={isPasswordVisible ? "visibility" : "visibility-off"}
                size={width * 0.06}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsContainer}>
            <View style={styles.rememberMeContainer}>
              <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)} // ✅ Now works correctly
                style={styles.checkboxContainer}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxChecked,
                  ]}
                >
                  {rememberMe && (
                    <MaterialIcons
                      name="check"
                      size={width * 0.04}
                      color="#FFFFFF"
                    />
                  )}
                </View>
                <Text style={styles.rememberMeText}>Remember Me</Text>
              </TouchableOpacity>
            </View>
            <Text
              style={styles.forgotPassword}
              onPress={() => navigation.navigate("ForgetPassword")}
              numberOfLines={1}
              adjustsFontSizeToFit
              allowFontScaling={false}
            >
              Forgot Password?
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.signUpText}>
            Don't have an account?{" "}
            <Text
              style={styles.signUpLink}
              onPress={() => navigation.navigate("SingUp")}
            >
              Sign Up
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#393939",
  },
  statusBarBackground: {
    height: StatusBar.currentHeight || height * 0.05,
    backgroundColor: "#393939",
  },
  container: {
    flex: 1,
    backgroundColor: "#393939",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
  },
  formContainer: {
    width: width * 0.9,
  },
  logo: {
    width: width * 0.25,
    height: width * 0.25,
    marginBottom: height * 0.02,
    tintColor: "#00D1D1", // ✅ Added tint to match your theme
  },
  title: {
    fontSize: width * 0.12 > 48 ? 48 : width * 0.12,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: height * 0.01,
  },
  sense: {
    color: "#00D1D1",
  },
  subtitle: {
    fontSize: width * 0.05 > 20 ? 20 : width * 0.05,
    color: "#ffffff",
    marginBottom: height * 0.03,
  },
  input: {
    width: "100%",
    padding: width * 0.04,
    marginBottom: height * 0.02,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffffff",
    color: "#ffffff",
    fontSize: width * 0.04 > 16 ? 16 : width * 0.04,
    backgroundColor: "transparent",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: height * 0.02,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffffff",
    backgroundColor: "transparent",
  },
  passwordInput: {
    flex: 1,
    padding: width * 0.04,
    color: "#ffffff",
    fontSize: width * 0.04 > 16 ? 16 : width * 0.04,
    backgroundColor: "transparent",
  },
  eyeIcon: {
    padding: width * 0.03,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: height * 0.02,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: width * 0.05,
    height: width * 0.05,
    borderWidth: 1,
    borderColor: "#ffffff",
    marginRight: width * 0.02,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2, // ✅ Added slight border radius for better look
  },
  checkboxChecked: {
    backgroundColor: "#00D1D1",
    borderColor: "#00D1D1", // ✅ Match border color when checked
  },
  rememberMeText: {
    color: "#ffffff",
    fontSize: width * 0.04 > 14 ? 14 : width * 0.04,
  },
  forgotPassword: {
    color: "#00D1D1",
    fontSize: width * 0.035 > 12 ? 12 : width * 0.035,
    textDecorationLine: "underline",
    flexShrink: 1,
    maxWidth: "100%",
  },
  loginButton: {
    width: "100%",
    padding: width * 0.04,
    backgroundColor: "#00D1D1",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonDisabled: {
    backgroundColor: "#00A3A3",
  },
  loginButtonText: {
    color: "#000000",
    fontSize: width * 0.045 > 16 ? 16 : width * 0.045,
    fontWeight: "600",
  },
  signUpText: {
    color: "#ffffff",
    fontSize: width * 0.04 > 14 ? 14 : width * 0.04,
    marginTop: height * 0.02,
  },
  signUpLink: {
    color: "#00D1D1",
    textDecorationLine: "underline",
  },
});
