'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import UserForm from '@/components/UserForm';
import type { User } from '@/types';  // Import the shared User type here

export default function EditUserPage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return; // handle if id is undefined

    async function fetchUser() {
      try {
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setUser(data.user);
      } catch (e: any) {
        setError(e.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id]);

  if (!id) return <p>Invalid user ID.</p>;
  if (loading) return <p>Loading user data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>User not found.</p>;

  return <UserForm user={user} />;
}
