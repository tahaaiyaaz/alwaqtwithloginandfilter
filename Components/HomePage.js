import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import NearestMasjidCard from "./NearestMasjidCard";
import SearchBar from "./SearchBar";
import FilterButton from "./filterbutton";
import FilterPopover from "./filterpopover";
import PrayerTimeComponent from "./arragemasjidsaccordingtotime";
import { COLORS, FONTS, SIZES } from "./Theme";

// Helper functions (moved from CurrentLocationUI)
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

const processMasjids = (masjids, userLat, userLng) => {
  if (!masjids || !Array.isArray(masjids)) return [];
  return masjids.map(masjid => {
    let distance = null;
    if (masjid.location && masjid.location.latitude && masjid.location.longitude) {
      distance = calculateDistance(userLat, userLng, masjid.location.latitude, masjid.location.longitude);
    }
    const nextPrayer = getNextPrayer(masjid.details?.timings);
    return {
      ...masjid,
      distance: distance,
      distanceText: distance !== null 
        ? (distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`)
        : "N/A",
      nextPrayer: nextPrayer.name,
      nextPrayerTime: nextPrayer.time,
      minsUntilPrayer: nextPrayer.minsUntil,
      time: nextPrayer.time, 
    };
  }).sort((a, b) => {
    if (a.distance === null) return 1;
    if (b.distance === null) return -1;
    return a.distance - b.distance;
  });
};

export default function HomePage({ navigation }) {
  // State from CurrentLocationUI
  const [userLocation, setUserLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sendCoords, setSendCoords] = useState({});
  const [Filters, setFilters] = useState({});
  const [data, setData] = useState({ masjids: [] });
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  // State for Lists
  const [masjidData, setMasjidData] = useState(null);
  const [earlierMasjidData, setEarlierMasjidData] = useState(null);
  
  // Handlers
  const openPopover = () => setIsPopoverVisible(true);
  const closePopover = () => setIsPopoverVisible(false);

  const handleApplyFilter = async (filter) => {
    closePopover();
    setFilters(filter);
    const lat = sendCoords.lat || userLocation?.coords?.latitude;
    const lng = sendCoords.lng || userLocation?.coords?.longitude;
    if (lat && lng) {
      getallnearestmasjids(lat, lng);
    }
  };

  useEffect(() => {
    initLocation();
  }, []);

  const initLocation = async () => {
    setIsLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setIsLoading(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setUserLocation(location);
      getallnearestmasjids(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error("Location error:", error);
      setErrorMsg("Could not get location");
      setIsLoading(false);
    }
  };

  const getallnearestmasjids = async (latitude, longitude, radius = "30") => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://helloworld-ftfo4ql2pa-el.a.run.app/getNearestMasjid?latitude=${latitude}&longitude=${longitude}&radiusInKm=${radius}`
      );
      const json = await response.json();
      if (json && json.masjids) {
        const processedMasjids = processMasjids(json.masjids, latitude, longitude);
        const processedData = { ...json, masjids: processedMasjids };
        setData(processedData);
        setMasjidData(processedData);
        setEarlierMasjidData(processedData);
      } else {
        setData({ masjids: [] });
        setMasjidData({ masjids: [] });
      }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSectionHeader = (title, onMorePress) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={onMorePress}>
        <Text style={styles.moreText}>See All</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMasjidList = (data, listId) => {
    if (!data || !data.masjids || data.masjids.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No masjids found</Text>
        </View>
      );
    }
    let items = [...data.masjids];
    if (listId === "later") items = items.reverse();
    items = items.slice(0, 5);

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {items.map((masjid, index) => (
          <NearestMasjidCard
            key={masjid.id || masjid.mosqueId || index}
            MasjidName={masjid.details?.name || masjid.mosqueName}
            MasjidDistance={masjid.distanceText || masjid.distance}
            NextNamazTime={masjid.nextPrayerTime || masjid.time}
            navigation={navigation}
            masjid={masjid}
          />
        ))}
      </ScrollView>
    );
  };

  const showmoremasjids = () => {
    if (masjidData) navigation.navigate("MasjidList", { masjidData });
  };

  return (
    <View style={styles.container}>
      {/* Header Container with Search */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTopRow}>
            <View>
                <Text style={styles.greeting}>Find Peace</Text>
                <Text style={styles.subGreeting}>Nearest Masjids & Prayer Times</Text>
            </View>
        </View>
        
        <View style={styles.searchRow}>
           <View style={{ flex: 1 }}>
                <SearchBar
                    setSendCoords={(coords) => {
                        setSendCoords(coords);
                        if (coords.lat && coords.lng) {
                        getallnearestmasjids(coords.lat, coords.lng);
                        }
                    }}
                    getallnearestmasjids={getallnearestmasjids}
                />
           </View>
           <FilterButton onPress={openPopover} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Finding nearby masjids...</Text>
                </View>
            )}

            {errorMsg && !isLoading && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
            )}
        
            {/* Logic for processed lists */}
             <PrayerTimeComponent
                mosqueData={data}
                setEarlierMasjidData={setEarlierMasjidData}
                setMasjidData={setMasjidData}
                Filters={Filters}
             />

            {/* Nearby Masjids Section */}
            {renderSectionHeader("Nearby", showmoremasjids)}
            {renderMasjidList(masjidData, "nearby")}

            {/* Earlier Prayer Section */}
            {renderSectionHeader("Early Prayer", showmoremasjids)}
            {renderMasjidList(earlierMasjidData || masjidData, "earlier")}

            {/* Later Prayer Section */}
            {renderSectionHeader("Late Prayer", showmoremasjids)}
            {renderMasjidList(earlierMasjidData || masjidData, "later")}

            <View style={{ height: 100 }} />
      </ScrollView>
      
      <FilterPopover
        visible={isPopoverVisible}
        onClose={closePopover}
        onApply={handleApplyFilter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    paddingHorizontal: SIZES.padding,
    paddingTop: 50, // More top padding for status bar
    paddingBottom: SIZES.padding,
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    zIndex: 100, // Ensure search autocomplete sits on top
  },
  headerTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
  },
  greeting: {
    ...FONTS.h1,
    color: COLORS.primary,
  },
  subGreeting: {
    ...FONTS.body3,
    marginTop: 5,
    marginBottom: 5,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.padding,
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    ...FONTS.h2,
  },
  moreText: {
    ...FONTS.body3,
    color: COLORS.primary,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 10,
  },
  emptyContainer: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 30,
    alignItems: "center",
  },
  emptyText: {
    ...FONTS.body3,
    fontStyle: "italic",
    color: COLORS.textSecondary,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginTop: 10,
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    ...FONTS.body3,
    color: COLORS.error,
  },
});
