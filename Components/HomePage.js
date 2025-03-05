// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   ActivityIndicator,
//   ScrollView,
// } from "react-native";
// import NearestMasjidCard from "./NearestMasjidCard";
// import CurrentLocationUI from "./CurrentLocationUI";

// export default function HomePage({ navigation }) {
//   const [masjidData, setMasjidData] = useState();
//   const [earlierMasjidData, setEarlierMasjidData] = useState();
//   const [laterMasjidData, setLaterMasjidData] = useState();
//   const [showAllNearby, setShowAllNearby] = useState(false);
//   const [showAllEarlier, setShowAllEarlier] = useState(false);
//   const [showAllLater, setShowAllLater] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setTimeout(() => {
//           const fetchedMasjids = [
//             { id: 1, details: { name: "masjida" }, distance: "2 km", nextNamazTime: "12:00 PM" },
//             { id: 2, details: { name: "masjida" }, distance: "3 km", nextNamazTime: "1:00 PM" },
//             { id: 3, details: { name: "masjida" }, distance: "5 km", nextNamazTime: "9:00 AM" },
//             { id: 4, details: { name: "masjida" }, distance: "1 km", nextNamazTime: "10:00 AM" },
//             { id: 5, details: { name: "masjida" }, distance: "4 km", nextNamazTime: "4:00 PM" },
//             { id: 6, details: { name: "masjida" }, distance: "6 km", nextNamazTime: "5:00 PM" },
//           ];

//           // For demonstration, we use the first 3 for all sections.
//           setMasjidData({ masjids: fetchedMasjids.slice(0, 3) });
//           setEarlierMasjidData({ masjids: fetchedMasjids.slice(0, 3) });
//           setLaterMasjidData({ masjids: fetchedMasjids.slice(0, 3) });
//           setIsLoading(false);
//         }, 2000);
//       } catch (error) {
//         setIsLoading(false);
//         console.error("Error fetching data", error);
//       }
//     };

//     fetchData();
//   }, []);

//   // Render function for Nearby Masjids
//   const renderMasjidList = (data, showAll, setShowAll) => {
//     if (data && data.masjids && data.masjids.length !== 0) {
//       return (
//         <>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             {data.masjids
//               .slice(0, showAll ? data.masjids.length : 2)
//               .map((masjid) => (
//                 <TouchableOpacity key={masjid.id}>
//                   <NearestMasjidCard
//                     MasjidName={masjid.details.name}
//                     MasjidDistance={masjid.distance}
//                     NextNamazTime={masjid.nextNamazTime}
//                     navigation={navigation}
//                     masjid={masjid}
//                   />
//                 </TouchableOpacity>
//               ))}
//           </ScrollView>
//           {data.masjids.length > 2 && (
//             <TouchableOpacity
//               style={styles.showMoreButton}
//               onPress={() => setShowAll(!showAll)}
//             >
//               <Text style={styles.showMoreText}>
//                 {showAll ? "Show Less" : "Show More"}
//               </Text>
//             </TouchableOpacity>
//           )}
//         </>
//       );
//     } else if (isLoading) {
//       return <ActivityIndicator size="large" color="#387478" />;
//     } else {
//       return <Text>No masjid data available.</Text>;
//     }
//   };

//   // Render function for Earlier Prayer Masjids
//   const renderMasjidListForEarlier = (data, showAll, setShowAll) => {
//     if (data && data.masjids && data.masjids.length !== 0) {
//       return (
//         <>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             {data.masjids
//               .slice(0, showAll ? data.masjids.length : 2)
//               .map((masjid) => (
//                 <NearestMasjidCard
//                   key={masjid.mosqueId || masjid.id}
//                   MasjidName={masjid.mosqueName || masjid.details.name}
//                   MasjidDistance={masjid.distance || "20"}
//                   NextNamazTime={masjid.time || masjid.nextNamazTime}
//                   navigation={navigation}
//                   masjid={masjid}
//                 />
//               ))}
//           </ScrollView>
//           {data.masjids.length > 2 && (
//             <TouchableOpacity
//               style={styles.showMoreButton}
//               onPress={() => setShowAll(!showAll)}
//             >
//               <Text style={styles.showMoreText}>
//                 {showAll ? "Show Less" : "Show More"}
//               </Text>
//             </TouchableOpacity>
//           )}
//         </>
//       );
//     } else if (isLoading) {
//       return <ActivityIndicator size="large" color="#387478" />;
//     } else {
//       return <Text>No masjid data available.</Text>;
//     }
//   };

//   // Render function for Later Prayer Masjids (with reversed order)
//   const renderMasjidListForLater = (earliermasjids, showAll, setShowAll) => {
//     let data = earliermasjids;
//     if (data && data.masjids && data.masjids.length !== 0) {
//       // Create a reversed copy without mutating the state
//       const reversedMasjids = [...data.masjids].reverse();
//       return (
//         <>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             {reversedMasjids
//               .slice(0, showAll ? reversedMasjids.length : 2)
//               .map((masjid) => (
//                 <NearestMasjidCard
//                   key={masjid.mosqueId || masjid.id}
//                   MasjidName={masjid.mosqueName || masjid.details.name}
//                   MasjidDistance={masjid.distance || "20"}
//                   NextNamazTime={masjid.time || masjid.nextNamazTime}
//                   navigation={navigation}
//                   masjid={masjid}
//                 />
//               ))}
//           </ScrollView>
//           {data.masjids.length > 2 && (
//             <TouchableOpacity
//               style={styles.showMoreButton}
//               onPress={() => setShowAll(!showAll)}
//             >
//               <Text style={styles.showMoreText}>
//                 {showAll ? "Show Less" : "Show More"}
//               </Text>
//             </TouchableOpacity>
//           )}
//         </>
//       );
//     } else if (isLoading) {
//       return <ActivityIndicator size="large" color="#387478" />;
//     } else {
//       return <Text>No masjid data available.</Text>;
//     }
//   };

//   return (
//     <ScrollView
//       style={styles.container}
//       contentContainerStyle={styles.scrollContent}
//       showsVerticalScrollIndicator={false}
//     >
//       <CurrentLocationUI
//         setMasjidData={setMasjidData}
//         setEarlierMasjidData={setEarlierMasjidData}
//         setLaterMasjidData={setLaterMasjidData}
//       />

//       {/* Nearby Masjids Section */}
//       <Text style={styles.subHeadings}>Nearby</Text>
//       {renderMasjidList(masjidData, showAllNearby, setShowAllNearby)}

//       {/* Earlier Prayer Masjids Section */}
//       <Text style={styles.subHeadings}>Earlier Prayer Masjids</Text>
//       {renderMasjidListForEarlier(earlierMasjidData, showAllEarlier, setShowAllEarlier)}

//       {/* Later Prayer Masjids Section */}
//       <Text style={styles.subHeadings}>Later Prayer Masjids</Text>
//       {renderMasjidListForLater(earlierMasjidData, showAllLater, setShowAllLater)}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#E2F1E7",
//   },
//   scrollContent: {
//     flexGrow: 1,
//     width: Dimensions.get("window").width,
//     paddingHorizontal: 30,
//     paddingTop: 50,
//     paddingBottom: 50, // Added padding for better scrolling experience
//   },
//   subHeadings: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#387478",
//     marginTop: 10,
//     marginBottom: 5,
//   },
//   showMoreText: {
//     fontSize: 16,
//     color: "#E2F1E7",
//   },
//   showMoreButton: {
//     backgroundColor: "#387478",
//     height: 40,
//     width: 120,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     marginVertical: 10,
//     alignSelf: "center",
//   },
// });

















































// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   ActivityIndicator,
//   ScrollView,
// } from "react-native";
// import NearestMasjidCard from "./NearestMasjidCard";
// import CurrentLocationUI from "./CurrentLocationUI";

// export default function HomePage({ navigation }) {
//   const [masjidData, setMasjidData] = useState();
//   const [earlierMasjidData, setEarlierMasjidData] = useState();
//   const [laterMasjidData, setLaterMasjidData] = useState();
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setTimeout(() => {
//           const fetchedMasjids = [
//             {
//               id: 1,
//               details: { name: "masjida" },
//               distance: "2 km",
//               nextNamazTime: "12:00 PM",
//             },
//             {
//               id: 2,
//               details: { name: "masjida" },
//               distance: "3 km",
//               nextNamazTime: "1:00 PM",
//             },
//             {
//               id: 3,
//               details: { name: "masjida" },
//               distance: "5 km",
//               nextNamazTime: "9:00 AM",
//             },
//             {
//               id: 4,
//               details: { name: "masjida" },
//               distance: "1 km",
//               nextNamazTime: "10:00 AM",
//             },
//             {
//               id: 5,
//               details: { name: "masjida" },
//               distance: "4 km",
//               nextNamazTime: "4:00 PM",
//             },
//             {
//               id: 6,
//               details: { name: "masjida" },
//               distance: "6 km",
//               nextNamazTime: "5:00 PM",
//             },
//           ];

//           // For demonstration, we use the first 3 for all sections.
//           setMasjidData({ masjids: fetchedMasjids.slice(0, 3) });
//           setEarlierMasjidData({ masjids: fetchedMasjids.slice(0, 3) });
//           setLaterMasjidData({ masjids: fetchedMasjids.slice(0, 3) });
//           setIsLoading(false);
//         }, 2000);
//       } catch (error) {
//         setIsLoading(false);
//         console.error("Error fetching data", error);
//       }
//     };

//     fetchData();
//   }, []);

//   // Render function for Nearby Masjids
//   const renderMasjidNearList = (data) => {
//     if (data && data.masjids && data.masjids.length !== 0) {
//       return (
//         <ScrollView
//           style={styles.scrollViewStyle}
//           contentContainerStyle={styles.scrollViewContainerStyle}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//         >
//           {data.masjids.map((masjid) => (
//             <View key={masjid.id}>
//               <NearestMasjidCard
//                 MasjidName={masjid.details.name}
//                 MasjidDistance={masjid.distance}
//                 NextNamazTime={masjid.nextNamazTime}
//                 navigation={navigation}
//                 masjid={masjid}
//               />
//             </View>
//           ))}
//         </ScrollView>
//       );
//     } else if (isLoading) {
//       return <ActivityIndicator size="large" color="#387478" />;
//     } else {
//       return <Text>No masjid data available.</Text>;
//     }
//   };

//   // Render function for Earlier Prayer Masjids
//   const renderMasjidListForEarlier = (data) => {
//     if (data && data.masjids && data.masjids.length !== 0) {
//       return (
//         <ScrollView
//           style={styles.scrollViewStyle}
//           contentContainerStyle={styles.scrollViewContainerStyle}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//         >
//           {data.masjids.map((masjid) => (
//             <NearestMasjidCard
//               key={masjid.mosqueId || masjid.id}
//               MasjidName={masjid.mosqueName || masjid.details.name}
//               MasjidDistance={masjid.distance || "20"}
//               NextNamazTime={masjid.time || masjid.nextNamazTime}
//               navigation={navigation}
//               masjid={masjid}
//             />
//           ))}
//         </ScrollView>
//       );
//     } else if (isLoading) {
//       return <ActivityIndicator size="large" color="#387478" />;
//     } else {
//       return <Text>No masjid data available.</Text>;
//     }
//   };

//   // Render function for Later Prayer Masjids (with reversed order)
//   const renderMasjidListForLater = (earliermasjids) => {
//     let data = earliermasjids;
//     if (data && data.masjids && data.masjids.length !== 0) {
//       // Create a reversed copy without mutating the state
//       const reversedMasjids = [...data.masjids].reverse();
//       return (
//         <ScrollView
//           style={styles.scrollViewStyle}
//           contentContainerStyle={styles.scrollViewContainerStyle}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//         >
//           {reversedMasjids.map((masjid) => (
//             <NearestMasjidCard
//               key={masjid.mosqueId || masjid.id}
//               MasjidName={masjid.mosqueName || masjid.details.name}
//               MasjidDistance={masjid.distance || "20"}
//               NextNamazTime={masjid.time || masjid.nextNamazTime}
//               navigation={navigation}
//               masjid={masjid}
//             />
//           ))}
//         </ScrollView>
//       );
//     } else if (isLoading) {
//       return <ActivityIndicator size="large" color="#387478" />;
//     } else {
//       return <Text>No masjid data available.</Text>;
//     }
//   };

//   return (
//     <ScrollView
//       style={styles.container}
//       contentContainerStyle={styles.scrollContent}
//       showsVerticalScrollIndicator={false}
//     >
//       <CurrentLocationUI
//         setMasjidData={setMasjidData}
//         setEarlierMasjidData={setEarlierMasjidData}
//         setLaterMasjidData={setLaterMasjidData}
//       />

//       {/* Nearby Masjids Section */}
//       <Text style={styles.subHeadings}>Nearby Mass</Text>
//       {renderMasjidNearList(masjidData)}

//       {/* Earlier Prayer Masjids Section */}
//       <Text style={styles.subHeadings}>Earlier Prayer Masjids</Text>
//       {renderMasjidListForEarlier(earlierMasjidData)}

//       {/* Later Prayer Masjids Section */}
//       <Text style={styles.subHeadings}>Later Prayer Masjids</Text>
//       {renderMasjidListForLater(earlierMasjidData)}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#E2F1E7",
//   },
//   scrollContent: {
//     //flexGrow: 1,
//     width: Dimensions.get("window").width,
//     paddingHorizontal: 35,
//     paddingTop: 40,
//     paddingBottom: 40, // Added padding for better scrolling experience
//   },
//   subHeadings: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#387478",
//     marginTop: 20,
//     marginBottom: 20,
//   },

//   scrollViewContainerStyle: {
//     paddingTop: 5,
//     paddingBottom: 5,
//   },
// });






































import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import NearestMasjidCard from "./NearestMasjidCard";
import CurrentLocationUI from "./CurrentLocationUI";


export default function HomePage({ navigation }) {

  const [masjidData, setMasjidData] = useState();
  const [earlierMasjidData, setEarlierMasjidData] = useState();
  const [laterMasjidData, setLaterMasjidData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTimeout(() => {
          const fetchedMasjids = [
            {
              id: 1,
              details: { name: "masjida" },
              distance: "2 km",
              nextNamazTime: "12:00 PM",
            },
            {
              id: 2,
              details: { name: "masjida" },
              distance: "3 km",
              nextNamazTime: "1:00 PM",
            },
            {
              id: 3,
              details: { name: "masjida" },
              distance: "5 km",
              nextNamazTime: "9:00 AM",
            },
            {
              id: 4,
              details: { name: "masjida" },
              distance: "1 km",
              nextNamazTime: "10:00 AM",
            },
            {
              id: 5,
              details: { name: "masjida" },
              distance: "4 km",
              nextNamazTime: "4:00 PM",
            },
            {
              id: 6,
              details: { name: "masjida" },
              distance: "6 km",
              nextNamazTime: "5:00 PM",
            },
          ];

          // For demonstration, we use the first 3 for all sections.
          setMasjidData({ masjids: fetchedMasjids.slice(0, 3) });
          setEarlierMasjidData({ masjids: fetchedMasjids.slice(0, 3) });
          setLaterMasjidData({ masjids: fetchedMasjids.slice(0, 3) });
          setIsLoading(false);
        }, 2000);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  // Render function for Nearby Masjids
  const renderMasjidNearList = (data) => {
    console.log(data)
    if (data && data.masjids && data.masjids.length !== 0) {
      return (
        <ScrollView
          style={styles.scrollViewStyle}
          contentContainerStyle={styles.scrollViewContainerStyle}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {data.masjids.map((masjid) => (
            <View key={masjid.id}>
              <NearestMasjidCard
                MasjidName={masjid.details.name}
                MasjidDistance={masjid.distance}
                NextNamazTime={masjid.nextNamazTime}
                navigation={navigation}
                masjid={masjid}
              />
            </View>
          ))}
        </ScrollView>
      );
    } else if (isLoading) {
      return <ActivityIndicator size="large" color="#387478" />;
    } else {
      return <Text>No masjid data available.</Text>;
    }
  };

  // Render function for Earlier Prayer Masjids
  const renderMasjidListForEarlier = (data) => {
    console.log(data)
    if (data && data.masjids && data.masjids.length !== 0) {
      return (
        <ScrollView
          style={styles.scrollViewStyle}
          contentContainerStyle={styles.scrollViewContainerStyle}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {data.masjids.map((masjid) => (
            <NearestMasjidCard
              key={masjid.mosqueId || masjid.id}
              MasjidName={masjid.mosqueName || masjid.details.name}
              MasjidDistance={masjid.distance || "20"}
              NextNamazTime={masjid.time || masjid.nextNamazTime}
              navigation={navigation}
              masjid={masjid}
            />
          ))}
        </ScrollView>
      );
    } else if (isLoading) {
      return <ActivityIndicator size="large" color="#387478" />;
    } else {
      return <Text>No masjid data available.</Text>;
    }
  };

  // Render function for Later Prayer Masjids (with reversed order)
  const renderMasjidListForLater = (earliermasjids) => {
    console.log(earliermasjids)
    let data = earliermasjids;
    if (data && data.masjids && data.masjids.length !== 0) {
      // Create a reversed copy without mutating the state
      const reversedMasjids = [...data.masjids].reverse();
      return (
        <ScrollView
          style={styles.scrollViewStyle}
          contentContainerStyle={styles.scrollViewContainerStyle}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {reversedMasjids.map((masjid) => (
            <NearestMasjidCard
              key={masjid.mosqueId || masjid.id}
              MasjidName={masjid.mosqueName || masjid.details.name}
              MasjidDistance={masjid.distance || "20"}
              NextNamazTime={masjid.time || masjid.nextNamazTime}
              navigation={navigation}
              masjid={masjid}
            />
          ))}
        </ScrollView>
      );
    } else if (isLoading) {
      return <ActivityIndicator size="large" color="#387478" />;
    } else {
      return <Text>No masjid data available.</Text>;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >


      <CurrentLocationUI
        setMasjidData={setMasjidData}
        setEarlierMasjidData={setEarlierMasjidData}
        setLaterMasjidData={setLaterMasjidData}
      />

      {/* Nearby Masjids Section */}
      <Text style={styles.subHeadings}>Nearby Masjids</Text>
      {renderMasjidNearList(masjidData)}

      {/* Earlier Prayer Masjids Section */}
      <Text style={styles.subHeadings}>Earlier Prayer Masjids</Text>
      {renderMasjidListForEarlier(earlierMasjidData)}

      {/* Later Prayer Masjids Section */}
      <Text style={styles.subHeadings}>Later Prayer Masjids</Text>
      {renderMasjidListForLater(earlierMasjidData)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E2F1E7",
  },
  scrollContent: {
    //flexGrow: 1,
    width: Dimensions.get("window").width,
    paddingHorizontal: 35,
    paddingTop: 40,
    paddingBottom: 40, // Added padding for better scrolling experience
  },
  subHeadings: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#387478",
    marginTop: 20,
    marginBottom: 20,
  },

  scrollViewContainerStyle: {
    paddingTop: 5,
    paddingBottom: 5,
  },
});
