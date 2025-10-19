'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaArrowLeft } from 'react-icons/fa';

type VerificationStatus = 'entering' | 'verifying' | 'success' | 'error';

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>('entering');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('Enter the verification code sent to your email');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlEmail = searchParams.get('email');
    const storedData = localStorage.getItem('registrationData');
    let registrationData = { email: '', name: '', password: '' };

    if (storedData) {
      try {
        registrationData = JSON.parse(storedData);
      } catch (e) {
        console.error('Error parsing registration data from localStorage:', e);
      }
    }

    // Prioritize URL email if available, otherwise use stored email
    const finalEmail = urlEmail || registrationData.email;
    setEmail(finalEmail);
    setName(registrationData.name);
    setPassword(registrationData.password);
    
    if (!finalEmail) {
      setStatus('error');
      setMessage('Email not found. Please register again.');
    } else if (!registrationData.name || !registrationData.password) {
      // This case handles if email is in URL but name/password are missing from localStorage
      setStatus('error');
      setMessage('Email not found. Please register again.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code) {
      setMessage('Enter the verification code sent to your email');
      setStatus('error');
      return;
    }

    if (!email) {
      setMessage('Email not found. Please register again.');
      setStatus('error');
      return;
    }

    setIsLoading(true);
    setStatus('verifying');
    setMessage('Verifying the code...');

    try {
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code,
          name,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage('Account created successfully! Redirecting to login page...');

        // Clear stored data
        localStorage.removeItem('registrationData');

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || '  Invalid verification code');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('An error occurred while verifying the code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email || !name || !password) {
      setMessage('Please return to the registration page and enter the data again');
      setStatus('error');
      return;
    }

    setIsLoading(true);
    setStatus('verifying');
    setMessage('Sending new verification code...');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('entering');
        setMessage('New verification code sent to your email');
        setCode(''); // Clear the code field
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to send new verification code');
      }
    } catch (error) {
      console.error('Resend error:', error);
      setStatus('error');
      setMessage('An error occurred while sending the new verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'verifying':
        return <FaSpinner className="animate-spin text-blue-500 text-3xl mb-4" />;
      case 'success':
        return <FaCheckCircle className="text-green-500 text-3xl mb-4" />;
      case 'error':
        return <FaTimesCircle className="text-red-500 text-3xl mb-4" />;
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

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50"
              >
                Resend code
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/register')}
                className="text-sm text-gray-600 hover:text-gray-500 flex items-center justify-center gap-2"
              >
                <FaArrowLeft className="text-sm" />
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
