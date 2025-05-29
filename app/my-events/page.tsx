'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import EventCard from '@/components/EventCart';
import { toast } from 'sonner';

export default function MyEventsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userRole = session?.user?.role ?? null;
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

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      return;
    }

    const fetchEvents = async () => {
      try {
        const res = await fetch(`/api/events?ownerId=${session.user.id}`);
        const data = await res.json();
        setEvents(data.events || []);
      } catch (error) {
        alert('Failed to fetch your events.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [session, status, router]);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this event?');
    if (!confirmDelete) return;

    const res = await fetch(`/api/events/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to delete event');
    }
  };

  const handleCopyLink = (event: any) => {
    const url = `${window.location.origin}/events/${event.id}`;
    navigator.clipboard.writeText(url)
      .then(() => alert('Event link copied to clipboard!'))
      .catch(() => alert('Failed to copy link'));
  };

  if (loading) return <p>Loading your events...</p>;

  return (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
  <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
    <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-6">
      My Events
    </h1>

    <div className="mb-6 text-right">
      <button
        onClick={() => router.push("/events/create")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
      >
        Create New Event
      </button>
    </div>

    {events.length === 0 ? (
      <p className="text-center text-gray-600 dark:text-gray-300">
        No events found for you.
      </p>
    ) : (
      <ul className="space-y-4">
        {events.map((event) => (
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
