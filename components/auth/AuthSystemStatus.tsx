'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Database,
  Server,
  RefreshCw
} from 'lucide-react';

interface SystemStatus {
  authentication: 'healthy' | 'warning' | 'error';
  database: 'healthy' | 'warning' | 'error';
  sessions: 'healthy' | 'warning' | 'error';
  security: 'healthy' | 'warning' | 'error';
  lastCheck: string;
  details: {
    activeSessions: number;
    securityEvents: number;
    cleanupStatus: string;
    rateLimitStatus: string;
  };
}

export function AuthSystemStatus() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    try {
      setChecking(true);
      const response = await fetch('/api/auth/system-status', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(data.status);
      } else {
        // Fallback status if API is not available
        setStatus({
          authentication: 'warning',
          database: 'warning',
          sessions: 'warning',
          security: 'warning',
          lastCheck: new Date().toISOString(),
          details: {
            activeSessions: 0,
            securityEvents: 0,
            cleanupStatus: 'unknown',
            rateLimitStatus: 'unknown',
          },
        });
      }
    } catch (error) {
      console.error('Failed to check system status:', error);
      setStatus({
        authentication: 'error',
        database: 'error',
        sessions: 'error',
        security: 'error',
        lastCheck: new Date().toISOString(),
        details: {
          activeSessions: 0,
          securityEvents: 0,
          cleanupStatus: 'error',
          rateLimitStatus: 'error',
        },
      });
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            System Status
          </CardTitle>
          <CardDescription>Checking authentication system status...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Unable to load system status</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Authentication System Status
            </CardTitle>
            <CardDescription>
              Last checked: {new Date(status.lastCheck).toLocaleString()}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkSystemStatus}
            disabled={checking}
          >
            <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* System Components Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-2">
              {getStatusIcon(status.authentication)}
              <span className="font-medium">Authentication</span>
            </div>
            {getStatusBadge(status.authentication)}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-500" />
              <span className="font-medium">Database</span>
            </div>
            {getStatusBadge(status.database)}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-purple-500" />
              <span className="font-medium">Sessions</span>
            </div>
            {getStatusBadge(status.sessions)}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-orange-500" />
              <span className="font-medium">Security</span>
            </div>
            {getStatusBadge(status.security)}
          </div>
        </div>

        {/* System Details */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">System Details</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <label className="text-muted-foreground">Active Sessions</label>
              <p className="font-medium">{status.details.activeSessions}</p>
            </div>
            <div>
              <label className="text-muted-foreground">Security Events</label>
              <p className="font-medium">{status.details.securityEvents}</p>
            </div>
            <div>
              <label className="text-muted-foreground">Cleanup Status</label>
              <p className="font-medium capitalize">{status.details.cleanupStatus}</p>
            </div>
            <div>
              <label className="text-muted-foreground">Rate Limiting</label>
              <p className="font-medium capitalize">{status.details.rateLimitStatus}</p>
            </div>
          </div>
        </div>

        {/* Overall Status */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall System Health</span>
            {(() => {
              const statuses = [status.authentication, status.database, status.sessions, status.security];
              const hasError = statuses.includes('error');
              const hasWarning = statuses.includes('warning');
              
              if (hasError) return getStatusBadge('error');
              if (hasWarning) return getStatusBadge('warning');
              return getStatusBadge('healthy');
            })()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}