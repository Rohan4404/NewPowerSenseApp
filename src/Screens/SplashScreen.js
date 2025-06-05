import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Easing,
  Text,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const SplashScreen = () => {
  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height * 0.05)).current;

  useEffect(() => {
    // Animate logo and text
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000, // ✅ Fixed: Changed from 100000 to 1000
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000, // ✅ Fixed: Changed from 100000 to 1000
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, slideAnim]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../../assets/Pslogo.png")}
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        Power <Text style={styles.sense}>SENSE</Text>
      </Animated.Text>
      <ActivityIndicator
        size={width * 0.1 > 40 ? "large" : "small"}
        color="#00e6e6"
        style={{ marginTop: height * 0.04 }}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.04,
  },
  logo: {
    width: width * 0.4,
    height: height * 0.4,
    marginBottom: height * 0.0,
  },
  title: {
    fontSize: width * 0.08 > 32 ? 32 : width * 0.08,
    fontWeight: "bold",
    color: "#00e6e6",
    marginTop: height * 0.0,
    // letterSpacing: width * 0.005,
  },
  sense: {
    color: "#ffffff",
  },
});
