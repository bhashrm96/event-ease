'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) throw new Error('Failed to fetch event');
        const data = await res.json();
        setEvent(data.event);
      } catch (error) {
        alert('Could not load event');
        router.push('/events');
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id, router]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (!event) return <p className="text-center mt-10 text-red-600">Event not found.</p>;

  return (
   <div className="bg-gray-50 dark:bg-gray-900 flex justify-center px-4 py-10">
  <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 border border-gray-200 dark:border-gray-700 max-w-xl w-full transition hover:shadow-xl">
    <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-6">
      Event Details
    </h1>

    <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
      {event.title}
    </h2>

    <div className="space-y-6 text-gray-800 dark:text-gray-300 text-base">
      <div>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">Description:</p>
        <p>{event.description || 'N/A'}</p>
      </div>

      <div>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">Location:</p>
        <p>{event.location || 'N/A'}</p>
      </div>

      <div>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">Date & Time:</p>
        <p>{new Date(event.date).toLocaleString()}</p>
      </div>

      {Array.isArray(event.additionalFields) && event.additionalFields.length > 0 && (
        <div>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Additional Details:</p>
          <div className="space-y-2">
            {event.additionalFields.map((field: any, i: number) => (
              <p key={i}>
                <span className="font-semibold">{field.label}:</span> {field.value}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
</div>


  );
}
