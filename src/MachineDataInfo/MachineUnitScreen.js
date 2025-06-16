// import { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   Image,
//   ScrollView,
//   StatusBar,
//   Platform,
//   ActivityIndicator,
// } from "react-native";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import axios from "axios";
// import unitImg from "../../assets/chartImages/3515462.jpg";
// import Icon from "react-native-vector-icons/FontAwesome";

// const MachineUnitScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { endPoint } = route.params || {};

//   const [data, setData] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [hourlyData, setHourlyData] = useState([]);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [screenWidth, setScreenWidth] = useState(
//     Dimensions.get("window").width
//   );
//   const [screenHeight, setScreenHeight] = useState(
//     Dimensions.get("window").height
//   );

//   const handleBackPress = () => {
//     navigation.goBack();
//   };

//   useEffect(() => {
//     const handleDimensionsChange = ({ window }) => {
//       setScreenWidth(window.width);
//       setScreenHeight(window.height);
//     };

//     const subscription = Dimensions.addEventListener(
//       "change",
//       handleDimensionsChange
//     );
//     return () => subscription.remove();
//   }, []);

//   // Enhanced responsive calculations
//   const isMobile = screenWidth < 768;
//   const isTablet = screenWidth >= 768 && screenWidth < 1024;
//   const isDesktop = screenWidth >= 1024;

//   // Responsive dimensions
//   const responsiveDimensions = {
//     // Container padding
//     containerPadding: screenWidth * 0.025,

//     // Font sizes
//     titleFontSize: screenWidth * (isMobile ? 0.06 : isTablet ? 0.05 : 0.045),
//     headerFontSize: screenWidth * (isMobile ? 0.04 : isTablet ? 0.035 : 0.032),
//     buttonFontSize: screenWidth * (isMobile ? 0.03 : isTablet ? 0.028 : 0.025),
//     tableTitleFontSize:
//       screenWidth * (isMobile ? 0.045 : isTablet ? 0.04 : 0.035),
//     tableHeaderFontSize:
//       screenWidth * (isMobile ? 0.028 : isTablet ? 0.032 : 0.035),
//     tableCellFontSize:
//       screenWidth * (isMobile ? 0.025 : isTablet ? 0.03 : 0.032),
//     loadingFontSize:
//       screenWidth * (isMobile ? 0.035 : isTablet ? 0.032 : 0.028),

//     // Spacing and margins
//     sectionMarginTop:
//       screenHeight * (isMobile ? 0.01 : isTablet ? 0.025 : 0.02),
//     sectionMarginBottom:
//       screenHeight * (isMobile ? 0.015 : isTablet ? 0.02 : 0.025),
//     headerPaddingVertical:
//       screenHeight * (isMobile ? 0.008 : isTablet ? 0.01 : 0.012),
//     headerPaddingHorizontal:
//       screenWidth * (isMobile ? 0.02 : isTablet ? 0.025 : 0.03),
//     buttonPaddingVertical:
//       screenHeight * (isMobile ? 0.006 : isTablet ? 0.008 : 0.01),
//     buttonPaddingHorizontal:
//       screenWidth * (isMobile ? 0.02 : isTablet ? 0.025 : 0.03),
//     tableCellPadding:
//       screenWidth * (isMobile ? 0.015 : isTablet ? 0.02 : 0.025),
//     tableHeaderPadding:
//       screenWidth * (isMobile ? 0.02 : isTablet ? 0.025 : 0.03),

//     // Border radius
//     borderRadius: screenWidth * (isMobile ? 0.02 : isTablet ? 0.018 : 0.015),
//     buttonBorderRadius:
//       screenWidth * (isMobile ? 0.012 : isTablet ? 0.01 : 0.008),

//     // Image height
//     imageHeight: screenHeight * (isMobile ? 0.3 : isTablet ? 0.32 : 0.35),

//     // Back button positioning
//     backButtonTop: screenHeight * (isMobile ? 0.015 : isTablet ? 0.018 : 0.02),
//     backButtonLeft: screenWidth * (isMobile ? 0.025 : isTablet ? 0.03 : 0.035),
//     backIconSize: screenWidth * (isMobile ? 0.06 : isTablet ? 0.055 : 0.05),

//     // Table dimensions - increased for better scrolling with large data
//     tableMaxHeight: screenHeight * (isMobile ? 0.45 : isTablet ? 0.5 : 0.55),
//     tableHeaderHeight:
//       screenHeight * (isMobile ? 0.06 : isTablet ? 0.065 : 0.07),
//     tableCellHeight: screenHeight * (isMobile ? 0.05 : isTablet ? 0.055 : 0.06),
//   };

//   const fetchData = async () => {
//     if (!endPoint) return;

//     try {
//       setLoading(true);
//       const response = await axios.get(`${endPoint}`);
//       const apiData = response.data;

//       console.log(endPoint, "endPoint of table data");

//       if (apiData?.data && Array.isArray(apiData.data)) {
//         setData(apiData.data);

//         if (apiData.data.length > 0) {
//           const latestEntry = apiData.data.reduce((latest, entry) => {
//             return new Date(entry.timestamp) > new Date(latest.timestamp)
//               ? entry
//               : latest;
//           }, apiData.data[0]);

//           setSelectedDate(new Date(latestEntry.timestamp));
//         }
//       } else if (Array.isArray(apiData)) {
//         setData(apiData);

//         if (apiData.length > 0) {
//           const latestEntry = apiData.reduce((latest, entry) => {
//             return new Date(entry.timestamp) > new Date(latest.timestamp)
//               ? entry
//               : latest;
//           }, apiData[0]);

//           setSelectedDate(new Date(latestEntry.timestamp));
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [endPoint]);

//   useEffect(() => {
//     if (data.length === 0) return;

//     const selectedISO = selectedDate.toISOString().split("T")[0];
//     const filteredData = data.filter(
//       (entry) => entry.timestamp.split(" ")[0] === selectedISO
//     );

//     const hourlyAggregation = {};

//     filteredData.forEach((entry) => {
//       const dateObj = new Date(entry.timestamp);
//       const hourKey = dateObj.getHours();
//       const power = (entry.current * 220) / 1000;

//       if (!hourlyAggregation[hourKey]) {
//         hourlyAggregation[hourKey] = {
//           totalPower: 0,
//           count: 0,
//           timestamps: [],
//         };
//       }

//       hourlyAggregation[hourKey].totalPower += power;
//       hourlyAggregation[hourKey].count++;
//       hourlyAggregation[hourKey].timestamps.push(entry.timestamp);
//     });

//     const formattedHourlyData = Object.keys(hourlyAggregation).map((hour) => {
//       const timestamps = hourlyAggregation[hour].timestamps;
//       const fromTime = timestamps[0]?.split(" ")[1] || "00:00:00";
//       const toTime =
//         timestamps[timestamps.length - 1]?.split(" ")[1] || "00:00:00";

//       const fromDate = new Date(`${selectedISO}T${fromTime}`);
//       const toDate = new Date(`${selectedISO}T${toTime}`);
//       const durationMinutes = Math.abs(
//         Math.round((toDate - fromDate) / (1000 * 60))
//       );

//       return {
//         time: `${toTime} - ${fromTime}`,
//         totalPower: hourlyAggregation[hour].totalPower.toFixed(2),
//         unit: (
//           hourlyAggregation[hour].totalPower / hourlyAggregation[hour].count
//         ).toFixed(2),
//         duration: `${durationMinutes} mins`,
//       };
//     });

//     setHourlyData(formattedHourlyData);
//   }, [data, selectedDate]);

//   const handleConfirm = (date) => {
//     setSelectedDate(date);
//     setShowDatePicker(false);
//   };

//   const formatDate = (date) => date.toISOString().split("T")[0];

//   return (
//     <View style={styles.mainContainer}>
//       <StatusBar translucent backgroundColor="transparent" style="light" />

//       <ScrollView
//         contentContainerStyle={[
//           styles.container,
//           {
//             padding: responsiveDimensions.containerPadding,
//             marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
//           },
//         ]}
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={true}
//       >
//         <TouchableOpacity
//           style={[
//             styles.backButton,
//             {
//               top: responsiveDimensions.backButtonTop,
//               left: responsiveDimensions.backButtonLeft,
//             },
//           ]}
//           onPress={handleBackPress}
//         >
//           <Icon
//             name="arrow-left"
//             style={[
//               styles.backIcon,
//               {
//                 fontSize: responsiveDimensions.backIconSize,
//               },
//             ]}
//           />
//         </TouchableOpacity>

//         <Text
//           style={[
//             styles.currentText,
//             {
//               fontSize: responsiveDimensions.titleFontSize,
//               marginBottom: responsiveDimensions.sectionMarginBottom,
//               marginTop: responsiveDimensions.sectionMarginTop,
//             },
//           ]}
//         >
//           Unit Consumption
//         </Text>

//         <View style={styles.imageContainer}>
//           <Image
//             source={unitImg}
//             style={[
//               styles.image,
//               {
//                 height: responsiveDimensions.imageHeight,
//               },
//             ]}
//             resizeMode="cover"
//           />
//         </View>

//         <View
//           style={[
//             styles.header,
//             {
//               paddingVertical: responsiveDimensions.headerPaddingVertical,
//               paddingHorizontal: responsiveDimensions.headerPaddingHorizontal,
//               marginTop: responsiveDimensions.sectionMarginTop,
//             },
//           ]}
//         >
//           <Text
//             style={[
//               styles.title,
//               {
//                 fontSize: responsiveDimensions.headerFontSize,
//               },
//             ]}
//           >
//             Selected Date: {formatDate(selectedDate)}
//           </Text>
//           <TouchableOpacity
//             style={[
//               styles.dateButton,
//               {
//                 paddingVertical: responsiveDimensions.buttonPaddingVertical,
//                 paddingHorizontal: responsiveDimensions.buttonPaddingHorizontal,
//                 borderRadius: responsiveDimensions.buttonBorderRadius,
//               },
//             ]}
//             onPress={() => setShowDatePicker(true)}
//           >
//             <Text
//               style={[
//                 styles.dateButtonText,
//                 {
//                   fontSize: responsiveDimensions.buttonFontSize,
//                 },
//               ]}
//             >
//               Change Date
//             </Text>
//           </TouchableOpacity>
//         </View>

//         <DateTimePickerModal
//           isVisible={showDatePicker}
//           mode="date"
//           onConfirm={handleConfirm}
//           onCancel={() => setShowDatePicker(false)}
//           date={selectedDate}
//         />

//         <View
//           style={[
//             styles.tableContainer,
//             {
//               marginTop: responsiveDimensions.sectionMarginTop,
//               borderRadius: responsiveDimensions.borderRadius,
//               height: responsiveDimensions.tableMaxHeight,
//             },
//           ]}
//         >
//           {loading ? (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color="#92F1F1" />
//               <Text
//                 style={[
//                   styles.loadingText,
//                   {
//                     fontSize: responsiveDimensions.loadingFontSize,
//                     marginTop: responsiveDimensions.sectionMarginBottom,
//                   },
//                 ]}
//               >
//                 Loading data...
//               </Text>
//             </View>
//           ) : (
//             <View style={styles.tableWrapper}>
//               {/* Fixed Header */}
//               <View
//                 style={[
//                   styles.headerRow,
//                   {
//                     minHeight: responsiveDimensions.tableHeaderHeight,
//                   },
//                 ]}
//               >
//                 <Text
//                   style={[
//                     styles.headerCell,
//                     {
//                       fontSize: responsiveDimensions.tableHeaderFontSize,
//                       padding: responsiveDimensions.tableHeaderPadding,
//                     },
//                   ]}
//                 >
//                   Time Range(From -To)
//                 </Text>
//                 <Text
//                   style={[
//                     styles.headerCell,
//                     {
//                       fontSize: responsiveDimensions.tableHeaderFontSize,
//                       padding: responsiveDimensions.tableHeaderPadding,
//                     },
//                   ]}
//                 >
//                   Duration
//                 </Text>
//                 <Text
//                   style={[
//                     styles.headerCell,
//                     {
//                       fontSize: responsiveDimensions.tableHeaderFontSize,
//                       padding: responsiveDimensions.tableHeaderPadding,
//                     },
//                   ]}
//                 >
//                   Total Power (kW)
//                 </Text>
//                 <Text
//                   style={[
//                     styles.headerCell,
//                     {
//                       fontSize: responsiveDimensions.tableHeaderFontSize,
//                       padding: responsiveDimensions.tableHeaderPadding,
//                     },
//                   ]}
//                 >
//                   Units
//                 </Text>
//               </View>

//               {/* Scrollable Body */}
//               {hourlyData.length > 0 ? (
//                 <ScrollView
//                   style={[
//                     styles.tableBody,
//                     {
//                       height:
//                         responsiveDimensions.tableMaxHeight -
//                         responsiveDimensions.tableHeaderHeight,
//                     },
//                   ]}
//                   showsVerticalScrollIndicator={true}
//                   nestedScrollEnabled={true}
//                   contentContainerStyle={styles.tableBodyContent}
//                 >
//                   {hourlyData.map((item, index) => (
//                     <View
//                       key={index}
//                       style={[
//                         styles.row,
//                         {
//                           minHeight: responsiveDimensions.tableCellHeight,
//                         },
//                       ]}
//                     >
//                       <Text
//                         style={[
//                           styles.cell,
//                           {
//                             fontSize: responsiveDimensions.tableCellFontSize,
//                             padding: responsiveDimensions.tableCellPadding,
//                           },
//                         ]}
//                       >
//                         {item.time}
//                       </Text>
//                       <Text
//                         style={[
//                           styles.cell,
//                           {
//                             fontSize: responsiveDimensions.tableCellFontSize,
//                             padding: responsiveDimensions.tableCellPadding,
//                           },
//                         ]}
//                       >
//                         {item.duration}
//                       </Text>
//                       <Text
//                         style={[
//                           styles.cell,
//                           {
//                             fontSize: responsiveDimensions.tableCellFontSize,
//                             padding: responsiveDimensions.tableCellPadding,
//                           },
//                         ]}
//                       >
//                         {item.totalPower}
//                       </Text>
//                       <Text
//                         style={[
//                           styles.cell,
//                           {
//                             fontSize: responsiveDimensions.tableCellFontSize,
//                             padding: responsiveDimensions.tableCellPadding,
//                           },
//                         ]}
//                       >
//                         {item.unit}
//                       </Text>
//                     </View>
//                   ))}
//                 </ScrollView>
//               ) : (
//                 <View
//                   style={[
//                     styles.noDataContainer,
//                     {
//                       padding: responsiveDimensions.containerPadding * 2,
//                     },
//                   ]}
//                 >
//                   <Text
//                     style={[
//                       styles.noDataText,
//                       {
//                         fontSize: responsiveDimensions.tableCellFontSize,
//                       },
//                     ]}
//                   >
//                     No data available for selected date
//                   </Text>
//                 </View>
//               )}
//             </View>
//           )}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     backgroundColor: "#111",
//   },
//   container: {
//     alignItems: "stretch",
//     width: "100%",
//     minHeight: "100%",
//   },
//   scrollView: {
//     backgroundColor: "#111",
//     flex: 1,
//   },
//   currentText: {
//     fontWeight: "bold",
//     color: "#92F1F1",
//     textAlign: "center",
//     fontFamily: "Inter, sans-serif",
//   },
//   imageContainer: {
//     width: "100%",
//     alignItems: "stretch",
//     justifyContent: "center",
//   },
//   image: {
//     width: "100%",
//     minWidth: "100%",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   title: {
//     color: "#92F1F1",
//     fontWeight: "bold",
//     fontFamily: "Inter, sans-serif",
//     flex: 1,
//   },
//   dateButton: {
//     backgroundColor: "#92F1F1",
//   },
//   dateButtonText: {
//     color: "#111",
//     fontFamily: "Inter, sans-serif",
//     fontWeight: "600",
//   },
//   tableContainer: {
//     borderWidth: 1,
//     borderColor: "#92F1F1",
//     overflow: "hidden",
//     backgroundColor: "#222",
//   },
//   tableWrapper: {
//     flex: 1,
//     flexDirection: "column",
//   },
//   loadingContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: Dimensions.get("window").height * 0.1,
//   },
//   loadingText: {
//     color: "#92F1F1",
//     fontFamily: "Inter, sans-serif",
//     textAlign: "center",
//   },
//   headerRow: {
//     flexDirection: "row",
//     backgroundColor: "#333",
//     borderBottomWidth: 2,
//     borderBottomColor: "#92F1F1",
//   },
//   headerCell: {
//     flex: 1,
//     borderRightWidth: 1,
//     borderRightColor: "#92F1F1",
//     textAlign: "center",
//     color: "#92F1F1",
//     fontWeight: "bold",
//     fontFamily: "Inter, sans-serif",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   tableBody: {
//     backgroundColor: "#222",
//     flexGrow: 1,
//   },
//   tableBodyContent: {
//     flexGrow: 1,
//   },
//   row: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#92F1F1",
//     backgroundColor: "#222",
//   },
//   cell: {
//     flex: 1,
//     borderRightWidth: 1,
//     borderRightColor: "#92F1F1",
//     textAlign: "center",
//     color: "#D7D7D7",
//     fontFamily: "Inter, sans-serif",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   noDataContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#222",
//     borderTopWidth: 0,
//     flex: 1,
//   },
//   noDataText: {
//     color: "#D7D7D7",
//     textAlign: "center",
//     fontFamily: "Inter, sans-serif",
//   },
//   backButton: {
//     position: "absolute",
//     zIndex: 1,
//   },
//   backIcon: {
//     tintColor: "#92F1F1",
//     color: "#92F1F1",
//   },
// });

// export default MachineUnitScreen;

"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import unitImg from "../../assets/chartImages/3515462.jpg";
import Icon from "react-native-vector-icons/FontAwesome";

const MachineUnitScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { endPoint } = route.params || {};

  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const handleDimensionsChange = ({ window }) => {
      setScreenWidth(window.width);
      setScreenHeight(window.height);
    };

    const subscription = Dimensions.addEventListener(
      "change",
      handleDimensionsChange
    );
    return () => subscription.remove();
  }, []);

  // Enhanced responsive calculations
  const isMobile = screenWidth <= 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;
  const isDesktop = screenWidth >= 1024;

  // Responsive dimensions
  const responsiveDimensions = {
    // Container padding
    containerPadding: screenWidth * 0.025,

    // Font sizes
    titleFontSize: screenWidth * (isMobile ? 0.06 : isTablet ? 0.05 : 0.045),
    headerFontSize: screenWidth * (isMobile ? 0.04 : isTablet ? 0.035 : 0.032),
    buttonFontSize: screenWidth * (isMobile ? 0.03 : isTablet ? 0.028 : 0.025),
    tableTitleFontSize:
      screenWidth * (isMobile ? 0.045 : isTablet ? 0.04 : 0.035),
    tableHeaderFontSize:
      screenWidth * (isMobile ? 0.028 : isTablet ? 0.032 : 0.035),
    tableCellFontSize:
      screenWidth * (isMobile ? 0.025 : isTablet ? 0.03 : 0.032),
    loadingFontSize:
      screenWidth * (isMobile ? 0.035 : isTablet ? 0.032 : 0.028),

    // Spacing and margins
    sectionMarginTop:
      screenHeight * (isMobile ? 0.01 : isTablet ? 0.025 : 0.02),
    sectionMarginBottom:
      screenHeight * (isMobile ? 0.015 : isTablet ? 0.02 : 0.025),
    headerPaddingVertical:
      screenHeight * (isMobile ? 0.008 : isTablet ? 0.01 : 0.012),
    headerPaddingHorizontal:
      screenWidth * (isMobile ? 0.02 : isTablet ? 0.025 : 0.03),
    buttonPaddingVertical:
      screenHeight * (isMobile ? 0.006 : isTablet ? 0.008 : 0.01),
    buttonPaddingHorizontal:
      screenWidth * (isMobile ? 0.02 : isTablet ? 0.025 : 0.03),
    tableCellPadding:
      screenWidth * (isMobile ? 0.015 : isTablet ? 0.02 : 0.025),
    tableHeaderPadding:
      screenWidth * (isMobile ? 0.02 : isTablet ? 0.025 : 0.03),

    // Border radius
    borderRadius: screenWidth * (isMobile ? 0.02 : isTablet ? 0.018 : 0.015),
    buttonBorderRadius:
      screenWidth * (isMobile ? 0.012 : isTablet ? 0.01 : 0.008),

    // Image height
    imageHeight: screenHeight * (isMobile ? 0.3 : isTablet ? 0.32 : 0.35),

    // Back button positioning
    backButtonTop: screenHeight * (isMobile ? 0.015 : isTablet ? 0.018 : 0.02),
    backButtonLeft: screenWidth * (isMobile ? 0.025 : isTablet ? 0.03 : 0.035),
    backIconSize: screenWidth * (isMobile ? 0.06 : isTablet ? 0.055 : 0.05),

    // Table dimensions - increased for better scrolling with large data
    tableMaxHeight: screenHeight * (isMobile ? 0.45 : isTablet ? 0.5 : 0.55),
    tableHeaderHeight:
      screenHeight * (isMobile ? 0.06 : isTablet ? 0.065 : 0.07),
    tableCellHeight: screenHeight * (isMobile ? 0.05 : isTablet ? 0.055 : 0.06),
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!endPoint) {
        setError("No API endpoint provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(endPoint);
        const sensorData = response.data;

        if (
          sensorData?.data &&
          Array.isArray(sensorData.data) &&
          sensorData.data.length > 0
        ) {
          const timestamps = sensorData.data.map(
            (entry) => new Date(entry.timestamp)
          );
          const latestDate = new Date(Math.max(...timestamps));

          if (!selectedDate) {
            setSelectedDate(latestDate);
          }

          setData(sensorData.data);
          processData(sensorData.data, selectedDate || latestDate);
          setError(null);
        } else {
          setError("Integrate the API with your hardware.");
          setHourlyData([]);
        }
      } catch (err) {
        setError("There is an error in the API");
        setHourlyData([]);
        console.error("Error fetching sensor data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [endPoint, selectedDate]);

  const processData = (sensorData, date) => {
    try {
      const selectedDateStr = date.toISOString().split("T")[0]; // e.g., "2025-04-18"
      const filteredData = sensorData.filter(
        (entry) => entry.timestamp.split(" ")[0] === selectedDateStr
      );

      if (filteredData.length === 0) {
        setHourlyData([]);
        return;
      }

      const hourlyAggregation = {};
      filteredData.forEach((entry) => {
        const entryDate = new Date(entry.timestamp); // Use timestamp directly (e.g., "2025-04-18 14:25:39")
        const hourKey = entryDate.getHours();
        const power = (entry.current * 220) / 1000; // Calculate power in kW

        if (!hourlyAggregation[hourKey]) {
          hourlyAggregation[hourKey] = {
            totalPower: 0,
            count: 0,
            timestamps: [],
          };
        }

        hourlyAggregation[hourKey].totalPower += power;
        hourlyAggregation[hourKey].count++;
        hourlyAggregation[hourKey].timestamps.push(entry.timestamp);
      });

      const formattedHourlyData = Object.entries(hourlyAggregation).map(
        ([hour, data]) => {
          data.timestamps.sort((a, b) => new Date(a) - new Date(b)); // Sort timestamps chronologically

          const fromTime = data.timestamps[0].split(" ")[1]; // e.g., "14:25:39"
          const toTime =
            data.timestamps[data.timestamps.length - 1].split(" ")[1]; // e.g., "14:59:59"

          const parseTime = (timeStr) => {
            const [h, m, s] = timeStr.split(":").map(Number);
            return h * 60 + m + s / 60;
          };

          const duration = Math.abs(
            parseTime(toTime) - parseTime(fromTime)
          ).toFixed(2);

          return {
            time: `${fromTime} - ${toTime}`, // e.g., "14:25:39 - 14:59:59"
            totalPower: data.totalPower.toFixed(2),
            unit: (data.totalPower / data.count).toFixed(2),
            duration,
          };
        }
      );

      setHourlyData(formattedHourlyData);
    } catch (err) {
      setError("Failed to process data");
      setHourlyData([]);
    }
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const formatDate = (date) => date.toISOString().split("T")[0];

  return (
    <View style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" style="light" />

      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            padding: responsiveDimensions.containerPadding,
            marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          },
        ]}
        style={styles.scrollView}
        showsVerticalScrollIndicator={true}
      >
        <TouchableOpacity
          style={[
            styles.backButton,
            {
              top: responsiveDimensions.backButtonTop,
              left: responsiveDimensions.backButtonLeft,
            },
          ]}
          onPress={handleBackPress}
        >
          <Icon
            name="arrow-left"
            style={[
              styles.backIcon,
              {
                fontSize: responsiveDimensions.backIconSize,
              },
            ]}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.currentText,
            {
              fontSize: responsiveDimensions.titleFontSize,
              marginBottom: responsiveDimensions.sectionMarginBottom,
              marginTop: responsiveDimensions.sectionMarginTop,
            },
          ]}
        >
          Unit Consumption
        </Text>

        <View style={styles.imageContainer}>
          <Image
            source={unitImg}
            style={[
              styles.image,
              {
                height: responsiveDimensions.imageHeight,
              },
            ]}
            resizeMode="cover"
          />
        </View>

        <View
          style={[
            styles.header,
            {
              paddingVertical: responsiveDimensions.headerPaddingVertical,
              paddingHorizontal: responsiveDimensions.headerPaddingHorizontal,
              marginTop: responsiveDimensions.sectionMarginTop,
            },
          ]}
        >
          <Text
            style={[
              styles.title,
              {
                fontSize: responsiveDimensions.headerFontSize,
              },
            ]}
          >
            Selected Date:{" "}
            {selectedDate ? formatDate(selectedDate) : "Loading..."}
          </Text>
          <TouchableOpacity
            style={[
              styles.dateButton,
              {
                paddingVertical: responsiveDimensions.buttonPaddingVertical,
                paddingHorizontal: responsiveDimensions.buttonPaddingHorizontal,
                borderRadius: responsiveDimensions.buttonBorderRadius,
              },
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text
              style={[
                styles.dateButtonText,
                {
                  fontSize: responsiveDimensions.buttonFontSize,
                },
              ]}
            >
              Change Date
            </Text>
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={() => setShowDatePicker(false)}
          date={selectedDate || new Date()}
        />

        <View
          style={[
            styles.tableContainer,
            {
              marginTop: responsiveDimensions.sectionMarginTop,
              borderRadius: responsiveDimensions.borderRadius,
              height: responsiveDimensions.tableMaxHeight,
            },
          ]}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#92F1F1" />
              <Text
                style={[
                  styles.loadingText,
                  {
                    fontSize: responsiveDimensions.loadingFontSize,
                    marginTop: responsiveDimensions.sectionMarginBottom,
                  },
                ]}
              >
                Loading data...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text
                style={[
                  styles.errorText,
                  {
                    fontSize: responsiveDimensions.tableCellFontSize,
                    padding: responsiveDimensions.containerPadding * 2,
                  },
                ]}
              >
                {error}
              </Text>
            </View>
          ) : (
            <View style={styles.tableWrapper}>
              {/* Fixed Header */}
              <View
                style={[
                  styles.headerRow,
                  {
                    minHeight: responsiveDimensions.tableHeaderHeight,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.headerCell,
                    {
                      fontSize: responsiveDimensions.tableHeaderFontSize,
                      padding: responsiveDimensions.tableHeaderPadding,
                    },
                  ]}
                >
                  Time (From - To)
                </Text>
                <Text
                  style={[
                    styles.headerCell,
                    {
                      fontSize: responsiveDimensions.tableHeaderFontSize,
                      padding: responsiveDimensions.tableHeaderPadding,
                    },
                  ]}
                >
                  Duration
                </Text>
                <Text
                  style={[
                    styles.headerCell,
                    {
                      fontSize: responsiveDimensions.tableHeaderFontSize,
                      padding: responsiveDimensions.tableHeaderPadding,
                    },
                  ]}
                >
                  Total Power (kW)
                </Text>
                <Text
                  style={[
                    styles.headerCell,
                    {
                      fontSize: responsiveDimensions.tableHeaderFontSize,
                      padding: responsiveDimensions.tableHeaderPadding,
                    },
                  ]}
                >
                  Units
                </Text>
              </View>

              {/* Scrollable Body */}
              {hourlyData.length > 0 ? (
                <ScrollView
                  style={[
                    styles.tableBody,
                    {
                      height:
                        responsiveDimensions.tableMaxHeight -
                        responsiveDimensions.tableHeaderHeight,
                    },
                  ]}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                  contentContainerStyle={styles.tableBodyContent}
                >
                  {hourlyData.map((item, index) => (
                    <View
                      key={index}
                      style={[
                        styles.row,
                        {
                          minHeight: responsiveDimensions.tableCellHeight,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.cell,
                          {
                            fontSize: responsiveDimensions.tableCellFontSize,
                            padding: responsiveDimensions.tableCellPadding,
                          },
                        ]}
                      >
                        {item.time}
                      </Text>
                      <Text
                        style={[
                          styles.cell,
                          {
                            fontSize: responsiveDimensions.tableCellFontSize,
                            padding: responsiveDimensions.tableCellPadding,
                          },
                        ]}
                      >
                        {item.duration} mins
                      </Text>
                      <Text
                        style={[
                          styles.cell,
                          {
                            fontSize: responsiveDimensions.tableCellFontSize,
                            padding: responsiveDimensions.tableCellPadding,
                          },
                        ]}
                      >
                        {`${item.totalPower} kW`}
                      </Text>
                      <Text
                        style={[
                          styles.cell,
                          {
                            fontSize: responsiveDimensions.tableCellFontSize,
                            padding: responsiveDimensions.tableCellPadding,
                          },
                        ]}
                      >
                        {item.unit}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View
                  style={[
                    styles.noDataContainer,
                    {
                      padding: responsiveDimensions.containerPadding * 2,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.noDataText,
                      {
                        fontSize: responsiveDimensions.tableCellFontSize,
                      },
                    ]}
                  >
                    No data available for selected date
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#121212",
  },
  container: {
    alignItems: "stretch",
    width: "100%",
    minHeight: "100%",
  },
  scrollView: {
    backgroundColor: "#111",
    flex: 1,
  },
  currentText: {
    fontWeight: "bold",
    color: "#92F1F1",
    textAlign: "center",
    fontFamily: "Inter, sans-serif",
  },
  imageContainer: {
    width: "100%",
    alignItems: "stretch",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    minWidth: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#92F1F1",
    fontWeight: "bold",
    fontFamily: "Inter, sans-serif",
    flex: 1,
  },
  dateButton: {
    backgroundColor: "#92F1F1",
  },
  dateButtonText: {
    color: "#111",
    fontFamily: "Inter, sans-serif",
    fontWeight: "600",
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#92F1F1",
    overflow: "hidden",
    backgroundColor: "#222",
  },
  tableWrapper: {
    flex: 1,
    flexDirection: "column",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Dimensions.get("window").height * 0.1,
  },
  loadingText: {
    color: "#92F1F1",
    fontFamily: "Inter, sans-serif",
    textAlign: "center",
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#222",
  },
  errorText: {
    color: "#ff5252",
    fontFamily: "Inter, sans-serif",
    textAlign: "center",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#333",
    borderBottomWidth: 2,
    borderBottomColor: "#92F1F1",
  },
  headerCell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#92F1F1",
    textAlign: "center",
    color: "#92F1F1",
    fontWeight: "bold",
    fontFamily: "Inter, sans-serif",
    justifyContent: "center",
    alignItems: "center",
  },
  tableBody: {
    backgroundColor: "#222",
    flexGrow: 1,
  },
  tableBodyContent: {
    flexGrow: 1,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#92F1F1",
    backgroundColor: "#222",
  },
  cell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#92F1F1",
    textAlign: "center",
    color: "#D7D7D7",
    fontFamily: "Inter, sans-serif",
    justifyContent: "center",
    alignItems: "center",
  },
  noDataContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
    borderTopWidth: 0,
    flex: 1,
  },
  noDataText: {
    color: "#D7D7D7",
    textAlign: "center",
    fontFamily: "Inter, sans-serif",
  },
  backButton: {
    position: "absolute",
    zIndex: 1,
  },
  backIcon: {
    tintColor: "#92F1F1",
    color: "#92F1F1",
  },
});

export default MachineUnitScreen;
