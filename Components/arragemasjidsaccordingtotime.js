import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet, View, Text } from "react-native";
import NearestMasjidCard2 from "./Nearestmasjidcard2";
import { COLORS, FONTS } from "./Theme";

const convertTimeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  if (Array.isArray(timeStr)) return 0;
  
  timeStr = timeStr.trim();
  if (timeStr.toUpperCase().includes("AM") || timeStr.toUpperCase().includes("PM")) {
    let [time, period] = timeStr.split(/\s+/);
    let [hours, minutes] = time.split(":").map(Number);
    if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  } else {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  }
};

export default function PrayerTimeComponent({
  navigation,
  mosqueData,
  setEarlierMasjidData,
  setMasjidData,
  Filters,
}) {
  const masjids = useMemo(() => {
    return mosqueData && mosqueData.masjids ? mosqueData.masjids : [];
  }, [mosqueData]);

  const [prayerTimes, setPrayerTimes] = useState({});
  const [selectedPrayer, setselectedPrayer] = useState({});
  const [upcomingPrayer, setUpcomingPrayer] = useState("null");
  const [displayedMosques, setDisplayedMosques] = useState([]);

  const getPrayerTimes = () => {
    const isJuma = new Date().getDay() === 5;
    const prayers = isJuma
      ? ["fajr", "jummatiming", "asar", "isha"]
      : ["fajr", "dhuhr", "asar", "isha", "jummatiming"];
    const times = {};
    prayers.forEach((prayer) => {
      times[prayer] = masjids
        .map((mosque) => ({
          mosqueId: mosque.id,
          mosqueName: mosque.details.name,
          time: mosque.details.timings[prayer],
          minutes: convertTimeToMinutes(mosque.details.timings[prayer]),
          address: mosque.details.addressLine1,
          location: mosque.location,
          details: mosque.details,
          distance: mosque.distance 
        }))
        .sort((a, b) => a.minutes - b.minutes);
    });
    return times;
  };

  const getUpcomingPrayer = (times) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const prayers = Object.entries(times).map(([name, mosques]) => ({
      name,
      minutes: mosques[0]?.minutes || 0,
      mosques,
    }));
    return (
      prayers.find((prayer) => prayer.minutes > currentMinutes) || prayers[0]
    );
  };

  useEffect(() => {
    const times = getPrayerTimes();
    setPrayerTimes(times);
    const upcoming = getUpcomingPrayer(times);
    setUpcomingPrayer(upcoming);
    setDisplayedMosques(upcoming?.mosques || []);
    if (setEarlierMasjidData) {
      setEarlierMasjidData({ masjids: upcoming?.mosques || [] });
    }
  }, [masjids]);

  useEffect(() => {
    if (selectedPrayer && prayerTimes[selectedPrayer]) {
      setDisplayedMosques(prayerTimes[selectedPrayer]);
      if (setEarlierMasjidData) {
        setEarlierMasjidData({ masjids: prayerTimes[selectedPrayer] });
      }
    }
  }, [selectedPrayer, prayerTimes]);

  useEffect(() => {
    if (
      Filters &&
      Filters.timeFilter &&
      Filters.time && 
      Filters.dropdownValue 
    ) {
      if (Filters.dropdownValue) {
        setselectedPrayer(Filters.dropdownValue);
      } else {
        setselectedPrayer(null);
      }
      const filterPrayer = Filters.dropdownValue;
      if (prayerTimes[filterPrayer]) {
        const filtered = prayerTimes[filterPrayer].filter((mosque) => {
          const mosqueTime = mosque.minutes;
          if (Filters.timeFilter === "before") {
            return mosqueTime < convertTimeToMinutes(Filters.time);
          } else if (Filters.timeFilter === "after") {
            return mosqueTime > convertTimeToMinutes(Filters.time);
          } else if (
            Filters.timeFilter === "between" &&
            Filters.time.start &&
            Filters.time.end
          ) {
            const start = convertTimeToMinutes(Filters.time.start);
            const end = convertTimeToMinutes(Filters.time.end);
            return mosqueTime >= start && mosqueTime <= end;
          }
          return true;
        });
        setDisplayedMosques(filtered);
        if (setEarlierMasjidData) {
          setEarlierMasjidData({ masjids: filtered });
        }
      }
    }
  }, [Filters, prayerTimes]);

  if (Filters && Filters.timeFilter && Filters.time && Filters.dropdownValue) {
    if (masjids.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No masjid data available.</Text>
        </View>
      );
    }
    return (
        <View>
          <Text style={styles.sectionHeader}>
            {selectedPrayer
              ? `Selected Prayer: ${selectedPrayer}`
              : `Upcoming Prayer: ${upcomingPrayer?.name}`}
          </Text>
  
          {displayedMosques.map((mosque) => (
            <NearestMasjidCard2
              key={mosque.mosqueId || mosque.id || Math.random()}
              MasjidName={mosque.mosqueName || mosque.details.name}
              MasjidDistance={mosque.distance || "20"}
              NextNamazTime={mosque.time || mosque.nextNamazTime}
              navigation={navigation}
              masjid={mosque}
            />
          ))}
        </View>
      );
  }

  return null; // Return null if component is supposed to be hidden when no filter is active (based on original logic which was returning undefined)
}

const styles = StyleSheet.create({
  sectionHeader: {
    ...FONTS.h3,
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
      ...FONTS.body3,
      color: COLORS.textSecondary,
  }
});
