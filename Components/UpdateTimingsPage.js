// import React, { useState } from "react";
// import { 
//   ScrollView,
//   View, 
//   Text, 
//   StyleSheet, 
//   Dimensions, 
//   TouchableOpacity, 
//   Alert, 
//   TextInput 
// } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";

// export default function UpdateTimingsPage({ route, navigation }) {
//   const { masjid } = route.params;
//   const currentTimings = masjid.details?.timings || {};

//   // Helper functions to parse and format times.
//   const parseTime = (timeStr) => {
//     if (!timeStr) return new Date();
//     const [hours, minutes] = timeStr.split(":").map(Number);
//     const date = new Date();
//     date.setHours(hours);
//     date.setMinutes(minutes);
//     date.setSeconds(0);
//     return date;
//   };

//   const formatTime = (date) => {
//     if (!date) return "";
//     let hours = date.getHours();
//     let minutes = date.getMinutes();
//     hours = hours < 10 ? "0" + hours : hours;
//     minutes = minutes < 10 ? "0" + minutes : minutes;
//     return `${hours}:${minutes}`;
//   };

//   // Standard prayer timings (pre-filled if available)
//   const [fajr, setFajr] = useState(currentTimings.fajr ? parseTime(currentTimings.fajr) : new Date());
//   const [dhuhr, setDhuhr] = useState(currentTimings.dhuhr ? parseTime(currentTimings.dhuhr) : new Date());
//   const [asar, setAsar] = useState(currentTimings.asar ? parseTime(currentTimings.asar) : new Date());
//   const [maghrib, setMaghrib] = useState(currentTimings.maghrib ? parseTime(currentTimings.maghrib) : new Date());
//   const [isha, setIsha] = useState(currentTimings.isha ? parseTime(currentTimings.isha) : new Date());

//   // Dynamic sections for Jumma and Taraweeh
//   const [jummaTimings, setJummaTimings] = useState([]); // Array of Date objects
//   const [taraweehEntries, setTaraweehEntries] = useState([]); // Each entry: { time: Date, parah: string, startDate: Date }

//   /* 
//     activePicker object holds info about which picker is active.
//     Structure:
//       { 
//         type: "prayer" | "jumma" | "taraweeh",
//         field: (for prayer: "fajr"/"dhuhr"/"asar"/"maghrib"/"isha"; for taraweeh: "time" or "startDate"),
//         index: (for jumma or taraweeh entries),
//         pickerType: "time" or "date"
//       }
//   */
//   const [activePicker, setActivePicker] = useState(null);

//   // Determine the current value for the picker.
//   let currentPickerValue = new Date();
//   if (activePicker) {
//     if (activePicker.type === "prayer") {
//       if (activePicker.field === "fajr") currentPickerValue = fajr;
//       else if (activePicker.field === "dhuhr") currentPickerValue = dhuhr;
//       else if (activePicker.field === "asar") currentPickerValue = asar;
//       else if (activePicker.field === "maghrib") currentPickerValue = maghrib;
//       else if (activePicker.field === "isha") currentPickerValue = isha;
//     } else if (activePicker.type === "jumma") {
//       currentPickerValue = jummaTimings[activePicker.index] || new Date();
//     } else if (activePicker.type === "taraweeh") {
//       if (activePicker.field === "time") {
//         currentPickerValue = taraweehEntries[activePicker.index].time;
//       } else if (activePicker.field === "startDate") {
//         currentPickerValue = taraweehEntries[activePicker.index].startDate;
//       }
//     }
//   }

//   const handlePickerChange = (event, selectedDate) => {
//     if (selectedDate) {
//       if (activePicker.type === "prayer") {
//         if (activePicker.field === "fajr") setFajr(selectedDate);
//         else if (activePicker.field === "dhuhr") setDhuhr(selectedDate);
//         else if (activePicker.field === "asar") setAsar(selectedDate);
//         else if (activePicker.field === "maghrib") setMaghrib(selectedDate);
//         else if (activePicker.field === "isha") setIsha(selectedDate);
//       } else if (activePicker.type === "jumma") {
//         const updated = [...jummaTimings];
//         updated[activePicker.index] = selectedDate;
//         setJummaTimings(updated);
//       } else if (activePicker.type === "taraweeh") {
//         const updated = [...taraweehEntries];
//         if (activePicker.field === "time") {
//           updated[activePicker.index].time = selectedDate;
//         } else if (activePicker.field === "startDate") {
//           updated[activePicker.index].startDate = selectedDate;
//         }
//         setTaraweehEntries(updated);
//       }
//     }
//     setActivePicker(null);
//   };

//   // Functions to add new entries
//   const addJummaTiming = () => {
//     setJummaTimings([...jummaTimings, new Date()]);
//   };

//   const addTaraweehEntry = () => {
//     setTaraweehEntries([...taraweehEntries, { time: new Date(), parah: "", startDate: new Date() }]);
//   };

//   const handleTaraweehParahChange = (index, value) => {
//     const updated = [...taraweehEntries];
//     updated[index].parah = value;
//     setTaraweehEntries(updated);
//   };

//   // On submit, consolidate data and log it.
//   const handleSubmit = () => {
//     const data = {
//       prayerTimings: {
//         fajr: formatTime(fajr),
//         dhuhr: formatTime(dhuhr),
//         asar: formatTime(asar),
//         maghrib: formatTime(maghrib),
//         isha: formatTime(isha),
//       },
//       jummaTimings: jummaTimings.map(time => formatTime(time)),
//       taraweehEntries: taraweehEntries.map(entry => ({
//         time: formatTime(entry.time),
//         parah: entry.parah,
//         startDate: entry.startDate.toDateString(),
//       })),
//     };

//     console.log("Updated Timings Data:", data);
//     Alert.alert("Thank you!", "Your prayer timings have been updated.", [
//       {
//         text: "OK",
//         onPress: () => navigation.goBack(),
//       },
//     ]);
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.heading}>Update Prayer Timings</Text>

//       {/* Standard Prayer Timings */}
//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Fajr:</Text>
//         <TouchableOpacity 
//           style={styles.timePickerButton} 
//           onPress={() => setActivePicker({ type: "prayer", field: "fajr", pickerType: "time" })}
//         >
//           <Text style={styles.timePickerText}>{formatTime(fajr)}</Text>
//         </TouchableOpacity>
//       </View>
//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Dhuhr:</Text>
//         <TouchableOpacity 
//           style={styles.timePickerButton} 
//           onPress={() => setActivePicker({ type: "prayer", field: "dhuhr", pickerType: "time" })}
//         >
//           <Text style={styles.timePickerText}>{formatTime(dhuhr)}</Text>
//         </TouchableOpacity>
//       </View>
//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Asr:</Text>
//         <TouchableOpacity 
//           style={styles.timePickerButton} 
//           onPress={() => setActivePicker({ type: "prayer", field: "asar", pickerType: "time" })}
//         >
//           <Text style={styles.timePickerText}>{formatTime(asar)}</Text>
//         </TouchableOpacity>
//       </View>
//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Maghrib:</Text>
//         <TouchableOpacity 
//           style={styles.timePickerButton} 
//           onPress={() => setActivePicker({ type: "prayer", field: "maghrib", pickerType: "time" })}
//         >
//           <Text style={styles.timePickerText}>{formatTime(maghrib)}</Text>
//         </TouchableOpacity>
//       </View>
//       <View style={styles.inputGroup}>
//         <Text style={styles.label}>Isha:</Text>
//         <TouchableOpacity 
//           style={styles.timePickerButton} 
//           onPress={() => setActivePicker({ type: "prayer", field: "isha", pickerType: "time" })}
//         >
//           <Text style={styles.timePickerText}>{formatTime(isha)}</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Jumma Timings Section */}
//       <Text style={styles.sectionHeading}>Jumma Timings</Text>
//       {jummaTimings.map((time, index) => (
//         <View key={index} style={styles.dynamicRow}>
//           <TouchableOpacity 
//             style={styles.timePickerButton} 
//             onPress={() => setActivePicker({ type: "jumma", index, pickerType: "time" })}
//           >
//             <Text style={styles.timePickerText}>{formatTime(time)}</Text>
//           </TouchableOpacity>
//         </View>
//       ))}
//       <TouchableOpacity style={styles.addButton} onPress={addJummaTiming}>
//         <Text style={styles.addButtonText}>Add Jumma Timing</Text>
//       </TouchableOpacity>

//       {/* Taraweeh Section */}
//       <Text style={styles.sectionHeading}>Taraweeh</Text>
//       {taraweehEntries.map((entry, index) => (
//         <View key={index} style={styles.taraweehRow}>
//           <View style={styles.taraweehField}>
//             <Text style={styles.label}>Timing:</Text>
//             <TouchableOpacity 
//               style={styles.timePickerButton} 
//               onPress={() => setActivePicker({ type: "taraweeh", index, field: "time", pickerType: "time" })}
//             >
//               <Text style={styles.timePickerText}>{formatTime(entry.time)}</Text>
//             </TouchableOpacity>
//           </View>
//           <View style={styles.taraweehField}>
//             <Text style={styles.label}>Parah:</Text>
//             <TextInput
//               style={styles.input}
//               value={entry.parah}
//               onChangeText={(value) => handleTaraweehParahChange(index, value)}
//               placeholder="Enter number of parah"
//               keyboardType="numeric"
//             />
//           </View>
//           <View style={styles.taraweehField}>
//             <Text style={styles.label}>Start Date:</Text>
//             <TouchableOpacity 
//               style={styles.timePickerButton} 
//               onPress={() => setActivePicker({ type: "taraweeh", index, field: "startDate", pickerType: "date" })}
//             >
//               <Text style={styles.timePickerText}>{entry.startDate.toDateString()}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       ))}
//       <TouchableOpacity style={styles.addButton} onPress={addTaraweehEntry}>
//         <Text style={styles.addButtonText}>Add Taraweeh Entry</Text>
//       </TouchableOpacity>

//       {/* Submit Button */}
//       <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//         <Text style={styles.submitButtonText}>Submit</Text>
//       </TouchableOpacity>

//       {/* DateTimePicker */}
//       {activePicker && (
//         <DateTimePicker
//           value={currentPickerValue}
//           mode={activePicker.pickerType}
//           display="default"
//           onChange={handlePickerChange}
//         />
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: "#E2F1E7",
//     width: Dimensions.get("window").width,
//     padding: 30,
//     paddingTop: 50,
//   },
//   heading: {
//     fontSize: 40,
//     color: "#387478",
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   inputGroup: {
//     marginVertical: 10,
//   },
//   label: {
//     fontSize: 20,
//     color: "#387478",
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   timePickerButton: {
//     borderColor: "#387478",
//     borderWidth: 1,
//     borderRadius: 5,
//     padding: 10,
//     backgroundColor: "#fff",
//   },
//   timePickerText: {
//     fontSize: 18,
//     color: "#387478",
//   },
//   sectionHeading: {
//     fontSize: 30,
//     color: "#387478",
//     fontWeight: "bold",
//     marginTop: 20,
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   dynamicRow: {
//     marginVertical: 5,
//   },
//   addButton: {
//     backgroundColor: "#387478",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     marginVertical: 10,
//     alignItems: "center",
//   },
//   addButtonText: {
//     color: "#E2F1E7",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   taraweehRow: {
//     borderWidth: 1,
//     borderColor: "#387478",
//     borderRadius: 5,
//     padding: 10,
//     marginVertical: 5,
//   },
//   taraweehField: {
//     marginVertical: 5,
//   },
//   input: {
//     borderColor: "#387478",
//     borderWidth: 1,
//     borderRadius: 5,
//     padding: 10,
//     fontSize: 18,
//     backgroundColor: "#fff",
//   },
//   submitButton: {
//     backgroundColor: "#387478",
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 30,
//     marginBottom: 50,
//   },
//   submitButtonText: {
//     fontSize: 20,
//     color: "#E2F1E7",
//     fontWeight: "bold",
//   },
// });










































































































































import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function UpdateTimingsPage({ route, navigation }) {
  const { masjid } = route.params;
  const currentTimings = masjid.details?.timings || {};

  // Helper functions to parse and format times.
  const parseTime = (timeStr) => {
    if (!timeStr) return new Date();
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    return date;
  };

  const formatTime = (date) => {
    if (!date) return "";
    let hours = date.getHours();
    let minutes = date.getMinutes();
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes}`;
  };

  // Standard prayer timings (pre-filled if available)
  const [fajr, setFajr] = useState(
    currentTimings.fajr ? parseTime(currentTimings.fajr) : new Date()
  );
  const [dhuhr, setDhuhr] = useState(
    currentTimings.dhuhr ? parseTime(currentTimings.dhuhr) : new Date()
  );
  const [asar, setAsar] = useState(
    currentTimings.asar ? parseTime(currentTimings.asar) : new Date()
  );
  const [maghrib, setMaghrib] = useState(
    currentTimings.maghrib ? parseTime(currentTimings.maghrib) : new Date()
  );
  const [isha, setIsha] = useState(
    currentTimings.isha ? parseTime(currentTimings.isha) : new Date()
  );

  // Dynamic sections for Jumma and Taraweeh
  const [jummaTimings, setJummaTimings] = useState([]); // Array of Date objects
  const [taraweehEntries, setTaraweehEntries] = useState([]); // Each entry: { time: Date, parah: string, startDate: Date }

  /* 
    activePicker object holds info about which picker is active.
    Structure:
      { 
        type: "prayer" | "jumma" | "taraweeh",
        field: (for prayer: "fajr"/"dhuhr"/"asar"/"maghrib"/"isha"; for taraweeh: "time" or "startDate"),
        index: (for jumma or taraweeh entries),
        pickerType: "time" or "date"
      }
  */
  const [activePicker, setActivePicker] = useState(null);

  // Determine the current value for the picker.
  let currentPickerValue = new Date();
  if (activePicker) {
    if (activePicker.type === "prayer") {
      if (activePicker.field === "fajr") currentPickerValue = fajr;
      else if (activePicker.field === "dhuhr") currentPickerValue = dhuhr;
      else if (activePicker.field === "asar") currentPickerValue = asar;
      else if (activePicker.field === "maghrib") currentPickerValue = maghrib;
      else if (activePicker.field === "isha") currentPickerValue = isha;
    } else if (activePicker.type === "jumma") {
      currentPickerValue = jummaTimings[activePicker.index] || new Date();
    } else if (activePicker.type === "taraweeh") {
      if (activePicker.field === "time") {
        currentPickerValue = taraweehEntries[activePicker.index].time;
      } else if (activePicker.field === "startDate") {
        currentPickerValue = taraweehEntries[activePicker.index].startDate;
      }
    }
  }

  const handlePickerChange = (event, selectedDate) => {
    if (selectedDate) {
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

  // Functions to add new entries
  const addJummaTiming = () => {
    setJummaTimings([...jummaTimings, new Date()]);
  };

  const addTaraweehEntry = () => {
    setTaraweehEntries([
      ...taraweehEntries,
      { time: new Date(), parah: "", startDate: new Date() },
    ]);
  };

  const handleTaraweehParahChange = (index, value) => {
    const updated = [...taraweehEntries];
    updated[index].parah = value;
    setTaraweehEntries(updated);
  };

  // On submit, consolidate data and log it.
  const handleSubmit = () => {
    const data = {
      prayerTimings: {
        fajr: formatTime(fajr),
        dhuhr: formatTime(dhuhr),
        asar: formatTime(asar),
        maghrib: formatTime(maghrib),
        isha: formatTime(isha),
      },
      jummaTimings: jummaTimings.map((time) => formatTime(time)),
      taraweehEntries: taraweehEntries.map((entry) => ({
        time: formatTime(entry.time),
        parah: entry.parah,
        startDate: entry.startDate.toDateString(),
      })),
    };

    console.log("Updated Timings Data:", data);
    Alert.alert("Thank you!", "Your prayer timings have been updated.", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Prayer Timings</Text>

      {/* Standard Prayer Timings */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Fajr:</Text>
        <TouchableOpacity
          style={styles.timePickerButton}
          onPress={() =>
            setActivePicker({
              type: "prayer",
              field: "fajr",
              pickerType: "time",
            })
          }
        >
          <Text style={styles.timePickerText}>{formatTime(fajr)}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Dhuhr:</Text>
        <TouchableOpacity
          style={styles.timePickerButton}
          onPress={() =>
            setActivePicker({
              type: "prayer",
              field: "dhuhr",
              pickerType: "time",
            })
          }
        >
          <Text style={styles.timePickerText}>{formatTime(dhuhr)}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Asr:</Text>
        <TouchableOpacity
          style={styles.timePickerButton}
          onPress={() =>
            setActivePicker({
              type: "prayer",
              field: "asar",
              pickerType: "time",
            })
          }
        >
          <Text style={styles.timePickerText}>{formatTime(asar)}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Maghrib:</Text>
        <TouchableOpacity
          style={styles.timePickerButton}
          onPress={() =>
            setActivePicker({
              type: "prayer",
              field: "maghrib",
              pickerType: "time",
            })
          }
        >
          <Text style={styles.timePickerText}>{formatTime(maghrib)}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Isha:</Text>
        <TouchableOpacity
          style={styles.timePickerButton}
          onPress={() =>
            setActivePicker({
              type: "prayer",
              field: "isha",
              pickerType: "time",
            })
          }
        >
          <Text style={styles.timePickerText}>{formatTime(isha)}</Text>
        </TouchableOpacity>
      </View>

      {/* Jumma Timings Section */}
      <Text style={styles.sectionHeading}>Jumma Timings</Text>
      {jummaTimings.map((time, index) => (
        <View key={index} style={styles.dynamicRow}>
          <TouchableOpacity
            style={styles.timePickerButton}
            onPress={() =>
              setActivePicker({ type: "jumma", index, pickerType: "time" })
            }
          >
            <Text style={styles.timePickerText}>{formatTime(time)}</Text>
          </TouchableOpacity>
        </View>
      ))}
      <View style={styles.btnCenter}>
        <TouchableOpacity style={styles.addButton} onPress={addJummaTiming}>
          <Text style={styles.addButtonText}>Add Jumma Timing</Text>
        </TouchableOpacity>
      </View>
      {/* Taraweeh Section */}
      <Text style={styles.sectionHeading}>Taraweeh</Text>
      {taraweehEntries.map((entry, index) => (
        <View key={index} style={styles.taraweehRow}>
          <View style={styles.taraweehField}>
            <Text style={styles.label}>Timing:</Text>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() =>
                setActivePicker({
                  type: "taraweeh",
                  index,
                  field: "time",
                  pickerType: "time",
                })
              }
            >
              <Text style={styles.timePickerText}>
                {formatTime(entry.time)}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.taraweehField}>
            <Text style={styles.label}>Parah:</Text>
            <TextInput
              style={styles.input}
              value={entry.parah}
              onChangeText={(value) => handleTaraweehParahChange(index, value)}
              placeholder="Enter number of parah"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.taraweehField}>
            <Text style={styles.label}>Start Date:</Text>
            <TouchableOpacity
              style={styles.timePickerButton}
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
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <View style={styles.btnCenter}>
        <TouchableOpacity style={styles.addButton} onPress={addTaraweehEntry}>
          <Text style={styles.addButtonText}>Add Taraweeh Entry</Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <View style={styles.btnCenter}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      {/* DateTimePicker */}
      {activePicker && (
        <DateTimePicker
          value={currentPickerValue}
          mode={activePicker.pickerType}
          display="default"
          onChange={handlePickerChange}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#E2F1E7",
    width: Dimensions.get("window").width,
    padding: 30,
    paddingTop: 50,
  },
  heading: {
    fontSize: 40,
    color: "#387478",
    fontWeight: "bold",
    margin: 10,
    textAlign: "center",
  },
  inputGroup: {
    marginVertical: 10,
  },
  label: {
    fontSize: 20,
    color: "#387478",
    fontWeight: "bold",
    marginBottom: 5,
  },
  timePickerButton: {
    borderColor: "#387478",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#E2F1E7",
  },
  timePickerText: {
    fontSize: 18,
    color: "#387478",
  },
  sectionHeading: {
    fontSize: 30,
    color: "#387478",
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 5,
    textAlign: "center",
  },
  dynamicRow: {
    marginVertical: 5,
  },
  addButton: {
    backgroundColor: "#387478",
    height: 50,
    width: 220,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  addButtonText: {
    color: "#E2F1E7",
    fontSize: 20,
    fontWeight: "bold",
  },
  taraweehRow: {
    borderWidth: 1,
    borderColor: "#387478",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  taraweehField: {
    marginVertical: 5,
  },
  input: {
    borderColor: "#387478",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    backgroundColor: "#E2F1E7",
  },
  submitButton: {
    backgroundColor: "#387478",
    height: 50,
    width: 140,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  submitButtonText: {
    fontSize: 20,
    color: "#E2F1E7",
    fontWeight: "bold",
  },
  btnCenter: {
    alignItems: "center",
  },
});