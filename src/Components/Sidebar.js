import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");

const Sidebar = ({ visible, onClose, handleHomeClick, handleLogoutClick }) => {
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

  return visible ? (
    <View style={StyleSheet.absoluteFill}>
      {/* Overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      </TouchableWithoutFeedback>

      {/* Sidebar */}
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

          {/* Spacer to push Logout to the bottom */}
          <View style={styles.bottomSpacer} />

          <TouchableOpacity style={styles.navItem} onPress={handleLogoutClick}>
            <MaterialIcons name="logout" size={22} color="#00E6E6" />
            <Text style={styles.navText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>
  ) : null;
};

export default Sidebar;

const styles = StyleSheet.create({
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
    backgroundColor: "#393939", // Match the background color from NavbarPage sidebar
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
    padding: 5, // Slight padding for better touch area
    borderRadius: 4,
  },
  navText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 10,
  },
  bottomSpacer: {
    flex: 1, // Pushes the logout button to the bottom
  },
});
