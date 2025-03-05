// FilterPopover.js
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function FilterPopover({ visible, onClose, onApply }) {
  // Time filter state (store Date objects)
  const [timeFilter, setTimeFilter] = useState("before"); // "before", "after", "between"
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("single"); // "single", "start", or "end"

  // Distance & dropdown state
  const [distance, setDistance] = useState("3");
  const [dropdownValue, setDropdownValue] = useState("");

  // Dropdown options (6 options)
  const dropdownOptions = [
    { label: "fajr", value: "fajr" },
    { label: "dhuhr", value: "dhuhr" },
    { label: "asar", value: "asar" },
    { label: "isha", value: "isha" },
    { label: "jummatiming", value: "jummatiming" },
    { label: "Option 6", value: "option6" },
  ];

  // Helper function to format Date into HH:MM string
  const formatTime = (date) => {
    if (!date) return "";
    const hours = date.getHours();
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return hours + ":" + minutes;
  };

  const openTimePicker = (mode) => {
    setPickerMode(mode);
    setShowTimePicker(true);
  };

  const onTimeChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setShowTimePicker(false);
      return;
    }
    setShowTimePicker(false);
    // Use event.nativeEvent.timestamp if selectedDate is not provided
    const dateValue = selectedDate ? selectedDate : new Date(event.nativeEvent.timestamp);
    if (pickerMode === "single") {
      setSelectedTime(dateValue);
    } else if (pickerMode === "start") {
      setSelectedStartTime(dateValue);
    } else if (pickerMode === "end") {
      setSelectedEndTime(dateValue);
    }
  };

  // New function: clear all fields except distance (which is set to "3")
  const handleClear = () => {
    setTimeFilter("before");
    setSelectedTime(new Date());
    setSelectedStartTime(new Date());
    setSelectedEndTime(new Date());
    setDropdownValue("");
    setDistance("3");
  };

  const handleApply = () => {
    // Validate distance: must be numeric and ≤ 30
    const distNum = parseFloat(distance);
    if (isNaN(distNum) || distNum > 30) {
      alert("Please enter a valid distance (max 30 km).");
      return;
    }

    // Build filter object; format the time(s) using formatTime()
    const filter = {
      timeFilter,
      time:
        timeFilter === "between"
          ? { start: formatTime(selectedStartTime), end: formatTime(selectedEndTime) }
          : formatTime(selectedTime),
      distance: distNum,
      dropdownValue,
    };

    onApply(filter);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popover}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>

          {/* Dropdown: Select prayer */}
          <Text style={styles.label}>Select Option:</Text>
          <Picker
            selectedValue={dropdownValue}
            onValueChange={(itemValue, itemIndex) => setDropdownValue(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select an option" value={null} />
            {dropdownOptions.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>

          {/* Only enable time filter if a prayer option is selected */}
          {dropdownValue ? (
            <>
              <Text style={styles.label}>Time Filter:</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setTimeFilter("before")}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      timeFilter === "before" && styles.selectedRadio,
                    ]}
                  />
                  <Text style={styles.radioLabel}>Before this time</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setTimeFilter("after")}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      timeFilter === "after" && styles.selectedRadio,
                    ]}
                  />
                  <Text style={styles.radioLabel}>After this time</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setTimeFilter("between")}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      timeFilter === "between" && styles.selectedRadio,
                    ]}
                  />
                  <Text style={styles.radioLabel}>Between these times</Text>
                </TouchableOpacity>
              </View>

              {timeFilter === "between" ? (
                <View style={styles.betweenContainer}>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => openTimePicker("start")}
                  >
                    <Text style={styles.timeButtonText}>
                      Start: {formatTime(selectedStartTime)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => openTimePicker("end")}
                  >
                    <Text style={styles.timeButtonText}>
                      End: {formatTime(selectedEndTime)}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => openTimePicker("single")}
                >
                  <Text style={styles.timeButtonText}>
                    {timeFilter === "before" ? "Before" : "After"}: {formatTime(selectedTime)}
                  </Text>
                </TouchableOpacity>
              )}

              {showTimePicker && (
                <DateTimePicker
                  value={
                    pickerMode === "single"
                      ? selectedTime
                      : pickerMode === "start"
                      ? selectedStartTime
                      : selectedEndTime
                  }
                  mode="time"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onTimeChange}
                />
              )}
            </>
          ) : (
            <Text style={styles.disabledText}>
              Select prayer time to enable time filtering
            </Text>
          )}

          {/* Distance Input */}
          <Text style={styles.label}>Distance (km):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter distance (max 30)"
            keyboardType="numeric"
            value={distance}
            onChangeText={setDistance}
          />

          {/* Clear Filter Button */}
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>Clear Filter</Text>
          </TouchableOpacity>

          {/* Apply Filter Button */}
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popover: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#387478",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#387478",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
    color: "#387478",
  },
  radioGroup: {
    marginBottom: 10,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#387478",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  selectedRadio: {
    backgroundColor: "#387478",
  },
  radioLabel: {
    fontSize: 16,
    color: "#387478",
  },
  betweenContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
  },
  timeButtonText: {
    fontSize: 16,
    color: "#387478",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
    color: "#000",
  },
  applyButton: {
    backgroundColor: "#387478",
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 15,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  clearButton: {
    backgroundColor: "#ccc",
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#000",
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: "100%",
    ...Platform.select({
      ios: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
      },
      android: {
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
      },
    }),
  },
  disabledText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginVertical: 8,
  },
});
