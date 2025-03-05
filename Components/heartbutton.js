// HeartButton.js
import React, { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { updateUserDetails } from "./userupdate";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HeartButton({masjidid}) {
    // console.log(masjidid)
  const [isFavorited, setIsFavorited] = useState(false);

  const handlePress = async() => {
    let userData;
        try {
           userData = await AsyncStorage.getItem("@user");
           userData = JSON.parse(userData)
          
          if (userData) {
            // setUser(JSON.parse(userData));
            

      const updates = {favorites:[masjidid] };
  
      console.log(userData.userid, updates)
      try {
        const result = await updateUserDetails(userData.userid, updates);
        if (result) {
          Alert.alert("Success", "User details updated!");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to update user details.");
      }

      alert("Details updated successfully!");

    console.log(masjidid)

    setIsFavorited(!isFavorited);
          }
          else{
            console.log("there is no useer")
            
    
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
        color={isFavorited ? "red" : "gray"}
      />
    </TouchableOpacity>
  );
}