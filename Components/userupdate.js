// api.js
export async function updateUserDetails(userId, updates) {
    const apiUrl = "https://helloworld-ftfo4ql2pa-el.a.run.app/updateUser"; 
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, updates }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Update Response:", data);
      return data;
    } catch (error) {
      console.error("Error updating user details:", error);
    }
}
  