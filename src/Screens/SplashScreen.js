// import React, { useEffect, useRef } from "react";
// import {
//   View,
//   Image,
//   StyleSheet,
//   Animated,
//   Easing,
//   Text,
//   ActivityIndicator,
//   Dimensions,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";

// const { width, height } = Dimensions.get("window");

// const SplashScreen = () => {
//   const navigation = useNavigation();

//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(height * 0.05)).current;

//   useEffect(() => {
//     // Animate logo and text
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 1000, // ✅ Fixed: Changed from 100000 to 1000
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 1000, // ✅ Fixed: Changed from 100000 to 1000
//         easing: Easing.out(Easing.exp),
//         useNativeDriver: true,
//       }),
//     ]).start();

//     const timer = setTimeout(() => {
//       navigation.replace("Login");
//     }, 2500);

//     return () => clearTimeout(timer);
//   }, [navigation, fadeAnim, slideAnim]);

//   return (
//     <View style={styles.container}>
//       <Animated.Image
//         source={require("../../assets/Pslogo.png")}
//         style={[
//           styles.logo,
//           {
//             opacity: fadeAnim,
//             transform: [{ translateY: slideAnim }],
//           },
//         ]}
//         resizeMode="contain"
//       />
//       <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
//         Power <Text style={styles.sense}>SENSE</Text>
//       </Animated.Text>
//       <ActivityIndicator
//         size={width * 0.1 > 40 ? "large" : "small"}
//         color="#00e6e6"
//         style={{ marginTop: height * 0.04 }}
//       />
//     </View>
//   );
// };

// export default SplashScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#0f0f0f",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: width * 0.04,
//   },
//   logo: {
//     width: width * 0.4,
//     height: height * 0.4,
//     marginBottom: height * 0.0,
//   },
//   title: {
//     fontSize: width * 0.08 > 32 ? 32 : width * 0.08,
//     fontWeight: "bold",
//     color: "#00e6e6",
//     marginTop: height * 0.0,
//     // letterSpacing: width * 0.005,
//   },
//   sense: {
//     color: "#ffffff",
//   },
// });

// import React, { useEffect, useRef } from "react";
// import {
//   View,
//   Image,
//   StyleSheet,
//   Animated,
//   Easing,
//   Text,
//   ActivityIndicator,
//   Dimensions,
//   StatusBar,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { LinearGradient } from "expo-linear-gradient"; // You'll need to install this

// const { width, height } = Dimensions.get("window");

// const SplashScreen = () => {
//   const navigation = useNavigation();

//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(height * 0.05)).current;
//   const scaleAnim = useRef(new Animated.Value(0.8)).current;
//   const rotateAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // Enhanced animation sequence
//     Animated.sequence([
//       Animated.parallel([
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 1200,
//           useNativeDriver: true,
//         }),
//         Animated.timing(slideAnim, {
//           toValue: 0,
//           duration: 1200,
//           easing: Easing.out(Easing.back(1.2)),
//           useNativeDriver: true,
//         }),
//         Animated.timing(scaleAnim, {
//           toValue: 1,
//           duration: 1200,
//           easing: Easing.out(Easing.back(1.1)),
//           useNativeDriver: true,
//         }),
//       ]),
//       Animated.timing(rotateAnim, {
//         toValue: 1,
//         duration: 800,
//         easing: Easing.out(Easing.quad),
//         useNativeDriver: true,
//       }),
//     ]).start();

//     const timer = setTimeout(() => {
//       navigation.replace("Login");
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [navigation, fadeAnim, slideAnim, scaleAnim, rotateAnim]);

//   const rotate = rotateAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ["0deg", "360deg"],
//   });

//   return (
//     <>
//       <StatusBar barStyle="light-content" backgroundColor="#1a0033" />
//       <LinearGradient
//         colors={["#1a0033", "#2d1b69", "#1a0033"]}
//         style={styles.container}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//       >
//         {/* Background decorative elements */}
//         <View style={styles.backgroundDecor}>
//           <Animated.View
//             style={[styles.decorCircle1, { transform: [{ rotate }] }]}
//           />
//           <Animated.View
//             style={[styles.decorCircle2, { transform: [{ rotate: rotate }] }]}
//           />
//         </View>

//         {/* Main content */}
//         <Animated.View
//           style={[
//             styles.logoContainer,
//             {
//               opacity: fadeAnim,
//               transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
//             },
//           ]}
//         >
//           <View style={styles.logoWrapper}>
//             <Image
//               source={require("../../assets/Pslogo.png")}
//               style={styles.logo}
//               resizeMode="contain"
//             />
//             <View style={styles.logoGlow} />
//           </View>
//         </Animated.View>

//         <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
//           <Text style={styles.title}>
//             Power <Text style={styles.sense}>SENSE</Text>
//           </Text>
//           <Text style={styles.subtitle}>Intelligent Power Management</Text>
//         </Animated.View>

//         <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
//           <ActivityIndicator
//             size="large"
//             color="#00f5ff"
//             style={styles.loader}
//           />
//           <Text style={styles.loadingText}>Loading...</Text>
//         </Animated.View>
//       </LinearGradient>
//     </>
//   );
// };

// export default SplashScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: width * 0.05,
//   },
//   backgroundDecor: {
//     position: "absolute",
//     width: "100%",
//     height: "100%",
//   },
//   decorCircle1: {
//     position: "absolute",
//     width: width * 0.6,
//     height: width * 0.6,
//     borderRadius: width * 0.3,
//     borderWidth: 1,
//     borderColor: "rgba(0, 245, 255, 0.1)",
//     top: height * 0.1,
//     right: -width * 0.2,
//   },
//   decorCircle2: {
//     position: "absolute",
//     width: width * 0.4,
//     height: width * 0.4,
//     borderRadius: width * 0.2,
//     borderWidth: 1,
//     borderColor: "rgba(138, 43, 226, 0.15)",
//     bottom: height * 0.15,
//     left: -width * 0.1,
//   },
//   logoContainer: {
//     alignItems: "center",
//     marginBottom: height * 0.03,
//   },
//   logoWrapper: {
//     position: "relative",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   logo: {
//     width: width * 0.35,
//     height: width * 0.35,
//     tintColor: "#00f5ff", // This will colorize your logo
//   },
//   logoGlow: {
//     position: "absolute",
//     width: width * 0.4,
//     height: width * 0.4,
//     borderRadius: width * 0.2,
//     backgroundColor: "rgba(0, 245, 255, 0.1)",
//     shadowColor: "#00f5ff",
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.8,
//     shadowRadius: 20,
//     elevation: 10,
//   },
//   textContainer: {
//     alignItems: "center",
//     marginBottom: height * 0.05,
//   },
//   title: {
//     fontSize: Math.min(width * 0.09, 36),
//     fontWeight: "800",
//     color: "#00f5ff",
//     textAlign: "center",
//     letterSpacing: 2,
//     textShadowColor: "rgba(0, 245, 255, 0.5)",
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 10,
//   },
//   sense: {
//     color: "#8a2be2",
//     textShadowColor: "rgba(138, 43, 226, 0.5)",
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 10,
//   },
//   subtitle: {
//     fontSize: Math.min(width * 0.04, 16),
//     color: "rgba(255, 255, 255, 0.7)",
//     marginTop: height * 0.01,
//     fontWeight: "300",
//     letterSpacing: 1,
//   },
//   loadingContainer: {
//     alignItems: "center",
//     marginTop: height * 0.02,
//   },
//   loader: {
//     marginBottom: height * 0.02,
//   },
//   loadingText: {
//     color: "rgba(255, 255, 255, 0.6)",
//     fontSize: Math.min(width * 0.035, 14),
//     fontWeight: "300",
//     letterSpacing: 1,
//   },
// });

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
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const SplashScreen = () => {
  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height * 0.05)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Enhanced animation sequence
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, slideAnim, scaleAnim, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#393939" />
      <LinearGradient
        colors={["#2a2a2a", "#393939", "#2a2a2a"]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Background decorative elements */}
        <View style={styles.backgroundDecor}>
          <Animated.View
            style={[styles.decorCircle1, { transform: [{ rotate }] }]}
          />
          <Animated.View
            style={[styles.decorCircle2, { transform: [{ rotate: rotate }] }]}
          />
        </View>

        {/* Main content */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.logoWrapper}>
            <Image
              source={require("../../assets/Pslogo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={styles.logoGlow} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
          <Text style={styles.title}>
            Power <Text style={styles.sense}>SENSE</Text>
          </Text>
          <Text style={styles.subtitle}>Intelligent Power Management</Text>
        </Animated.View>

        <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
          <ActivityIndicator
            size="large"
            color="#00D1D1"
            style={styles.loader}
          />
          <Text style={styles.loadingText}>Loading...</Text>
        </Animated.View>
      </LinearGradient>
    </>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
  },
  backgroundDecor: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  decorCircle1: {
    position: "absolute",
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    borderWidth: 1,
    borderColor: "rgba(0, 209, 209, 0.15)",
    top: height * 0.1,
    right: -width * 0.2,
  },
  decorCircle2: {
    position: "absolute",
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    borderWidth: 1,
    borderColor: "rgba(57, 57, 57, 0.3)",
    bottom: height * 0.15,
    left: -width * 0.1,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  logoWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: width * 0.35,
    height: width * 0.35,
    tintColor: "#00D1D1",
  },
  logoGlow: {
    position: "absolute",
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: "rgba(0, 209, 209, 0.08)",
    shadowColor: "#00D1D1",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 8,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: height * 0.05,
  },
  title: {
    fontSize: Math.min(width * 0.09, 36),
    fontWeight: "800",
    color: "#00D1D1",
    textAlign: "center",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 209, 209, 0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  sense: {
    color: "#ffffff",
    textShadowColor: "rgba(255, 255, 255, 0.2)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: Math.min(width * 0.04, 16),
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: height * 0.01,
    fontWeight: "300",
    letterSpacing: 1,
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: height * 0.02,
  },
  loader: {
    marginBottom: height * 0.02,
  },
  loadingText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: Math.min(width * 0.035, 14),
    fontWeight: "300",
    letterSpacing: 1,
  },
});
