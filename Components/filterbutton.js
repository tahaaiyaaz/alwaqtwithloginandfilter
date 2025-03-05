// // FilterButton.js
// import React from "react";
// import { TouchableOpacity, Text, StyleSheet } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// export default function FilterButton({ onPress }) {
//   return (
//     <TouchableOpacity style={styles.button} onPress={onPress}>
//       <Ionicons name="filter" size={24} color="#fff" style={styles.icon} />
//       {/* <Text style={styles.text}>Filter</Text> */}
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   button: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#387478",
//     padding: 10,
//     borderRadius: 5,
//   },
//   icon: {
//     marginRight: 5,
//   },
//   text: {
//     color: "#fff",
//     fontSize: 16,
//   },
// });
// FilterButton.js
import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
export default function FilterButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
     
    <Ionicons name="filter" size={24} color="#387478" style={styles.icon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    
    alignSelf: 'flex-start'
  },
  line: {
    height: 3,
    backgroundColor: "#387478",
    marginVertical: 2,
    width: 25,
    borderRadius: 2,
  },
});
