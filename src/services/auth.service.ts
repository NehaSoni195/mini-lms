import api from "./api";

export const loginUser = (email: string, password: string) => {
  return api.post("/users/login", { email, password });
};

export const registerUser = (
  username: string,
  email: string,
  password: string
) => {
  return api.post("/users/register", {
    username: username.toLowerCase(),
    email,
    password,
  });
};

export const getCurrentUser = () => {
  return api.get("/users/current-user");
};


export const refreshTokenApi = (refreshToken: string) => {
  return api.post("/users/refresh-token", {
    refreshToken,
  });
};