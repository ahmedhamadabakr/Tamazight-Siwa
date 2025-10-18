'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CreditCard, User } from "lucide-react"

interface BookingFormProps {
  tourId: string
  price: number
  onSuccess?: () => void
}

export function BookingForm({ tourId, price, onSuccess }: BookingFormProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [travelers, setTravelers] = useState(1)
  const [specialRequests, setSpecialRequests] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=/tours/${tourId}`)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tourId,
          travelers,
          specialRequests,
          totalAmount: price * travelers
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'فشل في إتمام الحجز')
      }

      toast.success('تم الحجز بنجاح!', {
        description: 'سيصلك تأكيد الحجز على بريدك الإلكتروني'
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push(`/user/${session?.user?.id}`)
      }

    } catch (error) {
      console.error('Booking error:', error)
      toast.error('حدث خطأ', {
        description: error.message || 'حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="travelers">عدد الأفراد (الحد الأقصى 5)</Label>
        <Input
          id="travelers"
          type="number"
          min="1"
          max="5"
          value={travelers}
          onChange={(e) => setTravelers(Math.min(5, Math.max(1, parseInt(e.target.value) || 1)))}
          className="w-24"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialRequests">طلبات خاصة (اختياري)</Label>
        <textarea
          id="specialRequests"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          className="w-full p-2 border rounded-md min-h-[100px]"
          placeholder="أي متطلبات خاصة أو حساسية من أطعمة معينة؟"
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              جارِ المعالجة...
            </>
          ) : (
            <>
              <CreditCard className="ml-2 h-4 w-4" />
              تأكيد الحجز
            </>
          )}
        </Button>
      </div>
    </form>
  )
}