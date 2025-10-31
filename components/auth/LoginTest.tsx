'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function LoginTest() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Logged In</CardTitle>
          <CardDescription>Welcome back!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p><strong>Name:</strong> {session.user?.name}</p>
            <p><strong>Email:</strong> {session.user?.email}</p>
            <p><strong>Role:</strong> {(session.user as any)?.role}</p>
          </div>
          <Button onClick={() => signOut()} variant="destructive">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Not Logged In</CardTitle>
        <CardDescription>Please sign in to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => signIn()} className="w-full">
          Sign In
        </Button>
      </CardContent>
    </Card>
  );
}