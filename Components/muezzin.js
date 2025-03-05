import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Muezzin() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>your masjid will appear here</Text>
      <Text style={styles.subText}>all the details of your masjid will appear</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E2F1E7",
  },
  heading: {
    fontSize: 30,
    color: "#387478",
    fontWeight: "bold",
  },
  subText: {
    fontSize: 18,
    color: "#387478",
    marginTop: 10,
  },
});