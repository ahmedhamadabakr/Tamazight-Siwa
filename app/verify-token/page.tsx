'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

type VerificationStatus = 'verifying' | 'success' | 'error' | 'invalid';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const [message, setMessage] = useState('جاري التحقق من البريد الإلكتروني...');

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('invalid');
        setMessage('رابط التحقق غير صالح');
        return;
      }

      try {
        const response = await fetch('/api/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setMessage('تم التحقق من بريدك الإلكتروني بنجاح! سيتم تحويلك إلى الصفحة الرئيسية...');
          setTimeout(() => router.push('/'), 3000);
        } else {
          throw new Error(data.error || 'فشل التحقق من البريد الإلكتروني');
        }
      } catch (error: unknown) {
        console.error('Verification error:', error);
        setStatus('error');
        const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
        setMessage(errorMessage || 'حدث خطأ أثناء التحقق من البريد الإلكتروني');
      }
    };

    verifyToken();
  }, [searchParams, router]);

  const getStatusIcon = () => {
    switch (status) {
      case 'verifying':
        return <FaSpinner className="animate-spin text-blue-500 text-4xl mb-4" />;
      case 'success':
        return <FaCheckCircle className="text-green-500 text-4xl mb-4" />;
      case 'error':
      case 'invalid':
        return <FaTimesCircle className="text-red-500 text-4xl mb-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
        <div className="flex flex-col items-center">
          {getStatusIcon()}
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            {status === 'verifying' && 'جاري التحقق...'}
            {status === 'success' && 'تم التحقق بنجاح!'}
            {(status === 'error' || status === 'invalid') && 'خطأ في التحقق'}
          </h2>
        </div>
        <p className="mt-2 text-gray-600 text-right">{message}</p>
        
        {(status === 'error' || status === 'invalid') && (
          <button
            onClick={() => window.location.href = '/'}
            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            العودة إلى الصفحة الرئيسية
          </button>
        )}
      </div>
    </div>
  );
}
