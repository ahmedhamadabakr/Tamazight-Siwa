'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, ArrowLeft, Mail } from 'lucide-react';

type VerificationStatus = 'entering' | 'verifying' | 'success' | 'error';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>('entering');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('Enter the 6-digit verification code sent to your email');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(true);
  const [resendMessage, setResendMessage] = useState('');

  // Format countdown to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const urlEmail = searchParams.get('email');
    if (!urlEmail) {
      setStatus('error');
      setMessage('Email not found. Please register again.');
      return;
    }
    setEmail(urlEmail);
  }, [searchParams]);

  // Handle countdown timer
  useEffect(() => {
    if (countdown > 0 && status === 'entering') {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code || code.length !== 6) {
      setMessage('Please enter a valid 6-digit code');
      setStatus('error');
      return;
    }

    setIsLoading(true);
    setStatus('verifying');
    setMessage('Verifying your code...');

    try {
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setStatus('success');
      setMessage('Email verified successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setMessage('Email not found');
      setStatus('error');
      return;
    }

    setIsLoading(true);
    setResendMessage('Sending new code...');

    try {
      const response = await fetch('/api/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend code');
      }

      setCanResend(false);
      setCountdown(300); // Reset countdown to 5 minutes
      setResendMessage('New verification code sent!');
      setStatus('entering');
      setCode('');
      setMessage('Enter the new 6-digit code sent to your email');
    } catch (error) {
      setResendMessage(error instanceof Error ? error.message : 'Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'verifying':
        return <Loader2 className="animate-spin text-blue-500 w-8 h-8 mb-4" />;
      case 'success':
        return <CheckCircle className="text-green-500 w-8 h-8 mb-4" />;
      case 'error':
        return <XCircle className="text-red-500 w-8 h-8 mb-4" />;
      default:
        return null;
    }
  };

  if (status === 'entering') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Verify your email</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter the verification code sent to: <strong>{email}</strong>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 text-right">
                Verification code (6 digits)
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest"
                placeholder="000000"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || code.length !== 6}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify account'}
              </button>
            </div>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isLoading || !canResend}
                className="text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50"
              >
                Resend code { !canResend && `in ${formatTime(countdown)}` }
              </button>
              {resendMessage && (
                <div className="text-xs text-gray-500">{resendMessage}</div>
              )}
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/register')}
                className="text-sm text-gray-600 hover:text-gray-500 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to registration page
              </button>
            </div>
          </form>

          {message && (
            <div className="mt-4 text-sm text-center text-gray-600">
              {message}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
        <div className="flex flex-col items-center">
          {getStatusIcon()}
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            {status === 'verifying' && 'Verifying...'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Error in verification'}
          </h2>
        </div>
        <p className="mt-2 text-gray-600 text-right">{message}</p>

        {status === 'error' && (
          <button
            onClick={() => {
              setStatus('entering');
              setMessage('Enter the verification code sent to your email');
              setCode('');
            }}
            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
