import React, { useEffect, useState, useCallback } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';

import HomePage from "./HomePage";
import FavoritesPage from "./FavoritesPage";
import Muezzin from "./muezzin";
import AccountsPage from "./AccountsPage";

import { COLORS, SHADOWS, SIZES, FONTS } from "./Theme";

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const [user, setUser] = useState(null);

  const getUserFromStorage = async () => {
    try {
      const userData = await AsyncStorage.getItem("@user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error retrieving user from storage", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getUserFromStorage();
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: {
            position: 'absolute',
            bottom: 25,
            left: 20,
            right: 20,
            elevation: 0,
            backgroundColor: COLORS.surface,
            borderRadius: SIZES.radius,
            height: 70,
            ...SHADOWS.dark,
            borderTopWidth: 0,
            paddingBottom: 5,
            paddingTop: 5,
          },
          tabBarLabelStyle: {
            ...FONTS.body5,
            fontWeight: '600',
            marginBottom: 5,
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textSecondary,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Favorites") {
              iconName = focused ? "heart" : "heart-outline";
            } else if (route.name === "Your Masjid") {
              iconName = focused ? "business" : "business-outline";
            } else if (route.name === "Account") {
              iconName = focused ? "person" : "person-outline";
            }

            return (
              <Ionicons 
                name={iconName} 
                size={24} 
                color={color} 
                style={{ marginTop: 5 }}
              />
            );
          },
        })}
      >
        <Tab.Screen name="Home" component={HomePage} />
        {user && (
           <Tab.Screen name="Favorites" component={FavoritesPage} />
        )}
        {user && user.userType === "Muazzin" && (
            <Tab.Screen name="Your Masjid" component={Muezzin} />
        )}
        <Tab.Screen name="Account" component={AccountsPage} />
      </Tab.Navigator>
    </View>
  );
};

export default MainTabs;
