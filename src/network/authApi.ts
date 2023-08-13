import { User } from "../models/user";
import { getApi } from "./api";
import { LoginCredentials } from "./usersApi";
export async function login(credentials: LoginCredentials): Promise<User> {
  const {
    data: { user, accessToken },
  } = await getApi().post("/api/auth", credentials);
  console.log(accessToken);
  sessionStorage.removeItem("token");
  sessionStorage.setItem("token", accessToken);
  return user;
}

export async function logout() {
  await getApi().post("/api/auth/logout");
  sessionStorage.removeItem("token");
}
