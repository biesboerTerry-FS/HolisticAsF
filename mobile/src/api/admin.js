const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://holisticasf-server.vercel.app";

export async function fetchAdminList(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { Accept: "application/json" },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  // Endpoints return either an object with a list field or a bare array.
  if (Array.isArray(data)) return data;
  const listKey = ["products", "orders", "employees", "messages", "data"].find(
    (key) => Array.isArray(data[key]),
  );
  return listKey ? data[listKey] : [];
}
