'use client';

import { AuthNavbar } from './AuthNavbar';
import { useSession } from 'next-auth/react';

export function NavbarTest() {
  const { data: session, status } = useSession();

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Navbar Test</h3>
      
      {/* Debug Info */}
      <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
        <p><strong>Status:</strong> {status}</p>
        <p><strong>User ID:</strong> {(session?.user as any)?.id || 'None'}</p>
        <p><strong>User Name:</strong> {session?.user?.name || 'None'}</p>
        <p><strong>User Role:</strong> {(session?.user as any)?.role || 'None'}</p>
      </div>

      {/* Navbar Component */}
      <div className="border p-2 rounded">
        <AuthNavbar />
      </div>
    </div>
  );
}