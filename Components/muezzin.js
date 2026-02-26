import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, FONTS, SIZES } from "./Theme";
import { Ionicons } from "@expo/vector-icons";

export default function Muezzin() {
  return (
    <View style={styles.container}>
      <Ionicons name="business" size={80} color={COLORS.primary} style={{ marginBottom: 20 }} />
      <Text style={styles.heading}>Your Masjid</Text>
      <Text style={styles.subText}>
        All the details of your masjid will appear here soon.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  heading: {
    ...FONTS.h1,
    color: COLORS.primary,
    marginBottom: 10,
  },
  subText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
