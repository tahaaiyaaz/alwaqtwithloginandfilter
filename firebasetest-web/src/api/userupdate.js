export async function updateUserDetails(userId, updates) {
  const response = await fetch(
    "/api/updateUser",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...updates }),
    }
  );
  return response.json();
}
