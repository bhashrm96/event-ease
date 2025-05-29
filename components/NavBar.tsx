'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  // Mark as mounted only on client to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold">EventEase</div>
      <ul className="flex gap-6 items-center">
        <li>
          <Link href="/events" className="hover:underline">
            Events
          </Link>
        </li>
{session && session.user?.role !== 'STAFF' && (
  <li>
    <Link href="/my-events" className="hover:underline">
      My Events
    </Link>
  </li>
)}
        {/* Render loading state or session UI only after mounted */}
        {!isMounted ? (
          <li>Loading...</li>
        ) : status === 'loading' ? (
          <li>Loading...</li>
        ) : session ? (
          <>
            {/* Show Users link only for ADMIN */}
            {session.user?.role === 'ADMIN' && (
              <li>
                <Link href="/users" className="hover:underline">
                  Users
                </Link>
              </li>
            )}

            <li>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="hover:underline"
              >
                Log Out
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link href="/sign-in" className="hover:underline">
              Sign In
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
