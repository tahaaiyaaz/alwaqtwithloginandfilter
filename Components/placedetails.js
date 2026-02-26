import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import { COLORS, FONTS, SIZES, SHADOWS } from "./Theme";

const NearbyRestaurants = ({ location }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function toPascalCase(str) {
    if (!str) return "";
    return str
      .split(/([ -])/g)
      .map((word) =>
        word.match(/[a-zA-Z]/)
          ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          : word
      )
      .join("");
  }
  
  useEffect(() => {
    if (!location || !location.lat || !location.lng) {
      return;
    }

    const fetchRestaurants = async () => {
      const radius = "4000";
      const url = `https://helloworld-ftfo4ql2pa-el.a.run.app/getNearestMasjid?latitude=${location.lat}&longitude=${location.lng}&radiusInKm=${radius}`;

      setLoading(true);
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "X-Request-Id": "XXX",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        setData(json || []);
        setError(null);
      } catch (err) {
        console.log(err);
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [location]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading nearby Masjids...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Masjids found in this area</Text>
      {data.masjids && data.masjids.length === 0 ? (
        <Text style={styles.noData}>No Masjids found.</Text>
      ) : (
        data.masjids && data.masjids.map((masjid, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.name}>
              {toPascalCase(masjid.details.name) || "Unknown"}
            </Text>
            <Text style={styles.address}>
              {toPascalCase(masjid.details.addressLine1) || "Address not available"}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  center: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
      ...FONTS.body3,
      color: COLORS.textSecondary,
      marginTop: 10,
  },
  heading: {
    ...FONTS.h3,
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  noData: {
    textAlign: "center",
    marginTop: 20,
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 15,
    marginVertical: 6,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  name: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  address: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
  },
  errorText: {
    color: COLORS.error,
    ...FONTS.body3,
  },
});

export default NearbyRestaurants;
