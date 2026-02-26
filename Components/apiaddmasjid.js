export async function addMasjid(masjidData) {
  console.log(masjidData);
  const url = "https://helloworld-ftfo4ql2pa-el.a.run.app/addmasjid";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any additional headers if needed
      },
      body: JSON.stringify({
        latitude: masjidData.latitude,
        longitude: masjidData.longitude,
        countryName: "India",
        cityName: "Mahabubnagar",
        stateName: "telangana",
        details: masjidData.details,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Masjid added successfully:", result);
    return result;
  } catch (error) {
    console.error("Error adding masjid:", error);
    throw error;
  }
}
