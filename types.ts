// src/types.ts

export type UserRole = "EVENT_OWNER" | "STAFF";

export type User = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
};
