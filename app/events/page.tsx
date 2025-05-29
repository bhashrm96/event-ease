'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import EventCard from '@/components/EventCard';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import type { Event } from '@/types';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const hasShownToast = useRef(false);
  const { data: session } = useSession();
  const userRole = session?.user?.role ?? null;

  const fetchEvents = async () => {
    const res = await fetch('/api/events');
    const data = await res.json();
    setEvents(data.events || []);
    setLoading(false);
  };


  useEffect(() => {
    if (hasShownToast.current) return;

    const message = localStorage.getItem('successMessage');
    if (message) {
      toast.success(message);
      localStorage.removeItem('successMessage');
      hasShownToast.current = true;
    }
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this event?');
    if (!confirmDelete) return;

    const res = await fetch(`/api/events/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setEvents((prev) => prev.filter((e: Event) => e.id !== id));
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to delete event');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Check if user is logged in and not staff
  const canCreateEvent = session && userRole !== 'STAFF';

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
  <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
    <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-6">
      {session ? "Manage Events" : "Events"}
    </h1>

    {canCreateEvent && (
      <div className="mb-6 text-right">
        <button
          onClick={() => router.push("/events/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
        >
          Create New Event
        </button>
      </div>
    )}

    {events.length === 0 ? (
      <p className="text-center text-gray-600 dark:text-gray-300">{loading ? "Loading..." : "No events found."}</p>
    ) : (
      <ul className="space-y-4">
        {events.map((event: Event) => (
          <EventCard
            key={event.id}
            event={event}
            onDelete={handleDelete}
            userRole={userRole}
          />
        ))}
      </ul>
    )}
  </div>
</div>

  );
}
