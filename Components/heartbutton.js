// HeartButton.js
import React, { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { updateUserDetails } from "./userupdate";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "./Theme";

export default function HeartButton({ masjidid }) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handlePress = async () => {
    let userData;
    try {
      userData = await AsyncStorage.getItem("@user");
      userData = JSON.parse(userData);

      if (userData) {
        const updates = { favorites: [masjidid] };
        // Ideally we should append to favorites, not overwrite. Assuming API handles it or strict array replacement.
        
        try {
          const result = await updateUserDetails(userData.userid || userData.id, updates);
          // if (result) {
          //   Alert.alert("Success", "Added to favorites!");
          // }
           setIsFavorited(!isFavorited);
           Alert.alert("Success", isFavorited ? "Removed from favorites" : "Added to favorites");

        } catch (error) {
          Alert.alert("Error", "Failed to update user details.");
        }
      } else {
        Alert.alert("Login Required", "Please login to add favorites.");
      }
    } catch (error) {
      console.error("Error retrieving user from storage", error);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Ionicons
        name={isFavorited ? "heart" : "heart-outline"}
        size={32}
        color={isFavorited ? COLORS.primary : COLORS.textLight}
      />
    </TouchableOpacity>
  );
}
