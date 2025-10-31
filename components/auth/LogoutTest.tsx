'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function LogoutTest() {
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);
  const router = useRouter();
  const { logout } = useAuth();

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Test 1: NextAuth signOut with redirect
  const testNextAuthRedirect = async () => {
    setLoading('nextauth-redirect');
    addResult('Testing NextAuth signOut with redirect...');
    
    try {
      await signOut({ 
        callbackUrl: '/',
        redirect: true 
      });
      addResult('✅ NextAuth signOut with redirect - Success');
    } catch (error) {
      addResult(`❌ NextAuth signOut with redirect - Error: ${error}`);
    } finally {
      setLoading(null);
    }
  };

  // Test 2: NextAuth signOut without redirect
  const testNextAuthNoRedirect = async () => {
    setLoading('nextauth-no-redirect');
    addResult('Testing NextAuth signOut without redirect...');
    
    try {
      await signOut({ redirect: false });
      addResult('✅ NextAuth signOut without redirect - Success');
      router.push('/');
    } catch (error) {
      addResult(`❌ NextAuth signOut without redirect - Error: ${error}`);
    } finally {
      setLoading(null);
    }
  };

  // Test 3: useAuth logout hook
  const testUseAuthLogout = async () => {
    setLoading('useauth-logout');
    addResult('Testing useAuth logout hook...');
    
    try {
      await logout({ 
        callbackUrl: '/',
        redirect: true 
      });
      addResult('✅ useAuth logout - Success');
    } catch (error) {
      addResult(`❌ useAuth logout - Error: ${error}`);
    } finally {
      setLoading(null);
    }
  };

  // Test 4: Force redirect (fallback method)
  const testForceRedirect = () => {
    setLoading('force-redirect');
    addResult('Testing force redirect...');
    
    try {
      window.location.href = '/';
      addResult('✅ Force redirect - Success');
    } catch (error) {
      addResult(`❌ Force redirect - Error: ${error}`);
    } finally {
      setLoading(null);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LogOut className="w-5 h-5" />
          Logout Methods Test
        </CardTitle>
        <CardDescription>
          Test different logout methods to identify which one works correctly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Button
            onClick={testNextAuthRedirect}
            disabled={!!loading}
            variant="default"
            className="w-full"
          >
            {loading === 'nextauth-redirect' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4 mr-2" />
            )}
            NextAuth + Redirect
          </Button>

          <Button
            onClick={testNextAuthNoRedirect}
            disabled={!!loading}
            variant="outline"
            className="w-full"
          >
            {loading === 'nextauth-no-redirect' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4 mr-2" />
            )}
            NextAuth + Manual Redirect
          </Button>

          <Button
            onClick={testUseAuthLogout}
            disabled={!!loading}
            variant="secondary"
            className="w-full"
          >
            {loading === 'useauth-logout' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4 mr-2" />
            )}
            useAuth Hook
          </Button>

          <Button
            onClick={testForceRedirect}
            disabled={!!loading}
            variant="destructive"
            className="w-full"
          >
            {loading === 'force-redirect' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4 mr-2" />
            )}
            Force Redirect
          </Button>
        </div>

        <div className="flex gap-2">
          <Button onClick={clearResults} variant="ghost" size="sm">
            Clear Results
          </Button>
        </div>

        {results.length > 0 && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Test Results:</h4>
            <div className="space-y-1 text-sm font-mono">
              {results.map((result, index) => (
                <div key={index} className={`${
                  result.includes('✅') ? 'text-green-600' : 
                  result.includes('❌') ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 p-2 bg-blue-50 rounded">
          <strong>Note:</strong> The working method should be used in the sidebar logout button.
        </div>
      </CardContent>
    </Card>
  );
}