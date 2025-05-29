'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type AdditionalField = { label: string; value: string };

export default function EventForm({ event }: { event?: any }) {
  const router = useRouter();

  const [form, setForm] = useState({
    title: event?.title || '',
    description: event?.description || '',
    location: event?.location || '',
    date: event?.date ? new Date(event.date).toISOString().slice(0, 16) : '',
  });

  const [additionalFields, setAdditionalFields] = useState<AdditionalField[]>(
    event?.additionalFields && Array.isArray(event.additionalFields)
      ? event.additionalFields
      : []
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdditionalFieldChange = (
    index: number,
    key: 'label' | 'value',
    value: string
  ) => {
    const updated = [...additionalFields];
    updated[index] = { ...updated[index], [key]: value };
    setAdditionalFields(updated);
  };

  const addAdditionalField = () => {
    setAdditionalFields([...additionalFields, { label: '', value: '' }]);
  };

  const removeAdditionalField = (index: number) => {
    const updated = additionalFields.filter((_, i) => i !== index);
    setAdditionalFields(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError(null);

    const newErrors: typeof errors = {};
    if (!form.title) newErrors.title = 'Title is required';
    if (!form.description) newErrors.description = 'Description is required';
    if (!form.location) newErrors.location = 'Location is required';
    if (!form.date) newErrors.date = 'Date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const payload = {
      ...form,
      additionalFields,
    };

    const method = event ? 'PUT' : 'POST';
    const url = event ? `/api/events/${event.id}` : '/api/events';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (res.ok) {
      localStorage.setItem('successMessage', `Event ${event ? "edited" : "created"} successfully!`);
      router.push('/events');
    } else {
      const data = await res.json();
      setSubmitError(data.error || 'Failed to save event');
    }
  };

  return (
    <div className="flex justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">
      <div className="bg-white w-full max-w-md rounded-xl shadow-md p-6 border border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-6">
          {event ? 'Update Event' : 'Create Event'}
        </h1>

        {submitError && (
          <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="block font-semibold text-lg mb-1">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Event Title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block font-semibold text-lg mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
          </div>

          <div>
            <label htmlFor="location" className="block font-semibold text-lg mb-1">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Event Location"
              value={form.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
            {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
          </div>

          <div>
            <label htmlFor="date" className="block font-semibold text-lg mb-1">Date & Time</label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
            {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Additional Fields</h3>
            {additionalFields.map((field, idx) => (
              <div key={idx} className="flex flex-col gap-1 mb-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Label"
                    value={field.label}
                    onChange={(e) => handleAdditionalFieldChange(idx, 'label', e.target.value)}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={field.value}
                    onChange={(e) => handleAdditionalFieldChange(idx, 'value', e.target.value)}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeAdditionalField(idx)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg"
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addAdditionalField}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              + Add Field
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? (event ? 'Updating...' : 'Creating...') : event ? 'Update Event' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
}
