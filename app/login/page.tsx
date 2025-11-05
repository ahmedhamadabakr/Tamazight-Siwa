'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock } from 'lucide-react';


export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { update } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rawCallback = searchParams.get('callbackUrl');
  const callbackUrl = rawCallback && rawCallback.startsWith('/') ? rawCallback : '/';
  const urlError = searchParams.get('error');

  const mapAuthError = (code?: string | null) => {
    switch (code) {
      case 'CredentialsSignin':
        return 'Invalid email or password.';
      case 'AccessDenied':
        return 'Access denied.';
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
      case 'EmailCreateAccount':
      case 'CallbackRouteError':
      case 'Configuration':
      case 'AdapterError':
      case 'OAuthAccountNotLinked':
      case 'SessionRequired':
      case 'Default':
        return 'Sign-in error. Please try again.';
      default:
        return code || 'Sign-in error. Please try again.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });
      if (res?.ok) {
        // Ensure session is up-to-date for navbar and other listeners
        await update();
        
        // Small delay to ensure session state is properly updated
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Only redirect if callbackUrl is not the login page itself
        if (callbackUrl !== '/login') {
          router.replace(callbackUrl);
        } else {
          router.replace('/');
        }
        router.refresh();
      } else {
        const message = mapAuthError(res?.error ?? null);
        setError(message);
        setLoading(false);
      }
    } catch (err) {
      setError('Sign-in error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <Image
          src="/siwa-oasis-traditional-berber-architecture-at-suns.jpg"
          alt="Siwa Oasis"
          fill
          style={{ objectFit: "cover" }}
          className="opacity-20"
        />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Tamazight Siwa logo"
              width={40}
              height={40}
              className="rounded-xl shadow-md"
              priority
            />
            <span className="font-semibold text-xl tracking-tight">Tamazight Siwa</span>
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              “Discover the timeless beauty of the Siwa Oasis. A journey into the heart of Berber culture and stunning natural landscapes.”
            </p>
            <footer className="text-sm">Tamazight Siwa Team</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-primary dark:text-primary-foreground lg:text-4xl md:text-3xl sm:text-2xl py-2">Login</h1>
            <p className="text-balance text-muted-foreground my-2">
              Enter your email below to login to your account
            </p>
            {(urlError || error) && (
              <p className="my-2 text-sm text-red-600">
                {error || mapAuthError(urlError)}
              </p>
            )}
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="pl-10" />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="pl-10" />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </Button>
          </form>


          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}  
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
