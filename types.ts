// src/types.ts

export type UserRole = "EVENT_OWNER" | "STAFF";

export type User = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
};


export interface Event {
  id: string;
  title: string;
  description?: string | null;
  location: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  publicSlug: string;
  additionalFields?: any;
}

export interface UserData {
  id: string;
  email: string;
  role: 'EVENT_OWNER' | 'STAFF';
  password?: string;
}

export interface UpdateUserData {
  email: string;
  role: 'EVENT_OWNER' | 'STAFF';
  password?: string;
}