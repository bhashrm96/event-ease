'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import EventForm from '@/components/EventForm';

export default function EditEventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then(res => res.json())
      .then(data => setEvent(data.event));
  }, [id]);

  return (
    <div>
      {/* <h1 className="text-2xl font-bold mb-4">Edit Event</h1> */}
      {event ? <EventForm event={event} /> : <p>Loading...</p>}
    </div>
  );
}