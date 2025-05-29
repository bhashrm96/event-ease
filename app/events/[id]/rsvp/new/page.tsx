'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RsvpForm() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError(null);

    const newErrors: typeof errors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const res = await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        eventId: id,
      }),
    });

    setLoading(false);

    if (res.ok) {
      localStorage.setItem('successMessage', 'RSVP submitted successfully!');
      router.push(`/events`);
    } else {
      const data = await res.json();
      setSubmitError(data.error || 'Failed to submit RSVP');
    }
  };

  return (
    <div className="flex justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">
      <div className="bg-white w-full max-w-md rounded-xl shadow-md p-6 border border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-6">RSVP to This Event</h1>
        {submitError && (
          <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">
            {submitError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block font-semibold text-lg mb-1">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block font-semibold text-lg mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit RSVP'}
          </button>
        </form>
      </div>
    </div>
  );
}
