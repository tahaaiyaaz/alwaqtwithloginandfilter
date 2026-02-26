import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { COLORS, FONTS, SIZES, SHADOWS } from "./Theme";
import { Ionicons } from "@expo/vector-icons";

function toPascalCase(str) {
  if (str) {
    return str
      .split(/([ -])/g)
      .map((word) =>
        word.match(/[a-zA-Z]/)
          ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          : word
      )
      .join("");
  } else {
    return str;
  }
}

const MasjidListScreen = ({ route, navigation }) => {
  let { masjidData } = route.params;
  masjidData = masjidData?.masjids || [];

  const renderMasjid = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate("About Page", { masjid: item })}
    >
      <View style={styles.cardIcon}>
         <Ionicons name="moon-outline" size={24} color={COLORS.primary} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.masjidName}>{toPascalCase(item.details.name)}</Text>
        <Text style={styles.address} numberOfLines={2}>
            {toPascalCase(item.details.addressLine1)} {toPascalCase(item.details.addressLine2)} {item.cityID}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={masjidData}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={renderMasjid}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
            <Text style={styles.heading}>Nearby Masjids</Text>
        }
        ListFooterComponent={
            <View style={styles.footer}>
                <Text style={styles.subHeading}>Can't find your Masjid?</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("Add Masjid")}
                >
                    <Text style={styles.buttonText}>Add New Masjid</Text>
                </TouchableOpacity>
            </View>
        }
      />
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
  },
  heading: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 15,
    marginBottom: 12,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  cardIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: COLORS.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
  },
  cardContent: {
      flex: 1,
  },
  masjidName: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  address: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
  },
  footer: {
      marginTop: 30,
      alignItems: 'center',
  },
  subHeading: {
    ...FONTS.h3,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: SIZES.radius,
    alignItems: "center",
    ...SHADOWS.medium,
  },
  buttonText: {
    ...FONTS.h3,
    color: COLORS.white,
    fontWeight: "bold",
  },
});

export default MasjidListScreen;
