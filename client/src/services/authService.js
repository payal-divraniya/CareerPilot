const API_URL = `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "")}`;

async function request(endpoint, payload) {
  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Cannot connect to CareerPilot server. Check that the backend is running.");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed. Please try again.");
  return data;
}
export const registerUser = (userData) => request("/auth/register", userData);
export const loginUser = (loginData) => request("/auth/login", loginData);
