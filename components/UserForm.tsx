'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type User = {
  id: string;
  name: string | null;
  email: string;
  role: 'EVENT_OWNER' | 'STAFF';
};

export default function UserForm({ user }: { user?: User }) {
  const router = useRouter();

  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState<'EVENT_OWNER' | 'STAFF'>(user?.role || 'EVENT_OWNER');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [apiError, setApiError] = useState('');

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validate = () => {
    let isValid = true;

    if (!email) {
      setEmailError('Email is required.');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!role) {
      setRoleError('Role is required.');
      isValid = false;
    } else {
      setRoleError('');
    }

    if (!user) {
      if (!password) {
        setPasswordError('Password is required.');
        isValid = false;
      } else if (password.length < 6) {
        setPasswordError('Password must be at least 6 characters.');
        isValid = false;
      } else {
        setPasswordError('');
      }
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSaving(true);
    setApiError('');

    try {
      const payload: Record<string, any> = { email, role };
      if (!user) {
        payload.password = password;
      }

      const res = await fetch(user ? `/api/users/${user.id}` : '/api/users', {
        method: user ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save user');
      }
      localStorage.setItem('successMessage', `User ${user ? "edited" : "created"} successfully!`);
      router.push('/users');
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">
  <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 space-y-5">
    <h2 className="text-2xl font-bold text-center">{user ? 'Edit User' : 'Create User'}</h2>

    {apiError && (
      <p className="text-red-600 bg-red-100 dark:bg-red-300 text-center p-2 rounded font-medium">{apiError}</p>
    )}

    <label className="block">
      <span className="block font-medium mb-1">Email</span>
      <input
        type="text"
        placeholder="user@example.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (emailError) setEmailError('');
        }}
        className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          emailError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        }`}
      />
      {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
    </label>

    {!user && (
      <label className="block">
        <span className="block font-medium mb-1">Password</span>
        <input
          type="password"
          placeholder="User password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError('');
          }}
          className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            passwordError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}
      </label>
    )}

    <label className="block">
      <span className="block font-medium mb-1">Role</span>
      <select
        value={role}
        onChange={(e) => {
          setRole(e.target.value as 'EVENT_OWNER' | 'STAFF');
          if (roleError) setRoleError('');
        }}
        className={`w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          roleError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        }`}
      >
        <option className="text-black dark:text-white" value="">Select role</option>
        <option className="text-black dark:text-white" value="EVENT_OWNER">Event Owner</option>
        <option className="text-black dark:text-white" value="STAFF">Staff</option>
      </select>
      {roleError && <p className="text-red-600 text-sm mt-1">{roleError}</p>}
    </label>

    <button
      onClick={handleSubmit}
      disabled={saving}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50"
    >
      {saving ? (user ? 'Updating...' : 'Creating...') : user ? 'Update User' : 'Create User'}
    </button>
  </div>
</div>

  );
}
