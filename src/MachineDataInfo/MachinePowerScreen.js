"use client";

import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  Platform,
} from "react-native";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Svg, Path, LinearGradient, Stop, Defs } from "react-native-svg";
import powerImg from "../../assets/chartImages/Rectangle 1.png";

const MachinePowerScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { endPoint } = route.params || {};

  console.log("endpoint of power is ", endPoint);

  const [data, setData] = useState([]);
  const [maxPower, setMaxPower] = useState(null);
  const [averagePower, setAveragePower] = useState(null);
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    timestamp: "",
    power: 0,
  });
  const [chartDimensions, setChartDimensions] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const chartContainerRef = useRef(null);

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

  const chartHeight = Math.min(
    screenHeight * 0.75,
    screenWidth < 768 ? 300 : 400
  );

  const fetchData = async (isInitial = false) => {
    if (isInitial) {
      setLoading(true);
    }

    try {
      const response = await axios.get(`${endPoint}`);
      const sensorData = response.data;

      // console.log("API response:", sensorData);

      if (
        sensorData?.data &&
        Array.isArray(sensorData.data) &&
        sensorData.data.length > 0
      ) {
        const parsedData = sensorData.data.map((item) => ({
          ...item,
          jsTimestamp: new Date(item.timestamp.replace(" ", "T")).getTime(),
          time: item.timestamp.split(" ")[1],
          power: item.current ? Number((item.current * 220) / 1000) : 0,
        }));

        console.log("Parsed data sample:", parsedData.slice(0, 2));

        const sortedData = parsedData
          .sort((a, b) => a.jsTimestamp - b.jsTimestamp)
          .slice(-50); // Get the last 50 data points

        console.log("Sorted data length:", sortedData.length);
        console.log("Sorted data sample:", sortedData.slice(0, 2));

        setData(sortedData);

        if (sortedData.length > 0) {
          const maxPowerEntry = sortedData.reduce(
            (max, item) =>
              item.power > max.power
                ? { ...item, power: Number.parseFloat(item.power.toFixed(2)) }
                : max,
            sortedData[0]
          );
          setMaxPower(maxPowerEntry);

          const totalPower = sortedData.reduce(
            (sum, item) => sum + item.power,
            0
          );
          const avgPower = sortedData.length
            ? Number.parseFloat((totalPower / sortedData.length).toFixed(2))
            : null;
          setAveragePower(avgPower);
        }
      } else {
        console.log("No data received from API");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [endPoint]);

  const minPower =
    data.length > 0 ? Math.min(...data.map((point) => point.power)) : 0;
  const maxPowerValue =
    data.length > 0 ? Math.max(...data.map((point) => point.power)) : 0;
  const padding = (maxPowerValue - minPower || 1) * 0.1;
  const yAxisMin = Number.isFinite(minPower - padding)
    ? Math.floor((minPower - padding) * 100) / 100
    : 0;
  const yAxisMax = Number.isFinite(maxPowerValue + padding)
    ? Math.ceil((maxPowerValue + padding) * 100) / 100
    : 1;

  const yAxisLabels = [];
  const numLabels = 6;
  for (let i = 0; i < numLabels; i++) {
    const value = yAxisMin + (i * (yAxisMax - yAxisMin)) / (numLabels - 1);
    yAxisLabels.push(Number.isFinite(value) ? value.toFixed(2) : "0.00");
  }
  yAxisLabels.reverse();

  const isMobile = screenWidth < 768;

  // Get properly spaced X-axis labels
  const getXAxisLabels = () => {
    if (data.length === 0) return [];

    const maxLabels = isMobile ? 4 : 6;
    const step = Math.max(1, Math.floor(data.length / maxLabels));
    const labels = [];

    for (let i = 0; i < data.length; i += step) {
      if (labels.length < maxLabels) {
        labels.push({
          time: data[i].time,
          index: i,
        });
      }
    }

    // Always include the last point if it's not already included
    if (
      labels.length > 0 &&
      labels[labels.length - 1].index !== data.length - 1
    ) {
      labels[labels.length - 1] = {
        time: data[data.length - 1].time,
        index: data.length - 1,
      };
    }

    return labels;
  };

  const createPath = () => {
    if (data.length === 0) return "";

    const width = 100;
    const height = 100;

    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = Number.isFinite(point.power)
        ? height - ((point.power - yAxisMin) / (yAxisMax - yAxisMin)) * height
        : height;
      return `${x},${y}`;
    });

    const pathData = `M 0,${height} L ${points.join(
      " L "
    )} L ${width},${height} Z`;
    return pathData;
  };

  const createLine = () => {
    if (data.length === 0) return "";

    const width = 100;
    const height = 100;

    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = Number.isFinite(point.power)
        ? height - ((point.power - yAxisMin) / (yAxisMax - yAxisMin)) * height
        : height;
      return `${x},${y}`;
    });

    const lineData = `M ${points.join(" L ")}`;
    return lineData;
  };

  const handleTouchMove = (e) => {
    if (data.length === 0) return;

    const { width: chartWidth, height: chartHeight } = chartDimensions;
    if (!chartWidth || !chartHeight) return;

    const touch = e.nativeEvent.touches?.[0];
    if (!touch) return;

    const { locationX, locationY } = touch;
    const relativeX = locationX || 0;
    const relativeY = locationY || 0;

    // Ensure touch is within chart bounds
    if (
      relativeX < 0 ||
      relativeX > chartWidth ||
      relativeY < 0 ||
      relativeY > chartHeight
    ) {
      return;
    }

    // Find the nearest data point
    const index = Math.round((relativeX / chartWidth) * (data.length - 1));
    const nearestPoint = data[Math.max(0, Math.min(index, data.length - 1))];

    if (!nearestPoint) return;

    const tooltipWidth = 160;
    const tooltipHeight = 60;

    // Smart tooltip positioning
    let x = relativeX - tooltipWidth / 2;
    let y = relativeY - tooltipHeight - 15;

    // Horizontal boundary checks
    if (x < 5) {
      x = 5;
    } else if (x + tooltipWidth > chartWidth - 5) {
      x = chartWidth - tooltipWidth - 5;
    }

    // Vertical boundary checks
    if (y < 5) {
      y = relativeY + 15; // Show below touch point
    }
    if (y + tooltipHeight > chartHeight - 5) {
      y = chartHeight - tooltipHeight - 5;
    }

    setTooltip({
      visible: true,
      x,
      y,
      timestamp: nearestPoint.timestamp,
      power: nearestPoint.power.toFixed(2),
    });
  };

  const handleTouchStart = (e) => {
    handleTouchMove(e);
  };

  const handleTouchEnd = () => {
    // Keep tooltip visible for a moment
    setTimeout(() => {
      setTooltip((prev) => ({ ...prev, visible: false }));
    }, 1500);
  };

  const handleChartLayout = (event) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setChartDimensions({ x, y, width, height });
  };

  const yAxisWidth = isMobile ? 45 : 50;
  const xAxisHeight = 35;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={styles.scrollView}
    >
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Icon name="arrow-left" style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.powerText}>Power Consumption</Text>

      <View style={styles.imageContainer}>
        <Image source={powerImg} style={styles.image} resizeMode="cover" />
      </View>

      <View
        style={[
          styles.chartWrapper,
          { height: chartHeight + xAxisHeight + 30 },
        ]}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00ff00" />
            <Text style={styles.loadingText}>Loading data...</Text>
          </View>
        ) : data.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No data available</Text>
          </View>
        ) : (
          <View style={styles.chartMainContainer}>
            {/* Y-axis labels */}
            <View
              style={[
                styles.yAxisContainer,
                { width: yAxisWidth, height: chartHeight },
              ]}
            >
              {yAxisLabels.map((label, index) => (
                <Text key={index} style={styles.yAxisLabel}>
                  {label}
                </Text>
              ))}
            </View>

            {/* Chart area */}
            <View style={styles.chartColumn}>
              <View
                style={[styles.chartArea, { height: chartHeight }]}
                onLayout={handleChartLayout}
                onTouchMove={handleTouchMove}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <Svg
                  height={chartHeight}
                  width="100%"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  style={styles.svgChart}
                >
                  <Defs>
                    <LinearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <Stop offset="0%" stopColor="#2BFFFF" stopOpacity={0.8} />
                      <Stop
                        offset="100%"
                        stopColor="#009D9D"
                        stopOpacity={0.8}
                      />
                    </LinearGradient>
                  </Defs>

                  {/* Horizontal grid lines */}
                  {[0, 20, 40, 60, 80, 100].map((y, index) => (
                    <Path
                      key={`h-${index}`}
                      d={`M 0 ${y} H 100`}
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth={0.5}
                    />
                  ))}

                  {/* Vertical grid lines */}
                  {getXAxisLabels().map((_, index) => {
                    const x = (index / (getXAxisLabels().length - 1)) * 100;
                    return (
                      <Path
                        key={`v-${index}`}
                        d={`M ${x} 0 V 100`}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth={0.5}
                      />
                    );
                  })}

                  {/* Chart data */}
                  <Path d={createPath()} fill="url(#gradient)" opacity={0.8} />
                  <Path
                    d={createLine()}
                    fill="none"
                    stroke="#00d4d4"
                    strokeWidth={0.5}
                  />
                </Svg>

                {/* Tooltip - showing full timestamp */}
                {tooltip.visible && (
                  <View
                    style={[
                      styles.tooltip,
                      {
                        left: tooltip.x,
                        top: tooltip.y,
                      },
                    ]}
                  >
                    <Text style={styles.tooltipText}>
                      Time: {tooltip.timestamp}
                    </Text>
                    <Text style={styles.tooltipText}>
                      Power: {tooltip.power} kW
                    </Text>
                  </View>
                )}
              </View>

              {/* X-axis labels */}
              <View style={[styles.xAxisContainer, { height: xAxisHeight }]}>
                {getXAxisLabels().map((label, index) => (
                  <Text key={index} style={styles.xAxisLabel}>
                    {label.time}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>

      {maxPower && (
        <View style={styles.maxValueBox}>
          <View style={styles.maxValueContent}>
            <Text style={[styles.maxText, isMobile && styles.maxTextMobile]}>
              <Text style={styles.maxValueLabel}>⚡ Max Power: </Text>
              <Text style={styles.maxValue}>
                {maxPower.power.toFixed(2)} kW{" "}
              </Text>
            </Text>
            <Text
              style={[
                styles.maxValueTimestamp,
                isMobile && styles.maxValueTimestampMobile,
              ]}
            >
              {maxPower.timestamp}
            </Text>
            {averagePower !== null && (
              <Text style={[styles.avgText, isMobile && styles.maxTextMobile]}>
                <Text style={styles.maxValueLabel}>➕ Avg Power: </Text>
                <Text style={styles.maxValue}>
                  {averagePower.toFixed(2)} kW
                </Text>
              </Text>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "stretch",
    backgroundColor: "#111",
    width: "100%",
    minHeight: "100%",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    backgroundColor: "black",
  },
  chartWrapper: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 8,
    width: "100%",
    marginBottom: 10,
    marginTop: 20,
    backgroundColor: "#222",
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
  },
  loadingText: {
    color: "white",
    marginTop: 10,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
  },
  noDataText: {
    color: "white",
    fontSize: 16,
  },
  chartMainContainer: {
    flex: 1,
    flexDirection: "row",
  },
  yAxisContainer: {
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingRight: 8,
    backgroundColor: "#222",
  },
  yAxisLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    fontFamily: "Inter, sans-serif",
    fontWeight: "400",
    textAlign: "right",
  },
  chartColumn: {
    flex: 1,
    flexDirection: "column",
  },
  chartArea: {
    position: "relative",
    backgroundColor: "transparent",
    flex: 1,
  },
  svgChart: {
    backgroundColor: "transparent",
  },
  xAxisContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    paddingHorizontal: 5,
  },
  xAxisLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 10,
    fontFamily: "Inter, sans-serif",
    fontWeight: "400",
    textAlign: "center",
    flex: 1,
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "rgba(30, 30, 30, 0.95)",
    padding: 8,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: "#00d4d4",
    minWidth: 160,
  },
  tooltipText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: "Inter, sans-serif",
    fontWeight: "500",
    lineHeight: 16,
  },
  maxValueBox: {
    marginTop: 0,
    backgroundColor: "#111",
    padding: 0,
    alignItems: "center",
    width: "100%",
    borderRadius: 8,
  },
  maxValueContent: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 1,
  },
  maxText: {
    color: "#92F1F1",
    fontSize: 16,
    textAlign: "center",
    flexShrink: 1,
    fontFamily: "Inter, sans-serif",
    fontWeight: "600",
  },
  avgText: {
    color: "#92F1F1",
    fontSize: 16,
    textAlign: "center",
    paddingTop: 15,
    flexShrink: 1,
    fontFamily: "Inter, sans-serif",
    fontWeight: "600",
  },
  maxTextMobile: {
    fontSize: 14,
    lineHeight: 18,
  },
  maxValueLabel: {
    color: "#92F1F1",
    fontSize: 16,
    fontFamily: "Inter, sans-serif",
    fontWeight: "600",
  },
  maxValue: {
    color: "#92F1F1",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Inter, sans-serif",
  },
  maxValueTimestamp: {
    color: "#92F1F1",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
    fontFamily: "Inter, sans-serif",
    fontWeight: "600",
  },
  maxValueTimestampMobile: {
    fontSize: 12,
  },
  powerText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 30,
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
    height: 280,
    minWidth: "100%",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
  },
  backIcon: {
    fontSize: 25,
    tintColor: "#92F1F1",
    color: "#92F1F1",
  },
});

export default MachinePowerScreen;

// import { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Dimensions,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Image,
//   ActivityIndicator,
//   StatusBar,
//   Platform,
// } from "react-native";
// import { WebView } from "react-native-webview";
// import powerImg from "../../assets/chartImages/Rectangle 1.png";
// import axios from "axios";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import Icon from "react-native-vector-icons/FontAwesome";

// const MachinePowerScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { endPoint } = route.params || {};

//   const [data, setData] = useState([]);
//   const [maxPower, setMaxPower] = useState(null);
//   const [averagePower, setAveragePower] = useState(null); // New state for average power
//   const [screenWidth, setScreenWidth] = useState(
//     Dimensions.get("window").width
//   );
//   const [screenHeight, setScreenHeight] = useState(
//     Dimensions.get("window").height
//   );

//   const handleBackPress = () => {
//     navigation.goBack();
//   };

//   const [loading, setLoading] = useState(true); // only for first load
//   const [refreshing, setRefreshing] = useState(false); // if you later want pull-to-refresh

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

//   const fetchData = async (isInitial = false) => {
//     if (isInitial) {
//       setLoading(true);
//     } else {
//       setRefreshing(true);
//     }

//     try {
//       const response = await axios.get(`${endPoint}`);
//       if (response.data && response.data.length > 0) {
//         const parsedData = response.data.map((item) => ({
//           ...item,
//           jsTimestamp: new Date(item.timestamp.replace(" ", "T")).getTime(),
//           power: item.current ? (item.current * 220) / 1000 : 0,
//         }));

//         const sortedData = parsedData.sort(
//           (a, b) => a.jsTimestamp - b.jsTimestamp
//         );
//         const limitedData = sortedData.slice(-100);

//         console.log("Fetched data length:", limitedData.length);
//         console.log("Sample data:", limitedData.slice(0, 2));

//         setData(limitedData);

//         if (limitedData.length > 0) {
//           const maxPowerEntry = limitedData.reduce((max, item) =>
//             item.power > max.power ? item : max
//           );
//           setMaxPower({
//             ...maxPowerEntry,
//             power: Number.parseFloat(maxPowerEntry.power.toFixed(2)),
//           });

//           const totalPower = limitedData.reduce(
//             (sum, item) => sum + item.power,
//             0
//           );
//           const avgPower = limitedData.length
//             ? Number.parseFloat((totalPower / limitedData.length).toFixed(2))
//             : null;
//           setAveragePower(avgPower);
//         }
//       } else {
//         console.log("No data received from API");
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       if (isInitial) {
//         setLoading(false);
//       } else {
//         setRefreshing(false);
//       }
//     }
//   };

//   useEffect(() => {
//     fetchData(true);
//     const interval = setInterval(fetchData, 5000);
//     return () => clearInterval(interval);
//   }, [endPoint]);

//   const categories = data.map((item) => item.timestamp.split(" ")[1]);
//   const seriesData = data.map((item) =>
//     Number.parseFloat(item.power.toFixed(2))
//   );

//   // Debug chart data
//   console.log("Categories length:", categories.length);
//   console.log("Series data length:", seriesData.length);
//   console.log("Sample categories:", categories.slice(0, 2));
//   console.log("Sample series data:", seriesData.slice(0, 2));

//   const isMobile = screenWidth < 768;

//   const chartHTML = `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <script src="https://code.highcharts.com/highcharts.js"></script>
//         <style>
//           html, body {
//             margin: 0;
//             padding: 0;
//             background-color: #222;
//             height: 100%;
//           }
//           #chart {
//             height: 100%;
//             width: 100%;
//           }
//         </style>
//       </head>
//       <body>
//         <div id="chart"></div>
//         <script>
//           document.addEventListener("DOMContentLoaded", function () {
//             try {
//               Highcharts.chart('chart', {
//                 chart: {
//                   type: 'line',
//                   backgroundColor: '#222',
//                   height: ${chartHeight},
//                   spacingTop: ${isMobile ? 15 : 30},
//                   spacingBottom: ${isMobile ? 15 : 30}
//                 },
//                 title: {
//                   text: 'Power Consumption Trend',
//                   style: { color: '#92F1F1', fontSize: '${
//                     isMobile ? "14px" : "25px"
//                   }' }
//                 },
//                 xAxis: {
//                   categories: ${JSON.stringify(categories)},
//                   title: { text: 'Timestamp', style: { color: '#D7D7D7', fontSize: '${
//                     isMobile ? "10px" : "14px"
//                   }' } },
//                   labels: {
//                     style: { color: '#D7D7D7', fontSize: '${
//                       isMobile ? "8px" : "12px"
//                     }' },
//                     rotation: ${isMobile ? -45 : 0},
//                     align: 'right'
//                   },
//                   tickInterval: ${Math.ceil(categories.length / 10)},
//                   lineColor: '#D7D7D7',
//                   gridLineColor: '#444'
//                 },
//                 yAxis: {
//                   title: { text: 'Power (kW)', style: { color: '#D7D7D7', fontSize: '${
//                     isMobile ? "10px" : "14px"
//                   }' } },
//                   labels: { style: { color: '#D7D7D7', fontSize: '${
//                     isMobile ? "8px" : "12px"
//                   }' } },
//                   min: 0,
//                   gridLineColor: '#555'
//                 },
//                 series: [{
//                   name: 'Power (kW)',
//                   data: ${JSON.stringify(seriesData)},
//                   color: '#92F1F1',
//                   lineWidth: ${isMobile ? 1 : 2},
//                   marker: { enabled: true, radius: ${isMobile ? 2 : 4} }
//                 }],
//                 tooltip: {
//                   backgroundColor: '#333',
//                   style: { color: '#92F1F1', fontSize: '${
//                     isMobile ? "8px" : "12px"
//                   }' },
//                   formatter: function () {
//                     const point = ${JSON.stringify(data)}[this.point.index];
//                     return '<b>Time:</b> ' + point.timestamp + '<br><b>Power:</b> ' + parseFloat(point.power.toFixed(2)) + ' kW';
//                   },
//                   useHTML: true
//                 },
//                 legend: { itemStyle: { color: '#D7D7D7', fontSize: '${
//                   isMobile ? "9px" : "13px"
//                 }' } },
//                 credits: { enabled: false }
//               });
//             } catch (error) {
//               console.error('Highcharts error:', error);
//             }
//           });
//         </script>
//       </body>
//     </html>
//   `;

//   return (
//     <ScrollView
//       contentContainerStyle={styles.container}
//       style={styles.scrollView}
//       onLayout={(event) => {
//         const { width } = event.nativeEvent.layout;
//         console.log("ScrollView width:", width);
//       }}
//     >
//       <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
//         <Icon name="arrow-left" style={styles.backIcon} />
//       </TouchableOpacity>
//       <Text style={styles.currentText}>Power Consumption</Text>

//       <View
//         style={styles.imageContainer}
//         onLayout={(event) => {
//           console.log("Image container width:", event.nativeEvent.layout.width);
//         }}
//       >
//         <Image source={powerImg} style={styles.image} resizeMode="cover" />
//       </View>

//       <View style={[styles.chartWrapper, { height: chartHeight + 2 }]}>
//         {loading ? (
//           <View
//             style={{
//               flex: 1,
//               justifyContent: "center",
//               alignItems: "center",
//               backgroundColor: "#222",
//             }}
//           >
//             <ActivityIndicator size="large" color="#00ff00" />
//             <Text style={{ color: "white", marginTop: 10 }}>
//               Loading data...
//             </Text>
//           </View>
//         ) : (
//           <WebView
//             originWhitelist={["*"]}
//             source={{ html: chartHTML }}
//             style={{ flex: 1, backgroundColor: "#222" }}
//             javaScriptEnabled={true}
//             domStorageEnabled={true}
//             scrollEnabled={false}
//             onError={(syntheticEvent) => {
//               const { nativeEvent } = syntheticEvent;
//               console.error("WebView error: ", nativeEvent);
//             }}
//             onLoadEnd={() => console.log("WebView loaded")}
//           />
//         )}
//       </View>

//       {maxPower && (
//         <View style={styles.maxValueBox}>
//           <View style={styles.maxValueContent}>
//             <Text style={[styles.maxText, isMobile && styles.maxTextMobile]}>
//               <Text style={styles.maxValueLabel}>⚡ Max Power: </Text>
//               <Text style={styles.maxValue}>{maxPower.power} kW </Text>
//             </Text>
//             <Text
//               style={[
//                 styles.maxValueTimestamp,
//                 isMobile && styles.maxValueTimestampMobile,
//               ]}
//             >
//               {maxPower.timestamp}
//             </Text>
//             {averagePower !== null && (
//               <Text
//                 style={[styles.avgPowerText, isMobile && styles.maxTextMobile]}
//               >
//                 <Text style={styles.maxValueLabel}>➕ Avg Power: </Text>
//                 <Text style={styles.maxValue}>
//                   {averagePower.toFixed(2)} kW
//                 </Text>
//               </Text>
//             )}
//           </View>
//         </View>
//       )}
//     </ScrollView>
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
//   scrollView: {
//     backgroundColor: "black",
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
//   avgPowerText: {
//     color: "#92F1F1",
//     fontSize: 16,
//     paddingTop: 15,
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
//     marginTop: 0,
//     textAlign: "center",
//   },
//   maxValueTimestampMobile: {
//     fontSize: 12,
//   },
//   currentText: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 8,
//     marginTop: 30,
//     color: "#92F1F1",
//     textAlign: "center",
//   },
//   imageContainer: {
//     width: "100%",
//     alignItems: "stretch",
//     justifyContent: "center",
//   },
//   image: {
//     width: "100%",
//     height: 280,
//     minWidth: "100%",
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

// export default MachinePowerScreen;
