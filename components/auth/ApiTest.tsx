'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';

interface ApiTestResult {
  endpoint: string;
  status: 'pending' | 'success' | 'error';
  statusCode?: number;
  message?: string;
  data?: any;
}

export function ApiTest() {
  const [results, setResults] = useState<ApiTestResult[]>([]);
  const [testing, setTesting] = useState(false);

  const apiEndpoints = [
    { url: '/api/tours', name: 'Tours API' },
    { url: '/api/admin/bookings', name: 'Admin Bookings' },
    { url: '/api/cloudinary/stats', name: 'Cloudinary Stats' },
    { url: '/api/test-db', name: 'Database Test', method: 'POST' },
    { url: '/api/auth/sessions', name: 'Auth Sessions' },
  ];

  const testApi = async (endpoint: { url: string; name: string; method?: string }) => {
    const method = endpoint.method || 'GET';
    const body = method === 'POST' ? JSON.stringify({ test: true }) : undefined;
    
    try {
      const response = await fetch(endpoint.url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      const data = await response.json();
      
      return {
        endpoint: endpoint.name,
        status: response.ok ? 'success' : 'error',
        statusCode: response.status,
        message: response.ok ? 'Success' : data.error || data.message || 'Unknown error',
        data: response.ok ? data : undefined,
      } as ApiTestResult;
    } catch (error) {
      return {
        endpoint: endpoint.name,
        status: 'error',
        statusCode: 0,
        message: error instanceof Error ? error.message : 'Network error',
      } as ApiTestResult;
    }
  };

  const testAllApis = async () => {
    setTesting(true);
    setResults([]);

    // Initialize results with pending status
    const initialResults = apiEndpoints.map(endpoint => ({
      endpoint: endpoint.name,
      status: 'pending' as const,
    }));
    setResults(initialResults);

    // Test each API
    for (let i = 0; i < apiEndpoints.length; i++) {
      const endpoint = apiEndpoints[i];
      const result = await testApi(endpoint);
      
      setResults(prev => prev.map((r, index) => 
        index === i ? result : r
      ));
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setTesting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (result: ApiTestResult) => {
    if (result.status === 'pending') {
      return <Badge variant="secondary">Testing...</Badge>;
    }
    
    if (result.status === 'success') {
      return <Badge className="bg-green-100 text-green-800">✅ {result.statusCode}</Badge>;
    }
    
    return <Badge variant="destructive">❌ {result.statusCode || 'Error'}</Badge>;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          API Routes Test
        </CardTitle>
        <CardDescription>
          Test API endpoints to check for 503 errors and other issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testAllApis} 
          disabled={testing}
          className="w-full"
        >
          {testing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Testing APIs...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Test All APIs
            </>
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Test Results:</h4>
            {results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <p className="font-medium text-sm">{result.endpoint}</p>
                    {result.message && (
                      <p className="text-xs text-gray-500">{result.message}</p>
                    )}
                  </div>
                </div>
                {getStatusBadge(result)}
              </div>
            ))}
          </div>
        )}

        {results.length > 0 && !testing && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-sm mb-2">Summary:</h5>
            <div className="flex gap-4 text-xs">
              <span className="text-green-600">
                ✅ Success: {results.filter(r => r.status === 'success').length}
              </span>
              <span className="text-red-600">
                ❌ Errors: {results.filter(r => r.status === 'error').length}
              </span>
              <span className="text-gray-600">
                Total: {results.length}
              </span>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 p-2 bg-blue-50 rounded">
          <strong>Note:</strong> Some APIs may return 401/403 errors if not authenticated - this is normal.
          The important thing is that there are no 503 Service Unavailable errors.
        </div>
      </CardContent>
    </Card>
  );
}