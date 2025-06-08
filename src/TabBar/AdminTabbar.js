// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import HomeScreen from "../Screens/AdminScreenDashbord";
// import AddMachine from "../PopUp/AddMachineForAdmin";
// import RegisterModelPopup from "../PopUp/RegisterModelPopup";
// import ShowAllClient from "../Screens/ShowAllClient";
// import Icon from "react-native-vector-icons/Ionicons";
// import { Text, View, Dimensions, Platform, StyleSheet } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// const { width, height } = Dimensions.get("window");
// const Tab = createBottomTabNavigator();

// export default function SuperAdminTabBar() {
//   const insets = useSafeAreaInsets();
//   const backgroundColor = "#1a332f"; // semi-transparent

//   return (
//     <View style={{ flex: 1, backgroundColor: "#2BFFFF" }}>
//       {" "}
//       {/* Solid base */}
//       {/* Solid background filler for bottom inset area on Android */}
//       {Platform.OS === "android" && insets.bottom > 0 && (
//         <View
//           style={{
//             position: "absolute",
//             bottom: 0,
//             height: insets.bottom,
//             width: "100%",
//             backgroundColor: "#2BFFFF",
//             zIndex: 100,
//           }}
//         />
//       )}
//       <Tab.Navigator
//         screenOptions={({ route }) => ({
//           headerShown: false,
//           tabBarShowLabel: false,
//           tabBarStyle: {
//             position: "absolute",
//             paddingTop: height * 0.01,
//             paddingBottom: insets.bottom, // ✅ dynamic padding based on device
//             left: width * 0.03,
//             right: width * 0.03,
//             elevation: 0,
//             backgroundColor: backgroundColor,
//             borderTopLeftRadius: width * 0.04,
//             borderTopRightRadius: width * 0.04,
//             height: height * 0.09 + insets.bottom, // ✅ dynamic total height
//           },

//           tabBarIcon: ({ focused }) => {
//             let iconName, label;
//             if (route.name === "Home") {
//               iconName = "home-outline";
//               label = "Home";
//             } else if (route.name === "AddMachine") {
//               iconName = "add-circle-outline";
//               label = "Add Machine";
//             } else if (route.name === "RegisterModelPopup") {
//               iconName = "log-in-outline";
//               label = "Onboarding";
//             }
//             //  else if (route.name === "ShowAllClient") {
//             //   iconName = "people-outline";
//             //   label = "Show Clients";
//             // }

//             return (
//               <View style={styles.tabItem}>
//                 <View
//                   style={[
//                     styles.iconWrapper,
//                     focused && styles.iconWrapperActive,
//                   ]}
//                 >
//                   <Icon name={iconName} size={width * 0.069} color="#FFFFFF" />
//                 </View>
//                 <Text
//                   numberOfLines={1}
//                   style={{
//                     fontSize: width * 0.03,
//                     color: focused ? "#00D1D1" : "#FFFFFF",
//                     marginTop: height * 0.002,
//                     width: width * 0.25,
//                     textAlign: "center",
//                   }}
//                 >
//                   {label}
//                 </Text>
//               </View>
//             );
//           },
//         })}
//       >
//         <Tab.Screen name="Home" component={HomeScreen} />
//         <Tab.Screen name="AddMachine" component={AddMachine} />
//         {/* <Tab.Screen name="RegisterModelPopup" component={RegisterModelPopup} /> */}
//         {/* <Tab.Screen name="ShowAllClient" component={ShowAllClient} /> */}
//       </Tab.Navigator>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   tabItem: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   iconWrapper: {
//     width: width * 0.12,
//     height: width * 0.12,
//     borderRadius: (width * 0.12) / 2,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   iconWrapperActive: {
//     backgroundColor: "#00D1D1",
//   },
// });

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../Screens/AdminScreenDashbord";
import AddMachine from "../PopUp/AddMachineForAdmin";
import RegisterModelPopup from "../PopUp/RegisterModelPopup";
import ShowAllClient from "../Screens/ShowAllClient";
import Icon from "react-native-vector-icons/Ionicons";
import { Text, View, Dimensions, Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const Tab = createBottomTabNavigator();

export default function SuperAdminTabBar() {
  const insets = useSafeAreaInsets();
  const backgroundColor = "#1a332f";

  return (
    <View style={{ flex: 1, backgroundColor: "#2BFFFF" }}>
      {Platform.OS === "android" && insets.bottom > 0 && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            height: insets.bottom,
            width: "100%",
            backgroundColor: "#284a45",
            zIndex: 100,
          }}
        />
      )}

      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: "absolute",
            paddingTop: height * 0.01,
            paddingBottom: insets.bottom / 2, // 🔽 Reduced bottom padding
            left: width * 0.03,
            right: width * 0.03,
            elevation: 0,
            backgroundColor: backgroundColor,
            borderTopLeftRadius: width * 0.04,
            borderTopRightRadius: width * 0.04,
            height: height * 0.075 + insets.bottom,
            borderTopWidth: 1,
            borderTopColor: "#FFFFFF",
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
            }

            return (
              <View style={styles.tabItem}>
                <View
                  style={[
                    styles.iconWrapper,
                    focused && styles.iconWrapperActive,
                  ]}
                >
                  <Icon name={iconName} size={width * 0.069} color="#FFFFFF" />
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
        {/* <Tab.Screen name="RegisterModelPopup" component={RegisterModelPopup} /> */}
        {/* <Tab.Screen name="ShowAllClient" component={ShowAllClient} /> */}
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
