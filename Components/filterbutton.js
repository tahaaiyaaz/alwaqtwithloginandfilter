// FilterButton.js
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOWS, SIZES } from "./Theme";

export default function FilterButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons name="filter" size={24} color={COLORS.primary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    alignSelf: "center", 
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    marginLeft: 10,
    ...SHADOWS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
});
