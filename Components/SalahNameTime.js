import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SalahNameTime({ salahName, salahTime }) {
  return (
    <View style={styles.container}>
      <Text style={styles.subText}>{salahName}</Text>
      <Text style={styles.subText}>{salahTime}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 8,
  },
  subText: {
    fontSize: 20,
    color: "#387478",
    fontWeight: "bold",
  },
});
