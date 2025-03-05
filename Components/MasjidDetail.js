// MasjidDetail.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function MasjidDetail({ route, navigation }) {
  // Get the masjid details passed as a parameter
  const { masjid } = route.params;
  console.log(masjid)

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {masjid.details?.name || masjid.mosqueName}
      </Text>
      <Text style={styles.detail}>Distance: {masjid.distance}</Text>
      <Text style={styles.detail}>
        Next Prayer: {masjid.nextNamazTime || masjid.time}
      </Text>
      {/* Add additional details as needed */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#E2F1E7",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#387478",
    marginBottom: 20,
  },
  detail: {
    fontSize: 18,
    color: "#387478",
    marginBottom: 10,
  },
});
