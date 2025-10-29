'use client';

import { useAuth } from '@/hooks/useAuth';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Shield, 
  Clock, 
  LogOut,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { useState } from 'react';

export function SessionInfo() {
  const { user, logout, refreshSession, isLoading } = useAuth();
  const { data: session } = useSession();
  const [showTokens, setShowTokens] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  if (!user || !session) {
    return null;
  }

  const handleRefreshSession = async () => {
    setRefreshing(true);
    try {
      await refreshSession();
    } catch (error) {
      console.error('Failed to refresh session:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'user':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTokenPreview = (token: string) => {
    if (!token) return 'Not available';
    return `${token.substring(0, 20)}...${token.substring(token.length - 10)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Session Information
        </CardTitle>
        <CardDescription>
          Current session details and authentication status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Name</label>
            <p className="text-sm">{user.name || 'Not provided'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <p className="text-sm">{user.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">User ID</label>
            <p className="text-sm font-mono">{user.id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Role</label>
            <div className="mt-1">
              <Badge className={getRoleColor(user.role || 'user')}>
                <Shield className="w-3 h-3 mr-1" />
                {user.role || 'user'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Session Status */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium">Session Status</h4>
            <Badge variant="outline" className="text-green-600 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Active
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="text-muted-foreground">Session Started</label>
              <p className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date().toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-muted-foreground">Loading State</label>
              <p>{isLoading ? 'Loading...' : 'Ready'}</p>
            </div>
          </div>
        </div>

        {/* Token Information (Debug) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Token Information</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTokens(!showTokens)}
              >
                {showTokens ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            
            {showTokens && (
              <div className="space-y-2 text-xs font-mono bg-gray-50 p-3 rounded-lg">
                <div>
                  <label className="text-muted-foreground">Access Token:</label>
                  <p className="break-all">
                    {formatTokenPreview((session as any)?.accessToken || '')}
                  </p>
                </div>
                <div>
                  <label className="text-muted-foreground">Session Expires:</label>
                  <p>
                    {session.expires ? new Date(session.expires).toLocaleString() : 'Unknown'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 border-t flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshSession}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Session
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => logout()}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}