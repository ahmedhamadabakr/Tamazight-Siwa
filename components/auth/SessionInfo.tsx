'use client';

import { useAuth } from '@/hooks/useAuth';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Shield, Clock, LogOut, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export function SessionInfo() {
  const { user, isLoading, logout, refreshSession } = useAuth();
  const { data: session } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshSession();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = async () => {
    await logout({ redirect: true, callbackUrl: '/login' });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Session Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Session Information
          </CardTitle>
          <CardDescription>
            You are not currently signed in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <a href="/login">Sign In</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getRoleBadgeColor = (role: string) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Session Information
        </CardTitle>
        <CardDescription>
          Current user session details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Name:</span>
            <span className="text-sm text-gray-900">{user.fullName || user.name}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Email:</span>
            <span className="text-sm text-gray-900">{user.email}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Role:</span>
            <Badge className={getRoleBadgeColor(user.role || 'user')}>
              <Shield className="w-3 h-3 mr-1" />
              {user.role?.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">User ID:</span>
            <span className="text-xs text-gray-600 font-mono">{user.id}</span>
          </div>
        </div>

        {/* Session Actions */}
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex-1"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="flex-1"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Development Info */}
        {process.env.NODE_ENV === 'development' && session && (
          <div className="pt-4 border-t border-gray-200">
            <details className="text-xs">
              <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                Session Debug Info (Development Only)
              </summary>
              <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </CardContent>
    </Card>
  );
}