'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  MapPin,
  Monitor,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SecurityEvent {
  _id: string;
  eventType: string;
  ipAddress?: string;
  userAgent?: string;
  details?: any;
  timestamp: string;
}

export function SecurityEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSecurityEvents();
    }
  }, [user]);

  const fetchSecurityEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/security-events', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch security events');
      }

      const data = await response.json();
      setEvents(data.events || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load security events');
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'LOGIN_SUCCESS':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'LOGIN_FAILED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'ACCOUNT_LOCKED':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'TOKEN_REFRESH':
        return <RefreshCw className="w-4 h-4 text-blue-500" />;
      case 'RATE_LIMIT_EXCEEDED':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEventBadge = (eventType: string) => {
    switch (eventType) {
      case 'LOGIN_SUCCESS':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Success</Badge>;
      case 'LOGIN_FAILED':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>;
      case 'ACCOUNT_LOCKED':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Locked</Badge>;
      case 'TOKEN_REFRESH':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Token</Badge>;
      case 'RATE_LIMIT_EXCEEDED':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Rate Limit</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatEventDescription = (event: SecurityEvent) => {
    const { eventType, details } = event;
    
    switch (eventType) {
      case 'LOGIN_SUCCESS':
        if (details?.action === 'logout') {
          return `Logged out (${details.type || 'single session'})`;
        }
        return 'Successful login';
      case 'LOGIN_FAILED':
        if (details?.reason === 'user_not_found') return 'Login failed - user not found';
        if (details?.reason === 'invalid_password') return 'Login failed - invalid password';
        if (details?.reason === 'account_inactive') return 'Login failed - account inactive';
        return 'Login failed';
      case 'ACCOUNT_LOCKED':
        return 'Account temporarily locked due to multiple failed attempts';
      case 'TOKEN_REFRESH':
        return details?.success ? 'Token refreshed successfully' : 'Token refresh failed';
      case 'RATE_LIMIT_EXCEEDED':
        return `Rate limit exceeded for ${details?.type || 'unknown'}`;
      default:
        return eventType.replace(/_/g, ' ').toLowerCase();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Events
          </CardTitle>
          <CardDescription>Loading security events...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
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
              Security Events
            </CardTitle>
            <CardDescription>
              Recent security-related activities on your account
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchSecurityEvents}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No security events found
          </p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event._id}
                className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="mt-0.5">
                  {getEventIcon(event.eventType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getEventBadge(event.eventType)}
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimestamp(event.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-1">
                    {formatEventDescription(event)}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {event.ipAddress && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.ipAddress}
                      </div>
                    )}
                    {event.userAgent && (
                      <div className="flex items-center gap-1">
                        <Monitor className="w-3 h-3" />
                        {event.userAgent.split(' ')[0] || 'Unknown'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}