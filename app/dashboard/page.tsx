'use client';

import { ProtectedRoute } from '@/components/auth/RouteGuard';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Calendar, 
  MapPin, 
  Settings,
  BarChart3,
  Users,
  Shield
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, hasRole } = useAuth();

  return (
    <ProtectedRoute requiredRole={['admin', 'manager', 'user']}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.fullName || user?.name}!
                </h1>
                <p className="mt-2 text-gray-600">
                  Here's what's happening with your account today.
                </p>
              </div>
              <Badge className="bg-primary text-primary-foreground">
                {user?.role?.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Active</div>
                <p className="text-xs text-muted-foreground">
                  Account status
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Total bookings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tours</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Tours completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Good</div>
                <p className="text-xs text-muted-foreground">
                  Security score
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common tasks and shortcuts
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button asChild className="h-auto p-4 flex-col items-start">
                    <Link href="/tours">
                      <MapPin className="h-6 w-6 mb-2" />
                      <span className="font-semibold">Browse Tours</span>
                      <span className="text-sm text-muted-foreground">
                        Discover amazing destinations
                      </span>
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
                    <Link href="/security">
                      <Shield className="h-6 w-6 mb-2" />
                      <span className="font-semibold">Security Settings</span>
                      <span className="text-sm text-muted-foreground">
                        Manage your account security
                      </span>
                    </Link>
                  </Button>

                  {hasRole(['admin', 'manager']) && (
                    <>
                      <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
                        <Link href="/admin/users">
                          <Users className="h-6 w-6 mb-2" />
                          <span className="font-semibold">Manage Users</span>
                          <span className="text-sm text-muted-foreground">
                            User administration
                          </span>
                        </Link>
                      </Button>

                      <Button asChild variant="outline" className="h-auto p-4 flex-col items-start">
                        <Link href="/admin/analytics">
                          <BarChart3 className="h-6 w-6 mb-2" />
                          <span className="font-semibold">Analytics</span>
                          <span className="text-sm text-muted-foreground">
                            View reports and insights
                          </span>
                        </Link>
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Account Info */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Your account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Name:</span>
                      <span>{user?.fullName || user?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Role:</span>
                      <Badge variant="outline">{user?.role}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">User ID:</span>
                      <span className="font-mono text-xs">{user?.id}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/profile/edit">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}