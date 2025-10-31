'use client';

import { LoginTest } from '@/components/auth/LoginTest';
import { NavbarTest } from '@/components/auth/NavbarTest';
import { DatabaseTest } from '@/components/auth/DatabaseTest';
import { LogoutTest } from '@/components/auth/LogoutTest';
import { ApiTest } from '@/components/auth/ApiTest';

export default function TestAuthPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">Authentication Test</h1>
        
        <div className="space-y-8">
          {/* Database Test */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Database & Auth Test</h2>
            <DatabaseTest />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Login Test */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Login Test</h2>
              <LoginTest />
            </div>
            
            {/* Navbar Test */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Navbar Test</h2>
              <NavbarTest />
            </div>
          </div>

          {/* API Test */}
          <div>
            <h2 className="text-xl font-semibold mb-4">API Routes Test</h2>
            <ApiTest />
          </div>

          {/* Logout Test */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Logout Methods Test</h2>
            <LogoutTest />
          </div>
        </div>
      </div>
    </div>
  );
}