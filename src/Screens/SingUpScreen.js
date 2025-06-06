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
import { verifyOtp, signup } from "../api/Service"; // Assuming these are reusable
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpVisible, setOtpVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  // Cleanup toast on unmount
  useEffect(() => {
    return () => {
      Toast.hide();
    };
  }, []);

  const handleVerify = async () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Please enter email or phone.",
        position: "top",
        autoHide: true,
        visibilityTime: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await signup(email);
      if (response.success) {
        Toast.show({
          type: "success",
          text1: "OTP sent successfully",
          position: "top",
          autoHide: true,
          visibilityTime: 2000,
        });
        setOtpVisible(true);
      } else {
        Toast.show({
          type: "error",
          text1: response?.error || "Failed to send OTP",
          position: "top",
          autoHide: true,
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: `Error sending OTP: ${error.message || "Something went wrong"}`,
        position: "top",
        autoHide: true,
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!otpVisible) {
      Toast.show({
        type: "error",
        text1: "Please verify your email/phone first.",
        position: "top",
        autoHide: true,
        visibilityTime: 3000,
      });
      return;
    }

    if (!otp) {
      Toast.show({
        type: "error",
        text1: "Please enter the OTP.",
        position: "top",
        autoHide: true,
        visibilityTime: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyOtp({
        emailOrPhone: email,
        otp,
        password,
        payload: {},
      });

      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Signup successful!",
          position: "top",
          autoHide: true,
          visibilityTime: 2000,
        });
        navigation.replace("Login");
      } else {
        Toast.show({
          type: "error",
          text1: response?.error || "Signup failed",
          position: "top",
          autoHide: true,
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: `Signup error: ${error.message || "Something went wrong"}`,
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
            source={require("../../assets/Pslogo.png")} // Adjust path as needed
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>
            Power <Text style={styles.sense}>Sense</Text>
          </Text>
          <Text style={styles.subtitle}>Sign up a new account</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email or phone of organization"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading && !otpVisible}
              autoCapitalize="none"
            />
            {email && !otpVisible && (
              <TouchableOpacity
                onPress={handleVerify}
                style={styles.verifyButton}
                disabled={isLoading}
              >
                <Text style={styles.verifyButtonText}>
                  {isLoading ? "Verifying..." : "Verify"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {otpVisible && (
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              placeholderTextColor="#888"
              value={otp}
              onChangeText={setOtp}
              editable={!isLoading}
              keyboardType="numeric"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />

          <TouchableOpacity
            style={[
              styles.signupButton,
              isLoading && styles.signupButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : (
              <Text style={styles.signupButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text
              style={styles.loginLink}
              onPress={() => navigation.navigate("Login")}
            >
              Login
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterPage;

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
    marginBottom: height * 0.02, // Restored margin for consistency
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
  inputContainer: {
    width: "100%",
    position: "relative",
    // marginBottom: height * 0.02,
  },
  input: {
    width: "100%",
    padding: width * 0.04,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffffff",
    marginBottom: height * 0.02,
    color: "#ffffff",
    fontSize: width * 0.04 > 16 ? 16 : width * 0.04,
    backgroundColor: "transparent",
  },
  verifyButton: {
    position: "absolute",
    right: width * 0.02,
    top: "50%",
    transform: [{ translateY: -height * 0.02 }],
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.01,
    backgroundColor: "#00D1D1",
    borderRadius: 4,
  },
  verifyButtonText: {
    color: "#000000",
    fontSize: width * 0.035 > 12 ? 12 : width * 0.035,
    fontWeight: "600",
  },
  signupButton: {
    width: "100%",
    padding: width * 0.04,
    marginTop: width * 0.04,
    backgroundColor: "#00D1D1",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  signupButtonDisabled: {
    backgroundColor: "#00A3A3",
  },
  signupButtonText: {
    color: "#000000",
    fontSize: width * 0.045 > 16 ? 16 : width * 0.045,
    fontWeight: "600",
  },
  loginText: {
    color: "#ffffff",
    fontSize: width * 0.04 > 14 ? 14 : width * 0.04,
    marginTop: height * 0.02,
  },
  loginLink: {
    color: "#00D1D1",
    textDecorationLine: "underline",
  },
});
