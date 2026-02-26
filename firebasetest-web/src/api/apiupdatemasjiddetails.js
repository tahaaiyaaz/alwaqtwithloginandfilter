export async function updateMasjidDetails(masjidId, updates) {
  try {
    const requestBody = {
      masjidId: masjidId,
      updates: updates,
    };

    const response = await fetch('/api/updateMasjid', {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Masjid updated successfully:", data);
      return data;
    } else {
      console.error("Error updating masjid:", data.message);
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Error during fetch:", error);
    throw error;
  }
}
