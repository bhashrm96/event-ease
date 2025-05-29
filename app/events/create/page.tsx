'use client';

import EventForm from '@/components/EventForm';

export default function CreateEventPage() {
  return (
    <div className=" mx-auto pt-6 dark:bg-gray-900 rounded-md">
      {/* <h1 className="text-2xl font-bold mb-6 text-center">Create New Event Page</h1> */}
      <EventForm />
    </div>
  );
}
