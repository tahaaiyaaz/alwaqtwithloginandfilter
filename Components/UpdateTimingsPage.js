import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { updateMasjidDetails } from "./apiupdatemasjiddetails";
import { COLORS, FONTS, SIZES, SHADOWS } from "./Theme";
import { Ionicons } from "@expo/vector-icons";

export default function UpdateTimingsPage({ route, navigation }) {
  const { masjid } = route.params;
  const currentTimings = masjid.details?.timings || {};

  // Improved parseTime that handles multiple formats
  const parseTime = (timeStr) => {
    if (!timeStr) return new Date();
    if (typeof timeStr !== 'string') return new Date();
    
    timeStr = timeStr.trim();
    
    // Handle AM/PM format (e.g., "9:30 AM" or "9:30AM")
    if (timeStr.toUpperCase().includes("AM") || timeStr.toUpperCase().includes("PM")) {
      const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (match) {
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const period = match[3].toUpperCase();
        
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
        
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
      }
    }
    
    // Handle 24-hour format (e.g., "14:30")
    const parts = timeStr.split(":");
    if (parts.length >= 2) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      if (!isNaN(hours) && !isNaN(minutes)) {
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
      }
    }
    
    return new Date();
  };

  const formatTime = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return "";
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };

  // Initialize prayer times
  const [fajr, setFajr] = useState(parseTime(currentTimings.fajr));
  const [dhuhr, setDhuhr] = useState(parseTime(currentTimings.dhuhr));
  const [asar, setAsar] = useState(parseTime(currentTimings.asar || currentTimings.asr));
  const [maghrib, setMaghrib] = useState(parseTime(currentTimings.maghrib));
  const [isha, setIsha] = useState(parseTime(currentTimings.isha));

  // Initialize Jumma timings from existing data
  const initJumma = () => {
    const existing = currentTimings.jummatiming;
    if (Array.isArray(existing)) {
      return existing.map(t => parseTime(t));
    } else if (typeof existing === 'string' && existing) {
      return [parseTime(existing)];
    }
    return [];
  };
  
  const [jummaTimings, setJummaTimings] = useState(initJumma());
  
  // Initialize Taraweeh entries from existing data
  const initTaraweeh = () => {
    const existing = currentTimings.taravi || currentTimings.taraweeh;
    if (Array.isArray(existing)) {
      return existing.map(entry => ({
        time: parseTime(entry.time),
        parah: entry.parah || "",
        startDate: entry.startDate ? new Date(entry.startDate) : new Date(),
      }));
    }
    return [];
  };
  
  const [taraweehEntries, setTaraweehEntries] = useState(initTaraweeh());

  const [activePicker, setActivePicker] = useState(null);

  const handlePickerConfirm = (selectedDate) => {
    if (selectedDate && activePicker) {
      if (activePicker.type === "prayer") {
        if (activePicker.field === "fajr") setFajr(selectedDate);
        else if (activePicker.field === "dhuhr") setDhuhr(selectedDate);
        else if (activePicker.field === "asar") setAsar(selectedDate);
        else if (activePicker.field === "maghrib") setMaghrib(selectedDate);
        else if (activePicker.field === "isha") setIsha(selectedDate);
      } else if (activePicker.type === "jumma") {
        const updated = [...jummaTimings];
        updated[activePicker.index] = selectedDate;
        setJummaTimings(updated);
      } else if (activePicker.type === "taraweeh") {
        const updated = [...taraweehEntries];
        if (activePicker.field === "time") {
          updated[activePicker.index].time = selectedDate;
        } else if (activePicker.field === "startDate") {
          updated[activePicker.index].startDate = selectedDate;
        }
        setTaraweehEntries(updated);
      }
    }
    setActivePicker(null);
  };

  const addJummaTiming = () => {
    setJummaTimings([...jummaTimings, new Date()]);
  };
  
  const removeJummaTiming = (index) => {
    setJummaTimings(jummaTimings.filter((_, i) => i !== index));
  };

  const addTaraweehEntry = () => {
    setTaraweehEntries([
      ...taraweehEntries,
      { time: new Date(), parah: "", startDate: new Date() },
    ]);
  };
  
  const removeTaraweehEntry = (index) => {
    setTaraweehEntries(taraweehEntries.filter((_, i) => i !== index));
  };

  const handleTaraweehParahChange = (index, value) => {
    const updated = [...taraweehEntries];
    updated[index].parah = value;
    setTaraweehEntries(updated);
  };

  const handleSubmit = async () => {
    const data = {
      timings: {
        fajr: formatTime(fajr),
        dhuhr: formatTime(dhuhr),
        asar: formatTime(asar),
        maghrib: formatTime(maghrib),
        isha: formatTime(isha),
        jummatiming: jummaTimings.map((time) => formatTime(time)),
        taravi: taraweehEntries.map((entry) => ({
          time: formatTime(entry.time),
          parah: entry.parah,
          startDate: entry.startDate.toDateString(),
        })),
      },
    };

    try {
        await updateMasjidDetails(masjid.id || masjid.mosqueId, data);
        
        // Update the masjid object with new timings for proper refresh
        const updatedMasjid = {
          ...masjid,
          details: {
            ...masjid.details,
            timings: data.timings,
          }
        };
        
        Alert.alert("Success", "Prayer timings updated successfully.", [
        {
            text: "OK",
            onPress: () => navigation.navigate("About Page", { masjid: updatedMasjid }),
        },
        ]);
    } catch (e) {
        Alert.alert("Error", "Failed to update timings.");
    }
  };

  const renderPrayerInput = (label, time, field) => (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity
          style={styles.timePickerButton}
          onPress={() =>
            setActivePicker({
              type: "prayer",
              field: field,
              pickerType: "time",
            })
          }
        >
          <Text style={styles.timePickerText}>{formatTime(time)}</Text>
          <Ionicons name="time-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
  );

  const getPickerValue = () => {
    if (!activePicker) return new Date();
    
    if (activePicker.type === "prayer") {
      if (activePicker.field === "fajr") return fajr;
      if (activePicker.field === "dhuhr") return dhuhr;
      if (activePicker.field === "asar") return asar;
      if (activePicker.field === "maghrib") return maghrib;
      if (activePicker.field === "isha") return isha;
    } else if (activePicker.type === "jumma") {
      return jummaTimings[activePicker.index] || new Date();
    } else if (activePicker.type === "taraweeh") {
      const entry = taraweehEntries[activePicker.index];
      if (activePicker.field === "time") return entry?.time || new Date();
      if (activePicker.field === "startDate") return entry?.startDate || new Date();
    }
    return new Date();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        <Text style={styles.backButtonText}>Back to Details</Text>
      </TouchableOpacity>
      
      <Text style={styles.heading}>Update Prayer Timings</Text>

      <View style={styles.card}>
        <Text style={styles.sectionHeading}>Daily Prayers</Text>
        {renderPrayerInput("Fajr", fajr, "fajr")}
        {renderPrayerInput("Dhuhr", dhuhr, "dhuhr")}
        {renderPrayerInput("Asr", asar, "asar")}
        {renderPrayerInput("Maghrib", maghrib, "maghrib")}
        {renderPrayerInput("Isha", isha, "isha")}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionHeading}>Jumma Timings</Text>
        {jummaTimings.length === 0 && (
          <Text style={styles.emptyText}>No Jumma timings added yet</Text>
        )}
        {jummaTimings.map((time, index) => (
            <View key={index} style={styles.dynamicRow}>
              <TouchableOpacity
                  style={styles.timePickerButtonFlex}
                  onPress={() =>
                    setActivePicker({ type: "jumma", index, pickerType: "time" })
                  }
              >
                  <Text style={styles.timePickerText}>{formatTime(time)}</Text>
                  <Ionicons name="time-outline" size={20} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.removeButton} 
                onPress={() => removeJummaTiming(index)}
              >
                <Ionicons name="trash-outline" size={20} color={COLORS.error} />
              </TouchableOpacity>
            </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addJummaTiming}>
            <Ionicons name="add-circle-outline" size={24} color={COLORS.white} />
            <Text style={styles.addButtonText}>Add Jumma Timing</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionHeading}>Taraweeh</Text>
        {taraweehEntries.length === 0 && (
          <Text style={styles.emptyText}>No Taraweeh entries added yet</Text>
        )}
        {taraweehEntries.map((entry, index) => (
            <View key={index} style={styles.taraweehRow}>
              <View style={styles.taraweehHeader}>
                <Text style={styles.taraweehTitle}>Taraweeh #{index + 1}</Text>
                <TouchableOpacity onPress={() => removeTaraweehEntry(index)}>
                  <Ionicons name="close-circle" size={24} color={COLORS.error} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.taraweehField}>
                  <Text style={styles.label}>Time</Text>
                  <TouchableOpacity
                    style={styles.timePickerButtonFlex}
                    onPress={() =>
                        setActivePicker({
                        type: "taraweeh",
                        index,
                        field: "time",
                        pickerType: "time",
                        })
                    }
                  >
                    <Text style={styles.timePickerText}>{formatTime(entry.time)}</Text>
                    <Ionicons name="time-outline" size={18} color={COLORS.primary} />
                  </TouchableOpacity>
              </View>
              
              <View style={styles.taraweehField}>
                  <Text style={styles.label}>Parah</Text>
                  <TextInput
                    style={styles.input}
                    value={entry.parah}
                    onChangeText={(value) => handleTaraweehParahChange(index, value)}
                    placeholder="e.g., 1-2"
                    placeholderTextColor={COLORS.textLight}
                  />
              </View>
              
              <View style={styles.taraweehField}>
                  <Text style={styles.label}>Date</Text>
                  <TouchableOpacity
                    style={styles.timePickerButtonFlex}
                    onPress={() =>
                        setActivePicker({
                        type: "taraweeh",
                        index,
                        field: "startDate",
                        pickerType: "date",
                        })
                    }
                  >
                    <Text style={styles.timePickerText}>
                        {entry.startDate.toDateString()}
                    </Text>
                    <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
                  </TouchableOpacity>
              </View>
            </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addTaraweehEntry}>
             <Ionicons name="add-circle-outline" size={24} color={COLORS.white} />
            <Text style={styles.addButtonText}>Add Taraweeh Entry</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Update All Timings</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={activePicker !== null}
        mode={activePicker?.pickerType || "time"}
        date={getPickerValue()}
        onConfirm={handlePickerConfirm}
        onCancel={() => setActivePicker(null)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SIZES.padding,
    backgroundColor: COLORS.background,
    paddingBottom: 50,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButtonText: {
    ...FONTS.h3,
    color: COLORS.primary,
    marginLeft: 8,
  },
  heading: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
      backgroundColor: COLORS.surface,
      borderRadius: SIZES.radius,
      padding: SIZES.padding,
      marginBottom: 20,
      ...SHADOWS.light,
  },
  sectionHeading: {
    ...FONTS.h3,
    color: COLORS.primary,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 5,
  },
  emptyText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
    marginRight: 10,
    width: 70, 
  },
  timePickerButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timePickerButtonFlex: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timePickerText: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
  },
  dynamicRow: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeButton: {
    padding: 10,
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  addButtonText: {
    ...FONTS.h3,
    color: COLORS.white,
    marginLeft: 10,
  },
  taraweehRow: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: 12,
    marginBottom: 12,
    backgroundColor: COLORS.background,
  },
  taraweehHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  taraweehTitle: {
    ...FONTS.h3,
    color: COLORS.accent,
  },
  taraweehField: {
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    padding: 12,
    ...FONTS.body3,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.surface,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
    ...SHADOWS.medium,
  },
  submitButtonText: {
    ...FONTS.h2,
    color: COLORS.white,
    fontWeight: "bold",
  },
});
