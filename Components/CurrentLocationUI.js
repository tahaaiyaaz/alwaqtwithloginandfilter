import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import * as Location from "expo-location";
import SearchBar from "./SearchBar";
import PrayerTimeComponent from "./arragemasjidsaccordingtotime";
import FilterButton from "./filterbutton";
import FilterPopover from "./filterpopover";
import { COLORS, FONTS, SIZES } from "./Theme";

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

// Convert time string to minutes since midnight
const timeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return null;
  
  timeStr = timeStr.trim();
  
  // Handle AM/PM format
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
  
  // Handle 24-hour format
  const parts = timeStr.split(":");
  if (parts.length >= 2) {
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    if (!isNaN(hours) && !isNaN(minutes)) {
      return hours * 60 + minutes;
    }
  }
  
  return null;
};

// Get next prayer time for a masjid
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
   .map(p => ({
     ...p,
     minutes: timeToMinutes(p.time)
   }))
   .filter(p => p.minutes !== null);
  
  // Find next prayer
  const nextPrayer = prayers.find(p => p.minutes > currentMinutes);
  
  if (nextPrayer) {
    const minsUntil = nextPrayer.minutes - currentMinutes;
    return {
      name: nextPrayer.name,
      time: nextPrayer.time,
      minsUntil: minsUntil,
    };
  }
  
  // If no prayer left today, return first prayer (Fajr tomorrow)
  if (prayers.length > 0) {
    const firstPrayer = prayers[0];
    const minsUntil = (24 * 60 - currentMinutes) + firstPrayer.minutes;
    return {
      name: firstPrayer.name,
      time: firstPrayer.time,
      minsUntil: minsUntil,
    };
  }
  
  return { name: "N/A", time: "N/A", minsUntil: null };
};

// Process masjids to add distance and next prayer
const processMasjids = (masjids, userLat, userLng) => {
  if (!masjids || !Array.isArray(masjids)) return [];
  
  return masjids.map(masjid => {
    let distance = null;
    
    // Calculate distance if we have location data
    if (masjid.location && masjid.location.latitude && masjid.location.longitude) {
      distance = calculateDistance(
        userLat, 
        userLng, 
        masjid.location.latitude, 
        masjid.location.longitude
      );
    }
    
    // Get next prayer time
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
      time: nextPrayer.time, // For compatibility with existing components
    };
  })
  // Sort by distance
  .sort((a, b) => {
    if (a.distance === null) return 1;
    if (b.distance === null) return -1;
    return a.distance - b.distance;
  });
};

const CurrentLocationUI = ({
  setMasjidData,
  setLaterMasjidData,
  setEarlierMasjidData,
  setLocation,
}) => {
  const [userLocation, setUserLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sendCoords, setSendCoords] = useState({});
  const [Filters, setFilters] = useState({});
  const [data, setData] = useState({ masjids: [] });
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  const openPopover = () => setIsPopoverVisible(true);
  const closePopover = () => setIsPopoverVisible(false);

  const handleApplyFilter = async (filter) => {
    console.log("Filter applied:", filter);
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

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      setUserLocation(location);
      getallnearestmasjids(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error("Location error:", error);
      setErrorMsg("Could not get location");
      setIsLoading(false);
    }
  };

  const getallnearestmasjids = async (latitude, longitude, radius = "30") => {
    console.log("Fetching masjids for:", latitude, longitude);
    
    if (setLocation) {
      setLocation({ lat: latitude, lng: longitude });
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(
        `https://helloworld-ftfo4ql2pa-el.a.run.app/getNearestMasjid?latitude=${latitude}&longitude=${longitude}&radiusInKm=${radius}`
      );
      const json = await response.json();
      console.log("API Response:", json);
      
      if (json && json.masjids) {
        // Process masjids to add distance and next prayer
        const processedMasjids = processMasjids(json.masjids, latitude, longitude);
        
        const processedData = {
          ...json,
          masjids: processedMasjids,
        };
        
        console.log("Processed masjids:", processedMasjids);
        
        setData(processedData);
        
        if (setMasjidData) {
          setMasjidData(processedData);
        }
        
        if (setEarlierMasjidData) {
          setEarlierMasjidData(processedData);
        }
      } else {
        console.log("No masjids in response");
        setData({ masjids: [] });
        if (setMasjidData) setMasjidData({ masjids: [] });
      }
    } catch (error) {
      console.error("Error fetching masjids:", error);
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <SearchBar
          setSendCoords={(coords) => {
            setSendCoords(coords);
            if (coords.lat && coords.lng) {
              getallnearestmasjids(coords.lat, coords.lng);
            }
          }}
          getallnearestmasjids={getallnearestmasjids}
        />
        <FilterButton onPress={openPopover} />
      </View>
      
      <FilterPopover
        visible={isPopoverVisible}
        onClose={closePopover}
        onApply={handleApplyFilter}
      />

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

      <PrayerTimeComponent
        mosqueData={data}
        setEarlierMasjidData={setEarlierMasjidData}
        setMasjidData={setMasjidData}
        Filters={Filters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIZES.padding,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
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

export default CurrentLocationUI;
