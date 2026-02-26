export async function addMasjid(data) {
  const response = await fetch(
    "/api/addMasjid",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  return response.json();
}
