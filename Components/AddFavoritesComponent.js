
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const AddFavoritesComponent = ({ userId, masjidId }) => {
  const [updateResponse, setUpdateResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const addFavorite = async (userId, masjidId) => {
    const apiUrl = 'https://helloworld-ftfo4ql2pa-el.a.run.app/updateUser';
    try {
      setLoading(true);
      // Send a PUT request with updates containing the favorites array with the new masjidId.
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          updates: { favorites: [masjidId] } // Adjust as needed if you want to append rather than overwrite.
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Add Favorite Response:", data);
      setUpdateResponse(JSON.stringify(data));
    } catch (error) {
      console.error("Error updating user details:", error);
      setUpdateResponse("Error updating user details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Favorite Masjid</Text>
      <Button
        title={loading ? "Adding..." : "Add Favorite"}
        onPress={() => addFavorite(userId, masjidId)}
        disabled={loading}
      />
      {updateResponse && <Text style={styles.response}>{updateResponse}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  response: { marginTop: 10 },
});

export default AddFavoritesComponent;
