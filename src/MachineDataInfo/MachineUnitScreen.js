import React, { useState, useEffect } from "react";
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
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useRoute, useNavigation } from "@react-navigation/native";
import unitImg from "../../assets/chartImages/3515462.jpg";
import Icon from "react-native-vector-icons/FontAwesome";

const MachineUnitScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { endPoint } = route.params || {};

  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hourlyData, setHourlyData] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
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

  useEffect(() => {
    if (!endPoint) return;
    fetch(`${endPoint}`)
      .then((res) => res.json())
      .then((apiData) => {
        console.log(endPoint, "endPoint of table data");
        setData(apiData);

        if (apiData.length > 0) {
          const latestEntry = apiData.reduce((latest, entry) => {
            return new Date(entry.timestamp) > new Date(latest.timestamp)
              ? entry
              : latest;
          }, apiData[0]);

          setSelectedDate(new Date(latestEntry.timestamp));
        }
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, [endPoint]);

  useEffect(() => {
    if (data.length === 0) return;

    const selectedISO = selectedDate.toISOString().split("T")[0];
    const filteredData = data.filter(
      (entry) => entry.timestamp.split(" ")[0] === selectedISO
    );

    const hourlyAggregation = {};

    filteredData.forEach((entry) => {
      const dateObj = new Date(entry.timestamp);
      const hourKey = dateObj.getHours();
      const power = (entry.current * 220) / 1000;

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

    const formattedHourlyData = Object.keys(hourlyAggregation).map((hour) => {
      const timestamps = hourlyAggregation[hour].timestamps;
      const fromTime = timestamps[0]?.split(" ")[1] || "00:00:00";
      const toTime =
        timestamps[timestamps.length - 1]?.split(" ")[1] || "00:00:00";

      const fromDate = new Date(`${selectedISO}T${fromTime}`);
      const toDate = new Date(`${selectedISO}T${toTime}`);
      const durationMinutes = Math.round((fromDate - toDate) / (1000 * 60));

      return {
        time: `${toTime} - ${fromTime}`,
        totalPower: hourlyAggregation[hour].totalPower.toFixed(2),
        unit: (
          hourlyAggregation[hour].totalPower / hourlyAggregation[hour].count
        ).toFixed(2),
        duration: `${durationMinutes} mins`,
      };
    });

    setHourlyData(formattedHourlyData);
  }, [data, selectedDate]);

  const handleConfirm = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const formatDate = (date) => date.toISOString().split("T")[0];

  const isMobile = screenWidth < 768;

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        console.log("Container width:", event.nativeEvent.layout.width);
      }}
    >
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Icon name="arrow-left" style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.currentText}>Unit Consumption</Text>

      <View
        style={styles.imageContainer}
        onLayout={(event) => {
          console.log("Image container width:", event.nativeEvent.layout.width);
        }}
      >
        <Image source={unitImg} style={styles.image} resizeMode="cover" />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>
          Selected Date: {formatDate(selectedDate)}
        </Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>Change Date</Text>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => setShowDatePicker(false)}
      />

      <View style={styles.headerRow}>
        <Text
          style={[
            styles.headerCell,
            isMobile ? styles.mobileText : styles.desktopText,
          ]}
        >
          Time (From - To)
        </Text>
        <Text
          style={[
            styles.headerCell,
            isMobile ? styles.mobileText : styles.desktopText,
          ]}
        >
          Duration
        </Text>
        <Text
          style={[
            styles.headerCell,
            isMobile ? styles.mobileText : styles.desktopText,
          ]}
        >
          Total Power (kW)
        </Text>
        <Text
          style={[
            styles.headerCell,
            isMobile ? styles.mobileText : styles.desktopText,
          ]}
        >
          Units
        </Text>
      </View>

      {hourlyData.length > 0 ? (
        <ScrollView style={styles.tableBody}>
          <View>
            {hourlyData.map((item, index) => (
              <View key={index} style={styles.row}>
                <Text
                  style={[
                    styles.cell,
                    isMobile ? styles.mobileText : styles.desktopText,
                  ]}
                >
                  {item.time}
                </Text>
                <Text
                  style={[
                    styles.cell,
                    isMobile ? styles.mobileText : styles.desktopText,
                  ]}
                >
                  {item.duration}
                </Text>
                <Text
                  style={[
                    styles.cell,
                    isMobile ? styles.mobileText : styles.desktopText,
                  ]}
                >{`${item.totalPower} kW`}</Text>
                <Text
                  style={[
                    styles.cell,
                    isMobile ? styles.mobileText : styles.desktopText,
                  ]}
                >
                  {item.unit}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.noDataContainer}>
          <Text
            style={[
              styles.noDataText,
              isMobile ? styles.mobileText : styles.desktopText,
            ]}
          >
            No data available for selected date
          </Text>
        </View>
      )}
    </View>
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
  currentText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 10,
    color: "#92F1F1",
    textAlign: "center",
  },
  imageContainer: {
    width: "100%",
    alignItems: "stretch",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 250,
    minWidth: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 1,
    paddingHorizontal: 5,
    marginTop: 20,
  },
  title: {
    color: "#92F1F1",
    fontSize: 16,
    fontWeight: "bold",
  },
  dateButton: {
    backgroundColor: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  dateButtonText: {
    color: "#000",
    fontSize: 12,
  },
  headerRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#92F1F1",
    borderBottomWidth: 1,
  },
  headerCell: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderColor: "#92F1F1",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#92F1F1",
    borderTopWidth: 0,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
  },
  cell: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderColor: "#92F1F1",
    textAlign: "center",
  },
  mobileText: {
    color: "#D7D7D7",
    fontSize: 12,
    padding: 8,
  },
  desktopText: {
    color: "#D7D7D7",
    fontSize: 16,
    padding: 12,
  },
  tableBody: {
    maxHeight: "52%",
    // borderLeftWidth: 1,
    borderColor: "#92F1F1",
  },
  noDataContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#92F1F1",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    padding: 16,
  },
  noDataText: {
    color: "#D7D7D7",
    textAlign: "center",
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

export default MachineUnitScreen;
