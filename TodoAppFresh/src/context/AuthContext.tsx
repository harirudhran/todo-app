import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginRequest, registerRequest } from "../api/api";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Wrap the whole app with this provider (see App.tsx) so any screen
// can read the logged-in user or call login/register/logout.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // true while we check for a saved session

  // On app start, check if we already have a saved user/token
  useEffect(() => {
    const loadStoredUser = async () => {
      const stored = await AsyncStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
      setLoading(false);
    };
    loadStoredUser();
  }, []);

  const persistUser = async (data: User) => {
    await AsyncStorage.setItem("user", JSON.stringify(data));
    await AsyncStorage.setItem("token", data.token);
    setUser(data);
  };

  const login = async (email: string, password: string) => {
    const { data } = await loginRequest(email, password);
    await persistUser(data);
  };

  const register = async (email: string, password: string) => {
    const { data } = await registerRequest(email, password);
    await persistUser(data);
  };

  const logout = async () => {
    // Using two separate removeItem calls instead of multiRemove — some
    // AsyncStorage/React Native version combinations don't reliably expose
    // multiRemove, while single-item methods (getItem/setItem/removeItem)
    // work consistently.
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — use this in screens instead of useContext(AuthContext) directly
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};