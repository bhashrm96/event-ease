'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Papa from 'papaparse';

type RSVP = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export default function RSVPListPage() {
  const rawParams = useParams();
  const router = useRouter();
  const id =
    typeof rawParams.id === 'string'
      ? rawParams.id
      : Array.isArray(rawParams.id)
      ? rawParams.id[0]
      : undefined;

  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const fetchRsvps = async () => {
      try {
        const res = await fetch(`/api/rsvp?id=${id}`);
        if (!res.ok) throw new Error('Failed to fetch RSVPs');
        const data = await res.json();
        if (!cancelled) {
          setRsvps(data.rsvps);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Error loading RSVPs');
          console.error(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRsvps();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (rsvpId: string) => {
    const confirmed = confirm('Are you sure you want to delete this RSVP?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/rsvp?id=${rsvpId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete RSVP');
      setRsvps((prev) => prev.filter((rsvp) => rsvp.id !== rsvpId));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete RSVP.');
    }
  };

  // Export CSV handler
  const handleExportCSV = () => {
    if (rsvps.length === 0) {
      alert('No RSVPs to export!');
      return;
    }
    // Prepare data for CSV export (exclude `id` maybe or keep it, your choice)
    const dataForCSV = rsvps.map(({ id, ...rest }) => rest);

    const csv = Papa.unparse(dataForCSV);

    // Create a blob and trigger download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rsvps_event_${id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!id) return <p className="p-4 text-red-500">Invalid event ID</p>;
  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
   <div className="flex justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">
  <div className="w-full max-w-4xl bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">RSVP List</h1>
      <button
        onClick={handleExportCSV}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
      >
        Export CSV
      </button>
    </div>

    {rsvps.length === 0 ? (
      <p className="text-gray-600 text-center">No RSVPs yet.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <tr>
              <th className="px-4 py-2 border-b border-gray-300 dark:border-gray-600">Name</th>
              <th className="px-4 py-2 border-b border-gray-300 dark:border-gray-600">Email</th>
              <th className="px-4 py-2 border-b border-gray-300 dark:border-gray-600">Date</th>
              <th className="px-4 py-2 border-b border-gray-300 dark:border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rsvps.map((rsvp) => (
              <tr key={rsvp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">
                  {rsvp.name}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">
                  {rsvp.email}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">
                  {new Date(rsvp.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleDelete(rsvp.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md font-medium transition"
                  >
                    Remove
                  </button>
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
