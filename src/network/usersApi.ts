import { API } from "./api";
import { User } from "../models/user";

export async function getLoggedInUser(): Promise<User> {
  const response = await API.get("/api/users");
  return response.data;
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
  const response = await API.post("/api/users/signup", credentials);
  return response.data;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await API.post("/api/users/login", credentials);
  return response.data;
}

export async function logout() {
  await API.post("/api/users/logout");
}

export async function updateUser(userId: string, user: User): Promise<User> {
  const response = await API.patch(`api/users/${userId}`, user);
  return response.data;
}
