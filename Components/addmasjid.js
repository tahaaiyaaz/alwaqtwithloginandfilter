import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import MapView, { UrlTile, Marker } from 'react-native-maps';
import * as Location from "expo-location";
import NearbyRestaurants from "./placedetails";
import SearchBar from "./SearchBar";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { addMasjid } from "./apiaddmasjid";
import { COLORS, FONTS, SIZES, SHADOWS } from "./Theme";
import Ionicons from "@expo/vector-icons/Ionicons";

const AddMasjidScreen = () => {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [masjidName, setMasjidName] = useState("");
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [locationofmasjid, setLocationofmasjid] = useState({
    lat: "",
    lng: "",
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [timings, setTimings] = useState({
    fajr: "",
    dhuhr: "",
    asar: "",
    isha: "",
    jummatiming: "",
    taraweeh: "",
  });

  const [pickerVisible, setPickerVisible] = useState({
    fajr: false,
    dhuhr: false,
    asar: false,
    isha: false,
    jummatiming: false,
    taraweeh: false,
  });

  // Step 1: Address Search & Existing Masjids
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Step 1: Location</Text>
      <Text style={styles.subTitle}>Search or tap the map to find existing masjids</Text>
      
      <View style={styles.searchBarWrapper}>
         <SearchBar setSendCoords={setLocation} />
      </View>

      <View style={styles.mapContainerStep1}>
         <MapView
            style={styles.map}
            mapType={Platform.OS === 'android' ? 'none' : 'standard'}
            region={{
              latitude: location.lat ? parseFloat(location.lat) : 17.3850,
              longitude: location.lng ? parseFloat(location.lng) : 78.4867,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            onPress={(e) => {
              const coords = e.nativeEvent.coordinate;
              setLocation({ lat: coords.latitude, lng: coords.longitude });
            }}
         >
            <UrlTile
              urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
              flipY={false}
            />
            {location.lat !== "" && location.lng !== "" && (
               <Marker
                  coordinate={{
                    latitude: parseFloat(location.lat),
                    longitude: parseFloat(location.lng)
                  }}
                  draggable
                  onDragEnd={(e) => {
                    const coords = e.nativeEvent.coordinate;
                    setLocation({ lat: coords.latitude, lng: coords.longitude });
                  }}
               />
            )}
         </MapView>
         <Text style={styles.mapInstruction}>Tap inside the map to search nearby</Text>
      </View>

      {location.lat !== "" && location.lng !== "" && (
        <>
            <View style={styles.nearbyContainer}>
                 <NearbyRestaurants location={location} />
            </View>
        </>
      )}

      <View style={styles.btnCenter}>
          <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
          <Text style={styles.buttonText}>Proceed to Add New</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
          </TouchableOpacity>
      </View>
    </View>
  );

  // Step 2: Masjid Details (Name & Location)
  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Location permission is required to fetch your current location.");
        setIsLoadingLocation(false);
        return;
      }
      
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      console.log("Got location:", currentLocation.coords.latitude, currentLocation.coords.longitude);
      
      setLocationofmasjid({
        lat: currentLocation.coords.latitude,
        lng: currentLocation.coords.longitude,
      });
      
      // Reverse Geocode for Address
      try {
        let reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        if (reverseGeocode && reverseGeocode.length > 0) {
          const addr = reverseGeocode[0];
          const formattedAddress = `${addr.name || ""}, ${addr.street || ""}, ${addr.city || ""}, ${addr.region || ""}, ${addr.postalCode || ""}`;
          setAddress(formattedAddress.replace(/^,\s*/, '').replace(/,\s*,/g, ','));
        } else {
          setAddress(`Lat: ${currentLocation.coords.latitude.toFixed(4)}, Lng: ${currentLocation.coords.longitude.toFixed(4)}`);
        }
      } catch (geoError) {
        console.warn("Reverse geocoding failed", geoError);
        setAddress(`Lat: ${currentLocation.coords.latitude.toFixed(4)}, Lng: ${currentLocation.coords.longitude.toFixed(4)}`);
      }
      
    } catch (error) {
      console.error("Location error:", error);
      Alert.alert("Error", "Could not fetch current location. Please check your device's location settings.");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const renderStep2 = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Step 2: Details</Text>
      
      <View style={styles.card}>
          <Text style={styles.inputLabel}>Masjid Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter masjid name"
            placeholderTextColor={COLORS.textLight}
            value={masjidName}
            onChangeText={setMasjidName}
          />
          
          <Text style={styles.inputLabel}>Location</Text>
          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={getCurrentLocation}
            disabled={isLoadingLocation}
          >
            {isLoadingLocation ? (
                <ActivityIndicator color={COLORS.primary} />
            ) : (
                <>
                    <Ionicons name="locate" size={20} color={COLORS.primary} />
                    <Text style={styles.secondaryButtonText}>Use Current Location</Text>
                </>
            )}
          </TouchableOpacity>
          
          <View style={styles.mapContainer}>
             <MapView
                style={styles.map}
                mapType={Platform.OS === 'android' ? 'none' : 'standard'}
                region={{
                  latitude: locationofmasjid.lat ? parseFloat(locationofmasjid.lat) : (location.lat ? parseFloat(location.lat) : 17.3850),
                  longitude: locationofmasjid.lng ? parseFloat(locationofmasjid.lng) : (location.lng ? parseFloat(location.lng) : 78.4867),
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                onPress={(e) => {
                  const coords = e.nativeEvent.coordinate;
                  setLocationofmasjid({ lat: coords.latitude, lng: coords.longitude });
                  setAddress(`Lat: ${coords.latitude.toFixed(4)}, Lng: ${coords.longitude.toFixed(4)}`);
                }}
             >
                <UrlTile
                  urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maximumZ={19}
                  flipY={false}
                />
                {locationofmasjid.lat !== "" && locationofmasjid.lng !== "" && (
                   <Marker
                      coordinate={{
                        latitude: parseFloat(locationofmasjid.lat),
                        longitude: parseFloat(locationofmasjid.lng)
                      }}
                      draggable
                      onDragEnd={(e) => {
                        const coords = e.nativeEvent.coordinate;
                        setLocationofmasjid({ lat: coords.latitude, lng: coords.longitude });
                        setAddress(`Lat: ${coords.latitude.toFixed(4)}, Lng: ${coords.longitude.toFixed(4)}`);
                      }}
                   />
                )}
             </MapView>
             <Text style={styles.mapInstruction}>Tap map or drag marker to adjust location</Text>
          </View>

          {locationofmasjid.lat !== "" && (
            <View style={styles.infoBox}>
                 <Text style={styles.infoText}>✅ Coordinates Captured:</Text>
                 <Text style={styles.infoTextValue}>{parseFloat(locationofmasjid.lat).toFixed(6)}, {parseFloat(locationofmasjid.lng).toFixed(6)}</Text>
            </View>
          )}

           {address !== "" && (
            <View style={styles.infoBox}>
                 <Text style={styles.infoText}>📍 Address:</Text>
                 <Text style={styles.infoTextValue}>{address}</Text>
            </View>
          )}
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
          <Ionicons name="arrow-back" size={20} color={COLORS.textSecondary} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => {
            if (!locationofmasjid.lat || !locationofmasjid.lng) {
              Alert.alert("Location Required", "Please 'Use Current Location' or select on map to proceed.");
              return;
            }
            setStep(3);
          }}
        >
          <Text style={styles.buttonText}>Next: Timings</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // Step 3: Prayer Timings
  const showPicker = (prayer) => {
    setPickerVisible((prev) => ({ ...prev, [prayer]: true }));
  };

  const hidePicker = (prayer) => {
    setPickerVisible((prev) => ({ ...prev, [prayer]: false }));
  };

  const handleConfirm = (date, prayer) => {
    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setTimings((prev) => ({ ...prev, [prayer]: formattedTime }));
    hidePicker(prayer);
  };

  const renderStep3 = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Step 3: Prayer Timings</Text>
      
      <View style={styles.card}>
      {["fajr", "dhuhr", "asar", "isha", "jummatiming", "taraweeh"].map(
        (prayer) => (
          <View key={prayer} style={styles.timeRow}>
            <Text style={styles.label}>
              {prayer.charAt(0).toUpperCase() + prayer.slice(1)}
            </Text>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => showPicker(prayer)}
            >
              <Text style={styles.timeText}>
                {timings[prayer] || "Select Time"}
              </Text>
               <Ionicons name="time-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={pickerVisible[prayer]}
              mode="time"
              is24Hour={false}
              onConfirm={(date) => handleConfirm(date, prayer)}
              onCancel={() => hidePicker(prayer)}
            />
          </View>
        )
      )}
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => setStep(2)}>
          <Ionicons name="arrow-back" size={20} color={COLORS.textSecondary} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.successButton} onPress={handleAddMasjid}>
          <Text style={styles.successButtonText}>Add Masjid</Text>
          <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const handleAddMasjid = async () => {
    if (!locationofmasjid.lat || !locationofmasjid.lng) {
      Alert.alert(
        "Location Error",
        "Current location is not available. Please 'Get Current Location' in Step 2."
      );
      return;
    }
    if (!masjidName || masjidName.trim() === "") {
      Alert.alert("Missing Name", "Please enter the masjid name.");
      return;
    }
    for (const [prayer, time] of Object.entries(timings)) {
      if (!time || time.trim() === "") {
        Alert.alert("Missing Timing", `Please provide the ${prayer} timing.`);
        return;
      }
    }

    const finalData = {
      latitude: locationofmasjid.lat,
      longitude: locationofmasjid.lng,
      countryName: "India", // Can be dynamic with reverse geocode
      cityName: "City",
      stateName: "State",
      details: {
        addressLine1: address || "Custom Location",
        name: masjidName,
        timings,
      },
    };

    try {
      await addMasjid(finalData);
      Alert.alert(
        "Submitted",
        "We will reach out to you soon regarding masjid details confirmation.",
        [{ text: "OK", onPress: () => { setStep(1); setMasjidName(""); setAddress(""); setLocationofmasjid({lat:"", lng:""}); setTimings({fajr:"", dhuhr:"", asar:"", isha:"", jummatiming:"", taraweeh:""});} }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to add masjid. Please try again.");
    }
  };

  return (
    <View style={styles.mainContainer}>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    ...FONTS.h1,
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 5,
  },
  subTitle: {
      ...FONTS.body3,
      color: COLORS.textSecondary,
      textAlign: "center",
      marginBottom: 20,
  },
  card: {
      backgroundColor: COLORS.surface,
      borderRadius: SIZES.radius,
      padding: SIZES.padding,
      ...SHADOWS.light,
      marginBottom: 20,
  },
  searchBarWrapper: {
      zIndex: 10,
      marginBottom: 20,
  },
  nearbyContainer: {
      flex: 1,
      marginVertical: 10,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 15,
    borderRadius: SIZES.radius,
    ...FONTS.body3,
    color: COLORS.textPrimary,
  },
  inputLabel: {
      ...FONTS.h3,
      color: COLORS.textPrimary,
      marginBottom: 5,
  },
  secondaryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      borderWidth: 1,
      borderColor: COLORS.primary,
      borderRadius: SIZES.radius,
      marginBottom: 15,
      backgroundColor: COLORS.background,
      minHeight: 50,
  },
  secondaryButtonText: {
      ...FONTS.h3,
      color: COLORS.primary,
      marginLeft: 8,
  },
  infoBox: {
      backgroundColor: COLORS.background,
      padding: 10,
      borderRadius: SIZES.radius,
      marginBottom: 10,
      borderLeftWidth: 3,
      borderLeftColor: COLORS.success,
  },
  infoText: {
      ...FONTS.h4,
      color: COLORS.textSecondary,
      fontWeight: 'bold',
  },
  infoTextValue: {
      ...FONTS.body4,
      color: COLORS.textPrimary,
  },
  timeRow: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
  },
  label: {
     ...FONTS.h3,
     color: COLORS.textPrimary,
     marginBottom: 5,
  },
  timeButton: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
  },
  btnCenter: {
    alignItems: "center",
    marginTop: 20,
  },
  btnRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: SIZES.radius,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  buttonText: {
    ...FONTS.h3,
    color: COLORS.white,
    fontWeight: "bold",
    marginRight: 8,
  },
  successButton: {
    backgroundColor: COLORS.success,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: SIZES.radius,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  successButtonText: {
    ...FONTS.h3,
    color: COLORS.white,
    fontWeight: "bold",
    marginRight: 8,
  },
  backButton: {
      paddingVertical: 15,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
  },
  backButtonText: {
      ...FONTS.h3,
      color: COLORS.textSecondary,
      marginLeft: 5,
  },
  mapContainer: {
    height: 250,
    width: '100%',
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mapContainerStep1: {
    height: 200,
    width: '100%',
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    marginBottom: 5, // Tighter margin so NearbyRestaurants list fits
    borderWidth: 1,
    borderColor: COLORS.border,
    zIndex: 1, // Search bar should ideally be above this
  },
  map: {
    flex: 1,
  },
  mapInstruction: {
    ...FONTS.body4,
    color: COLORS.white,
    backgroundColor: 'rgba(0,0,0,0.6)',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    textAlign: 'center',
    paddingVertical: 5,
  },
});

export default AddMasjidScreen;
