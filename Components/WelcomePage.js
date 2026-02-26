import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { COLORS, FONTS, SIZES, SHADOWS } from "./Theme";

export default function WelcomePage({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.contentContainer}>
        <Text style={styles.heading}>Al Waqt</Text>
        <Text style={styles.subText}>Your Own Islamic Community App</Text>
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("MainTabs")}
        activeOpacity={0.8}
      >
        <Text style={styles.btnText}>Let's Start</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingVertical: 60,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    ...FONTS.largeTitle,
    fontSize: 50,
    color: COLORS.primary,
    marginBottom: 10,
  },
  subText: {
    ...FONTS.h3,
    color: COLORS.textSecondary,
    textAlign: "center",
    maxWidth: '80%',
  },
  btn: {
    backgroundColor: COLORS.primary,
    height: 55,
    width: 200,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.medium,
  },
  btnText: {
    ...FONTS.h3,
    color: COLORS.white,
    fontWeight: "bold",
  }
});
