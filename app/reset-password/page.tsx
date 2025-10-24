'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null)
  const [isPasswordReset, setIsPasswordReset] = useState(false)

  useEffect(() => {
    if (!token) {
      setIsTokenValid(false)
      return
    }

    // Verify token
    verifyToken()
  }, [token])

  const verifyToken = async () => {
    try {
      const response = await fetch('/api/auth/verify-reset-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()
      setIsTokenValid(data.success)

      if (!data.success) {
        toast.error(data.message || 'الرابط غير صالح أو منتهي الصلاحية')
      }
    } catch (error) {
      console.error('Error verifying token:', error)
      setIsTokenValid(false)
      toast.error('حدث خطأ في التحقق من الرابط')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      toast.error('يرجى ملء جميع الحقول')
      return
    }

    if (password.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }

    if (password !== confirmPassword) {
      toast.error('كلمات المرور غير متطابقة')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setIsPasswordReset(true)
        toast.success('تم تغيير كلمة المرور بنجاح')
      } else {
        toast.error(data.message || 'حدث خطأ في تغيير كلمة المرور')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('حدث خطأ في الاتصال بالخادم')
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state
  if (isTokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من الرابط...</p>
        </div>
      </div>
    )
  }

  // Invalid token
  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            رابط غير صالح
          </h1>
          
          <p className="text-gray-600 mb-6">
            الرابط المستخدم غير صالح أو منتهي الصلاحية. يرجى طلب رابط جديد.
          </p>
          
          <div className="space-y-3">
            <Link href="/forgot-password">
              <Button className="w-full">
                طلب رابط جديد
              </Button>
            </Link>
            
            <Link href="/login">
              <Button variant="outline" className="w-full">
                العودة لتسجيل الدخول
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  // Password reset successful
  if (isPasswordReset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            تم تغيير كلمة المرور
          </h1>
          
          <p className="text-gray-600 mb-6">
            تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.
          </p>
          
          <Button
            onClick={() => router.push('/login')}
            className="w-full"
          >
            تسجيل الدخول
          </Button>
        </motion.div>
      </div>
    )
  }

  // Reset password form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            إعادة تعيين كلمة المرور
          </h1>
          
          <p className="text-gray-600">
            أدخل كلمة المرور الجديدة لحسابك
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور الجديدة
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="أدخل كلمة المرور الجديدة"
                required
                disabled={isLoading}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              يجب أن تكون كلمة المرور 6 أحرف على الأقل
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              تأكيد كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="أعد إدخال كلمة المرور"
                required
                disabled={isLoading}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white ml-2"></div>
                جاري التحديث...
              </div>
            ) : (
              'تحديث كلمة المرور'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login">
            <Button variant="ghost" className="text-sm">
              العودة لتسجيل الدخول
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}