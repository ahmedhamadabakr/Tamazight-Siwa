'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Globe, 
  Clock, 
  Trash2, 
  Shield,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Session {
  id: string;
  deviceInfo: string;
  ipAddress: string;
  location?: string;
  lastActive: string;
  createdAt: string;
  isCurrent: boolean;
}

export function SessionManager() {
  const { user, logout } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/sessions');
      
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }
      
      const data = await response.json();
      setSessions(data.sessions || []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const handleTerminateSession = async (sessionId: string) => {
    try {
      setActionLoading(sessionId);
      
      const response = await fetch(`/api/auth/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to terminate session');
      }
      
      // Refresh sessions list
      await fetchSessions();
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to terminate session');
    } finally {
      setActionLoading(null);
    }
  };

  const handleTerminateAllOther = async () => {
    try {
      setActionLoading('all-others');
      
      const response = await fetch('/api/auth/logout-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keepCurrent: true }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to terminate other sessions');
      }
      
      // Refresh sessions list
      await fetchSessions();
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to terminate other sessions');
    } finally {
      setActionLoading(null);
    }
  };

  const getDeviceIcon = (deviceInfo: string) => {
    const info = deviceInfo.toLowerCase();
    if (info.includes('mobile') || info.includes('android') || info.includes('iphone')) {
      return <Smartphone className="w-4 h-4" />;
    }
    if (info.includes('tablet') || info.includes('ipad')) {
      return <Tablet className="w-4 h-4" />;
    }
    return <Monitor className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Session Manager</CardTitle>
          <CardDescription>Please sign in to manage your sessions</CardDescription>
        </CardHeader>
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
              Active Sessions
            </CardTitle>
            <CardDescription>
              Manage your active sessions across different devices
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSessions}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No active sessions found</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-4 border rounded-lg ${
                    session.isCurrent 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getDeviceIcon(session.deviceInfo)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {session.deviceInfo}
                          </p>
                          {session.isCurrent && (
                            <Badge variant="secondary" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            <span>{session.ipAddress}</span>
                            {session.location && (
                              <span>• {session.location}</span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Last active: {getRelativeTime(session.lastActive)}</span>
                          </div>
                          
                          <div>
                            Created: {formatDate(session.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {!session.isCurrent && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTerminateSession(session.id)}
                        disabled={actionLoading === session.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {sessions.filter(s => !s.isCurrent).length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant="destructive"
                  onClick={handleTerminateAllOther}
                  disabled={actionLoading === 'all-others'}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {actionLoading === 'all-others' 
                    ? 'Terminating...' 
                    : 'Terminate All Other Sessions'
                  }
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}