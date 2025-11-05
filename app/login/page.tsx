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

  const handleGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    
    try {
      const target = callbackUrl && callbackUrl !== '/login' ? callbackUrl : '/';
      const result = await signIn('google', { 
        callbackUrl: target,
        redirect: false 
      });

      if (result?.error) {
        console.error('Google sign-in error:', result.error);
        setError(mapAuthError(result.error));
      } else if (result?.url) {
        // If we have a URL, redirect to it (handles the OAuth flow)
        window.location.href = result.url;
        return;
      }
    } catch (err) {
      console.error('Error during Google sign-in:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
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

        // Wait until session cookie is readable by middleware (up to ~5s)
        for (let i = 0; i < 50; i++) {
          try {
            const s = await fetch('/api/auth/session', { cache: 'no-store' });
            const json = await s.json();
            if (json?.user?.id) break;
          } catch {}
          await new Promise(r => setTimeout(r, 100));
        }

        // Determine safe redirect target
        let target = '/';
        if (callbackUrl && callbackUrl !== '/login') {
          target = callbackUrl;
        } else {
          try {
            const uRes = await fetch('/api/user/fetch_user', { cache: 'no-store' });
            if (uRes.ok) {
              const u = await uRes.json();
              const id = u?._id || u?.id;
              const role = u?.role;
              if (id && (role === 'admin' || role === 'manager')) target = `/dashboard/${id}`;
              else if (id) target = `/user/${id}`;
            }
          } catch {}
        }

        if (typeof window !== 'undefined') {
          window.location.assign(target);
        } else {
          router.replace(target);
        }
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

        {/*   <Button 
            type="button" 
            onClick={handleGoogleSignIn} 
            className="w-full flex items-center justify-center gap-2"
            disabled={loading}
            variant="outline"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.602 32.915 29.197 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.155 7.961 3.039l5.657-5.657C34.847 6.053 29.69 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.651-.389-3.917z"/>
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.818C14.655 16.108 18.961 14 24 14c3.059 0 5.842 1.155 7.961 3.039l5.657-5.657C34.847 6.053 29.69 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                <path fill="#4CAF50" d="M24 44c5.132 0 9.797-1.969 13.304-5.182l-6.147-5.196C29.074 35.755 26.671 36 24 36c-5.176 0-9.567-3.062-11.291-7.447l-6.542 5.036C9.466 39.556 16.227 44 24 44z"/>
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.358 3.832-5.004 6.667-9.303 6.667-5.176 0-9.567-3.062-11.291-7.447l-6.542 5.036C9.466 39.556 16.227 44 24 44c11.046 0 20-8.954 20-20 0-1.341-.138-2.651-.389-3.917z"/>
              </svg>
            )}
            {loading ? 'Signing in with Google...' : 'Continue with Google'}
          </Button> 

          <div className="relative flex items-center justify-center">
            <span className="px-2 text-xs text-muted-foreground bg-background">or</span>
            <div className="absolute inset-x-0 h-px bg-muted" />
          </div>*/}
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
