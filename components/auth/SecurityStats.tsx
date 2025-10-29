'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

interface SecurityStats {
  totalSessions: number;
  activeSessions: number;
  recentLogins: number;
  failedAttempts: number;
  accountStatus: 'active' | 'locked' | 'inactive';
  lastLogin: string;
  securityScore: number;
}

export function SecurityStats() {
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSecurityStats();
  }, []);

  const fetchSecurityStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/security-stats', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch security stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getSecurityScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const getAccountStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case 'locked':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Locked
          </Badge>
        );
      case 'inactive':
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <Clock className="w-3 h-3 mr-1" />
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Security Overview
          </CardTitle>
          <CardDescription>Loading security statistics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Security Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Unable to load security statistics</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Security Overview
        </CardTitle>
        <CardDescription>
          Your account security status and activity summary
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Active Sessions */}
          <div className="p-4 rounded-lg border border-gray-200 bg-blue-50">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Active Sessions</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {stats.activeSessions}
            </div>
            <div className="text-xs text-blue-700">
              of {stats.totalSessions} total
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-4 rounded-lg border border-gray-200 bg-green-50">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Recent Logins</span>
            </div>
            <div className="text-2xl font-bold text-green-900">
              {stats.recentLogins}
            </div>
            <div className="text-xs text-green-700">
              last 7 days
            </div>
          </div>

          {/* Failed Attempts */}
          <div className="p-4 rounded-lg border border-gray-200 bg-red-50">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-900">Failed Attempts</span>
            </div>
            <div className="text-2xl font-bold text-red-900">
              {stats.failedAttempts}
            </div>
            <div className="text-xs text-red-700">
              last 24 hours
            </div>
          </div>

          {/* Security Score */}
          <div className="p-4 rounded-lg border border-gray-200 bg-purple-50">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Security Score</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">
              {stats.securityScore}%
            </div>
            <div className="text-xs text-purple-700">
              {getSecurityScoreLabel(stats.securityScore)}
            </div>
          </div>
        </div>

        {/* Account Status and Last Login */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Account Status</label>
            <div className="mt-1">
              {getAccountStatusBadge(stats.accountStatus)}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Last Login</label>
            <p className="text-sm mt-1">
              {new Date(stats.lastLogin).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Security Recommendations */}
        {stats.securityScore < 80 && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="text-sm font-medium text-yellow-900 mb-2">
              Security Recommendations
            </h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              {stats.securityScore < 60 && (
                <li>• Enable two-factor authentication</li>
              )}
              {stats.failedAttempts > 0 && (
                <li>• Review recent failed login attempts</li>
              )}
              {stats.activeSessions > 3 && (
                <li>• Consider logging out unused sessions</li>
              )}
              <li>• Regularly update your password</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}