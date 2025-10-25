'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

interface Session {
  id: string;
  deviceInfo: string;
  ipAddress: string;
  createdAt: string;
  expiresAt: string;
  isCurrentSession: boolean;
}

interface SessionsResponse {
  success: boolean;
  data?: {
    totalSessions: number;
    sessions: Session[];
  };
  error?: {
    code: string;
    message: string;
  };
}

export default function SessionManager() {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get current session info for comparison
  const getCurrentSessionInfo = () => {
    if (typeof window !== 'undefined') {
      return {
        userAgent: navigator.userAgent,
        // We can't get exact IP on client side, so we'll mark based on user agent
      };
    }
    return null;
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/sessions');
      const data: SessionsResponse = await response.json();

      if (data.success && data.data) {
        // Mark current session
        const currentInfo = getCurrentSessionInfo();
        const sessionsWithCurrent = data.data.sessions.map(session => ({
          ...session,
          isCurrentSession: currentInfo ? 
            session.deviceInfo.includes(currentInfo.userAgent.split(' ')[0]) : false
        }));

        setSessions(sessionsWithCurrent);
      } else {
        setError(data.error?.message || 'Failed to fetch sessions');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Fetch sessions error:', err);
    } finally {
      setLoading(false);
    }
  };

  const revokeSession = async (sessionId: string) => {
    try {
      setActionLoading(sessionId);
      setError(null);

      const response = await fetch(`/api/auth/sessions?sessionId=${sessionId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // Refresh sessions list
        await fetchSessions();
      } else {
        setError(data.error?.message || 'Failed to revoke session');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Revoke session error:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const logoutAllDevices = async () => {
    try {
      setActionLoading('logout-all');
      setError(null);

      const response = await fetch('/api/auth/logout-all', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        // Sign out from current session
        await signOut({ callbackUrl: '/login?message=logged_out_all' });
      } else {
        setError(data.error?.message || 'Failed to logout from all devices');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Logout all error:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getDeviceIcon = (deviceInfo: string) => {
    const info = deviceInfo.toLowerCase();
    if (info.includes('mobile') || info.includes('android') || info.includes('iphone')) {
      return '📱';
    } else if (info.includes('tablet') || info.includes('ipad')) {
      return '📱';
    } else {
      return '💻';
    }
  };

  useEffect(() => {
    if (session) {
      fetchSessions();
    }
  }, [session]);

  if (!session) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Active Sessions</h3>
        <button
          onClick={() => fetchSessions()}
          disabled={loading}
          className="text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading sessions...</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {sessions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No active sessions found</p>
            ) : (
              sessions.map((sessionItem) => (
                <div
                  key={sessionItem.id}
                  className={`border rounded-lg p-4 ${
                    sessionItem.isCurrentSession 
                      ? 'border-blue-200 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">
                          {getDeviceIcon(sessionItem.deviceInfo)}
                        </span>
                        <span className="font-medium text-gray-900">
                          {sessionItem.deviceInfo}
                        </span>
                        {sessionItem.isCurrentSession && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Current Session
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>IP Address: {sessionItem.ipAddress}</p>
                        <p>Created: {formatDate(sessionItem.createdAt)}</p>
                        <p>Expires: {formatDate(sessionItem.expiresAt)}</p>
                      </div>
                    </div>

                    {!sessionItem.isCurrentSession && (
                      <button
                        onClick={() => revokeSession(sessionItem.id)}
                        disabled={actionLoading === sessionItem.id}
                        className="ml-4 text-sm text-red-600 hover:text-red-500 disabled:opacity-50"
                      >
                        {actionLoading === sessionItem.id ? 'Revoking...' : 'Revoke'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {sessions.length > 1 && (
            <div className="border-t pt-4">
              <button
                onClick={logoutAllDevices}
                disabled={actionLoading === 'logout-all'}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
              >
                {actionLoading === 'logout-all' 
                  ? 'Logging out from all devices...' 
                  : 'Logout from All Devices'
                }
              </button>
              <p className="mt-2 text-xs text-gray-500 text-center">
                This will log you out from all devices including this one
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}