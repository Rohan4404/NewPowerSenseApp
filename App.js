import React from "react";
import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar"; // Correct import
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import SplashScreen from "./src/Screens/SplashScreen";
import LoginScreen from "./src/Screens/LoginScreen";
import AdminScreen from "./src/Screens/AdminScreen";
import SuperAdminScreen from "./src/Screens/SuperAdminScreen";
import SingUpScreen from "./src/Screens/SingUpScreen";
import ForgetPasswordScreen from "./src/Screens/ForgetPasswordScreen";
import ResetPasswordScreen from "./src/Screens/ResetPasswordScreen";
import ShowAllClient from "./src/Screens/ShowAllClient";
import SuperAdminTabBar from "./src/TabBar/SuperAdminTabBar";
import AdminTabbar from "./src/TabBar/AdminTabbar";
import MachineDetaild from "./src/Screens/MachineDetaild";
import MachineCurrentScreen from "./src/MachineDataInfo/MachineCurrentScreen";
import MachinePowerScreen from "./src/MachineDataInfo/MachinePowerScreen";
import MachinePeakPowerScreen from "./src/MachineDataInfo/MachinePeakPowerScreen";
import MachineUnitScreen from "./src/MachineDataInfo/MachineUnitScreen";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* ✅ Use StatusBar as a component */}
      {/* <StatusBar style="auto" backgroundColor="#393939" /> */}

      <StatusBar translucent backgroundColor="transparent" style="light" />

      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="SuperAdminDashboard"
          component={SuperAdminScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="SuperAdminTabBar"
          component={SuperAdminTabBar}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AdminTabBar"
          component={AdminTabbar}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AdminDashboard"
          component={AdminScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="SingUp"
          component={SingUpScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ForgetPassword"
          component={ForgetPasswordScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ShowAllClient"
          component={ShowAllClient}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MachineDetailPage"
          component={MachineDetaild}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="currentConsumption"
          component={MachineCurrentScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="powerConsumptions"
          component={MachinePowerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="peakpowerconsumption"
          component={MachinePeakPowerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="unitconsumption"
          component={MachineUnitScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>

      <Toast />
    </NavigationContainer>
  );
}
