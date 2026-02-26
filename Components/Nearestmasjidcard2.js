import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SIZES, SHADOWS } from "./Theme";
import { Ionicons } from "@expo/vector-icons";

export default function NearestMasjidCard2({
  MasjidName,
  MasjidDistance,
  NextNamazTime,
  masjid,
}) {
  const navigation = useNavigation();

  function toPascalCase(str) {
    if (!str) return "";
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

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate("About Page", { masjid })}
    >
      <View style={styles.card}>
        <View style={styles.content}>
            <Text style={styles.name}>{toPascalCase(MasjidName)}</Text>
            
            <View style={styles.row}>
                <View style={styles.badge}>
                    <Ionicons name="location-outline" size={14} color={COLORS.primary} />
                    <Text style={styles.badgeText}>{MasjidDistance} km</Text>
                </View>

                <View style={styles.badge}>
                     <Ionicons name="time-outline" size={14} color={COLORS.primary} />
                    <Text style={styles.badgeText}>{NextNamazTime}</Text>
                </View>
            </View>
        </View>
        
        <View style={styles.arrowContainer}>
             <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    padding: 15,
    marginVertical: 6,
    marginHorizontal: 2, 
    borderRadius: SIZES.radius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.light,
  },
  content: {
      flex: 1,
  },
  name: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  row: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  badge: {
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: COLORS.background,
     paddingHorizontal: 8,
     paddingVertical: 4,
     borderRadius: 12,
     marginRight: 10,
     borderWidth: 1,
     borderColor: COLORS.border,
  },
  badgeText: {
      ...FONTS.body4,
      color: COLORS.textPrimary,
      marginLeft: 4,
  },
  arrowContainer: {
      marginLeft: 10,
  },
});