import React, { useState, useMemo } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import debounce from "lodash.debounce";

const SearchBar = ({ setSendCoords, getallnearestmasjids }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);


  // Replace with your actual API key
  const apiKey = "4yMoq0DZvYfIOnx8bt5vllCNmshBnfNIrsRvE36q";

  const fetchAutocomplete = async (input) => {
    if (input.trim() === "") {
      setResults([]);
      return;
    }
    try {
      const url = `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(
        input
      )}&api_key=${apiKey}`;
      const response = await fetch(url, {
        headers: {
          "X-Request-Id": "XXX", // Adjust or generate a unique ID if needed
        },
      });
      const data = await response.json();
      // Assuming suggestions are in data.results
      setResults(data.predictions || []);
      //console.log(data);
    } catch (error) {
      console.error("Error fetching autocomplete suggestions:", error);
    }
  };

  // Debounce the API call to avoid too many requests
  const debouncedFetch = useMemo(() => debounce(fetchAutocomplete, 500), []);

  const handleTextChange = (text) => {
    setQuery(text);
    debouncedFetch(text);
  };

  // Handler for when a suggestion is tapped
  const handleOptionPress = (item) => {
    console.log("Selected item:", item);
    // Optionally update the query with the selected item (if it has a description or name)
    setQuery(item.description || item.name || "");
    setSendCoords(item.geometry.location);
    // console.log(item.geometry.location);
    getallnearestmasjids(
      item.geometry.location.lat,
      item.geometry.location.lng
    );
    // Optionally clear the suggestion list
    setResults([]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search location..."
        value={query}
        onChangeText={handleTextChange}
      />
      
      <FlatList
        style={[styles.list, results.length === 0 && { borderWidth: 0 }]} // Hide border when no suggestions
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleOptionPress(item)}>
            <Text style={styles.itemText}>{item.description || item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {},
  input: {
    backgroundColor: "#E2F1E7",
    color: "#387478",
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#387478",
    fontSize: 20,
    paddingLeft: 10,
    marginTop: 5,
    marginBottom: 5,
    justifyContent: "center",
    paddingTop: 0,
    paddingBottom: 0,
  },
  itemText: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  list: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#387478",
    padding: 10,
  },
});
