import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// IMPORTANT: change this to match your setup (see GUIDE.md "Connecting the app to the backend"):
// - Android Emulator talking to a backend on your own machine -> "http://10.0.2.2:5000/api"
// - Physical device on the same Wi-Fi -> "http://<your-computer-LAN-IP>:5000/api"
// - Deployed backend -> your real URL, e.g. "https://your-api.onrender.com/api"
export const BASE_URL = "http://10.0.2.2:5000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach the JWT (if we have one) to every outgoing request automatically
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Auth ----
export const registerRequest = (email: string, password: string) =>
  api.post("/auth/register", { email, password });

export const loginRequest = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

// ---- Tasks ----
export const getTasksRequest = () => api.get("/tasks");

export const createTaskRequest = (task: {
  title: string;
  description?: string;
  dateTime: string;
  deadline: string;
  priority: string;
}) => api.post("/tasks", task);

export const updateTaskRequest = (id: string, updates: object) =>
  api.patch(`/tasks/${id}`, updates);

export const deleteTaskRequest = (id: string) => api.delete(`/tasks/${id}`);
