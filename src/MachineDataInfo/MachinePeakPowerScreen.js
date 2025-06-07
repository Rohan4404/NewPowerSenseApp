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

  // Enhanced responsive calculations
  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;
  const isDesktop = screenWidth >= 1024;

  // Responsive dimensions
  const responsiveDimensions = {
    // Container padding
    containerPadding: screenWidth * 0.025,

    // Chart dimensions
    chartHeight: Math.min(
      screenHeight * (isMobile ? 0.45 : isTablet ? 0.5 : 0.55),
      isMobile ? screenWidth * 0.75 : screenWidth * 0.6
    ),
    chartWidth: screenWidth * (isMobile ? 0.95 : 0.9),

    // Font sizes
    titleFontSize: screenWidth * (isMobile ? 0.055 : isTablet ? 0.045 : 0.04),
    headerFontSize: screenWidth * (isMobile ? 0.038 : isTablet ? 0.035 : 0.032),
    buttonFontSize: screenWidth * (isMobile ? 0.032 : isTablet ? 0.028 : 0.025),
    maxValueFontSize:
      screenWidth * (isMobile ? 0.038 : isTablet ? 0.035 : 0.032),
    timestampFontSize:
      screenWidth * (isMobile ? 0.032 : isTablet ? 0.028 : 0.025),
    loadingFontSize:
      screenWidth * (isMobile ? 0.035 : isTablet ? 0.032 : 0.028),

    // Chart font sizes
    chartTitleFontSize:
      screenWidth * (isMobile ? 0.035 : isTablet ? 0.032 : 0.028),
    chartAxisTitleFontSize:
      screenWidth * (isMobile ? 0.028 : isTablet ? 0.025 : 0.022),
    chartLabelFontSize:
      screenWidth * (isMobile ? 0.022 : isTablet ? 0.02 : 0.018),
    tooltipFontSize: screenWidth * (isMobile ? 0.022 : isTablet ? 0.02 : 0.018),

    // Spacing and margins
    sectionMarginTop:
      screenHeight * (isMobile ? 0.009 : isTablet ? 0.025 : 0.01),
    sectionMarginBottom:
      screenHeight * (isMobile ? 0.015 : isTablet ? 0.02 : 0.025),
    headerPaddingVertical:
      screenHeight * (isMobile ? 0.01 : isTablet ? 0.012 : 0.015),
    headerPaddingHorizontal:
      screenWidth * (isMobile ? 0.025 : isTablet ? 0.03 : 0.035),
    buttonPaddingVertical:
      screenHeight * (isMobile ? 0.008 : isTablet ? 0.01 : 0.012),
    buttonPaddingHorizontal:
      screenWidth * (isMobile ? 0.025 : isTablet ? 0.03 : 0.035),

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

    // Chart spacing - Increased right spacing to prevent cutoff
    chartSpacingTop:
      screenHeight * (isMobile ? 0.015 : isTablet ? 0.02 : 0.025),
    chartSpacingBottom:
      screenHeight * (isMobile ? 0.015 : isTablet ? 0.02 : 0.025),
    chartSpacingLeft: screenWidth * (isMobile ? 0.02 : isTablet ? 0.025 : 0.03),
    chartSpacingRight: screenWidth * (isMobile ? 0.06 : isTablet ? 0.08 : 0.1), // Increased significantly

    // Bar width
    barWidth: isMobile
      ? screenWidth * 0.025
      : isTablet
      ? screenWidth * 0.02
      : screenWidth * 0.015,

    // Tooltip padding
    tooltipPadding: screenWidth * (isMobile ? 0.02 : isTablet ? 0.018 : 0.015),
    tooltipInnerPadding:
      screenWidth * (isMobile ? 0.01 : isTablet ? 0.008 : 0.006),
  };

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
                height: ${responsiveDimensions.chartHeight},
                width: ${responsiveDimensions.chartWidth},
                spacingTop: ${responsiveDimensions.chartSpacingTop},
                spacingBottom: ${responsiveDimensions.chartSpacingBottom},
                spacingLeft: ${responsiveDimensions.chartSpacingLeft},
                spacingRight: ${responsiveDimensions.chartSpacingRight}
              },
              title: { 
                text: 'POWER PEAK PER HOUR', 
                style: { 
                  color: '#FFFFFF', 
                  fontSize: '${responsiveDimensions.chartTitleFontSize}px',
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
                    fontSize: '${
                      responsiveDimensions.chartAxisTitleFontSize
                    }px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '600'
                  } 
                },
                labels: { 
                  style: { 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontSize: '${responsiveDimensions.chartLabelFontSize}px',
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
                    fontSize: '${
                      responsiveDimensions.chartAxisTitleFontSize
                    }px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '600'
                  } 
                },
                labels: { 
                  style: { 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontSize: '${responsiveDimensions.chartLabelFontSize}px',
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
                pointWidth: ${responsiveDimensions.barWidth},
                borderRadiusTopLeft: 5,
                borderRadiusTopRight: 5,
                borderWidth: 0
              }],
              tooltip: {
                backgroundColor: '#F5F5F5',
                style: { 
                  color: '#000000', 
                  fontSize: '${responsiveDimensions.tooltipFontSize}px',
                  fontFamily: 'Inter, sans-serif'
                },
                borderRadius: 4,
                padding: ${responsiveDimensions.tooltipPadding},
                positioner: function (labelWidth, labelHeight, point) {
                  var chart = this.chart;
                  var plotLeft = chart.plotLeft;
                  var plotTop = chart.plotTop;
                  var plotWidth = chart.plotWidth;
                  var plotHeight = chart.plotHeight;
                  
                  var x = point.plotX + plotLeft;
                  var y = point.plotY + plotTop;
                  
                  // Adjust horizontal position to prevent cutoff
                  if (x + labelWidth > plotLeft + plotWidth) {
                    x = plotLeft + plotWidth - labelWidth - 10;
                  }
                  if (x < plotLeft) {
                    x = plotLeft + 10;
                  }
                  
                  // Adjust vertical position to prevent cutoff
                  if (y - labelHeight < plotTop) {
                    y = plotTop + labelHeight + 10;
                  }
                  if (y > plotTop + plotHeight) {
                    y = plotTop + plotHeight - 10;
                  }
                  
                  return { x: x, y: y - labelHeight };
                },
                formatter: function () {
                  const point = ${JSON.stringify(data)}[this.point.index];
                  return '<div style="padding: ${
                    responsiveDimensions.tooltipInnerPadding
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
                  fontSize: '${responsiveDimensions.chartLabelFontSize}px',
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
                  pointPadding: 0.05,
                  groupPadding: 0.15, // Increased for better spacing
                  maxPointWidth: ${
                    responsiveDimensions.barWidth * 1.5
                  } // Ensure bars don't get too wide
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
      contentContainerStyle={[
        styles.container,
        {
          padding: responsiveDimensions.containerPadding,
          marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        },
      ]}
      style={[styles.scrollView, { backgroundColor: "#111" }]}
    >
      <StatusBar translucent backgroundColor="transparent" style="light" />
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
        Peak Power Per Hour
      </Text>

      <View style={styles.imageContainer}>
        <Image
          source={peakPowerImg}
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
          styles.chartWrapper,
          {
            height:
              responsiveDimensions.chartHeight +
              responsiveDimensions.sectionMarginTop,
            marginBottom: responsiveDimensions.sectionMarginBottom,
            marginTop: responsiveDimensions.sectionMarginTop,
            borderRadius: responsiveDimensions.borderRadius,
            padding: responsiveDimensions.containerPadding,
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
                  marginTop: responsiveDimensions.sectionMarginBottom,
                  fontSize: responsiveDimensions.loadingFontSize,
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
                  fontSize: responsiveDimensions.headerFontSize,
                  padding: responsiveDimensions.containerPadding * 2,
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
                  fontSize: responsiveDimensions.headerFontSize,
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
              borderRadius: responsiveDimensions.borderRadius,
              padding: responsiveDimensions.containerPadding,
            },
          ]}
        >
          <View style={styles.maxValueContent}>
            <Text
              style={[
                styles.maxText,
                {
                  fontSize: responsiveDimensions.maxValueFontSize,
                },
              ]}
            >
              <Text
                style={[
                  styles.maxValueLabel,
                  {
                    fontSize: responsiveDimensions.maxValueFontSize,
                  },
                ]}
              >
                ⚡ Max Power:{" "}
              </Text>
              <Text
                style={[
                  styles.maxValue,
                  {
                    fontSize: responsiveDimensions.maxValueFontSize,
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
                  fontSize: responsiveDimensions.timestampFontSize,
                  marginTop: responsiveDimensions.sectionMarginBottom / 2,
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
    alignItems: "stretch",
    backgroundColor: "#111",
    width: "100%",
    minHeight: "100%",
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
    flex: 1,
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
    backgroundColor: "#222",
  },
  maxValueBox: {
    marginTop: 0,
    backgroundColor: "#111",
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
