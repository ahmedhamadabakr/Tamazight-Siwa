'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function TestSessionPage() {
  const { data: session, status } = useSession();
  const [serverSession, setServerSession] = useState(null);

  useEffect(() => {
    // Test server-side session
    fetch('/api/test-auth')
      .then(res => res.json())
      .then(data => setServerSession(data))
      .catch(err => console.error('Server session test failed:', err));
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Session Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Session */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Client Session</h2>
            <div className="space-y-2">
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Authenticated:</strong> {session ? 'Yes' : 'No'}</p>
              {session && (
                <div className="mt-4">
                  <h3 className="font-medium">User Data:</h3>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                    {JSON.stringify(session.user, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Server Session */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Server Session</h2>
            <div className="space-y-2">
              {serverSession ? (
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(serverSession, null, 2)}
                </pre>
              ) : (
                <p>Loading server session...</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 space-x-4">
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
}