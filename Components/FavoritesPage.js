import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";
import NearestMasjidCard from "./NearestMasjidCard";
import { COLORS, FONTS, SIZES, SHADOWS } from "./Theme";
import { Ionicons } from "@expo/vector-icons";

// Reusing helper functions for consistency
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; 
};

const timeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return null;
  timeStr = timeStr.trim();
  if (timeStr.toUpperCase().includes("AM") || timeStr.toUpperCase().includes("PM")) {
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const period = match[3].toUpperCase();
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      return hours * 60 + minutes;
    }
  }
  const parts = timeStr.split(":");
  if (parts.length >= 2) {
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    if (!isNaN(hours) && !isNaN(minutes)) return hours * 60 + minutes;
  }
  return null;
};

const getNextPrayer = (timings) => {
  if (!timings) return { name: "N/A", time: "N/A", minutes: null };
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const prayers = [
    { name: "Fajr", time: timings.fajr },
    { name: "Dhuhr", time: timings.dhuhr },
    { name: "Asr", time: timings.asar || timings.asr },
    { name: "Maghrib", time: timings.maghrib },
    { name: "Isha", time: timings.isha },
  ].filter(p => p.time)
   .map(p => ({ ...p, minutes: timeToMinutes(p.time) }))
   .filter(p => p.minutes !== null);
  
  const nextPrayer = prayers.find(p => p.minutes > currentMinutes);
  if (nextPrayer) {
    const minsUntil = nextPrayer.minutes - currentMinutes;
    return { name: nextPrayer.name, time: nextPrayer.time, minsUntil: minsUntil };
  }
  if (prayers.length > 0) {
    const firstPrayer = prayers[0];
    const minsUntil = (24 * 60 - currentMinutes) + firstPrayer.minutes;
    return { name: firstPrayer.name, time: firstPrayer.time, minsUntil: minsUntil };
  }
  return { name: "N/A", time: "N/A", minsUntil: null };
};

const FavoritesPage = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [processedFavorites, setProcessedFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Get User
      const userData = await AsyncStorage.getItem("@user");
      if (!userData) {
          setLoading(false);
          return;
      }
      const parsedUser = JSON.parse(userData);
      const userId = parsedUser.userid || parsedUser.id;
      
      if (!userId) {
          setLoading(false);
          return;
      }

      // 2. Get Location
      let location = null;
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
           location = await Location.getCurrentPositionAsync({});
           setUserLocation(location);
        }
      } catch (e) {
         console.warn("Location error in favorites:", e);
      }

      // 3. Get Favorites
      const response = await fetch("https://helloworld-ftfo4ql2pa-el.a.run.app/getFavoriteMasjids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      const rawFavorites = data.masjids || [];
      
      // 4. Process Favorites (Distance calculation & Sorting)
      if (rawFavorites.length > 0 && location) {
         const lat = location.coords.latitude;
         const lng = location.coords.longitude;
         
         const processed = rawFavorites.map(masjid => {
            let distance = null;
            if (masjid.location && masjid.location.latitude && masjid.location.longitude) {
              distance = calculateDistance(lat, lng, masjid.location.latitude, masjid.location.longitude);
            }
            const nextPrayer = getNextPrayer(masjid.details?.timings);
            
            return {
              ...masjid,
              distance: distance,
              distanceText: distance !== null 
                ? (distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`)
                : "N/A",
              nextPrayerTime: nextPrayer.time,
            };
         });
         
         // Sort by distance
         processed.sort((a, b) => {
            if (a.distance === null) return 1;
            if (b.distance === null) return -1;
            return a.distance - b.distance;
         });
         
         setProcessedFavorites(processed);
      } else {
         // Fallback if no location data yet
         setProcessedFavorites(rawFavorites.map(m => ({
             ...m,
             distanceText: "---",
             nextPrayerTime: getNextPrayer(m.details?.timings).time
         })));
      }

    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
      useCallback(() => {
          fetchData();
      }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const renderMasjid = ({ item }) => (
    <NearestMasjidCard
        MasjidName={item.details?.name || item.mosqueName}
        MasjidDistance={item.distanceText}
        NextNamazTime={item.nextPrayerTime}
        masjid={item}
        showEvents={true} // Show events inline
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Favorites</Text>

      {loading && !refreshing ? (
        <View style={styles.center}>
             <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
          <FlatList
            data={processedFavorites}
            keyExtractor={(item) => item.id || item.mosqueId || Math.random().toString()}
            renderItem={renderMasjid}
            contentContainerStyle={styles.listContent}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
            }
            ListEmptyComponent={
                <View style={styles.center}>
                    <Text style={styles.emptyText}>No favorite masjids yet.</Text>
                </View>
            }
          />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
      padding: SIZES.padding,
      paddingBottom: 50,
  },
  heading: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginBottom: 10,
    marginTop: 50, // Top padding
    paddingHorizontal: SIZES.padding,
  },
  center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 50,
  },
  emptyText: {
      ...FONTS.body3,
      color: COLORS.textSecondary,
      fontStyle: 'italic',
  },
});

export default FavoritesPage;
