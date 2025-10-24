'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('يرجى إدخال البريد الإلكتروني')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setIsEmailSent(true)
        toast.success('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني')
      } else {
        toast.error(data.message || 'حدث خطأ في إرسال البريد الإلكتروني')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('حدث خطأ في الاتصال بالخادم')
    } finally {
      setIsLoading(false)
    }
  }

  if (isEmailSent) {
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
            تم إرسال البريد الإلكتروني
          </h1>
          
          <p className="text-gray-600 mb-6">
            تم إرسال رابط إعادة تعيين كلمة المرور إلى:
            <br />
            <span className="font-medium text-gray-900">{email}</span>
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              يرجى فحص بريدك الإلكتروني والنقر على الرابط لإعادة تعيين كلمة المرور.
              إذا لم تجد البريد، تحقق من مجلد الرسائل غير المرغوب فيها.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={() => setIsEmailSent(false)}
              variant="outline"
              className="w-full"
            >
              إرسال مرة أخرى
            </Button>
            
            <Link href="/login">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة لتسجيل الدخول
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            نسيت كلمة المرور؟
          </h1>
          
          <p className="text-gray-600">
            أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="أدخل بريدك الإلكتروني"
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white ml-2"></div>
                جاري الإرسال...
              </div>
            ) : (
              'إرسال رابط إعادة التعيين'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login">
            <Button variant="ghost" className="text-sm">
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة لتسجيل الدخول
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}