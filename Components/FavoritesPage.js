// // pages/FavoritesPage.js
// import React from "react";
// import { View, Text, StyleSheet } from "react-native";

// export default function FavoritesPage() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Favorites</Text>
//       <Text style={styles.subText}>Your favorite masjids will appear here.</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#E2F1E7",
//   },
//   heading: {
//     fontSize: 30,
//     color: "#387478",
//     fontWeight: "bold",
//   },
//   subText: {
//     fontSize: 18,
//     color: "#387478",
//     marginTop: 10,
//   },
// });



















import React, { useState, useEffect } from 'react';
import { View, Text, FlatList,TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

import AsyncStorage from "@react-native-async-storage/async-storage";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
  

  const getFavoriteMasjids = async (userId) => {
    console.log(userId)
    const apiUrl = 'https://helloworld-ftfo4ql2pa-el.a.run.app/getFavoriteMasjids';
    try {
      setLoading(true);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Favorite Masjids:', data.masjids);
      setFavorites(data.masjids);
    } catch (error) {
      console.error('Error fetching favorite masjids:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Call with fixed favorite IDs for demonstration


    
    // Retrieve the user data from AsyncStorage
    const getUserFromStorage = async () => {
      try {
        const userData = await AsyncStorage.getItem("@user");
        if (userData) {
          setUser(JSON.parse(userData));
          let userdata2 = JSON.parse(userData)
          console.log(userdata2.userid)

    getFavoriteMasjids(userdata2.userid);
         
          // console.log(userData.id)
        }
        else{
          console.log("there is no useer")
        }
      } catch (error) {
        console.error("Error retrieving user from storage", error);
      }
    };

    getUserFromStorage();

    // getFavoriteMasjids(['5cWzpDG95UwJtb6aPYt3', '8dcyShXkvjdFXwfd0Lcl']);
  }, []);
  console.log(user)
  
    return (
      <View style={styles.container}>
        {/* <Text style={styles.text}>No user is logged in.</Text>
        <TouchableOpacity
          style={styles.button}
         
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity> */}



<Text style={styles.title}>Favorite Masjids</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#387478" />
      ) : (
        
        favorites.map((masjidsdata)=>{
          return(
          
          
          <Text>
            {masjidsdata.details.name}
            
            
          </Text>
          
        
        
        )
        })
      )}


      </View>
    );
  
  // return (
  //   <View style={styles.container}>
  //     <Text style={styles.heading}>Favorites</Text>
  //     <Text style={styles.subText}>Your favorite masjids will appear here.</Text>
  //   </View>
  // );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E2F1E7",
  },
  heading: {
    fontSize: 30,
    color: "#387478",
    fontWeight: "bold",
  },
  subText: {
    fontSize: 18,
    color: "#387478",
    marginTop: 10,
  },
});


export default FavoritesPage;