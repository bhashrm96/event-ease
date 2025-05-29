'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import type { UserData } from '@/types';

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
      const hasShownToast = useRef(false);

    useEffect(() => {
    if (hasShownToast.current) return;

    const message = localStorage.getItem('successMessage');
    if (message) {
      toast.success(message);
      localStorage.removeItem('successMessage');
      hasShownToast.current = true;
    }
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.users);
    } catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError('An unexpected error occurred');
  }
} finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      setDeletingUserId(id);
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to delete user');
        return;
      }
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      alert('Failed to delete user');
      console.error("Error: ", error)
    } finally {
      setDeletingUserId(null);
    }
  }

  return (
  <div className="flex justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">
  <div className="w-full max-w-4xl bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Users</h1>
      <Link href="/users/create">
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition">
          Create New User
        </button>
      </Link>
    </div>

    {loading ? (
      <p className="text-gray-700 dark:text-gray-200">Loading users...</p>
    ) : error ? (
      <p className="text-red-600 bg-red-100 dark:bg-red-300 p-2 rounded text-center">{error}</p>
    ) : users.length === 0 ? (
      <p className="text-gray-600 text-center">No users found</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <tr>
              <th className="px-4 py-2 border-b border-gray-300 dark:border-gray-600">Email</th>
              <th className="px-4 py-2 border-b border-gray-300 dark:border-gray-600">Role</th>
              <th className="px-4 py-2 border-b border-gray-300 dark:border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">{user.email}</td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">{user.role}</td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <Link href={`/users/${user.id}/edit`}>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md font-medium transition">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={deletingUserId === user.id}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md font-medium transition disabled:opacity-50"
                    >
                      {deletingUserId === user.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</div>

  );
}
