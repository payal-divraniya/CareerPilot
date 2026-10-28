const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

const applicationRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("careerpilot_token");
  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
    });
  } catch {
    throw new Error("Cannot connect to CareerPilot server. Check your connection and try again.");
  }
  const data = await response.json().catch(() => ({}));
  if (response.status === 401 && typeof window !== "undefined") {
    window.dispatchEvent(new Event("careerpilot:unauthorized"));
  }
  if (!response.ok) throw new Error(data.message || "Request failed.");
  return data;
};
export const getApplications = () => applicationRequest("/applications");
export const createApplication = (data) => applicationRequest("/applications", { method: "POST", body: JSON.stringify(data) });
export const updateApplication = (id, data) => applicationRequest(`/applications/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteApplication = (id) => applicationRequest(`/applications/${id}`, { method: "DELETE" });
