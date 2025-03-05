// // MainTabs.js
// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// import HomePage from "./HomePage";
// import FavoritesPage from "./FavoritesPage";
// import muezzin from "./muezzin";
// import Signup from "./Signup";
// import AccountsPage from "./AccountsPage";


// const Tab = createBottomTabNavigator();

// const MainTabs = () => {
//   return (
//     <Tab.Navigator screenOptions={{ headerShown: false }}>
//       <Tab.Screen name="Home" component={HomePage} 
//           />
//       <Tab.Screen name="Favorites" component={FavoritesPage} 
//         />
        
//       <Tab.Screen name="Your Masjid" component={muezzin} 
//         />
        
//       {/* <Tab.Screen name="accounts" component={Signup} /> */}

//       <Tab.Screen name="Account" component={AccountsPage} />



//     </Tab.Navigator>
//   );
// };

// export default MainTabs;
// MainTabs.js





// import React, { useEffect, useState } from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { StyleSheet, View } from 'react-native'; // Import StyleSheet and View

// import AsyncStorage from "@react-native-async-storage/async-storage";
// import HomePage from "./HomePage";
// import FavoritesPage from "./FavoritesPage";
// import Muezzin from "./muezzin";
// import Signup from "./Signup";
// import AccountsPage from "./AccountsPage";

// const Tab = createBottomTabNavigator();

// const MainTabs = () => {
  
  
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // Retrieve the user data from AsyncStorage
//     const getUserFromStorage = async () => {
//       try {
//         const userData = await AsyncStorage.getItem("@user");
//         console.log(userData)
//         if (userData) {
//           setUser(JSON.parse(userData));
//           console.log(userData)
//         }
//         else{
//           console.log("there is no useer")
          
//         }
//       } catch (error) {
//         console.error("Error retrieving user from storage", error);
//       }
//     };

//     getUserFromStorage();
//   })

  
  
  
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         headerShown: false,
//         tabBarStyle: { // Styling for the tab bar
//           backgroundColor: '#f0f0f0', // Example background color
//           height: 60, // Adjust as needed
//           margin:10,
//           borderRadius:50

//         },
//         tabBarActiveTintColor: '#007bff', // Example active tab icon color
//         tabBarInactiveTintColor: 'gray', // Example inactive tab icon color
//         labelStyle: { // Styling for the tab labels
//           fontSize: 12,
//         },
//       }}
//     >
//       <Tab.Screen
//         name="Home"
//         component={HomePage}
//         options={{
//           tabBarIcon: ({ focused, color, size }) => (
//             // You can add custom icons here based on the 'focused' state
//             <View
//               style={{
//                 width: size,
//                 height: size,
//                 backgroundColor: focused ? color : 'transparent', // Example icon background
//                 borderRadius: size / 2, // Make it circular
//               }}
//             />
//           ),
//         }}
//       />


//       user:(
//       <Tab.Screen
//         name="Favorites"
//         component={FavoritesPage}
//         options={{
//           tabBarIcon: ({ focused, color, size }) => (
//             // Add your favorites icon here
//             <View
//               style={{
//                 width: size,
//                 height: size,
//                 backgroundColor: focused ? color : 'transparent',
//                 borderRadius: size / 2,
//               }}
//             />
//           ),
//         }}
//       />

//       <Tab.Screen
//         name="Your Masjid"
//         component={Muezzin}
//         options={{
//           tabBarIcon: ({ focused, color, size }) => (
//             // Add your masjid icon here
//             <View
//               style={{
//                 width: size,
//                 height: size,
//                 backgroundColor: focused ? color : 'transparent',
//                 borderRadius: size / 2,
//               }}
//             />
//           ),
//         }}
//       />)

//       {/* <Tab.Screen name="accounts" component={Signup} /> */}

//       <Tab.Screen
//         name="Account"
//         component={AccountsPage}
//         options={{
//           tabBarIcon: ({ focused, color, size }) => (
//             // Add your account icon here
//             <View
//               style={{
//                 width: size,
//                 height: size,
//                 backgroundColor: focused ? color : 'transparent',
//                 borderRadius: size / 2,
//               }}
//             />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// export default MainTabs;




















import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HomePage from "./HomePage";
import FavoritesPage from "./FavoritesPage";
import Muezzin from "./muezzin";
import Signup from "./Signup";
import AccountsPage from "./AccountsPage";

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve the user data from AsyncStorage on component mount.
    const getUserFromStorage = async () => {
      try {
        const userData = await AsyncStorage.getItem("@user");
        if (userData) {
          setUser(JSON.parse(userData));
          console.log(userData)
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error retrieving user from storage", error);
      }
    };

    getUserFromStorage();
  }, []);

  // Common tab screen options for styling the tab bar and icons.
  const screenOptions = {
    headerShown: false,
    tabBarStyle: {
      backgroundColor: "#f0f0f0",
      height: 60,
      margin: 10,
      borderRadius: 50,
    },
    tabBarActiveTintColor: "#007bff",
    tabBarInactiveTintColor: "gray",
    tabBarLabelStyle: {
      fontSize: 12,
    },
    tabBarIcon: ({ focused, color, size }) => (
      <View
        style={{
          width: size,
          height: size,
          backgroundColor: focused ? color : "transparent",
          borderRadius: size / 2,
        }}
      />
    ),
  };

  return (
    <>
      {user ? (
        // If user exists, show only two tabs: Favorites and Account.
        <Tab.Navigator screenOptions={screenOptions}>
          <Tab.Screen name="Home" component={HomePage} />
          <Tab.Screen name="Favorites" component={FavoritesPage} />
          { user.userType == "Muazzin"&&(
                 <Tab.Screen name="Your Masjid" component={Muezzin} />
                )}
          
          <Tab.Screen name="Account" component={AccountsPage} />
        </Tab.Navigator>
      ) : (
        // If no user exists, show the other tabs.
        <Tab.Navigator screenOptions={screenOptions}>
          <Tab.Screen name="Home" component={HomePage} />
          <Tab.Screen name="Account" component={AccountsPage} />
        </Tab.Navigator>
      )}
    </>
  );
};

export default MainTabs;
