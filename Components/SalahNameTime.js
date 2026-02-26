import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, FONTS, SIZES } from "./Theme";

export default function SalahNameTime({ salahName, salahTime }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{salahName}</Text>
      <Text style={styles.text}>{salahTime}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  text: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
});
