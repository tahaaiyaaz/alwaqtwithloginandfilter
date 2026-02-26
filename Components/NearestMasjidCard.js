import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SHADOWS, SIZES, FONTS } from "./Theme";

export default function NearestMasjidCard({
  MasjidName,
  MasjidDistance,
  NextNamazTime,
  masjid,
  showEvents = false,
}) {
  const navigation = useNavigation();
  const [isPressed, setIsPressed] = useState(false);

  function toPascalCase(str) {
    if (!str) return "Unknown Masjid";
    return str
      .split(/([ -])/g)
      .map(
        (word) =>
          word.match(/[a-zA-Z]/)
            ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            : word
      )
      .join("");
  }

  // Format distance for display
  const formatDistance = () => {
    if (!MasjidDistance) return "---";
    if (typeof MasjidDistance === 'string') return MasjidDistance;
    if (typeof MasjidDistance === 'number') {
      if (MasjidDistance < 1) {
        return `${Math.round(MasjidDistance * 1000)} m`;
      }
      return `${MasjidDistance.toFixed(1)} km`;
    }
    return "---";
  };

  // Format time for display
  const formatTime = () => {
    if (!NextNamazTime) return "---";
    return NextNamazTime;
  };

  const distanceDisplay = formatDistance();
  const timeDisplay = formatTime();

  // Helper to check if events exist
  const hasEvents = masjid.details?.events && masjid.details.events.length > 0;

  return (
    <Pressable
      onPress={() => navigation.navigate("About Page", { masjid })}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={({ pressed }) => [
        styles.container,
        showEvents && styles.containerFull, 
        pressed ? styles.pressed : null,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="moon" size={24} color={COLORS.primary} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>{toPascalCase(MasjidName)}</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoBadge}>
              <Ionicons name="location" size={12} color={COLORS.white} />
              <Text style={styles.badgeText}>{distanceDisplay}</Text>
            </View>
            
            <View style={[styles.infoBadge, { backgroundColor: COLORS.accent }]}>
              <Ionicons name="time" size={12} color={COLORS.white} />
              <Text style={styles.badgeText}>{timeDisplay}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Optional Events Section */}
      {showEvents && hasEvents && (
        <View style={styles.eventsSection}>
          <View style={styles.divider} />
          <Text style={styles.eventsTitle}>Upcoming Events</Text>
          {masjid.details.events.slice(0, 2).map((event, index) => (
             <View key={index} style={styles.eventItem}>
                <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} style={{marginRight: 6}} />
                <Text style={styles.eventText} numberOfLines={1}>{event.name || event.title} - {event.date || event.time}</Text>
             </View>
          ))}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    width: 260,
    padding: SIZES.padding / 1.5,
    marginRight: 15,
    marginVertical: 10,
    borderRadius: SIZES.radius,
    ...SHADOWS.medium,
  },
  containerFull: {
      width: '100%',
      marginRight: 0,
      marginBottom: 15,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: 4,
  },
  eventsSection: {
      marginTop: 12,
  },
  divider: {
      height: 1,
      backgroundColor: COLORS.border,
      marginBottom: 8,
  },
  eventsTitle: {
      ...FONTS.body4,
      color: COLORS.textSecondary,
      fontWeight: 'bold',
      marginBottom: 4,
  },
  eventItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
  },
  eventText: {
      ...FONTS.body4,
      color: COLORS.textPrimary,
  },
});
