'use client';

import { useRouter } from 'next/navigation';
import type { Event } from '@/types';

interface EventCardProps {
  event: Event;
  onDelete: (id: string) => void;
  userRole: string | null;
}

export default function EventCard({ event, onDelete, userRole }: EventCardProps) {
  const router = useRouter();

  const handleCopyLink = () => {
    const url = `${window.location.origin}/events/${event.id}`;
    navigator.clipboard.writeText(url)
      .then(() => alert('Event link copied to clipboard!'))
      .catch(() => alert('Failed to copy link'));
  };

  const isGuest = !userRole;
  const isStaff = userRole === 'STAFF';

  return (
   <li className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition hover:shadow-xl">
  <div className="mb-5">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{event.title}</h2>
    {event.description && (
      <p className="text-gray-600 dark:text-gray-300 mt-2">{event.description}</p>
    )}
  </div>

  <div className="flex flex-wrap gap-3">
    <button
      onClick={() => router.push(`/events/${event.id}`)}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
    >
      View Event
    </button>

    {isGuest && (
      <button
        onClick={() => router.push(`/events/${event.id}/rsvp/new`)}
        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
      >
        RSVP
      </button>
    )}

    <button
      onClick={handleCopyLink}
      className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition"
    >
      Copy Share Link
    </button>

    {!isGuest && (
      <>
        <button
          onClick={() => router.push(`/events/${event.id}/rsvp`)}
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition"
        >
          View RSVPs
        </button>

        {!isStaff && (
          <button
            onClick={() => router.push(`/events/${event.id}/edit`)}
            className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition"
          >
            Edit
          </button>
        )}

        <button
          onClick={() => onDelete(event.id)}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
        >
          Delete
        </button>
      </>
    )}
  </div>
</li>

  );
}
