import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import * as Location from "expo-location";
import SearchBar from "./SearchBar";
import PrayerTimeComponent from "./arragemasjidsaccordingtotime";

import FilterButton from "./filterbutton";
import FilterPopover from "./filterpopover";

const CurrentLocationUI = ({ setMasjidData,setLaterMasjidData,setEarlierMasjidData }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [city, setCity] = useState(null);
  const [country, setCountry] = useState(null);
  const [earliermasjiddata,setearliermasjiddata] = useState(null)
  //tapped masjid data
  const [sendCoords, setSendCoords] = useState([]);
  const [Filters,setFilters] = useState({})

  //Api data
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  const openPopover = () => setIsPopoverVisible(true);
  const closePopover = () => setIsPopoverVisible(false);

  const handleApplyFilter = async (filter) => {
    console.log("Filter applied:", filter);
    // Here you can pass the filter criteria to your API or update your UI accordingly.







    closePopover();
    console.log('closed popup')
     setFilters(filter)
    console.log(filter)
    

    // uses current location to display masjids
    //getallnearestmasjids(location.coords.latitude, location.coords.longitude);
    // uses tapped location to display masjids
    if (sendCoords.length == 0) {
      
    let location = await Location.getCurrentPositionAsync({});
      getallnearestmasjids(location.coords.latitude, location.coords.longitude);
    } else {
      getallnearestmasjids(sendCoords.lat, sendCoords.lng);
    }




  };
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
    })();
  }, []);

  const getLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});

    // uses current location to display masjids
    //getallnearestmasjids(location.coords.latitude, location.coords.longitude);
    // uses tapped location to display masjids
    if (sendCoords.length == 0) {
      getallnearestmasjids(location.coords.latitude, location.coords.longitude);
    } else {
      getallnearestmasjids(sendCoords.lat, sendCoords.lng);
    }

    // getallnearestmasjids(sendCoords.lat, sendCoords.lng);

    setLocation(location);
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
    getReverseGeocode(location.coords.latitude, location.coords.longitude);
  };

  const getReverseGeocode = async (latitude, longitude) => {
    let reverseGeocode = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    setAddress(reverseGeocode);
    setCity(reverseGeocode[0].city);
    setCountry(reverseGeocode[0].country);
  };

  function getallnearestmasjids(latitude, longitude,radius = '10000') {
    console.log(latitude, longitude);
    fetch(
      `https://helloworld-ftfo4ql2pa-el.a.run.app/getNearestMasjid?latitude=${latitude}&longitude=${longitude}&radiusInKm=${radius}`
    )
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        setMasjidData(json);
        setearliermasjiddata(json)
        setLaterMasjidData()
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }

  async function getlocationandmasjids() {
    await getLocation();
  }
  //Api call
  useEffect(() => {
    getlocationandmasjids();
  }, []);

  return (
    <View>
      <SearchBar
        setSendCoords={setSendCoords}
        getallnearestmasjids={getallnearestmasjids}
      />

      
      <FilterButton onPress={openPopover} />
            <FilterPopover visible={isPopoverVisible} onClose={closePopover} onApply={handleApplyFilter} />
         

<PrayerTimeComponent
        mosqueData={data}
        setEarlierMasjidData={setEarlierMasjidData}
        setMasjidData={setMasjidData}
        Filters={Filters}
      />
      {/* <Text>Current Location:</Text>
      {location ? (
        <Text>
          Latitude: {latitude}, Longitude: {longitude}
        </Text>
      ) : (
        <Text>No location data available</Text>
      )}
      {address ? (
        <Text>
          Address: {city}, {country}
        </Text>
      ) : (
        <Text>No address data available</Text>
      )}
      {errorMsg ? <Text style={{ color: "red" }}>{errorMsg}</Text> : null}
      <Button title="Get Location" onPress={getLocation} /> */}
    </View>
  );
};

export default CurrentLocationUI;
