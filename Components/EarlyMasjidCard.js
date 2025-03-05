import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function EarlyMasjidCard({
  MasjidName,
  MasjidDistance,
  NextNamazTime,
}) {
  
  function toPascalCase(str) {
    return str
      .split(/([ -])/g) // Split by both spaces and hyphens, preserving the separators
      .map(
        (word) =>
          word.match(/[a-zA-Z]/) // Check if it's a word (not a separator)
            ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize the word
            : word // Leave the separator as is
      )
      .join(""); // Join everything back together
  }

  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.text}>{toPascalCase(MasjidName)}</Text>
        <Text style={styles.text}>{MasjidDistance}</Text>
        <Text style={styles.text}>{NextNamazTime}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    backgroundColor: "#387478",
    height: 100,
    padding: 10,
    marginTop: 3,
    marginBottom: 3,
    borderRadius: 10,
  },
  text: {
    margin: 3,
    color: "#E2F1E7",
  },
});
