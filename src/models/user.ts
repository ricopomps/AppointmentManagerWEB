import { User } from "@clerk/nextjs/server";

export interface PaginatedUsers {
  users: User[];
  totalUsers: number;
}
