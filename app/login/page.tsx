'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const urlError = searchParams.get('error');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    if (res?.ok) {
      router.replace(callbackUrl);
    } else {
      setError(res?.error || 'Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Logo + Title */}
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-md">
              <span className="text-primary-foreground font-bold text-xl">TS</span>
            </div>
            <span className="font-bold text-2xl text-foreground tracking-tight">Tamazight Siwa</span>
          </Link>

          <h2 className="text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          {(urlError || error) && (
            <p className="mt-2 text-sm text-red-600">
              {error || 'Sign-in error. Please try again.'}
            </p>
          )}
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <LogIn className="w-5 h-5 text-primary" />
              Welcome back
            </CardTitle>
            <CardDescription>Enter your email and password to continue</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link href="/register">
                <Button variant="outline" className="w-full">Register</Button>
              </Link>
              <Link href="/forgot-password">
                <Button variant="ghost" className="w-full">Forgot Password</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
