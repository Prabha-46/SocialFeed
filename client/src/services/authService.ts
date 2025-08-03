import api from "./api";

export const authAPI = {
  signup: async (userData: {
    username: string;
    password: string;
    gender: string;
    age: string;
  }) => {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  },
  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
};

export default authAPI;
