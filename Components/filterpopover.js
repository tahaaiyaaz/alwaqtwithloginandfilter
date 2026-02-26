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
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { COLORS, FONTS, SIZES, SHADOWS } from "./Theme";
import { Ionicons } from "@expo/vector-icons";

export default function FilterPopover({ visible, onClose, onApply }) {
  const [timeFilter, setTimeFilter] = useState("before"); 
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  
  const [showSinglePicker, setShowSinglePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [distance, setDistance] = useState("3");
  const [dropdownValue, setDropdownValue] = useState("");

  const dropdownOptions = [
    { label: "Fajr", value: "fajr" },
    { label: "Dhuhr", value: "dhuhr" },
    { label: "Asar", value: "asar" },
    { label: "Isha", value: "isha" },
    { label: "Jummah", value: "jummatiming" },
  ];

  const formatTime = (date) => {
    if (!date) return "00:00";
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };

  const handleClear = () => {
    setTimeFilter("before");
    setSelectedTime(new Date());
    setSelectedStartTime(new Date());
    setSelectedEndTime(new Date());
    setDropdownValue("");
    setDistance("3");
  };

  const handleApply = () => {
    const distNum = parseFloat(distance);
    if (isNaN(distNum) || distNum > 30) {
      alert("Please enter a valid distance (max 30 km).");
      return;
    }

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
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popover}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.heading}>Filter Options</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Select Prayer:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={dropdownValue}
                  onValueChange={(itemValue) => setDropdownValue(itemValue)}
                  style={styles.picker}
                  dropdownIconColor={COLORS.primary}
                >
                  <Picker.Item label="Select an option" value="" color={COLORS.textSecondary} />
                  {dropdownOptions.map((option) => (
                    <Picker.Item key={option.value} label={option.label} value={option.value} color={COLORS.textPrimary} />
                  ))}
                </Picker>
            </View>

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
                    <Text style={styles.radioLabel}>Before</Text>
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
                    <Text style={styles.radioLabel}>After</Text>
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
                    <Text style={styles.radioLabel}>Between</Text>
                  </TouchableOpacity>
                </View>

                {timeFilter === "between" ? (
                  <View style={styles.betweenContainer}>
                    <TouchableOpacity
                      style={styles.timeInputButton}
                      onPress={() => setShowStartPicker(true)}
                    >
                      <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                      <Text style={styles.timeInputText}>
                        Start: {formatTime(selectedStartTime)}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.timeInputButton}
                      onPress={() => setShowEndPicker(true)}
                    >
                      <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                      <Text style={styles.timeInputText}>
                        End: {formatTime(selectedEndTime)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.timeInputButton}
                    onPress={() => setShowSinglePicker(true)}
                  >
                    <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.timeInputText}>
                      {timeFilter === "before" ? "Before" : "After"}: {formatTime(selectedTime)}
                    </Text>
                  </TouchableOpacity>
                )}

                {/* DateTimePickerModals - always visible for proper modal approach */}
                <DateTimePickerModal
                  isVisible={showSinglePicker}
                  mode="time"
                  onConfirm={(date) => { setSelectedTime(date); setShowSinglePicker(false); }}
                  onCancel={() => setShowSinglePicker(false)}
                />
                <DateTimePickerModal
                  isVisible={showStartPicker}
                  mode="time"
                  onConfirm={(date) => { setSelectedStartTime(date); setShowStartPicker(false); }}
                  onCancel={() => setShowStartPicker(false)}
                />
                <DateTimePickerModal
                  isVisible={showEndPicker}
                  mode="time"
                  onConfirm={(date) => { setSelectedEndTime(date); setShowEndPicker(false); }}
                  onCancel={() => setShowEndPicker(false)}
                />
              </>
            ) : (
              <Text style={styles.disabledText}>
                Select a prayer to enable time filtering
              </Text>
            )}

            <Text style={styles.label}>Distance (km):</Text>
            <TextInput
              style={styles.input}
              placeholder="Max 30"
              placeholderTextColor={COLORS.textLight}
              keyboardType="numeric"
              value={distance}
              onChangeText={setDistance}
            />

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                  <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                  <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  popover: {
    width: "100%",
    maxHeight: "80%",
    backgroundColor: COLORS.surface,
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    ...SHADOWS.medium,
  },
  header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
  },
  heading: {
      ...FONTS.h2,
      color: COLORS.primary,
  },
  label: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginBottom: 8,
    marginTop: 15,
  },
  pickerContainer: {
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: SIZES.radius,
      backgroundColor: COLORS.background,
  },
  picker: {
    height: 55,
    width: "100%",
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: SIZES.radius,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  selectedRadio: {
    backgroundColor: COLORS.primary,
  },
  radioLabel: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
  },
  betweenContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeInputButton: {
    backgroundColor: COLORS.background,
    padding: 15,
    borderRadius: SIZES.radius,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: COLORS.primary,
    flexDirection: 'row',
  },
  timeInputText: {
    ...FONTS.h3,
    color: COLORS.primary,
    marginLeft: 8,
  },
  input: {
    height: 50,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingHorizontal: 15,
    marginVertical: 5,
    color: COLORS.textPrimary,
    ...FONTS.body3,
    backgroundColor: COLORS.background,
  },
  buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 25,
      marginBottom: 10,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: SIZES.radius,
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
    ...SHADOWS.light,
  },
  applyButtonText: {
    ...FONTS.h3,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: COLORS.background,
    paddingVertical: 15,
    borderRadius: SIZES.radius,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  clearButtonText: {
    ...FONTS.h3,
    color: COLORS.textSecondary,
  },
  disabledText: {
    ...FONTS.body3,
    color: COLORS.textLight,
    textAlign: "center",
    marginVertical: 15,
    fontStyle: 'italic',
  },
});
