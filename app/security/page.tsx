'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function SecurityPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading...</div>
    );
  }

  if (status !== 'authenticated' || !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-700">You need to sign in to view this page.</p>
          <Link href="/login" className="text-primary underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  const user = session.user as any;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Security</h1>
          <p className="mt-2 text-gray-600">Basic account session powered by NextAuth.</p>
        </div>

        <div className="rounded-lg border bg-white p-6 space-y-2">
          <div><span className="font-semibold">Name:</span> {user.fullName || user.name || '—'}</div>
          <div><span className="font-semibold">Email:</span> {user.email || '—'}</div>
          <div><span className="font-semibold">Role:</span> {user.role || 'user'}</div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}