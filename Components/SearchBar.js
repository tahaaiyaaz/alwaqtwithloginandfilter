import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import debounce from "lodash.debounce";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES, SHADOWS } from "./Theme";

const SearchBar = ({ setSendCoords, getallnearestmasjids }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [focused, setFocused] = useState(false);

  // Consider externalizing this key securely
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
          "X-Request-Id": "XXX",
        },
      });
      const data = await response.json();
      setResults(data.predictions || []);
    } catch (error) {
      console.error("Error fetching autocomplete suggestions:", error);
    }
  };

  const debouncedFetch = useMemo(() => debounce(fetchAutocomplete, 500), []);

  const handleTextChange = (text) => {
    setQuery(text);
    debouncedFetch(text);
  };

  const handleOptionPress = (item) => {
    setQuery(item.description || item.name || "");
    setSendCoords(item.geometry.location);
    if (getallnearestmasjids) {
      getallnearestmasjids(
        item.geometry.location.lat,
        item.geometry.location.lng
      );
    }
    setResults([]);
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.inputContainer, 
        focused && styles.inputFocused
      ]}>
        <Ionicons name="search" size={20} color={COLORS.textSecondary} style={{ marginRight: 10 }} />
        <TextInput
          style={styles.input}
          placeholder="Search location..."
          value={query}
          onChangeText={handleTextChange}
          placeholderTextColor={COLORS.textLight}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(""); setResults([]); }}>
             <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {results.length > 0 && (
        <View style={styles.listContainer}>
          {results.slice(0, 5).map((item, index) => (
            <TouchableOpacity 
              key={index.toString()} 
              onPress={() => handleOptionPress(item)} 
              style={styles.item}
            >
              <Ionicons name="location-sharp" size={16} color={COLORS.primary} style={{ marginTop: 2, marginRight: 8 }} />
              <Text style={styles.itemText} numberOfLines={2}>{item.description || item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    width: '100%', // Changed to flex width for better layout
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background, // Slightly different context in white header
    height: 45,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 15,
    marginVertical: 5,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface, // Pop out when focused
    ...SHADOWS.medium,
  },
  input: {
    flex: 1,
    ...FONTS.body3,
    color: COLORS.textPrimary,
  },
  listContainer: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    ...SHADOWS.dark,
    maxHeight: 250,
    zIndex: 999, // High z-index
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  item: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemText: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
    flex: 1,
  },
});
