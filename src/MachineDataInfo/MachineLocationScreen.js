// import React from "react";
// import { View, StyleSheet, Dimensions } from "react-native";
// import MapView, { Marker } from "react-native-maps";

// const Machine1Location = ({ lat, lon }) => {
//   const machineLocation = {
//     latitude: lat,
//     longitude: lon,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   };

//   return (
//     <View style={styles.container}>
//       <MapView style={styles.map} initialRegion={machineLocation}>
//         <Marker coordinate={machineLocation} title="Machine is here!" />
//       </MapView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     height: 310,
//     width: Dimensions.get("window").width - 20,
//     borderRadius: 8,
//     overflow: "hidden",
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
// });

// export default Machine1Location;

import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
const { width, height } = Dimensions.get("window");
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"; // Keep PROVIDER_GOOGLE if using Google Maps

const Machine1Location = ({ lat, lon }) => {
  console.log(lat, lon, "lat lom is ");
  const machineLocation = {
    latitude: lat,
    longitude: lon,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // Remove if not using Google Maps
        style={styles.map}
        initialRegion={machineLocation}
      >
        <Marker coordinate={machineLocation} title="Machine is here!" />
      </MapView>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     height: 310,
//     width: Dimensions.get("window").width - 20,
//     justifyContent: "flex-end",
//     alignItems: "center",
//     borderRadius: 8,
//     overflow: "hidden",
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
// });

const styles = StyleSheet.create({
  container: {
    height: height * 0.309, // roughly 35% of screen height
    width: width - 29, // keeping your original intent but dynamic
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: width * 0.02, // responsive border radius
    overflow: "hidden",
  },
  map: {
    ...StyleSheet.absoluteFillObject, // keeps map full-screen inside container
  },
});

export default Machine1Location;
