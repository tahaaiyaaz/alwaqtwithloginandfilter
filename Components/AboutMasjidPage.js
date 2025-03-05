// import React from "react";
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   Dimensions, 
//   TouchableOpacity, 
//   Linking 
// } from "react-native";
// import SalahNameTime from "./SalahNameTime";

// export default function AboutMasjidPage({ route, navigation }) {
//   const { masjid } = route.params;

//   // Extract details safely
//   const masjidName = masjid.details?.name || masjid.mosqueName || "Unknown Mosque";
//   const timings = masjid.details?.timings;
//   const address = masjid.address ? masjid.address : null;
//   const location = masjid.location;

//   // Function to open Google Maps with the masjid's location
//   const openGoogleMaps = () => {
//     if (location && location.latitude && location.longitude) {
//       const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
//       Linking.openURL(url);
//     } else {
//       alert("Location not available");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>{masjidName}</Text>
      
//       {/* Conditionally render the address */}
//       {address ? (
//         <Text style={styles.subText}>Address: {address}</Text>
//       ) : (
//         <Text style={styles.subText}>Address not available.</Text>
//       )}

//       {/* Conditionally render Salah timings */}
//       {timings ? (
//         <>
//           <Text style={styles.subHeading}>Salah Timings</Text>
//           <SalahNameTime salahName="Fajr" salahTime={timings.fajr || "N/A"} />
//           <SalahNameTime salahName="Dhuhr" salahTime={timings.dhuhr || "N/A"} />
//           <SalahNameTime salahName="Asr" salahTime={timings.asar || "N/A"} />
//           {timings.maghrib && (
//             <SalahNameTime salahName="Maghrib" salahTime={timings.maghrib} />
//           )}
//           <SalahNameTime salahName="Isha" salahTime={timings.isha || "N/A"} />
//         </>
//       ) : (
//         <Text style={styles.subText}>Timings not available.</Text>
//       )}

//       {/* Render additional details if available */}
//       {masjid.minutes && (
//         <Text style={styles.subText}>Minutes: {masjid.minutes}</Text>
//       )}
//       {masjid.mosqueId && (
//         <Text style={styles.subText}>Mosque ID: {masjid.mosqueId}</Text>
//       )}

//       {/* Button to open location in Google Maps */}
//       <TouchableOpacity style={styles.mapButton} onPress={openGoogleMaps}>
//         <Text style={styles.mapButtonText}>Open in Google Maps</Text>
//       </TouchableOpacity>

//       {/* Update Timings Button */}
//       <TouchableOpacity 
//         style={styles.updateButton} 
//         onPress={() => navigation.navigate("UpdateTimingsPage", { masjid })}
//       >
//         <Text style={styles.updateButtonText}>Update Timings</Text>
//       </TouchableOpacity>

//       {/* Example Events Section */}
//       <Text style={styles.subHeading}>Events</Text>
//       <Text style={styles.subText}>1. Pasha bhai ki shadi</Text>
//       <Text style={styles.subText}>2.</Text>
//       <Text style={styles.subText}>3.</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     width: Dimensions.get("window").width,
//     paddingHorizontal: 30,
//     paddingTop: 50,
//     justifyContent: "flex-start",
//     backgroundColor: "#E2F1E7",
//   },
//   heading: {
//     fontSize: 50,
//     color: "#387478",
//     fontWeight: "bold",
//   },
//   subHeading: {
//     fontSize: 40,
//     color: "#387478",
//     fontWeight: "bold",
//     marginTop: 10,
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   subText: {
//     fontSize: 20,
//     color: "#387478",
//     fontWeight: "bold",
//     marginVertical: 2,
//   },
//   mapButton: {
//     backgroundColor: "#387478",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     marginVertical: 20,
//     alignItems: "center",
//   },
//   mapButtonText: {
//     color: "#E2F1E7",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   updateButton: {
//     backgroundColor: "#387478",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   updateButtonText: {
//     color: "#E2F1E7",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });







// // import React from "react";
// // import { 
// //   View, 
// //   Text, 
// //   StyleSheet, 
// //   Dimensions, 
// //   TouchableOpacity, 
// //   Linking 
// // } from "react-native";
// // import SalahNameTime from "./SalahNameTime";

// // export default function AboutMasjidPage({ route, navigation }) {
// //   const { masjid } = route.params;

// //   // Extract details safely
// //   const masjidName = masjid.details?.name || masjid.mosqueName || "Unknown Mosque";
// //   const timings = masjid.details?.timings;
// //   const address = masjid.address ? masjid.address : null;
// //   const location = masjid.location;

// //   // Function to open Google Maps with the masjid's location
// //   const openGoogleMaps = () => {
// //     if (location && location.latitude && location.longitude) {
// //       const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
// //       Linking.openURL(url);
// //     } else {
// //       alert("Location not available");
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.heading}>{masjidName}</Text>
      
// //       {/* Conditionally render the address */}
// //       {address ? (
// //         <Text style={styles.subText}>Address: {address}</Text>
// //       ) : (
// //         <Text style={styles.subText}>Address not available.</Text>
// //       )}

// //       {/* Conditionally render Salah timings */}
// //       {timings ? (
// //         <>
// //           <Text style={styles.subHeading}>Salah Timings</Text>
// //           <SalahNameTime salahName="Fajr" salahTime={timings.fajr || "N/A"} />
// //           <SalahNameTime salahName="Dhuhr" salahTime={timings.dhuhr || "N/A"} />
// //           <SalahNameTime salahName="Asr" salahTime={timings.asar || "N/A"} />
// //           {timings.maghrib && (
// //             <SalahNameTime salahName="Maghrib" salahTime={timings.maghrib} />
// //           )}
// //           <SalahNameTime salahName="Isha" salahTime={timings.isha || "N/A"} />
// //         </>
// //       ) : (
// //         <Text style={styles.subText}>Timings not available.</Text>
// //       )}

// //       {/* Render additional details if available */}
// //       {masjid.minutes && (
// //         <Text style={styles.subText}>Minutes: {masjid.minutes}</Text>
// //       )}
// //       {masjid.mosqueId && (
// //         <Text style={styles.subText}>Mosque ID: {masjid.mosqueId}</Text>
// //       )}

// //       {/* Button to open location in Google Maps */}
// //       <TouchableOpacity style={styles.mapButton} onPress={openGoogleMaps}>
// //         <Text style={styles.mapButtonText}>Open in Google Maps</Text>
// //       </TouchableOpacity>

// //       {/* Example Events Section */}
// //       <Text style={styles.subHeading}>Events</Text>
// //       <Text style={styles.subText}>1. Pasha bhai ki shadi</Text>
// //       <Text style={styles.subText}>2.</Text>
// //       <Text style={styles.subText}>3.</Text>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     width: Dimensions.get("window").width,
// //     paddingHorizontal: 30,
// //     paddingTop: 50,
// //     backgroundColor: "#E2F1E7",
// //   },
// //   heading: {
// //     fontSize: 50,
// //     color: "#387478",
// //     fontWeight: "bold",
// //   },
// //   subHeading: {
// //     fontSize: 40,
// //     color: "#387478",
// //     fontWeight: "bold",
// //     marginTop: 10,
// //     marginBottom: 10,
// //     textAlign: "center",
// //   },
// //   subText: {
// //     fontSize: 20,
// //     color: "#387478",
// //     fontWeight: "bold",
// //     marginVertical: 2,
// //   },
// //   mapButton: {
// //     backgroundColor: "#387478",
// //     paddingVertical: 10,
// //     paddingHorizontal: 20,
// //     borderRadius: 10,
// //     marginVertical: 20,
// //     alignItems: "center",
// //   },
// //   mapButtonText: {
// //     color: "#E2F1E7",
// //     fontSize: 18,
// //     fontWeight: "bold",
// //   },
// // });

































































































import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Linking,
} from "react-native";
import SalahNameTime from "./SalahNameTime";
import HeartButton from "./heartbutton";

export default function AboutMasjidPage({ route, navigation }) {
  const { masjid } = route.params;
console.log(masjid)
  //Pascal Case Converter
  function toPascalCase(str) {
    return str
      .split(/([ -])/g) // Split by both spaces and hyphens, preserving the separators
      .map(
        (word) =>
          word.match(/[a-zA-Z]/) // Check if it's a word (not a separator)
            ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize the word
            : word // Leave the separator as is
      )
      .join(""); // Join everything back together
  }

  // Extract details safely
  const masjidName =
    masjid.details?.name || masjid.mosqueName || "Unknown Mosque";
  const timings = masjid.details?.timings;
  const address = masjid.address ? masjid.address : "null";
  const location = masjid.location;

  // Function to open Google Maps with the masjid's location
  const openGoogleMaps = () => {
    if (location && location.latitude && location.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
      Linking.openURL(url);
    } else {
      alert("Location not available");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{toPascalCase(masjidName)}</Text>
      <HeartButton 
      
      masjidid = {masjid.id}
      />
      {/* Conditionally render the address */}
      {address ? (
        <Text style={styles.subText}>Address: {address}</Text>
      ) : (
        <Text style={styles.subText}>Address not available.</Text>
      )}

      {/* Conditionally render Salah timings */}
      {timings ? (
        <>
          <Text style={styles.subHeading}>Salah Timings</Text>
          <SalahNameTime salahName="Fajr" salahTime={timings.fajr || "N/A"} />
          <SalahNameTime salahName="Dhuhr" salahTime={timings.dhuhr || "N/A"} />
          <SalahNameTime salahName="Asr" salahTime={timings.asar || "N/A"} />
          {timings.maghrib && (
            <SalahNameTime salahName="Maghrib" salahTime={timings.maghrib} />
          )}
          <SalahNameTime salahName="Isha" salahTime={timings.isha || "N/A"} />
        </>
      ) : (
        <Text style={styles.subText}>Timings not available.</Text>
      )}

      {/* Render additional details if available */}
      {masjid.minutes && (
        <Text style={styles.subText}>
          Next Salah : {masjid.minutes} minutes
        </Text>
      )}

      <View style={styles.btnContainer}>
        {/* Button to open location in Google Maps */}
        <TouchableOpacity style={styles.mapButton} onPress={openGoogleMaps}>
          <Text style={styles.mapButtonText}>Google Maps</Text>
        </TouchableOpacity>

        {/* Update Timings Button */}
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => navigation.navigate("UpdateTimingsPage", { masjid })}
        >
          <Text style={styles.updateButtonText}>Update Timings</Text>
        </TouchableOpacity>
      </View>
      {/* Example Events Section */}
      <Text style={styles.subHeading}>Events</Text>
      <Text style={styles.subText}>1. Pasha bhai ki shadi</Text>
      <Text style={styles.subText}>2.</Text>
      <Text style={styles.subText}>3.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    paddingHorizontal: 30,
    paddingTop: 50,
    justifyContent: "flex-start",
    backgroundColor: "#E2F1E7",
  },
  heading: {
    fontSize: 40,
    color: "#387478",
    fontWeight: "bold",
  },
  subHeading: {
    fontSize: 30,
    color: "#387478",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  subText: {
    fontSize: 20,
    color: "#387478",
    fontWeight: "bold",
    marginVertical: 5,
  },
  mapButton: {
    backgroundColor: "#387478",
    height: 50,
    width: 180,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  mapButtonText: {
    color: "#E2F1E7",
    fontSize: 18,
    fontWeight: "bold",
  },
  updateButton: {
    backgroundColor: "#387478",
    height: 50,
    width: 180,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  updateButtonText: {
    color: "#E2F1E7",
    fontSize: 18,
    fontWeight: "bold",
  },
  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
});

// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   Linking
// } from "react-native";
// import SalahNameTime from "./SalahNameTime";

// export default function AboutMasjidPage({ route, navigation }) {
//   const { masjid } = route.params;

//   // Extract details safely
//   const masjidName = masjid.details?.name || masjid.mosqueName || "Unknown Mosque";
//   const timings = masjid.details?.timings;
//   const address = masjid.address ? masjid.address : null;
//   const location = masjid.location;

//   // Function to open Google Maps with the masjid's location
//   const openGoogleMaps = () => {
//     if (location && location.latitude && location.longitude) {
//       const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
//       Linking.openURL(url);
//     } else {
//       alert("Location not available");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>{masjidName}</Text>

//       {/* Conditionally render the address */}
//       {address ? (
//         <Text style={styles.subText}>Address: {address}</Text>
//       ) : (
//         <Text style={styles.subText}>Address not available.</Text>
//       )}

//       {/* Conditionally render Salah timings */}
//       {timings ? (
//         <>
//           <Text style={styles.subHeading}>Salah Timings</Text>
//           <SalahNameTime salahName="Fajr" salahTime={timings.fajr || "N/A"} />
//           <SalahNameTime salahName="Dhuhr" salahTime={timings.dhuhr || "N/A"} />
//           <SalahNameTime salahName="Asr" salahTime={timings.asar || "N/A"} />
//           {timings.maghrib && (
//             <SalahNameTime salahName="Maghrib" salahTime={timings.maghrib} />
//           )}
//           <SalahNameTime salahName="Isha" salahTime={timings.isha || "N/A"} />
//         </>
//       ) : (
//         <Text style={styles.subText}>Timings not available.</Text>
//       )}

//       {/* Render additional details if available */}
//       {masjid.minutes && (
//         <Text style={styles.subText}>Minutes: {masjid.minutes}</Text>
//       )}
//       {masjid.mosqueId && (
//         <Text style={styles.subText}>Mosque ID: {masjid.mosqueId}</Text>
//       )}

//       {/* Button to open location in Google Maps */}
//       <TouchableOpacity style={styles.mapButton} onPress={openGoogleMaps}>
//         <Text style={styles.mapButtonText}>Open in Google Maps</Text>
//       </TouchableOpacity>

//       {/* Example Events Section */}
//       <Text style={styles.subHeading}>Events</Text>
//       <Text style={styles.subText}>1. Pasha bhai ki shadi</Text>
//       <Text style={styles.subText}>2.</Text>
//       <Text style={styles.subText}>3.</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     width: Dimensions.get("window").width,
//     paddingHorizontal: 30,
//     paddingTop: 50,
//     backgroundColor: "#E2F1E7",
//   },
//   heading: {
//     fontSize: 50,
//     color: "#387478",
//     fontWeight: "bold",
//   },
//   subHeading: {
//     fontSize: 40,
//     color: "#387478",
//     fontWeight: "bold",
//     marginTop: 10,
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   subText: {
//     fontSize: 20,
//     color: "#387478",
//     fontWeight: "bold",
//     marginVertical: 2,
//   },
//   mapButton: {
//     backgroundColor: "#387478",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     marginVertical: 20,
//     alignItems: "center",
//   },
//   mapButtonText: {
//     color: "#E2F1E7",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });
