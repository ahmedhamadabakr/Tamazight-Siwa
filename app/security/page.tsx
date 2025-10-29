'use client';

import { ProtectedRoute } from '@/components/auth/RouteGuard';
import { SessionInfo } from '@/components/auth/SessionInfo';
import { SessionManager } from '@/components/auth/SessionManager';
import { SecurityEvents } from '@/components/auth/SecurityEvents';
import { SecurityStats } from '@/components/auth/SecurityStats';

export default function SecurityPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Security Settings</h1>
            <p className="mt-2 text-gray-600">
              Manage your account security, active sessions, and view security events
            </p>
          </div>

          <div className="space-y-8">
            {/* Security Overview */}
            <SecurityStats />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Session Information */}
              <div className="space-y-8">
                <SessionInfo />
                <SessionManager />
              </div>

              {/* Security Events */}
              <div>
                <SecurityEvents />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}