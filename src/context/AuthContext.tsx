import React, { createContext, useEffect, useState } from "react";
import {
  loginUser,
  registerUser,
  getCurrentUser,
} from "../services/auth.service";

import {
  saveToken,
  getToken,
  removeToken,
  saveRefreshToken,
} from "../utils/storage";
import { useRouter } from "expo-router";
import { Alert, Platform, ToastAndroid } from "react-native";

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const bootstrap = async () => {
    try {
      const token = await getToken();

      if (!token) {
        setUser(null);
        return;
      }

      const profile = await getCurrentUser();
      setUser(profile.data.data);
    } catch (err) {
      await removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bootstrap();
  }, []);

  // LOGIN

  const login = async (email: string, password: string) => {
    const res = await loginUser(email, password);

    const accessToken = res.data.data.accessToken;
    const refreshToken = res.data.data.refreshToken;

    await saveToken(accessToken);
    if (refreshToken) await saveRefreshToken(refreshToken);

    const profile = await getCurrentUser();

    setUser(profile.data.data);
  };

  // REGISTER

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    await registerUser(username, email, password);
    await login(email, password);
  };

  // LOGOUT

  const showMessage = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  };

  const logout = async () => {
    try {
      await removeToken();

      setUser(null);

      showMessage("Logged out successfully");

      router.replace("/(auth)/login");
    } catch (error) {
      console.log("Logout error:", error);

      showMessage("Logout failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
