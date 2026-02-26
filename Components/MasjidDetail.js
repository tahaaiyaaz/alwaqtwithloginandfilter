// MasjidDetail.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from "./Theme";

export default function MasjidDetail({ route, navigation }) {
  // Get the masjid details passed as a parameter
  const { masjid } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
            {masjid.details?.name || masjid.mosqueName}
        </Text>
        <View style={styles.row}>
            <Text style={styles.label}>Distance:</Text>
            <Text style={styles.value}>{masjid.distance}</Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.label}>Next Prayer:</Text>
            <Text style={styles.value}>{masjid.nextNamazTime || masjid.time}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  card: {
      backgroundColor: COLORS.surface,
      borderRadius: SIZES.radius,
      padding: SIZES.padding,
      ...SHADOWS.light,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 5,
      paddingVertical: 5,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
  },
  label: {
      ...FONTS.body3,
      color: COLORS.textSecondary,
  },
  value: {
      ...FONTS.h3,
      color: COLORS.textPrimary,
  }
});
