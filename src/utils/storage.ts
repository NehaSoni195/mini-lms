
import * as SecureStore from "expo-secure-store";

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

// ---------------- ACCESS TOKEN ----------------

export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync(ACCESS_KEY, token);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync(ACCESS_KEY);
};

export const removeToken = async () => {
  await SecureStore.deleteItemAsync(ACCESS_KEY);
};

// ---------------- REFRESH TOKEN ----------------

export const saveRefreshToken = async (
  token: string
) => {
  await SecureStore.setItemAsync(
    REFRESH_KEY,
    token
  );
};

export const getRefreshToken = async () => {
  return await SecureStore.getItemAsync(
    REFRESH_KEY
  );
};

export const removeRefreshToken = async () => {
  await SecureStore.deleteItemAsync(
    REFRESH_KEY
  );
};

