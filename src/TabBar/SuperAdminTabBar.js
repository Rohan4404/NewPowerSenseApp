import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../Screens/SuperAdminScreen";
import AddMachine from "../PopUp/AddMachine";
import RegisterModelPopup from "../PopUp/RegisterModelPopup";
import ShowAllClient from "../Screens/ShowAllClient";
import Icon from "react-native-vector-icons/Ionicons";
import { Text, View, Dimensions, Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const Tab = createBottomTabNavigator();

export default function SuperAdminTabBar() {
  const insets = useSafeAreaInsets();
  //   const bottomPadding = insets.bottom > 0 ? insets.bottom : height * 0.01;
  const backgroundColor = "#2BFFFF1A";

  return (
    <View style={{ flex: 1, backgroundColor }}>
      {Platform.OS === "android" && insets.bottom > 0 && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            height: insets.bottom,
            width: "100%",
            backgroundColor,
            zIndex: 40,
          }}
        />
      )}

      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: "absolute",
            // bottom: bottomPadding,
            paddingTop: height * 0.01,
            left: width * 0.03,
            right: width * 0.03,
            elevation: 0,
            backgroundColor,
            borderTopLeftRadius: width * 0.04,
            borderTopRightRadius: width * 0.04,
            height: height * 0.09,
          },
          tabBarIcon: ({ focused }) => {
            let iconName, label;
            if (route.name === "Home") {
              iconName = "home-outline";
              label = "Home";
            } else if (route.name === "AddMachine") {
              iconName = "add-circle-outline";
              label = "Add Machine";
            } else if (route.name === "RegisterModelPopup") {
              iconName = "log-in-outline";
              label = "Onboarding";
            } else if (route.name === "ShowAllClient") {
              iconName = "people-outline";
              label = "Show Clients";
            }

            return (
              <View style={styles.tabItem}>
                <View
                  style={[
                    styles.iconWrapper,
                    focused && styles.iconWrapperActive,
                  ]}
                >
                  <Icon
                    name={iconName}
                    size={width * 0.069}
                    color={focused ? "#FFFFFF" : "#FFFFFF"}
                  />
                </View>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: width * 0.03,
                    color: focused ? "#00D1D1" : "#FFFFFF",
                    marginTop: height * 0.002,
                    width: width * 0.25,
                    textAlign: "center",
                  }}
                >
                  {label}
                </Text>
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="AddMachine" component={AddMachine} />
        <Tab.Screen name="RegisterModelPopup" component={RegisterModelPopup} />
        <Tab.Screen name="ShowAllClient" component={ShowAllClient} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: (width * 0.12) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapperActive: {
    backgroundColor: "#00D1D1",
  },
});

// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import HomeScreen from "../Screens/SuperAdminScreen";
// import AttendanceScreen from "../PopUp/AddMachine";
// import LeaveScreen from "../PopUp/RegisterModelPopup";
// import ShowAllClient from "../Screens/ShowAllClient";
// import Icon from "react-native-vector-icons/Ionicons";
// import { Text, View, Dimensions, Platform, StyleSheet } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// const { width, height } = Dimensions.get("window");
// const Tab = createBottomTabNavigator();

// export default function Adminscreen() {
//   const insets = useSafeAreaInsets();
//   const TAB_BG = "#274143";
//   const ACTIVE_BG = "#00D1D1";

//   return (
//     <View style={{ flex: 1, backgroundColor: TAB_BG }}>
//       {/* Filler for soft-nav bar background */}
//       {Platform.OS === "android" && insets.bottom > 0 && (
//         <View style={{ height: insets.bottom, backgroundColor: TAB_BG }} />
//       )}

//       <Tab.Navigator
//         screenOptions={({ route }) => ({
//           headerShown: false,
//           tabBarShowLabel: false,
//           tabBarStyle: {
//             height: height * 0.09 + insets.bottom,
//             backgroundColor: TAB_BG,
//             borderTopWidth: 0,
//             elevation: 0,
//           },
//           tabBarIcon: ({ focused }) => {
//             let iconName = "";
//             let label = "";

//             if (route.name === "Home") {
//               iconName = "home-outline";
//               label = "Home";
//             } else if (route.name === "Attendance") {
//               iconName = "add-circle-outline";
//               label = "Add Machine";
//             } else if (route.name === "Leave") {
//               iconName = "log-in-outline";
//               label = "Onboarding";
//             } else if (route.name === "ShowAllClient") {
//               iconName = "people-outline";
//               label = "Show Clients";
//             }

//             return (
//               <View style={styles.tabItem}>
//                 <View
//                   style={[
//                     styles.iconContainer,
//                     focused && { backgroundColor: ACTIVE_BG },
//                   ]}
//                 >
//                   <Icon
//                     name={iconName}
//                     size={width * 0.06}
//                     color={focused ? "#FFFFFF" : "#B5C0C0"}
//                   />
//                 </View>
//                 <Text
//                   style={[
//                     styles.label,
//                     { color: focused ? "#FFFFFF" : "#B5C0C0" },
//                   ]}
//                   numberOfLines={1}
//                 >
//                   {label}
//                 </Text>
//               </View>
//             );
//           },
//         })}
//       >
//         <Tab.Screen name="Home" component={HomeScreen} />
//         <Tab.Screen name="Attendance" component={AttendanceScreen} />
//         <Tab.Screen name="Leave" component={LeaveScreen} />
//         <Tab.Screen name="ShowAllClient" component={ShowAllClient} />
//       </Tab.Navigator>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   tabItem: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   iconContainer: {
//     paddingHorizontal: 18,
//     paddingVertical: 10,
//     borderRadius: 50,
//     backgroundColor: "transparent",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   label: {
//     marginTop: 4,
//     fontSize: width * 0.032,
//     fontWeight: "600",
//     textAlign: "center",
//     width: width * 0.25,
//   },
// });
