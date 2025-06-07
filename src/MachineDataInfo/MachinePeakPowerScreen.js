// // import { useState, useEffect } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   Dimensions,
// //   ActivityIndicator,
// //   TouchableOpacity,
// //   Image,
// //   StatusBar,
// //   Platform,
// // } from "react-native";
// // import { WebView } from "react-native-webview";
// // import DateTimePickerModal from "react-native-modal-datetime-picker";
// // import { useRoute, useNavigation } from "@react-navigation/native";
// // import peakPowerImg from "../../assets/chartImages/Rectangle 3.png";
// // import Icon from "react-native-vector-icons/FontAwesome";

// // const VOLTAGE = 220;

// // const MachinePeakPowerScreen = () => {
// //   const route = useRoute();
// //   const { endPoint } = route.params || {};
// //   const navigation = useNavigation();
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [data, setData] = useState([]);
// //   const [error, setError] = useState(null);
// //   const [selectedDate, setSelectedDate] = useState(null);
// //   const [showDatePicker, setShowDatePicker] = useState(false);
// //   const [screenWidth, setScreenWidth] = useState(
// //     Dimensions.get("window").width
// //   );
// //   const [screenHeight, setScreenHeight] = useState(
// //     Dimensions.get("window").height
// //   );

// //   useEffect(() => {
// //     const handleDimensionsChange = ({ window }) => {
// //       setScreenWidth(window.width);
// //       setScreenHeight(window.height);
// //     };

// //     const subscription = Dimensions.addEventListener(
// //       "change",
// //       handleDimensionsChange
// //     );
// //     return () => subscription.remove();
// //   }, []);

// //   const chartHeight = Math.min(
// //     screenHeight * 0.6,
// //     screenWidth < 768 ? 400 : 500
// //   );

// //   const fetchData = async () => {
// //     try {
// //       setIsLoading(true);
// //       const response = await fetch(`${endPoint}`);

// //       console.log("response of peak Power is", response);
// //       console.log(endPoint, "endPoint of peak power");
// //       if (!response.ok) {
// //         throw new Error(`HTTP error! Status: ${response.status}`);
// //       }
// //       const apiData = await response.json();

// //       const latestDate = getLatestDate(apiData);
// //       if (!selectedDate) {
// //         setSelectedDate(latestDate);
// //       }

// //       const processedData = processDataByHour(
// //         apiData,
// //         selectedDate || latestDate
// //       );
// //       setData([...processedData]);
// //     } catch (err) {
// //       setError(err instanceof Error ? err.message : "Failed to fetch data");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const getLatestDate = (apiData) => {
// //     const latestDate = apiData.reduce((latest, entry) => {
// //       const entryDate = new Date(entry.timestamp);
// //       return entryDate > latest ? entryDate : latest;
// //     }, new Date(0));
// //     return latestDate;
// //   };

// //   useEffect(() => {
// //     if (endPoint) {
// //       fetchData();
// //     }
// //   }, [selectedDate, endPoint]);

// //   const processDataByHour = (apiData, selectedDate) => {
// //     const groupedData = {};
// //     const selectedYear = selectedDate.getFullYear();
// //     const selectedMonth = selectedDate.getMonth();
// //     const selectedDay = selectedDate.getDate();

// //     apiData.forEach((entry) => {
// //       const entryDate = new Date(entry.timestamp);
// //       if (
// //         entryDate.getFullYear() === selectedYear &&
// //         entryDate.getMonth() === selectedMonth &&
// //         entryDate.getDate() === selectedDay
// //       ) {
// //         const hour = entryDate.getHours(); // Use getUTCHours() if API timestamps are in UTC
// //         const power = ((entry.current * VOLTAGE) / 1000).toFixed(2);
// //         if (!groupedData[hour] || power > groupedData[hour].power) {
// //           groupedData[hour] = {
// //             power: parseFloat(power),
// //             timestamp: entry.timestamp,
// //           };
// //         }
// //       }
// //     });

// //     // Only include hours with data, sorted by hour
// //     return Object.keys(groupedData)
// //       .map((hour) => {
// //         const hourInt = parseInt(hour, 10);
// //         // Use the original timestamp or create a new Date for the hour to preserve timezone
// //         const timestamp = groupedData[hour].timestamp;
// //         return [
// //           timestamp, // Use the original API timestamp
// //           groupedData[hour].power,
// //           groupedData[hour].timestamp,
// //         ];
// //       })
// //       .sort((a, b) => new Date(a[0]) - new Date(b[0])); // Sort by timestamp
// //   };

// //   const handleBackPress = () => {
// //     navigation.goBack();
// //   };

// //   const handleConfirm = (date) => {
// //     setSelectedDate(date);
// //     setShowDatePicker(false);
// //   };

// //   const isMobile = screenWidth < 768;
// //   const formatDate = (date) =>
// //     `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
// //   const categories = data.map(([timestamp]) => {
// //     const date = new Date(timestamp);
// //     return `${date.getHours()}:00`; // Use getUTCHours() if API timestamps are in UTC
// //   });
// //   const seriesData = data.map(([_, power]) => power);
// //   const maxPower = data.length > 0 ? Math.max(...seriesData) : 0;
// //   const maxPowerTimestamp =
// //     data.find(([_, power]) => power === maxPower)?.[2] || "";

// //   const chartHTML = `
// //     <!DOCTYPE html>
// //     <html>
// //       <head>
// //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
// //         <script src="https://code.highcharts.com/highcharts.js"></script>
// //         <style>
// //           html, body { margin: 0; padding: 0; background-color: #222; height: 100%; }
// //           #chart { height: 100%; width: 100%; }
// //         </style>
// //       </head>
// //       <body>
// //         <div id="chart"></div>
// //         <script>
// //           document.addEventListener("DOMContentLoaded", function () {
// //             Highcharts.chart('chart', {
// //               chart: { type: 'column', backgroundColor: '#222', height: ${chartHeight}, spacingTop: ${
// //     isMobile ? 15 : 30
// //   }, spacingBottom: ${isMobile ? 15 : 30} },
// //               title: { text: 'Power Peak Per Hour', style: { color: '#92F1F1', fontSize: '${
// //                 isMobile ? "17px" : "25px"
// //               }' } },
// //               xAxis: {
// //                 categories: ${JSON.stringify(categories)},
// //                 title: { text: 'Time', style: { color: '#D7D7D7', fontSize: '${
// //                   isMobile ? "10px" : "14px"
// //                 }' } },
// //                 labels: { style: { color: '#D7D7D7', fontSize: '${
// //                   isMobile ? "8px" : "12px"
// //                 }' }, rotation: ${isMobile ? -45 : 0}, align: 'right' },
// //                 tickInterval: 1, // Show every hour label since only data hours are included
// //                 lineColor: '#92F1F1',
// //                 gridLineColor: '#444'
// //               },
// //               yAxis: {
// //                 title: { text: 'Power (kW)', style: { color: '#D7D7D7', fontSize: '${
// //                   isMobile ? "10px" : "14px"
// //                 }' } },
// //                 labels: { style: { color: '#D7D7D7', fontSize: '${
// //                   isMobile ? "8px" : "12px"
// //                 }' } },
// //                 min: 0,
// //                 gridLineColor: '#555'
// //               },
// //               series: [{ name: 'Max Power', data: ${JSON.stringify(
// //                 seriesData
// //               )}, color: '#92F1F1', pointWidth: 5, borderRadius: 5, borderWidth: 0 }],
// //               tooltip: {
// //                 backgroundColor: '#333',
// //                 style: { color: '#92F1F1', fontSize: '${
// //                   isMobile ? "8px" : "12px"
// //                 }' },
// //                 formatter: function () {
// //                   const point = ${JSON.stringify(data)}[this.point.index];
// //                   return '<b>TimeStamp:</b> ' + point[2] + '<br><b>Power:</b> ' + this.y.toFixed(2) + ' kW';
// //                 },
// //                 useHTML: true
// //               },
// //               legend: { itemStyle: { color: '#92F1F1', fontSize: '${
// //                 isMobile ? "9px" : "13px"
// //               }' } },
// //               credits: { enabled: false }
// //             });
// //           });
// //         </script>
// //       </body>
// //     </html>
// //   `;

// //   return (
// //     <View style={styles.container}>
// //       <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
// //         <Icon name="arrow-left" style={styles.backIcon} />
// //       </TouchableOpacity>
// //       <Text style={styles.currentText}>Peak Power Per Hour</Text>
// //       <View style={styles.imageContainer}>
// //         <Image source={peakPowerImg} style={styles.image} resizeMode="cover" />
// //       </View>

// //       <View style={styles.header}>
// //         <Text style={styles.title}>
// //           Selected Date:{" "}
// //           {selectedDate ? formatDate(selectedDate) : "Loading..."}
// //         </Text>
// //         <TouchableOpacity
// //           style={styles.dateButton}
// //           onPress={() => setShowDatePicker(true)}
// //         >
// //           <Text style={styles.dateButtonText}>Change Date</Text>
// //         </TouchableOpacity>
// //       </View>

// //       <DateTimePickerModal
// //         isVisible={showDatePicker}
// //         mode="date"
// //         onConfirm={handleConfirm}
// //         onCancel={() => setShowDatePicker(false)}
// //         date={selectedDate}
// //       />

// //       <View
// //         style={[
// //           styles.chartWrapper,
// //           { height: chartHeight + 2, backgroundColor: "#222" },
// //         ]}
// //       >
// //         {isLoading ? (
// //           <View
// //             style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
// //           >
// //             <ActivityIndicator size="large" color="#00ff00" />
// //             <Text style={{ color: "white", marginTop: 10 }}>
// //               Loading data...
// //             </Text>
// //           </View>
// //         ) : data.length === 0 ? (
// //           <View
// //             style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
// //           >
// //             <Text style={{ color: "white", fontSize: 16 }}>
// //               No data found for selected date.
// //             </Text>
// //           </View>
// //         ) : (
// //           <WebView
// //             originWhitelist={["*"]}
// //             source={{ html: chartHTML }}
// //             style={{ flex: 1 }}
// //             javaScriptEnabled={true}
// //             domStorageEnabled={true}
// //             scrollEnabled={false}
// //           />
// //         )}
// //       </View>

// //       {maxPower > 0 && (
// //         <View style={styles.maxValueBox}>
// //           <View style={styles.maxValueContent}>
// //             <Text style={styles.maxText}>
// //               <Text style={styles.maxValueLabel}>⚡ Max Power: </Text>
// //               <Text style={styles.maxValue}>{maxPower.toFixed(2)} kW </Text>
// //             </Text>
// //             <Text style={styles.maxValueTimestamp}>{maxPowerTimestamp}</Text>
// //           </View>
// //         </View>
// //       )}
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     padding: 10,
// //     alignItems: "stretch",
// //     backgroundColor: "#111",
// //     width: "100%",
// //     minHeight: "100%",
// //     marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
// //   },
// //   imageContainer: {
// //     width: "100%",
// //     alignItems: "stretch",
// //     justifyContent: "center",
// //   },
// //   image: {
// //     width: "100%",
// //     height: 270,
// //     minWidth: "100%",
// //   },
// //   header: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     paddingVertical: 1,
// //     paddingHorizontal: 5,
// //     marginTop: 20,
// //   },
// //   title: {
// //     color: "#92F1F1",
// //     fontSize: 16,
// //     fontWeight: "bold",
// //   },
// //   dateButton: {
// //     backgroundColor: "#fff",
// //     paddingVertical: 5,
// //     paddingHorizontal: 10,
// //     borderRadius: 5,
// //   },
// //   dateButtonText: {
// //     color: "#000",
// //     fontSize: 12,
// //   },
// //   chartWrapper: {
// //     borderWidth: 1,
// //     borderColor: "#92F1F1",
// //     borderRadius: 4,
// //     overflow: "hidden",
// //     width: "100%",
// //     marginBottom: 10,
// //     marginTop: 20,
// //   },
// //   maxValueBox: {
// //     marginTop: 0,
// //     backgroundColor: "#111",
// //     padding: 0,
// //     alignItems: "center",
// //     width: "100%",
// //     borderRadius: 8,
// //   },
// //   maxValueContent: {
// //     flexDirection: "column",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     flexShrink: 1,
// //   },
// //   maxText: {
// //     color: "#92F1F1",
// //     fontSize: 16,
// //     textAlign: "center",
// //     flexShrink: 1,
// //   },
// //   maxTextMobile: {
// //     fontSize: 14,
// //     lineHeight: 18,
// //   },
// //   maxValueLabel: {
// //     color: "#92F1F1",
// //     fontSize: 16,
// //   },
// //   maxValue: {
// //     color: "#92F1F1",
// //     fontWeight: "bold",
// //     fontSize: 16,
// //   },
// //   maxValueTimestamp: {
// //     color: "#92F1F1",
// //     fontSize: 14,
// //     marginTop: 5,
// //     textAlign: "center",
// //   },
// //   maxValueTimestampMobile: {
// //     fontSize: 12,
// //   },
// //   currentText: {
// //     fontSize: 28,
// //     fontWeight: "bold",
// //     marginBottom: 15,
// //     marginTop: 20,
// //     color: "#92F1F1",
// //     textAlign: "center",
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundColor: "#222",
// //   },
// //   loadingText: {
// //     color: "#fff",
// //     marginTop: 10,
// //     fontSize: 16,
// //   },
// //   errorContainer: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundColor: "#222",
// //     padding: 20,
// //   },
// //   errorText: {
// //     color: "#ff5252",
// //     fontSize: 16,
// //     textAlign: "center",
// //   },
// //   backButton: {
// //     position: "absolute",
// //     top: 10,
// //     left: 10,
// //     zIndex: 1,
// //   },
// //   backIcon: {
// //     fontSize: 25,
// //     tintColor: "#92F1F1",
// //     color: "#92F1F1",
// //   },
// // });

// // export default MachinePeakPowerScreen;

// import { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   ActivityIndicator,
//   TouchableOpacity,
//   Image,
//   StatusBar,
//   Platform,
// } from "react-native";
// import { WebView } from "react-native-webview";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import axios from "axios"; // Import axios
// import peakPowerImg from "../../assets/chartImages/Rectangle 3.png";
// import Icon from "react-native-vector-icons/FontAwesome";

// const VOLTAGE = 220;

// const MachinePeakPowerScreen = () => {
//   const route = useRoute();
//   const { endPoint } = route.params || {};
//   const navigation = useNavigation();
//   const [isLoading, setIsLoading] = useState(true);
//   const [data, setData] = useState([]);
//   const [error, setError] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [screenWidth, setScreenWidth] = useState(
//     Dimensions.get("window").width
//   );
//   const [screenHeight, setScreenHeight] = useState(
//     Dimensions.get("window").height
//   );

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

//   const chartHeight = Math.min(
//     screenHeight * 0.6,
//     screenWidth < 768 ? 400 : 500
//   );

//   const fetchData = async () => {
//     try {
//       setIsLoading(true);
//       // Use axios instead of fetch
//       const response = await axios.get(`${endPoint}`);

//       console.log("response of peak Power is", response);
//       console.log(endPoint, "endPoint of peak power");

//       // With axios, the data is in response.data
//       const apiData = response.data;

//       // Check if the API returned data in the expected format
//       if (!apiData || !apiData.data || !Array.isArray(apiData.data)) {
//         throw new Error("Invalid data format received from API");
//       }

//       const latestDate = getLatestDate(apiData.data);
//       if (!selectedDate) {
//         setSelectedDate(latestDate);
//       }

//       const processedData = processDataByHour(
//         apiData.data,
//         selectedDate || latestDate
//       );
//       setData([...processedData]);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to fetch data");
//       console.error("Error fetching peak power data:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getLatestDate = (apiData) => {
//     if (!apiData || apiData.length === 0) return new Date();

//     const latestDate = apiData.reduce((latest, entry) => {
//       const entryDate = new Date(entry.timestamp);
//       return entryDate > latest ? entryDate : latest;
//     }, new Date(0));
//     return latestDate;
//   };

//   useEffect(() => {
//     if (endPoint) {
//       fetchData();
//     }
//   }, [selectedDate, endPoint]);

//   const processDataByHour = (apiData, selectedDate) => {
//     const groupedData = {};
//     const selectedYear = selectedDate.getFullYear();
//     const selectedMonth = selectedDate.getMonth();
//     const selectedDay = selectedDate.getDate();

//     apiData.forEach((entry) => {
//       const entryDate = new Date(entry.timestamp);
//       if (
//         entryDate.getFullYear() === selectedYear &&
//         entryDate.getMonth() === selectedMonth &&
//         entryDate.getDate() === selectedDay
//       ) {
//         const hour = entryDate.getHours(); // Use getUTCHours() if API timestamps are in UTC
//         const power = ((entry.current * VOLTAGE) / 1000).toFixed(2);
//         if (!groupedData[hour] || power > groupedData[hour].power) {
//           groupedData[hour] = {
//             power: parseFloat(power),
//             timestamp: entry.timestamp,
//           };
//         }
//       }
//     });

//     // Only include hours with data, sorted by hour
//     return Object.keys(groupedData)
//       .map((hour) => {
//         const hourInt = parseInt(hour, 10);
//         // Use the original timestamp or create a new Date for the hour to preserve timezone
//         const timestamp = groupedData[hour].timestamp;
//         return [
//           timestamp, // Use the original API timestamp
//           groupedData[hour].power,
//           groupedData[hour].timestamp,
//         ];
//       })
//       .sort((a, b) => new Date(a[0]) - new Date(b[0])); // Sort by timestamp
//   };

//   const handleBackPress = () => {
//     navigation.goBack();
//   };

//   const handleConfirm = (date) => {
//     setSelectedDate(date);
//     setShowDatePicker(false);
//   };

//   const isMobile = screenWidth < 768;
//   const formatDate = (date) =>
//     `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
//   const categories = data.map(([timestamp]) => {
//     const date = new Date(timestamp);
//     return `${date.getHours()}:00`; // Use getUTCHours() if API timestamps are in UTC
//   });
//   const seriesData = data.map(([_, power]) => power);
//   const maxPower = data.length > 0 ? Math.max(...seriesData) : 0;
//   const maxPowerTimestamp =
//     data.find(([_, power]) => power === maxPower)?.[2] || "";

//   const chartHTML = `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <script src="https://code.highcharts.com/highcharts.js"></script>
//         <style>
//           html, body { margin: 0; padding: 0; background-color: #222; height: 100%; }
//           #chart { height: 100%; width: 100%; }
//         </style>
//       </head>
//       <body>
//         <div id="chart"></div>
//         <script>
//           document.addEventListener("DOMContentLoaded", function () {
//             Highcharts.chart('chart', {
//               chart: { type: 'column', backgroundColor: '#222', height: ${chartHeight}, spacingTop: ${
//     isMobile ? 15 : 30
//   }, spacingBottom: ${isMobile ? 15 : 30} },
//               title: { text: 'Power Peak Per Hour', style: { color: '#92F1F1', fontSize: '${
//                 isMobile ? "17px" : "25px"
//               }' } },
//               xAxis: {
//                 categories: ${JSON.stringify(categories)},
//                 title: { text: 'Time', style: { color: '#D7D7D7', fontSize: '${
//                   isMobile ? "10px" : "14px"
//                 }' } },
//                 labels: { style: { color: '#D7D7D7', fontSize: '${
//                   isMobile ? "8px" : "12px"
//                 }' }, rotation: ${isMobile ? -45 : 0}, align: 'right' },
//                 tickInterval: 1, // Show every hour label since only data hours are included
//                 lineColor: '#92F1F1',
//                 gridLineColor: '#444'
//               },
//               yAxis: {
//                 title: { text: 'Power (kW)', style: { color: '#D7D7D7', fontSize: '${
//                   isMobile ? "10px" : "14px"
//                 }' } },
//                 labels: { style: { color: '#D7D7D7', fontSize: '${
//                   isMobile ? "8px" : "12px"
//                 }' } },
//                 min: 0,
//                 gridLineColor: '#555'
//               },
//               series: [{ name: 'Max Power', data: ${JSON.stringify(
//                 seriesData
//               )}, color: '#92F1F1', pointWidth: 5, borderRadius: 5, borderWidth: 0 }],
//               tooltip: {
//                 backgroundColor: '#333',
//                 style: { color: '#92F1F1', fontSize: '${
//                   isMobile ? "8px" : "12px"
//                 }' },
//                 formatter: function () {
//                   const point = ${JSON.stringify(data)}[this.point.index];
//                   return '<b>TimeStamp:</b> ' + point[2] + '<br><b>Power:</b> ' + this.y.toFixed(2) + ' kW';
//                 },
//                 useHTML: true
//               },
//               legend: { itemStyle: { color: '#92F1F1', fontSize: '${
//                 isMobile ? "9px" : "13px"
//               }' } },
//               credits: { enabled: false }
//             });
//           });
//         </script>
//       </body>
//     </html>
//   `;

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
//         <Icon name="arrow-left" style={styles.backIcon} />
//       </TouchableOpacity>
//       <Text style={styles.currentText}>Peak Power Per Hour</Text>
//       <View style={styles.imageContainer}>
//         <Image source={peakPowerImg} style={styles.image} resizeMode="cover" />
//       </View>

//       <View style={styles.header}>
//         <Text style={styles.title}>
//           Selected Date:{" "}
//           {selectedDate ? formatDate(selectedDate) : "Loading..."}
//         </Text>
//         <TouchableOpacity
//           style={styles.dateButton}
//           onPress={() => setShowDatePicker(true)}
//         >
//           <Text style={styles.dateButtonText}>Change Date</Text>
//         </TouchableOpacity>
//       </View>

//       <DateTimePickerModal
//         isVisible={showDatePicker}
//         mode="date"
//         onConfirm={handleConfirm}
//         onCancel={() => setShowDatePicker(false)}
//         date={selectedDate || new Date()}
//       />

//       <View
//         style={[
//           styles.chartWrapper,
//           { height: chartHeight + 2, backgroundColor: "#222" },
//         ]}
//       >
//         {isLoading ? (
//           <View
//             style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
//           >
//             <ActivityIndicator size="large" color="#00ff00" />
//             <Text style={{ color: "white", marginTop: 10 }}>
//               Loading data...
//             </Text>
//           </View>
//         ) : error ? (
//           <View
//             style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
//           >
//             <Text
//               style={{
//                 color: "red",
//                 fontSize: 16,
//                 textAlign: "center",
//                 padding: 20,
//               }}
//             >
//               Error: {error}
//             </Text>
//           </View>
//         ) : data.length === 0 ? (
//           <View
//             style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
//           >
//             <Text style={{ color: "white", fontSize: 16 }}>
//               No data found for selected date.
//             </Text>
//           </View>
//         ) : (
//           <WebView
//             originWhitelist={["*"]}
//             source={{ html: chartHTML }}
//             style={{ flex: 1 }}
//             javaScriptEnabled={true}
//             domStorageEnabled={true}
//             scrollEnabled={false}
//           />
//         )}
//       </View>

//       {maxPower > 0 && (
//         <View style={styles.maxValueBox}>
//           <View style={styles.maxValueContent}>
//             <Text style={styles.maxText}>
//               <Text style={styles.maxValueLabel}>⚡ Max Power: </Text>
//               <Text style={styles.maxValue}>{maxPower.toFixed(2)} kW </Text>
//             </Text>
//             <Text style={styles.maxValueTimestamp}>{maxPowerTimestamp}</Text>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 10,
//     alignItems: "stretch",
//     backgroundColor: "#111",
//     width: "100%",
//     minHeight: "100%",
//     marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
//   },
//   imageContainer: {
//     width: "100%",
//     alignItems: "stretch",
//     justifyContent: "center",
//   },
//   image: {
//     width: "100%",
//     height: 270,
//     minWidth: "100%",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 1,
//     paddingHorizontal: 5,
//     marginTop: 20,
//   },
//   title: {
//     color: "#92F1F1",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   dateButton: {
//     backgroundColor: "#fff",
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//   },
//   dateButtonText: {
//     color: "#000",
//     fontSize: 12,
//   },
//   chartWrapper: {
//     borderWidth: 1,
//     borderColor: "#92F1F1",
//     borderRadius: 4,
//     overflow: "hidden",
//     width: "100%",
//     marginBottom: 10,
//     marginTop: 20,
//   },
//   maxValueBox: {
//     marginTop: 0,
//     backgroundColor: "#111",
//     padding: 0,
//     alignItems: "center",
//     width: "100%",
//     borderRadius: 8,
//   },
//   maxValueContent: {
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     flexShrink: 1,
//   },
//   maxText: {
//     color: "#92F1F1",
//     fontSize: 16,
//     textAlign: "center",
//     flexShrink: 1,
//   },
//   maxTextMobile: {
//     fontSize: 14,
//     lineHeight: 18,
//   },
//   maxValueLabel: {
//     color: "#92F1F1",
//     fontSize: 16,
//   },
//   maxValue: {
//     color: "#92F1F1",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   maxValueTimestamp: {
//     color: "#92F1F1",
//     fontSize: 14,
//     marginTop: 5,
//     textAlign: "center",
//   },
//   maxValueTimestampMobile: {
//     fontSize: 12,
//   },
//   currentText: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 15,
//     marginTop: 20,
//     color: "#92F1F1",
//     textAlign: "center",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#222",
//   },
//   loadingText: {
//     color: "#fff",
//     marginTop: 10,
//     fontSize: 16,
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#222",
//     padding: 20,
//   },
//   errorText: {
//     color: "#ff5252",
//     fontSize: 16,
//     textAlign: "center",
//   },
//   backButton: {
//     position: "absolute",
//     top: 10,
//     left: 10,
//     zIndex: 1,
//   },
//   backIcon: {
//     fontSize: 25,
//     tintColor: "#92F1F1",
//     color: "#92F1F1",
//   },
// });

// export default MachinePeakPowerScreen;

"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  ScrollView,
} from "react-native";
import { WebView } from "react-native-webview";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import peakPowerImg from "../../assets/chartImages/Rectangle 3.png";
import Icon from "react-native-vector-icons/FontAwesome";

const VOLTAGE = 220;

const MachinePeakPowerScreen = () => {
  const route = useRoute();
  const { endPoint } = route.params || {};
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );

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

  // Responsive calculations
  const isMobile = screenWidth < 768;
  const chartHeight = Math.min(
    screenHeight * 0.5,
    isMobile ? screenWidth * 0.8 : screenWidth * 0.6
  );
  const chartWidth = screenWidth * 0.9;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${endPoint}`);

      console.log("response of peak Power is", response);
      console.log(endPoint, "endPoint of peak power");

      const apiData = response.data;

      if (!apiData || !apiData.data || !Array.isArray(apiData.data)) {
        throw new Error("Invalid data format received from API");
      }

      const latestDate = getLatestDate(apiData.data);
      if (!selectedDate) {
        setSelectedDate(latestDate);
      }

      const processedData = processDataByHour(
        apiData.data,
        selectedDate || latestDate
      );
      setData([...processedData]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      console.error("Error fetching peak power data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getLatestDate = (apiData) => {
    if (!apiData || apiData.length === 0) return new Date();

    const latestDate = apiData.reduce((latest, entry) => {
      const entryDate = new Date(entry.timestamp);
      return entryDate > latest ? entryDate : latest;
    }, new Date(0));
    return latestDate;
  };

  useEffect(() => {
    if (endPoint) {
      fetchData();
    }
  }, [selectedDate, endPoint]);

  const processDataByHour = (apiData, selectedDate) => {
    const groupedData = {};
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth();
    const selectedDay = selectedDate.getDate();

    apiData.forEach((entry) => {
      const entryDate = new Date(entry.timestamp);
      if (
        entryDate.getFullYear() === selectedYear &&
        entryDate.getMonth() === selectedMonth &&
        entryDate.getDate() === selectedDay
      ) {
        const hour = entryDate.getHours();
        const power = ((entry.current * VOLTAGE) / 1000).toFixed(2);
        if (!groupedData[hour] || power > groupedData[hour].power) {
          groupedData[hour] = {
            power: Number.parseFloat(power),
            timestamp: entry.timestamp,
          };
        }
      }
    });

    return Object.keys(groupedData)
      .map((hour) => {
        const timestamp = groupedData[hour].timestamp;
        return [
          timestamp,
          groupedData[hour].power,
          groupedData[hour].timestamp,
        ];
      })
      .sort((a, b) => new Date(a[0]) - new Date(b[0]));
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const formatDate = (date) =>
    `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  const categories = data.map(([timestamp]) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:00`;
  });

  const seriesData = data.map(([_, power]) => power);
  const maxPower = data.length > 0 ? Math.max(...seriesData) : 0;
  const maxPowerTimestamp =
    data.find(([_, power]) => power === maxPower)?.[2] || "";

  // Calculate responsive Y-axis max
  const powerValues = seriesData.filter((power) => power !== undefined);
  const maxPowerValue = powerValues.length > 0 ? Math.max(...powerValues) : 5;
  const padding = (maxPowerValue || 1) * 0.1;
  const yAxisMax = Math.ceil((maxPowerValue + padding) * 100) / 100;

  const chartHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://code.highcharts.com/highcharts.js"></script>
        <style>
          html, body { 
            margin: 0; 
            padding: 0; 
            background: linear-gradient(135deg, rgba(62, 159, 159, 0.58) 0%, #000000 100%);
            height: 100%; 
            font-family: 'Inter', sans-serif;
          }
          #chart { height: 100%; width: 100%; }
        </style>
      </head>
      <body>
        <div id="chart"></div>
        <script>
          document.addEventListener("DOMContentLoaded", function () {
            Highcharts.chart('chart', {
              chart: { 
                type: 'column', 
                backgroundColor: 'transparent',
                height: ${chartHeight},
                width: ${chartWidth},
                spacingTop: ${screenHeight * 0.02},
                spacingBottom: ${screenHeight * 0.02},
                spacingLeft: ${screenWidth * 0.02},
                spacingRight: ${screenWidth * 0.02}
              },
              title: { 
                text: 'POWER PEAK PER HOUR', 
                style: { 
                  color: '#FFFFFF', 
                  fontSize: '${screenWidth * 0.04}px',
                  fontWeight: '700',
                  fontFamily: 'Inter, sans-serif'
                } 
              },
              xAxis: {
                categories: ${JSON.stringify(categories)},
                title: { 
                  text: 'Time', 
                  style: { 
                    color: 'rgba(255, 255, 255, 0.9)', 
                    fontSize: '${screenWidth * 0.03}px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '600'
                  } 
                },
                labels: { 
                  style: { 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontSize: '${screenWidth * 0.025}px',
                    fontFamily: 'Inter, sans-serif'
                  }, 
                  rotation: ${isMobile ? -45 : 0}, 
                  align: 'center' 
                },
                tickInterval: 1,
                lineColor: 'rgba(255, 255, 255, 0.2)',
                tickColor: 'rgba(255, 255, 255, 0.2)',
                gridLineColor: 'rgba(255, 255, 255, 0.1)'
              },
              yAxis: {
                title: { 
                  text: 'Power (kW)', 
                  style: { 
                    color: 'rgba(255, 255, 255, 0.9)', 
                    fontSize: '${screenWidth * 0.03}px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '600'
                  } 
                },
                labels: { 
                  style: { 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontSize: '${screenWidth * 0.025}px',
                    fontFamily: 'Inter, sans-serif'
                  } 
                },
                min: 0,
                max: ${yAxisMax},
                tickAmount: 6,
                gridLineColor: 'rgba(255, 255, 255, 0.1)',
                gridLineWidth: 1,
                lineColor: 'rgba(255, 255, 255, 0.2)',
                tickColor: 'rgba(255, 255, 255, 0.2)'
              },
              series: [{
                name: 'Max Power',
                data: ${JSON.stringify(seriesData)},
                color: {
                  linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
                  stops: [
                    [0, '#2BFFFF'],
                    [1, '#009D9D']
                  ]
                },
                pointWidth: ${
                  isMobile ? screenWidth * 0.02 : screenWidth * 0.015
                },
                borderRadiusTopLeft: 5,
                borderRadiusTopRight: 5,
                borderWidth: 0
              }],
              tooltip: {
                backgroundColor: '#F5F5F5',
                style: { 
                  color: '#000000', 
                  fontSize: '${screenWidth * 0.025}px',
                  fontFamily: 'Inter, sans-serif'
                },
                borderRadius: 4,
                padding: ${screenWidth * 0.02},
                formatter: function () {
                  const point = ${JSON.stringify(data)}[this.point.index];
                  return '<div style="padding: ${
                    screenWidth * 0.01
                  }px;"><div>Timestamp: ' + point[2] + '</div><div>Power: ' + this.y.toFixed(2) + ' kW</div></div>';
                },
                useHTML: true
              },
              legend: { 
                enabled: true,
                align: 'center',
                verticalAlign: 'bottom',
                itemStyle: { 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  fontSize: '${screenWidth * 0.025}px',
                  fontFamily: 'Inter, sans-serif'
                },
                itemHoverStyle: {
                  color: '#FFFFFF'
                }
              },
              credits: { enabled: false },
              plotOptions: {
                column: {
                  borderRadiusTopLeft: 5,
                  borderRadiusTopRight: 5,
                  borderWidth: 0,
                  pointPadding: 0,
                  groupPadding: 0.1
                }
              }
            });
          });
        </script>
      </body>
    </html>
  `;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={[styles.scrollView, { backgroundColor: "#111" }]}
    >
      <StatusBar translucent backgroundColor="transparent" style="light" />
      <TouchableOpacity
        style={[
          styles.backButton,
          {
            top: screenHeight * 0.015,
            left: screenWidth * 0.025,
          },
        ]}
        onPress={handleBackPress}
      >
        <Icon
          name="arrow-left"
          style={[
            styles.backIcon,
            {
              fontSize: screenWidth * 0.06,
            },
          ]}
        />
      </TouchableOpacity>

      <Text
        style={[
          styles.currentText,
          {
            fontSize: screenWidth * 0.06,
            marginBottom: screenHeight * 0.01,
            marginTop: screenHeight * 0.02,
          },
        ]}
      >
        Peak Power Per Hour
      </Text>

      <View style={styles.imageContainer}>
        <Image
          source={peakPowerImg}
          style={[
            styles.image,
            {
              height: screenHeight * 0.35,
            },
          ]}
          resizeMode="cover"
        />
      </View>

      <View
        style={[
          styles.header,
          {
            paddingVertical: screenHeight * 0.01,
            paddingHorizontal: screenWidth * 0.025,
            marginTop: screenHeight * 0.02,
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              fontSize: screenWidth * 0.04,
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
              paddingVertical: screenHeight * 0.008,
              paddingHorizontal: screenWidth * 0.025,
              borderRadius: screenWidth * 0.012,
            },
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text
            style={[
              styles.dateButtonText,
              {
                fontSize: screenWidth * 0.03,
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
          styles.chartWrapper,
          {
            height: chartHeight + screenHeight * 0.04,
            marginBottom: screenHeight * 0.015,
            marginTop: screenHeight * 0.02,
            borderRadius: screenWidth * 0.025,
            padding: screenWidth * 0.02,
          },
        ]}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00ff00" />
            <Text
              style={[
                styles.loadingText,
                {
                  marginTop: screenHeight * 0.015,
                  fontSize: screenWidth * 0.035,
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
                  fontSize: screenWidth * 0.04,
                  padding: screenWidth * 0.05,
                },
              ]}
            >
              Error: {error}
            </Text>
          </View>
        ) : data.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Text
              style={[
                styles.noDataText,
                {
                  fontSize: screenWidth * 0.04,
                },
              ]}
            >
              No data found for selected date.
            </Text>
          </View>
        ) : (
          <WebView
            originWhitelist={["*"]}
            source={{ html: chartHTML }}
            style={{ flex: 1 }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scrollEnabled={false}
          />
        )}
      </View>

      {maxPower > 0 && (
        <View
          style={[
            styles.maxValueBox,
            {
              borderRadius: screenWidth * 0.02,
            },
          ]}
        >
          <View style={styles.maxValueContent}>
            <Text
              style={[
                styles.maxText,
                {
                  fontSize: screenWidth * 0.04,
                },
              ]}
            >
              <Text
                style={[
                  styles.maxValueLabel,
                  {
                    fontSize: screenWidth * 0.04,
                  },
                ]}
              >
                ⚡ Max Power:{" "}
              </Text>
              <Text
                style={[
                  styles.maxValue,
                  {
                    fontSize: screenWidth * 0.04,
                  },
                ]}
              >
                {maxPower.toFixed(2)} kW{" "}
              </Text>
            </Text>
            <Text
              style={[
                styles.maxValueTimestamp,
                {
                  fontSize: screenWidth * 0.035,
                  marginTop: screenHeight * 0.008,
                },
              ]}
            >
              {maxPowerTimestamp}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Dimensions.get("window").width * 0.025,
    alignItems: "stretch",
    backgroundColor: "#111",
    width: "100%",
    minHeight: "100%",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    backgroundColor: "black",
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
  },
  dateButton: {
    backgroundColor: "#fff",
  },
  dateButtonText: {
    color: "#000",
    fontFamily: "Inter, sans-serif",
    fontWeight: "500",
  },
  chartWrapper: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    overflow: "hidden",
    width: "100%",
    background:
      "linear-gradient(135deg, rgba(62, 159, 159, 0.58) 0%, #000000 100%)",
  },
  maxValueBox: {
    marginTop: 0,
    backgroundColor: "#111",
    padding: 0,
    alignItems: "center",
    width: "100%",
  },
  maxValueContent: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 1,
  },
  maxText: {
    color: "#92F1F1",
    textAlign: "center",
    flexShrink: 1,
    fontFamily: "Inter, sans-serif",
    fontWeight: "600",
  },
  maxValueLabel: {
    color: "#92F1F1",
    fontFamily: "Inter, sans-serif",
    fontWeight: "600",
  },
  maxValue: {
    color: "#92F1F1",
    fontWeight: "bold",
    fontFamily: "Inter, sans-serif",
  },
  maxValueTimestamp: {
    color: "#92F1F1",
    textAlign: "center",
    fontFamily: "Inter, sans-serif",
    fontWeight: "600",
  },
  currentText: {
    fontWeight: "bold",
    color: "#92F1F1",
    textAlign: "center",
    fontFamily: "Inter, sans-serif",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    fontFamily: "Inter, sans-serif",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ff5252",
    textAlign: "center",
    fontFamily: "Inter, sans-serif",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    color: "white",
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

export default MachinePeakPowerScreen;
