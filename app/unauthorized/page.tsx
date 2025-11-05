'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function UnauthorizedPage() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  
  const requiredRole = searchParams.get('required') || 'unknown';
  const currentRole = searchParams.get('current') || (session?.user as any)?.role || 'guest';

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'manager': return 'Manager';
      case 'user': return 'User';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          
          <p className="mt-2 text-sm text-gray-600">
            You don't have permission to access this resource
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Your Role:</span>
              <span className="text-sm text-gray-900 bg-gray-100 px-2 py-1 rounded">
                {getRoleDisplayName(currentRole)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Required Role:</span>
              <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                {getRoleDisplayName(requiredRole)}
              </span>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500 mb-4">
              If you believe this is an error, please contact your administrator or try logging in with a different account.
            </p>
            
            <div className="flex space-x-3">
              <Link
                href="/"
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium transition-colors"
              >
                Go Home
              </Link>
              
              <Link
                href="/login"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-400">
            Need help? Contact support at{' '}
            <Link href="mailto:support@tamazight-siwa.com" className="text-blue-600 hover:text-blue-500">
              support@tamazight-siwa.com
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}