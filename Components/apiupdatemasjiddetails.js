export async function updateMasjidDetails(masjidId, updates) {
  try {
    // apiUrl = "http://127.0.0.1:5001/functionsinjs/asia-south1/helloWorld"
    let apiUrl = "https://helloworld-ftfo4ql2pa-el.a.run.app";

    masjidId = masjidId;
    console.log(masjidId, updates);
    // Construct the request body
    const requestBody = {
      masjidId: masjidId,
      updates: updates,
    };

    // Make the fetch request
    const response = await fetch(`${apiUrl}/updateMasjid`, {
      method: "PUT", // HTTP method
      headers: {
        "Content-Type": "application/json", // Specify JSON content type
      },
      body: JSON.stringify(requestBody), // Convert the body to JSON string
    });

    // Parse the response
    const data = await response.json();

    if (response.ok) {
      console.log("Masjid updated successfully:", data);
    } else {
      console.error("Error updating masjid:", data.message);
    }
  } catch (error) {
    console.error("Error during fetch:", error);
  }
}

// let details = {
//
//                 timings : {
//                     asar:"05:30pm",
//                     dhuhr:"12:00 PM",
//                     fajr:"4:30 AM",
//                     isha:"09:00 PM",
//                     juma:"01:30pm",
//                     maghrib:"07:30 PM",
//                 }

//         }
