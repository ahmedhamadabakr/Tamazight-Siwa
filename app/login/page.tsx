'use client';

import { useState, useEffect } from 'react';
import { signIn, getSession, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  
  // Get callback URL from search params
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const urlError = searchParams.get('error');

  // Set error from URL params
  useEffect(() => {
    if (urlError) {
      switch (urlError) {
        case 'authentication_required':
          setError('Please sign in to access this page');
          break;
        case 'middleware_error':
          setError('Authentication error. Please try again.');
          break;
        default:
          setError('An error occurred. Please try again.');
      }
    }
  }, [urlError]);

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const userRole = (session.user as any).role;
      let redirectPath = callbackUrl;
      
      // Override callback URL based on user role if it's just the home page
      if (callbackUrl === '/') {
        if (userRole === 'admin') {
          redirectPath = '/admin/dashboard';
        } else if (userRole === 'manager') {
          redirectPath = `/dashboard/${(session.user as any).id}`;
        } else {
          redirectPath = `/user/${(session.user as any).id}`;
        }
      }
      
      router.replace(redirectPath);
    }
  }, [status, session, router, callbackUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Show loading if already authenticated and redirecting
  if (status === 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (loading || status === 'loading') return; // Prevent double submission
  
  setLoading(true);
  setError('');

  try {
    const result = await signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password');
      setLoading(false);
      return;
    }

    if (result?.ok) {
      // Determine redirect path based on callbackUrl or user role
      try {
        const sess = await getSession();
        let redirectPath = callbackUrl;

        if (!callbackUrl || callbackUrl === '/') {
          const role = (sess?.user as any)?.role;
          const id = (sess?.user as any)?.id;
          if (role === 'admin') redirectPath = '/admin/dashboard';
          else if (role === 'manager') redirectPath = `/dashboard/${id}`;
          else redirectPath = `/user/${id}`;
        }

        router.replace(redirectPath);
        return;
      } catch {
        // Fallback to callbackUrl if session not yet available
        router.replace(callbackUrl || '/');
        return;
      }
    } else {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  } catch (err) {
    console.error('Login error:', err);
    setError('An error occurred during login. Please try again.');
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
          <p className="mt-2 text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Create one
            </Link>
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <LogIn className="w-5 h-5 text-primary" />
              Welcome back
            </CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="example@email.com"
                  className="focus-visible:ring-primary"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="focus-visible:ring-primary pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full font-semibold text-base"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-5 text-center">
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forget password ?
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
