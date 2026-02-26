import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { useFocusEffect } from '@react-navigation/native';
import SalahNameTime from "./SalahNameTime";
import HeartButton from "./heartbutton";
import { COLORS, FONTS, SIZES, SHADOWS } from "./Theme";
import { Ionicons } from "@expo/vector-icons";

export default function AboutMasjidPage({ route, navigation }) {
  const [masjid, setMasjid] = useState(route.params.masjid);
  const [displayAddress, setDisplayAddress] = useState("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.masjid) {
        setMasjid(route.params.masjid);
      }
    }, [route.params?.masjid])
  );

  useEffect(() => {
    const getAddress = async () => {
      const existingAddress = masjid.details?.addressLine1 || masjid.details?.address || masjid.address;
      
      // Only use reverse geocoding if address is missing or is coordinates
      if (existingAddress && 
          existingAddress !== "Custom Location" && 
          existingAddress !== "Address not available" &&
          !existingAddress.startsWith("Lat:")) {
        setDisplayAddress(existingAddress);
        return;
      }
      
      const loc = masjid.location;
      if (loc && loc.latitude && loc.longitude) {
        setIsLoadingAddress(true);
        try {
          let reverseGeocode = await Location.reverseGeocodeAsync({
            latitude: loc.latitude,
            longitude: loc.longitude,
          });
          if (reverseGeocode && reverseGeocode.length > 0) {
            const addr = reverseGeocode[0];
            const formattedAddress = [addr.name, addr.street, addr.city, addr.region, addr.postalCode]
              .filter(Boolean)
              .join(", ");
            setDisplayAddress(formattedAddress || "Address not available");
          } else {
            setDisplayAddress("Address not available");
          }
        } catch (error) {
          console.log("Reverse geocode failed:", error);
          setDisplayAddress("Address not available");
        } finally {
          setIsLoadingAddress(false);
        }
      } else {
        setDisplayAddress("Address not available");
      }
    };
    
    getAddress();
  }, [masjid]);

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

  const masjidName = masjid.details?.name || masjid.mosqueName || "Unknown Mosque";
  const timings = masjid.details?.timings;
  const location = masjid.location;

  const openGoogleMaps = () => {
    if (location && location.latitude && location.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
      Linking.openURL(url);
    } else {
      alert("Location not available");
    }
  };

  const safeTime = (time) => {
    if (!time) return "N/A";
    if (typeof time === 'string') return time;
    return "N/A";
  };

  // Get Jumma timings (can be string or array)
  const getJummaTimings = () => {
    if (!timings?.jummatiming) return null;
    if (Array.isArray(timings.jummatiming)) {
      return timings.jummatiming.filter(t => t && t.trim());
    }
    return [timings.jummatiming];
  };

  // Get Taraweeh entries
  const getTaraweehEntries = () => {
    const taravi = timings?.taravi || timings?.taraweeh;
    if (!taravi) return null;
    if (Array.isArray(taravi)) return taravi;
    return [taravi];
  };

  const jummaTimings = getJummaTimings();
  const taraweehEntries = getTaraweehEntries();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.heading}>{toPascalCase(masjidName)}</Text>
        <HeartButton masjidid={masjid.id || masjid.mosqueId} />
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Address</Text>
        </View>
        {isLoadingAddress ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <Text style={styles.subText}>{displayAddress}</Text>
        )}
        
        <View style={styles.badgeRow}>
          {masjid.minutes && (
              <View style={styles.infoBadge}>
                  <Ionicons name="time-outline" size={16} color={COLORS.white} />
                  <Text style={styles.infoBadgeText}>{masjid.minutes} mins</Text>
              </View>
          )}
          
          {masjid.distance && (
              <View style={[styles.infoBadge, { backgroundColor: COLORS.primary }]}>
                  <Ionicons name="navigate-outline" size={16} color={COLORS.white} />
                  <Text style={styles.infoBadgeText}>{typeof masjid.distance === 'number' ? `${masjid.distance.toFixed(1)} km` : masjid.distance}</Text>
              </View>
          )}
        </View>
      </View>

      {timings ? (
        <View style={styles.card}>
           <View style={styles.sectionHeader}>
                <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Daily Prayer Timings</Text>
            </View>
          <View style={styles.timingsContainer}>
              <SalahNameTime salahName="Fajr" salahTime={safeTime(timings.fajr)} />
              <SalahNameTime salahName="Dhuhr" salahTime={safeTime(timings.dhuhr)} />
              <SalahNameTime salahName="Asr" salahTime={safeTime(timings.asar || timings.asr)} />
              {timings.maghrib && (
                <SalahNameTime salahName="Maghrib" salahTime={safeTime(timings.maghrib)} />
              )}
              <SalahNameTime salahName="Isha" salahTime={safeTime(timings.isha)} />
          </View>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.subText}>Timings not available yet.</Text>
        </View>
      )}

      {/* Jumma Section */}
      {jummaTimings && jummaTimings.length > 0 && (
        <View style={styles.card}>
           <View style={styles.sectionHeader}>
                <Ionicons name="people-outline" size={20} color={COLORS.success} />
                <Text style={[styles.sectionTitle, { color: COLORS.success }]}>Jumma Timings</Text>
            </View>
          <View style={styles.timingsContainer}>
              {jummaTimings.map((time, index) => (
                <SalahNameTime 
                  key={index} 
                  salahName={`Jumma ${jummaTimings.length > 1 ? index + 1 : ''}`} 
                  salahTime={safeTime(time)} 
                />
              ))}
          </View>
        </View>
      )}

      {/* Taraweeh Section */}
      {taraweehEntries && taraweehEntries.length > 0 && (
        <View style={styles.card}>
           <View style={styles.sectionHeader}>
                <Ionicons name="moon-outline" size={20} color={COLORS.accent} />
                <Text style={[styles.sectionTitle, { color: COLORS.accent }]}>Taraweeh Schedule</Text>
            </View>
          {taraweehEntries.map((entry, index) => (
            <View key={index} style={styles.taraweehItem}>
              <View style={styles.taraweehRow}>
                <Text style={styles.taraweehLabel}>Date:</Text>
                <Text style={styles.taraweehValue}>{entry.startDate || 'Not set'}</Text>
              </View>
              <View style={styles.taraweehRow}>
                <Text style={styles.taraweehLabel}>Time:</Text>
                <Text style={styles.taraweehValue}>{safeTime(entry.time)}</Text>
              </View>
              {entry.parah && (
                <View style={styles.taraweehRow}>
                  <Text style={styles.taraweehLabel}>Parah:</Text>
                  <Text style={styles.taraweehValue}>{entry.parah}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={openGoogleMaps}>
          <Ionicons name="map-outline" size={24} color={COLORS.white} />
          <Text style={styles.btnText}>Maps</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("UpdateTimingsPage", { masjid })}
        >
          <Ionicons name="create-outline" size={24} color={COLORS.white} />
          <Text style={styles.btnText}>Update</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Events</Text>
        <Text style={styles.subText}>• No upcoming events</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: SIZES.padding,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  heading: {
    ...FONTS.h1,
    color: COLORS.primary,
    flex: 1,
    marginRight: 10,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 20,
    ...SHADOWS.light,
  },
  sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.primary,
    marginLeft: 8,
  },
  subText: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  infoBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.accent,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      marginRight: 10,
      marginTop: 5,
  },
  infoBadgeText: {
      ...FONTS.body4,
      color: COLORS.white,
      fontWeight: 'bold',
      marginLeft: 5,
  },
  timingsContainer: {
      marginTop: 5,
  },
  taraweehItem: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: SIZES.radius,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  taraweehRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  taraweehLabel: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  taraweehValue: {
    ...FONTS.h3,
    color: COLORS.accent,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    flex: 1,
    height: 50,
    borderRadius: SIZES.radius,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 5,
    ...SHADOWS.medium,
  },
  btnText: {
    ...FONTS.h3,
    color: COLORS.white,
    marginLeft: 8,
    fontWeight: "bold",
  },
});
