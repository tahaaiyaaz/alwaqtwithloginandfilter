






























import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';

// Helper to convert a time string (e.g., "10:00 AM" or "10:00") into minutes since midnight
const convertTimeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  timeStr = timeStr.trim();
  // If timeStr contains AM/PM, handle 12-hour format
  if (timeStr.toUpperCase().includes("AM") || timeStr.toUpperCase().includes("PM")) {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
    if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  } else {
    // Assume 24-hour format
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }
};

const PrayerTimeComponent = ({
  mosqueData,
  
  setEarlierMasjidData,
  setMasjidData,
  Filters,
}) => {
  // Derive a stable masjids array using useMemo
  const masjids = useMemo(() => {
    return mosqueData && mosqueData.masjids ? mosqueData.masjids : [];
  }, [mosqueData]);

  const [prayerTimes, setPrayerTimes] = useState({});
  
  const [selectedPrayer, setselectedPrayer] = useState({});
  const [upcomingPrayer, setUpcomingPrayer] = useState(null);
  const [displayedMosques, setDisplayedMosques] = useState([]);

  // Compute prayer times for each prayer from the masjids data.
  const getPrayerTimes = () => {
    const isJuma = new Date().getDay() === 5;
    const prayers = isJuma 
      ? ['fajr', 'jummatiming', 'asar', 'isha'] 
      : ['fajr', 'dhuhr', 'asar', 'isha', 'jummatiming'];
    const times = {};
    prayers.forEach(prayer => {
      times[prayer] = masjids
        .map(mosque => ({
          mosqueId: mosque.id,
          mosqueName: mosque.details.name,
          time: mosque.details.timings[prayer],
          minutes: convertTimeToMinutes(mosque.details.timings[prayer]),
          address: mosque.details.addressLine1,
          location: mosque.location,
          details: mosque.details,
        }))
        .sort((a, b) => a.minutes - b.minutes);
    });
    console.log("Computed prayer times:", times);
    return times;
  };

  // Find the upcoming prayer (the first prayer with time greater than current time)
  const getUpcomingPrayer = (times) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const prayers = Object.entries(times).map(([name, mosques]) => ({
      name,
      minutes: mosques[0]?.minutes || 0,
      mosques,
    }));
    return prayers.find(prayer => prayer.minutes > currentMinutes) || prayers[0];
  };

  // Effect: update prayer times when masjids changes.
  useEffect(() => {
    const times = getPrayerTimes();
    setPrayerTimes(times);
    const upcoming = getUpcomingPrayer(times);
    setUpcomingPrayer(upcoming);
    setDisplayedMosques(upcoming?.mosques || []);
    if (setEarlierMasjidData) {
      setEarlierMasjidData({ masjids: upcoming?.mosques || [] });
    }
  }, [masjids, setEarlierMasjidData]);

  // Effect: update displayed mosques if a specific prayer is selected.
  useEffect(() => {
    if (selectedPrayer && prayerTimes[selectedPrayer]) {
      setDisplayedMosques(prayerTimes[selectedPrayer]);
      if (setEarlierMasjidData) {
        setEarlierMasjidData({ masjids: prayerTimes[selectedPrayer] });
      }
    }
  }, [selectedPrayer, prayerTimes, setEarlierMasjidData]);

  // Effect: apply filter if a Filters object is provided.
  // We filter based on timeFilter and the prayer specified in dropdownValue.
  useEffect(() => {
    if (
      Filters &&
      Filters.timeFilter &&
      Filters.time && // either a string or an object { start, end } for "between"
      Filters.dropdownValue // represents the prayer (e.g., "fajr")
    ) {

      if(Filters.dropdownValue){
        setselectedPrayer(Filters.dropdownValue)
      }
      else{
        setselectedPrayer(null)
      }
      const filterPrayer = Filters.dropdownValue;
      if (prayerTimes[filterPrayer]) {
        const filtered = prayerTimes[filterPrayer].filter(mosque => {
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
        console.log("Filtered masjids:", filtered);
        setDisplayedMosques(filtered);
        if (setEarlierMasjidData) {
          setEarlierMasjidData({ masjids: filtered });
        }
      }
    }
  }, [Filters, prayerTimes, setEarlierMasjidData]);
  if (
    Filters &&
    Filters.timeFilter &&
    Filters.time && // either a string or an object { start, end } for "between"
    Filters.dropdownValue // represents the prayer (e.g., "fajr")
  ) {

  if (masjids.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>No masjid data available.</Text>
      </View>
    );
  }
}
console.log(selectedPrayer)

if (
  Filters &&
  Filters.timeFilter &&
  Filters.time && // either a string or an object { start, end } for "between"
  Filters.dropdownValue // represents the prayer (e.g., "fajr")
) {

  return (
    <View>
      <Text style={styles.sectionHeader}>
        {selectedPrayer 
          ? `Selected Prayer: ${selectedPrayer}` 
          : `Upcoming Prayer: ${upcomingPrayer?.name?.toUpperCase()}`}
      </Text>
      
      {displayedMosques.map((mosque) => (
        <View key={mosque.mosqueId} style={styles.mosqueItem}>
          <View>
            <Text style={styles.mosqueName}>{mosque.mosqueName}</Text>
            <Text style={styles.mosqueAddress}>{mosque.address}</Text>
          </View>
          <Text style={styles.mosqueTime}>{mosque.time}</Text>
        </View>
      ))}
    </View>
  );
}
else{}
};

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  mosqueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  mosqueName: {
    fontSize: 14,
    color: '#34495e',
    fontWeight: '500',
  },
  mosqueAddress: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  mosqueTime: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
});

export default PrayerTimeComponent;
