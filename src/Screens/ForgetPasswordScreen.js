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
import { forgotPassword } from "../api/Service"; // Assuming this is reusable
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  // Cleanup toast on unmount
  useEffect(() => {
    return () => {
      Toast.hide();
    };
  }, []);

  const handleForgotPassword = async () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Please enter your email.",
        position: "top",
        autoHide: true,
        visibilityTime: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await forgotPassword(email);
      if (response.success || response.message) {
        Toast.show({
          type: "success",
          text1: "Reset link sent to your email.",
          position: "top",
          autoHide: true,
          visibilityTime: 2000,
        });
        setEmail("");
      } else {
        Toast.show({
          type: "error",
          text1: response?.error || "Failed to send reset link.",
          position: "top",
          autoHide: true,
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error.message || "Something went wrong. Please try again.",
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
          <Text style={styles.subtitle}>
            Enter your email to receive a reset link
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            editable={!isLoading}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TouchableOpacity
            style={[
              styles.resetButton,
              isLoading && styles.resetButtonDisabled,
            ]}
            onPress={handleForgotPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : (
              <Text style={styles.resetButtonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.loginText}>
            Back to{" "}
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

export default ForgotPasswordPage;

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
  resetButton: {
    width: "100%",
    padding: width * 0.04,
    backgroundColor: "#00D1D1",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  resetButtonDisabled: {
    backgroundColor: "#00A3A3",
  },
  resetButtonText: {
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
