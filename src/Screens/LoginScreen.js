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
  const [rememberMe, setRememberMe] = useState(false);
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
        const savedValue = await AsyncStorage.getItem("savedEmailOrPhone");
        console.log("Loaded savedEmailOrPhone:", savedValue);
        if (savedValue) {
          setEmailOrPhone(savedValue);
          setRememberMe(true);
          Toast.show({
            type: "info",
            text1: "Loaded saved email/phone.",
            position: "top",
            autoHide: true,
            visibilityTime: 2000,
          });
        }

        const token =
          (await AsyncStorage.getItem("token")) ||
          (await AsyncStorage.getItem("sessionToken"));
        if (token) {
          try {
            console.log("Token found:", token);
            const decodedToken = jwtDecode(token);
            console.log("Decoded token:", decodedToken);
            const role = decodedToken.role;
            if (role === "admin") {
              navigation.replace("AdminDashboard");
              return;
            } else if (role === "manager") {
              navigation.replace("SuperAdminTabBar");
              return;
            }
          } catch (err) {
            console.error("Token decode error:", err);
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("sessionToken");
          }
        }
      } catch (err) {
        console.error("Error loading saved data:", err);
        Toast.show({
          type: "error",
          text1: "Error loading saved data.",
          position: "top",
          autoHide: true,
          visibilityTime: 3000,
        });
      }
    };

    loadSavedData();
  }, [navigation]);

  const handleLogin = async () => {
    console.log("handleLogin started");

    // Input validation
    if (!emailOrPhone || !password) {
      Toast.show({
        type: "error",
        text1: "Please enter both email/phone and password.",
        position: "top",
        autoHide: true,
        visibilityTime: 3000,
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
            text1: "Email/phone saved for next login.",
            position: "top",
            autoHide: true,
            visibilityTime: 2000,
          });
        } else {
          await AsyncStorage.removeItem("savedEmailOrPhone");
          console.log("Removed savedEmailOrPhone");
        }

        Toast.show({
          type: "success",
          text1: "Login successful!",
          position: "top",
          autoHide: true,
          visibilityTime: 2000,
        });

        console.log(
          "Ready to navigate to:",
          role === "admin" ? "AdminDashboard" : "SuperAdminTabBar"
        );

        if (role === "admin") {
          navigation.replace("AdminDashboard");
        } else if (role === "manager") {
          navigation.replace("SuperAdminTabBar");
        } else {
          Toast.show({
            type: "error",
            text1: "Unknown role!",
            position: "top",
            autoHide: true,
            visibilityTime: 3000,
          });
        }
      } else {
        console.log("Login failed or token missing:", response);
        Toast.show({
          type: "error",
          text1: response.error || "Login failed. Please try again.",
          position: "top",
          autoHide: true,
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.error("Login error caught:", error);
      const apiError = error.message || "An unexpected error occurred.";
      Toast.show({
        type: "error",
        text1: apiError,
        position: "top",
        autoHide: true,
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
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

          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />

          <View style={styles.optionsContainer}>
            <View style={styles.rememberMeContainer}>
              <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)}
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
    // alignItems: "center",
  },
  logo: {
    width: width * 0.25,
    height: width * 0.25,
    marginBottom: height * 0.02,
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
  },
  checkboxChecked: {
    backgroundColor: "#00D1D1",
  },
  rememberMeText: {
    color: "#ffffff",
    fontSize: width * 0.04 > 14 ? 14 : width * 0.04,
  },
  forgotPassword: {
    color: "#00D1D1",
    fontSize: width * 0.035 > 12 ? 12 : width * 0.035,
    textDecorationLine: "underline",
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
