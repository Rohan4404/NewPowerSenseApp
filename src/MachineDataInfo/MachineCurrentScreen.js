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
import currentImg from "../../assets/chartImages/3515462.jpg";

const MachineCurrentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { endPoint } = route.params || {};

  console.log("endpoint of current is ", endPoint);

  const [data, setData] = useState([]);
  const [maxValue, setMaxValue] = useState(null);
  const [averageCurrent, setAverageCurrent] = useState(null);
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
    current: 0,
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

  // Responsive chart height: 75% of screen height or capped at 40% of width for wider screens
  const chartHeight = Math.min(screenHeight * 0.88, screenWidth * 0.6);

  const fetchData = async (isInitial = false) => {
    if (isInitial) {
      setLoading(true);
    }

    try {
      const response = await axios.get(`${endPoint}`);
      const sensorData = response.data;

      if (
        sensorData?.data &&
        Array.isArray(sensorData.data) &&
        sensorData.data.length > 0
      ) {
        const parsedData = sensorData.data.map((item) => ({
          ...item,
          jsTimestamp: new Date(item.timestamp.replace(" ", "T")).getTime(),
          time: item.timestamp.split(" ")[1],
          current: Number.isFinite(item.current) ? item.current : 0,
        }));

        console.log("Parsed data sample:", parsedData.slice(0, 2));

        const sortedData = parsedData
          .sort((a, b) => b.jsTimestamp - a.jsTimestamp)
          .slice(0, 50)
          .sort((a, b) => a.jsTimestamp - b.jsTimestamp);

        console.log("Sorted data length:", sortedData.length);
        console.log("Sorted data sample:", sortedData.slice(0, 2));

        setData(sortedData);

        if (sortedData.length > 0) {
          const maxCurrentEntry = sortedData.reduce((max, item) =>
            item.current > max.current
              ? { ...item, current: Number.parseFloat(item.current.toFixed(1)) }
              : max
          );
          setMaxValue(maxCurrentEntry);

          const totalCurrent = sortedData.reduce(
            (sum, item) => sum + item.current,
            0
          );
          const avgCurrent = sortedData.length
            ? Number.parseFloat((totalCurrent / sortedData.length).toFixed(2))
            : null;
          setAverageCurrent(avgCurrent);
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

  const minCurrent =
    data.length > 0 ? Math.min(...data.map((point) => point.current)) : 0;
  const maxCurrentValue =
    data.length > 0 ? Math.max(...data.map((point) => point.current)) : 0;
  const padding = (maxCurrentValue - minCurrent || 1) * 0.1;
  const yAxisMin = Number.isFinite(minCurrent - padding)
    ? Math.floor((minCurrent - padding) * 100) / 100
    : 0;
  const yAxisMax = Number.isFinite(maxCurrentValue + padding)
    ? Math.ceil((maxCurrentValue + padding) * 100) / 100
    : 1;

  const yAxisLabels = [];
  const numLabels = 6;
  for (let i = 0; i < numLabels; i++) {
    const value = yAxisMin + (i * (yAxisMax - yAxisMin)) / (numLabels - 1);
    yAxisLabels.push(Number.isFinite(value) ? value.toFixed(1) : "0.0");
  }
  yAxisLabels.reverse();

  const isMobile = screenWidth < 768;

  // const isMobile = screenWidth <= 768;

  // Get properly spaced X-axis labels
  const getXAxisLabels = () => {
    if (data.length === 0) return [];

    const maxLabels = isMobile ? 5 : 4;
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
      const y = Number.isFinite(point.current)
        ? height - ((point.current - yAxisMin) / (yAxisMax - yAxisMin)) * height
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
      const y = Number.isFinite(point.current)
        ? height - ((point.current - yAxisMin) / (yAxisMax - yAxisMin)) * height
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

    const tooltipWidth = screenWidth * 0.4; // 40% of screen width
    const tooltipHeight = screenHeight * 0.08; // 8% of screen height

    // Smart tooltip positioning
    let x = relativeX - tooltipWidth / 2;
    let y = relativeY - tooltipHeight - screenHeight * 0.02;

    // Horizontal boundary checks
    if (x < screenWidth * 0.01) {
      x = screenWidth * 0.01;
    } else if (x + tooltipWidth > chartWidth - screenWidth * 0.01) {
      x = chartWidth - tooltipWidth - screenWidth * 0.01;
    }

    // Vertical boundary checks
    if (y < screenHeight * 0.01) {
      y = relativeY + screenHeight * 0.02; // Show below touch point
    }
    if (y + tooltipHeight > chartHeight - screenHeight * 0.01) {
      y = chartHeight - tooltipHeight - screenHeight * 0.01;
    }

    setTooltip({
      visible: true,
      x,
      y,
      timestamp: nearestPoint.timestamp,
      current: nearestPoint.current.toFixed(1),
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

  const yAxisWidth = screenWidth * 0.12; // 12% of screen width
  const xAxisHeight = screenHeight * 0.05; // 5% of screen height

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={styles.scrollView}
    >
      <StatusBar translucent backgroundColor="transparent" style="light" />
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Icon name="arrow-left" style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.currentText}>Current Consumption</Text>

      <View style={styles.imageContainer}>
        <Image source={currentImg} style={styles.image} resizeMode="cover" />
      </View>

      <View
        style={[
          styles.chartWrapper,
          { height: chartHeight + xAxisHeight + screenHeight * 0.04 },
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

                {/* Tooltip - now showing full timestamp */}
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
                      Current: {tooltip.current} A
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

      {maxValue && (
        <View style={styles.maxValueBox}>
          <View style={styles.maxValueContent}>
            <Text style={[styles.maxText, isMobile && styles.maxTextMobile]}>
              <Text style={styles.maxValueLabel}>🔹 Max Current: </Text>
              <Text style={styles.maxValue}>
                {maxValue.current.toFixed(1)} A{" "}
              </Text>
            </Text>
            <Text
              style={[
                styles.maxValueTimestamp,
                isMobile && styles.maxValueTimestampMobile,
              ]}
            >
              {maxValue.timestamp}
            </Text>
            {averageCurrent !== null && (
              <Text style={[styles.avgText, isMobile && styles.maxTextMobile]}>
                <Text style={styles.maxValueLabel}>➕ Avg Current: </Text>
                <Text style={styles.maxValue}>
                  {averageCurrent.toFixed(1)} A
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
    padding: Dimensions.get("window").width * 0.025, // 2.5% of screen width
    alignItems: "stretch",
    backgroundColor: "#111",
    width: "100%",
    minHeight: "100%",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#121212",
  },
  chartWrapper: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: Dimensions.get("window").width * 0.02, // 2% of screen width
    width: "100%",
    marginBottom: Dimensions.get("window").height * 0.015, // 1.5% of screen height
    marginTop: Dimensions.get("window").height * 0.01, // 3% of screen height
    backgroundColor: "#222",
    padding: Dimensions.get("window").width * 0.04, // 4% of screen width
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
  },
  loadingText: {
    color: "white",
    marginTop: Dimensions.get("window").height * 0.015, // 1.5% of screen height
    fontSize: Dimensions.get("window").width * 0.035, // 3.5% of screen width
    fontFamily: "Inter, sans-serif",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
  },
  noDataText: {
    color: "white",
    fontSize: Dimensions.get("window").width * 0.04, // 4% of screen width
    fontFamily: "Inter, sans-serif",
  },
  chartMainContainer: {
    flex: 1,
    flexDirection: "row",
  },
  yAxisContainer: {
    justifyContent: "space-between",
    paddingVertical: Dimensions.get("window").height * 0.01, // 1% of screen height
    paddingRight: Dimensions.get("window").width * 0.02, // 2% of screen width
    backgroundColor: "#222",
  },
  yAxisLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: Dimensions.get("window").width * 0.028, // 2.8% of screen width
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
    paddingTop: Dimensions.get("window").height * 0.01, // 1% of screen height
    paddingHorizontal: Dimensions.get("window").width * 0.012, // 1.2% of screen width
  },
  xAxisLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: Dimensions.get("window").width * 0.025, // 2.5% of screen width
    fontFamily: "Inter, sans-serif",
    fontWeight: "400",
    textAlign: "center",
    flex: 1,
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "rgba(30, 30, 30, 0.95)",
    padding: Dimensions.get("window").width * 0.02, // 2% of screen width
    borderRadius: Dimensions.get("window").width * 0.01, // 1% of screen width
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: "#00d4d4",
    minWidth: Dimensions.get("window").width * 0.4, // 40% of screen width
  },
  tooltipText: {
    color: "#FFFFFF",
    fontSize: Dimensions.get("window").width * 0.025, // 2.5% of screen width
    fontFamily: "Inter, sans-serif",
    fontWeight: "500",
    lineHeight: Dimensions.get("window").width * 0.04, // 4% of screen width
  },
  maxValueBox: {
    marginTop: 0,
    backgroundColor: "#111",
    padding: 0,
    alignItems: "center",
    width: "100%",
    borderRadius: Dimensions.get("window").width * 0.02, // 2% of screen width
  },
  maxValueContent: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 1,
  },
  maxText: {
    color: "#92F1F1",
    fontSize: Dimensions.get("window").width * 0.04, // 4% of screen width
    textAlign: "center",
    flexShrink: 1,
    fontFamily: "Inter, sans-serif",
    fontWeight: "600",
  },
  avgText: {
    color: "#92F1F1",
    fontSize: Dimensions.get("window").width * 0.04, // 4% of screen width
    textAlign: "center",
    paddingTop: Dimensions.get("window").height * 0.009, // 2% of screen height
    flexShrink: 1,
    fontFamily: "Inter, sans-serif",
    fontWeight: "600",
  },
  maxTextMobile: {
    fontSize: Dimensions.get("window").width * 0.035, // 3.5% of screen width
    lineHeight: Dimensions.get("window").width * 0.045, // 4.5% of screen width
  },
  maxValueLabel: {
    color: "#92F1F1",
    fontSize: Dimensions.get("window").width * 0.04, // 4% of screen width
    fontFamily: "Inter, sans-serif",
    fontWeight: "600",
  },
  maxValue: {
    color: "#92F1F1",
    fontWeight: "bold",
    fontSize: Dimensions.get("window").width * 0.04, // 4% of screen width
    fontFamily: "Inter, sans-serif",
  },
  maxValueTimestamp: {
    color: "#92F1F1",
    fontSize: Dimensions.get("window").width * 0.035, // 3.5% of screen width
    marginTop: Dimensions.get("window").height * 0.008, // 0.8% of screen height
    textAlign: "center",
    fontFamily: "Inter, sans-serif",
    fontWeight: "600",
  },
  maxValueTimestampMobile: {
    fontSize: Dimensions.get("window").width * 0.03, // 3% of screen width
  },
  currentText: {
    fontSize: Dimensions.get("window").width * 0.06, // 7% of screen width
    fontWeight: "bold",
    marginBottom: Dimensions.get("window").height * 0.01, // 2% of screen height
    marginTop: Dimensions.get("window").height * 0.02, // 4% of screen height
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
    height: Dimensions.get("window").height * 0.35, // 35% of screen height
    minWidth: "100%",
  },
  backButton: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.015, // 1.5% of screen height
    left: Dimensions.get("window").width * 0.025, // 2.5% of screen width
    zIndex: 1,
  },
  backIcon: {
    fontSize: Dimensions.get("window").width * 0.06, // 6% of screen width
    tintColor: "#92F1F1",
    color: "#92F1F1",
  },
});

export default MachineCurrentScreen;

// import { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   Dimensions,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   StatusBar,
//   Platform,
// } from "react-native";
// import axios from "axios";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import Icon from "react-native-vector-icons/FontAwesome";
// import { Svg, Path, LinearGradient, Stop, Defs } from "react-native-svg";
// import currentImg from "../../assets/chartImages/3515462.jpg";

// const MachineCurrentScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { endPoint } = route.params || {};

//   console.log("endpoint of current is ", endPoint);

//   const [data, setData] = useState([]);
//   const [maxValue, setMaxValue] = useState(null);
//   const [averageCurrent, setAverageCurrent] = useState(null);
//   const [screenWidth, setScreenWidth] = useState(
//     Dimensions.get("window").width
//   );
//   const [screenHeight, setScreenHeight] = useState(
//     Dimensions.get("window").height
//   );
//   const [loading, setLoading] = useState(true);
//   const [tooltip, setTooltip] = useState({
//     visible: false,
//     x: 0,
//     y: 0,
//     timestamp: "",
//     current: 0,
//   });
//   const [chartDimensions, setChartDimensions] = useState({
//     width: 0,
//     height: 0,
//     x: 0,
//     y: 0,
//   });
//   const chartContainerRef = useRef(null);

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

//   const chartHeight = Math.min(
//     screenHeight * 0.75,
//     screenWidth < 768 ? 300 : 400
//   );

//   const fetchData = async (isInitial = false) => {
//     if (isInitial) {
//       setLoading(true);
//     }

//     try {
//       const response = await axios.get(`${endPoint}`);
//       const sensorData = response.data;

//       // console.log("API response:", sensorData);

//       if (
//         sensorData?.data &&
//         Array.isArray(sensorData.data) &&
//         sensorData.data.length > 0
//       ) {
//         const parsedData = sensorData.data.map((item) => ({
//           ...item,
//           jsTimestamp: new Date(item.timestamp.replace(" ", "T")).getTime(),
//           time: item.timestamp.split(" ")[1],
//           current: Number.isFinite(item.current) ? item.current : 0,
//         }));

//         console.log("Parsed data sample:", parsedData.slice(0, 2));

//         const sortedData = parsedData
//           .sort((a, b) => b.jsTimestamp - a.jsTimestamp)
//           .slice(0, 50)
//           .sort((a, b) => a.jsTimestamp - b.jsTimestamp);

//         console.log("Sorted data length:", sortedData.length);
//         console.log("Sorted data sample:", sortedData.slice(0, 2));

//         setData(sortedData);

//         if (sortedData.length > 0) {
//           const maxCurrentEntry = sortedData.reduce((max, item) =>
//             item.current > max.current
//               ? { ...item, current: Number.parseFloat(item.current.toFixed(1)) }
//               : max
//           );
//           setMaxValue(maxCurrentEntry);

//           const totalCurrent = sortedData.reduce(
//             (sum, item) => sum + item.current,
//             0
//           );
//           const avgCurrent = sortedData.length
//             ? Number.parseFloat((totalCurrent / sortedData.length).toFixed(1))
//             : null;
//           setAverageCurrent(avgCurrent);
//         }
//       } else {
//         console.log("No data received from API");
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData(true);
//     const interval = setInterval(fetchData, 5000);
//     return () => clearInterval(interval);
//   }, [endPoint]);

//   const minCurrent =
//     data.length > 0 ? Math.min(...data.map((point) => point.current)) : 0;
//   const maxCurrentValue =
//     data.length > 0 ? Math.max(...data.map((point) => point.current)) : 0;
//   const padding = (maxCurrentValue - minCurrent || 1) * 0.1;
//   const yAxisMin = Number.isFinite(minCurrent - padding)
//     ? Math.floor((minCurrent - padding) * 100) / 100
//     : 0;
//   const yAxisMax = Number.isFinite(maxCurrentValue + padding)
//     ? Math.ceil((maxCurrentValue + padding) * 100) / 100
//     : 1;

//   const yAxisLabels = [];
//   const numLabels = 6;
//   for (let i = 0; i < numLabels; i++) {
//     const value = yAxisMin + (i * (yAxisMax - yAxisMin)) / (numLabels - 1);
//     yAxisLabels.push(Number.isFinite(value) ? value.toFixed(1) : "0.0");
//   }
//   yAxisLabels.reverse();

//   const isMobile = screenWidth < 768;

//   // Get properly spaced X-axis labels
//   const getXAxisLabels = () => {
//     if (data.length === 0) return [];

//     const maxLabels = isMobile ? 4 : 6;
//     const step = Math.max(1, Math.floor(data.length / maxLabels));
//     const labels = [];

//     for (let i = 0; i < data.length; i += step) {
//       if (labels.length < maxLabels) {
//         labels.push({
//           time: data[i].time,
//           index: i,
//         });
//       }
//     }

//     // Always include the last point if it's not already included
//     if (
//       labels.length > 0 &&
//       labels[labels.length - 1].index !== data.length - 1
//     ) {
//       labels[labels.length - 1] = {
//         time: data[data.length - 1].time,
//         index: data.length - 1,
//       };
//     }

//     return labels;
//   };

//   const createPath = () => {
//     if (data.length === 0) return "";

//     const width = 100;
//     const height = 100;

//     const points = data.map((point, index) => {
//       const x = (index / (data.length - 1)) * width;
//       const y = Number.isFinite(point.current)
//         ? height - ((point.current - yAxisMin) / (yAxisMax - yAxisMin)) * height
//         : height;
//       return `${x},${y}`;
//     });

//     const pathData = `M 0,${height} L ${points.join(
//       " L "
//     )} L ${width},${height} Z`;
//     return pathData;
//   };

//   const createLine = () => {
//     if (data.length === 0) return "";

//     const width = 100;
//     const height = 100;

//     const points = data.map((point, index) => {
//       const x = (index / (data.length - 1)) * width;
//       const y = Number.isFinite(point.current)
//         ? height - ((point.current - yAxisMin) / (yAxisMax - yAxisMin)) * height
//         : height;
//       return `${x},${y}`;
//     });

//     const lineData = `M ${points.join(" L ")}`;
//     return lineData;
//   };

//   const handleTouchMove = (e) => {
//     if (data.length === 0) return;

//     const { width: chartWidth, height: chartHeight } = chartDimensions;
//     if (!chartWidth || !chartHeight) return;

//     const touch = e.nativeEvent.touches?.[0];
//     if (!touch) return;

//     const { locationX, locationY } = touch;
//     const relativeX = locationX || 0;
//     const relativeY = locationY || 0;

//     // Ensure touch is within chart bounds
//     if (
//       relativeX < 0 ||
//       relativeX > chartWidth ||
//       relativeY < 0 ||
//       relativeY > chartHeight
//     ) {
//       return;
//     }

//     // Find the nearest data point
//     const index = Math.round((relativeX / chartWidth) * (data.length - 1));
//     const nearestPoint = data[Math.max(0, Math.min(index, data.length - 1))];

//     if (!nearestPoint) return;

//     const tooltipWidth = 160;
//     const tooltipHeight = 60;

//     // Smart tooltip positioning
//     let x = relativeX - tooltipWidth / 2;
//     let y = relativeY - tooltipHeight - 15;

//     // Horizontal boundary checks
//     if (x < 5) {
//       x = 5;
//     } else if (x + tooltipWidth > chartWidth - 5) {
//       x = chartWidth - tooltipWidth - 5;
//     }

//     // Vertical boundary checks
//     if (y < 5) {
//       y = relativeY + 15; // Show below touch point
//     }
//     if (y + tooltipHeight > chartHeight - 5) {
//       y = chartHeight - tooltipHeight - 5;
//     }

//     setTooltip({
//       visible: true,
//       x,
//       y,
//       timestamp: nearestPoint.timestamp,
//       current: nearestPoint.current.toFixed(1),
//     });
//   };

//   const handleTouchStart = (e) => {
//     handleTouchMove(e);
//   };

//   const handleTouchEnd = () => {
//     // Keep tooltip visible for a moment
//     setTimeout(() => {
//       setTooltip((prev) => ({ ...prev, visible: false }));
//     }, 1500);
//   };

//   const handleChartLayout = (event) => {
//     const { x, y, width, height } = event.nativeEvent.layout;
//     setChartDimensions({ x, y, width, height });
//   };

//   const yAxisWidth = isMobile ? 45 : 50;
//   const xAxisHeight = 35;

//   return (
//     <ScrollView
//       contentContainerStyle={styles.container}
//       style={styles.scrollView}
//     >
//       <StatusBar translucent backgroundColor="transparent" style="light" />
//       <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
//         <Icon name="arrow-left" style={styles.backIcon} />
//       </TouchableOpacity>
//       <Text style={styles.currentText}>Current Consumption</Text>

//       <View style={styles.imageContainer}>
//         <Image source={currentImg} style={styles.image} resizeMode="cover" />
//       </View>

//       <View
//         style={[
//           styles.chartWrapper,
//           { height: chartHeight + xAxisHeight + 30 },
//         ]}
//       >
//         {loading ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#00ff00" />
//             <Text style={styles.loadingText}>Loading data...</Text>
//           </View>
//         ) : data.length === 0 ? (
//           <View style={styles.noDataContainer}>
//             <Text style={styles.noDataText}>No data available</Text>
//           </View>
//         ) : (
//           <View style={styles.chartMainContainer}>
//             {/* Y-axis labels */}
//             <View
//               style={[
//                 styles.yAxisContainer,
//                 { width: yAxisWidth, height: chartHeight },
//               ]}
//             >
//               {yAxisLabels.map((label, index) => (
//                 <Text key={index} style={styles.yAxisLabel}>
//                   {label}
//                 </Text>
//               ))}
//             </View>

//             {/* Chart area */}
//             <View style={styles.chartColumn}>
//               <View
//                 style={[styles.chartArea, { height: chartHeight }]}
//                 onLayout={handleChartLayout}
//                 onTouchMove={handleTouchMove}
//                 onTouchStart={handleTouchStart}
//                 onTouchEnd={handleTouchEnd}
//               >
//                 <Svg
//                   height={chartHeight}
//                   width="100%"
//                   viewBox="0 0 100 100"
//                   preserveAspectRatio="none"
//                   style={styles.svgChart}
//                 >
//                   <Defs>
//                     <LinearGradient
//                       id="gradient"
//                       x1="0%"
//                       y1="0%"
//                       x2="100%"
//                       y2="0%"
//                     >
//                       <Stop offset="0%" stopColor="#2BFFFF" stopOpacity={0.8} />
//                       <Stop
//                         offset="100%"
//                         stopColor="#009D9D"
//                         stopOpacity={0.8}
//                       />
//                     </LinearGradient>
//                   </Defs>

//                   {/* Horizontal grid lines */}
//                   {[0, 20, 40, 60, 80, 100].map((y, index) => (
//                     <Path
//                       key={`h-${index}`}
//                       d={`M 0 ${y} H 100`}
//                       stroke="rgba(255,255,255,0.1)"
//                       strokeWidth={0.5}
//                     />
//                   ))}

//                   {/* Vertical grid lines */}
//                   {getXAxisLabels().map((_, index) => {
//                     const x = (index / (getXAxisLabels().length - 1)) * 100;
//                     return (
//                       <Path
//                         key={`v-${index}`}
//                         d={`M ${x} 0 V 100`}
//                         stroke="rgba(255,255,255,0.1)"
//                         strokeWidth={0.5}
//                       />
//                     );
//                   })}

//                   {/* Chart data */}
//                   <Path d={createPath()} fill="url(#gradient)" opacity={0.8} />
//                   <Path
//                     d={createLine()}
//                     fill="none"
//                     stroke="#00d4d4"
//                     strokeWidth={0.5}
//                   />
//                 </Svg>

//                 {/* Tooltip - now showing full timestamp */}
//                 {tooltip.visible && (
//                   <View
//                     style={[
//                       styles.tooltip,
//                       {
//                         left: tooltip.x,
//                         top: tooltip.y,
//                       },
//                     ]}
//                   >
//                     <Text style={styles.tooltipText}>
//                       Time: {tooltip.timestamp}
//                     </Text>
//                     <Text style={styles.tooltipText}>
//                       Current: {tooltip.current} A
//                     </Text>
//                   </View>
//                 )}
//               </View>

//               {/* X-axis labels */}
//               <View style={[styles.xAxisContainer, { height: xAxisHeight }]}>
//                 {getXAxisLabels().map((label, index) => (
//                   <Text key={index} style={styles.xAxisLabel}>
//                     {label.time}
//                   </Text>
//                 ))}
//               </View>
//             </View>
//           </View>
//         )}
//       </View>

//       {maxValue && (
//         <View style={styles.maxValueBox}>
//           <View style={styles.maxValueContent}>
//             <Text style={[styles.maxText, isMobile && styles.maxTextMobile]}>
//               <Text style={styles.maxValueLabel}>🔹 Max Current: </Text>
//               <Text style={styles.maxValue}>
//                 {maxValue.current.toFixed(1)} A{" "}
//               </Text>
//             </Text>
//             <Text
//               style={[
//                 styles.maxValueTimestamp,
//                 isMobile && styles.maxValueTimestampMobile,
//               ]}
//             >
//               {maxValue.timestamp}
//             </Text>
//             {averageCurrent !== null && (
//               <Text style={[styles.avgText, isMobile && styles.maxTextMobile]}>
//                 <Text style={styles.maxValueLabel}>➕ Avg Current: </Text>
//                 <Text style={styles.maxValue}>
//                   {averageCurrent.toFixed(1)} A
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
//     borderColor: "#FFFFFF",
//     borderRadius: 8,
//     width: "100%",
//     marginBottom: 10,
//     marginTop: 20,
//     backgroundColor: "#222",
//     padding: 15,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#222",
//   },
//   loadingText: {
//     color: "white",
//     marginTop: 10,
//   },
//   noDataContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#222",
//   },
//   noDataText: {
//     color: "white",
//     fontSize: 16,
//   },
//   chartMainContainer: {
//     flex: 1,
//     flexDirection: "row",
//   },
//   yAxisContainer: {
//     justifyContent: "space-between",
//     paddingVertical: 8,
//     paddingRight: 8,
//     backgroundColor: "#222",
//   },
//   yAxisLabel: {
//     color: "rgba(255,255,255,0.8)",
//     fontSize: 11,
//     fontFamily: "Inter, sans-serif",
//     fontWeight: "400",
//     textAlign: "right",
//   },
//   chartColumn: {
//     flex: 1,
//     flexDirection: "column",
//   },
//   chartArea: {
//     position: "relative",
//     backgroundColor: "transparent",
//     flex: 1,
//   },
//   svgChart: {
//     backgroundColor: "transparent",
//   },
//   xAxisContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingTop: 8,
//     paddingHorizontal: 5,
//   },
//   xAxisLabel: {
//     color: "rgba(255,255,255,0.8)",
//     fontSize: 10,
//     fontFamily: "Inter, sans-serif",
//     fontWeight: "400",
//     textAlign: "center",
//     flex: 1,
//   },
//   tooltip: {
//     position: "absolute",
//     backgroundColor: "rgba(30, 30, 30, 0.95)",
//     padding: 8,
//     borderRadius: 4,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 8,
//     zIndex: 1000,
//     borderWidth: 1,
//     borderColor: "#00d4d4",
//     minWidth: 160,
//   },
//   tooltipText: {
//     color: "#FFFFFF",
//     fontSize: 10,
//     fontFamily: "Inter, sans-serif",
//     fontWeight: "500",
//     lineHeight: 16,
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
//     fontFamily: "Inter, sans-serif",
//     fontWeight: "600",
//   },
//   avgText: {
//     color: "#92F1F1",
//     fontSize: 16,
//     textAlign: "center",
//     paddingTop: 15,
//     flexShrink: 1,
//     fontFamily: "Inter, sans-serif",
//     fontWeight: "600",
//   },
//   maxTextMobile: {
//     fontSize: 14,
//     lineHeight: 18,
//   },
//   maxValueLabel: {
//     color: "#92F1F1",
//     fontSize: 16,
//     fontFamily: "Inter, sans-serif",
//     fontWeight: "600",
//   },
//   maxValue: {
//     color: "#92F1F1",
//     fontWeight: "bold",
//     fontSize: 16,
//     fontFamily: "Inter, sans-serif",
//   },
//   maxValueTimestamp: {
//     color: "#92F1F1",
//     fontSize: 14,
//     marginTop: 5,
//     textAlign: "center",
//     fontFamily: "Inter, sans-serif",
//     fontWeight: "600",
//   },
//   maxValueTimestampMobile: {
//     fontSize: 12,
//   },
//   currentText: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 15,
//     marginTop: 30,
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

// export default MachineCurrentScreen;

// import { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Dimensions,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   StatusBar,
//   Platform,
// } from "react-native";
// import { WebView } from "react-native-webview";
// import currentImg from "../../assets/chartImages/3515462.jpg";
// import axios from "axios";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import Icon from "react-native-vector-icons/FontAwesome";

// const MachineCurrentScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation();

//   const { endPoint } = route.params || {};

//   console.log("endpoint of current is ", endPoint);

//   const [data, setData] = useState([]);
//   const [maxValue, setMaxValue] = useState(null);
//   const [averageCurrent, setAverageCurrent] = useState(null);
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

//   const chartHeight = Math.min(
//     screenHeight * 0.6,
//     screenWidth < 768 ? 400 : 500
//   );
//   const [loading, setLoading] = useState(true); // only for first time
//   const [refreshing, setRefreshing] = useState(false); // for later fetches

//   const fetchData = async (isInitial = false) => {
//     if (isInitial) {
//       setLoading(true); // first time loading
//     } else {
//       setRefreshing(true); // refreshing
//     }

//     try {
//       const response = await axios.get(`${endPoint}`);

//       //  const response = await axios.get(api);
//       const sensorData = response.data;

//       // if (
//       //   sensorData?.data &&
//       //   Array.isArray(sensorData.data) &&
//       //   sensorData.data.length > 0
//       // )
//       // console.log("Response data:", response.data);

//       console.log("outside data ");

//       console.log(response.data && response.data.length > 0);
//       // if (
//       //   sensorData?.data &&
//       //   Array.isArray(sensorData.data) &&
//       //   sensorData.data.length > 0
//       // ) {
//       //   console.log("outside inside ");
//       //   const parsedData = response.data.map((item) => ({
//       //     ...item,
//       //     jsTimestamp: new Date(item.timestamp.replace(" ", "T")).getTime(),
//       //   }));

//       //   const sortedData = parsedData.sort(
//       //     (a, b) => a.jsTimestamp - b.jsTimestamp
//       //   );
//       //   const limitedData = sortedData.slice(-100);

//       //   console.log("limited data is ", limitedData);
//       //   // console.log("Fetched data length:", limitedData.length);
//       //   // console.log("Sample data:", limitedData.slice(0, 2));

//       //   setData(limitedData);
//       //   setMaxValue(
//       //     limitedData.reduce((max, item) =>
//       //       item.current > max.current
//       //         ? { ...item, current: Number.parseFloat(item.current.toFixed(1)) }
//       //         : max
//       //     )
//       //   );

//       //   const totalCurrent = limitedData.reduce(
//       //     (sum, item) => sum + item.current,
//       //     0
//       //   );
//       //   const avgCurrent = limitedData.length
//       //     ? Number.parseFloat((totalCurrent / limitedData.length).toFixed(1))
//       //     : null;
//       //   setAverageCurrent(avgCurrent);
//       // } else {
//       //   console.log("No data received from API");
//       // }

//       if (
//         sensorData?.data &&
//         Array.isArray(sensorData.data) &&
//         sensorData.data.length > 0
//       ) {
//         const parsedData = sensorData.data.map((item) => ({
//           ...item,
//           jsTimestamp: new Date(item.timestamp.replace(" ", "T")).getTime(),
//         }));

//         const sortedData = parsedData.sort(
//           (a, b) => a.jsTimestamp - b.jsTimestamp
//         );
//         const limitedData = sortedData.slice(-100);

//         setData(limitedData);
//         setMaxValue(
//           limitedData.reduce((max, item) =>
//             item.current > max.current
//               ? { ...item, current: Number.parseFloat(item.current.toFixed(1)) }
//               : max
//           )
//         );

//         const totalCurrent = limitedData.reduce(
//           (sum, item) => sum + item.current,
//           0
//         );
//         const avgCurrent = limitedData.length
//           ? Number.parseFloat((totalCurrent / limitedData.length).toFixed(1))
//           : null;
//         setAverageCurrent(avgCurrent);
//       } else {
//         console.log("No data received from API");
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       if (isInitial) {
//         setLoading(false); // done loading first time
//       } else {
//         setRefreshing(false); // done refreshing
//       }
//     }
//   };

//   useEffect(() => {
//     // fetchData();
//     fetchData(true);
//     const interval = setInterval(fetchData, 5000);
//     return () => clearInterval(interval);
//   }, [endPoint]);

//   const categories = data.map((item) => item.timestamp.split(" ")[1]);
//   const seriesData = data.map((item) => item.current);

//   // Debug chart data
//   console.log("Categories length:", categories.length);
//   console.log("Series data length:", seriesData.length);
//   console.log("Sample categories:", categories.slice(0, 2));
//   console.log("Sample series data:", seriesData.slice(0, 2));

//   const isMobile = screenWidth < 768;
//   const chartHTML = `
//   <!DOCTYPE html>
//   <html>
//     <head>
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <script src="https://code.highcharts.com/highcharts.js"></script>
//       <style>
//         html, body {
//           margin: 0;
//           padding: 0;
//           background-color: #222;
//           height: 100%;
//         }
//         #chart {
//           height: 100%;
//           width: 100%;
//         }
//       </style>
//     </head>
//     <body>
//       <div id="chart"></div>
//       <script>
//         document.addEventListener("DOMContentLoaded", function () {
//           try {
//             Highcharts.chart('chart', {
//               chart: {
//                 type: 'line',
//                 backgroundColor: '#222',
//                 height: ${chartHeight},
//                 spacingTop: ${isMobile ? 15 : 30},
//                 spacingBottom: ${isMobile ? 15 : 30}
//               },
//               title: {
//                 text: 'Current Consumption Trend',
//                 style: {
//                   color: '#92F1F1',
//                   fontSize: '${isMobile ? "17px" : "25px"}'
//                 }
//               },
//               xAxis: {
//                 categories: ${JSON.stringify(categories)},
//                 title: {
//                   text: 'Timestamp',
//                   style: { color: '#D7D7D7', fontSize: '${
//                     isMobile ? "10px" : "14px"
//                   }' }
//                 },
//                 labels: {
//                   style: { color: '#D7D7D7', fontSize: '${
//                     isMobile ? "8px" : "12px"
//                   }' },
//                   rotation: ${isMobile ? -45 : 0},
//                   align: 'right'
//                 },
//                 tickInterval: ${Math.ceil(categories.length / 10)},
//                 lineColor: '#92F1F1',
//                 gridLineColor: '#444'
//               },
//               yAxis: {
//                 title: {
//                   text: 'Current (A)',
//                   style: { color: '#D7D7D7', fontSize: '${
//                     isMobile ? "10px" : "14px"
//                   }' }
//                 },
//                 labels: { style: { color: '#D7D7D7', fontSize: '${
//                   isMobile ? "8px" : "12px"
//                 }' } },
//                 min: 0,
//                 gridLineColor: '#555'
//               },
//               series: [{
//                 name: 'Current',
//                 data: ${JSON.stringify(seriesData)},
//                 color: '#92F1F1',
//                 lineWidth: ${isMobile ? 1 : 2},
//                 marker: { enabled: true, radius: ${isMobile ? 2 : 4} }
//               }],
//               tooltip: {
//                 backgroundColor: '#333',
//                 style: { color: '#92F1F1', fontSize: '${
//                   isMobile ? "8px" : "12px"
//                 }' },
//                 formatter: function () {
//                   const point = ${JSON.stringify(data)}[this.point.index];
//                   return '<b>Time:</b> ' + point.timestamp + '<br><b>Current:</b> ' + point.current.toFixed(2) + ' A';
//                 },
//                 useHTML: true
//               },
//               legend: {
//                 itemStyle: { color: '#D7D7D7', fontSize: '${
//                   isMobile ? "9px" : "13px"
//                 }' }
//               },
//               credits: { enabled: false }
//             });
//           } catch (error) {
//             console.error('Highcharts error:', error);
//           }
//         });
//       </script>
//     </body>
//   </html>
// `;

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
//       <Text style={styles.currentText}>Current Consumption</Text>

//       <View
//         style={styles.imageContainer}
//         onLayout={(event) => {
//           console.log("Image container width:", event.nativeEvent.layout.width);
//         }}
//       >
//         <Image source={currentImg} style={styles.image} resizeMode="cover" />
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

//       {maxValue && (
//         <View style={styles.maxValueBox}>
//           <View style={styles.maxValueContent}>
//             <Text style={[styles.maxText, isMobile && styles.maxTextMobile]}>
//               <Text style={styles.maxValueLabel}>🔹 Max Current: </Text>
//               <Text style={styles.maxValue}>
//                 {maxValue.current.toFixed(1)} A{" "}
//               </Text>
//             </Text>
//             <Text
//               style={[
//                 styles.maxValueTimestamp,
//                 isMobile && styles.maxValueTimestampMobile,
//               ]}
//             >
//               {maxValue.timestamp}
//             </Text>
//             {averageCurrent !== null && (
//               <Text style={[styles.avgText, isMobile && styles.maxTextMobile]}>
//                 <Text style={styles.maxValueLabel}>➕ Avg Current: </Text>
//                 <Text style={styles.maxValue}>
//                   {averageCurrent.toFixed(1)} A
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
//   avgText: {
//     color: "#92F1F1",
//     fontSize: 16,
//     textAlign: "center",
//     paddingTop: 15,
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
//   maxValueTimestampMobile: {
//     fontSize: 12,
//   },
//   currentText: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 15,
//     marginTop: 30,
//     color: "#92F1F1",
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

// export default MachineCurrentScreen;
