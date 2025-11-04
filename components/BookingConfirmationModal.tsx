'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { CheckCircle, X, Calendar, Users, MapPin, CreditCard } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface BookingConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  bookingData: {
    bookingReference: string
    tourTitle: string
    destination: string
    travelers: number
    totalAmount: number
    status: string
  }
  onViewDetails: () => void
}

export function BookingConfirmationModal({
  isOpen,
  onClose,
  bookingData,
  onViewDetails
}: BookingConfirmationModalProps) {
  const prefersReduced = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const update = () => setIsMobile(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const simple = prefersReduced || isMobile
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={simple ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            animate={simple ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={simple ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            transition={simple ? { duration: 0.2 } : undefined}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Success Icon */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 px-6 pt-8 pb-6 text-center">
              <motion.div
                initial={simple ? { opacity: 0 } : { scale: 0 }}
                animate={simple ? { opacity: 1 } : { scale: 1 }}
                transition={simple ? { duration: 0.2 } : { delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>
              
              <motion.h2
                initial={simple ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={simple ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{ delay: simple ? 0 : 0.3, duration: simple ? 0.2 : undefined }}
                className="text-2xl font-bold text-gray-900 mb-2"
              >
                Booking confirmed!
              </motion.h2>
              
              <motion.p
                initial={simple ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={simple ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{ delay: simple ? 0 : 0.4, duration: simple ? 0.2 : undefined }}
                className="text-gray-600"
              >
                Booking Reference: {bookingData.bookingReference}
              </motion.p>
            </div>

            {/* Booking Details */}
            <div className="px-6 py-4 space-y-4">
              <motion.div
                initial={simple ? { opacity: 0 } : { opacity: 0, x: -20 }}
                animate={simple ? { opacity: 1 } : { opacity: 1, x: 0 }}
                transition={{ delay: simple ? 0 : 0.5, duration: simple ? 0.2 : undefined }}
                className="flex items-center space-x-3 space-x-reverse"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{bookingData.tourTitle}</p>
                  <p className="text-sm text-gray-600">{bookingData.destination}</p>
                </div>
              </motion.div>

              <motion.div
                initial={simple ? { opacity: 0 } : { opacity: 0, x: -20 }}
                animate={simple ? { opacity: 1 } : { opacity: 1, x: 0 }}
                transition={{ delay: simple ? 0 : 0.6, duration: simple ? 0.2 : undefined }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Passengers</span>
                </div>
                <span className="font-medium text-gray-900">{bookingData.travelers} passengers</span>
              </motion.div>

              <motion.div
                initial={simple ? { opacity: 0 } : { opacity: 0, x: -20 }}
                animate={simple ? { opacity: 1 } : { opacity: 1, x: 0 }}
                transition={{ delay: simple ? 0 : 0.7, duration: simple ? 0.2 : undefined }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Total Amount</span>
                </div>
                <span className="font-bold text-blue-600">{bookingData.totalAmount.toLocaleString()} Dollar</span>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 pb-6 space-y-3">
              <motion.div
                initial={simple ? { opacity: 0 } : { opacity: 0, y: 20 }}
                animate={simple ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{ delay: simple ? 0 : 0.8, duration: simple ? 0.2 : undefined }}
              >
                <Button
                  onClick={onViewDetails}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  View Booking Details
                </Button>
              </motion.div>

              <motion.div
                initial={simple ? { opacity: 0 } : { opacity: 0, y: 20 }}
                animate={simple ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{ delay: simple ? 0 : 0.9, duration: simple ? 0.2 : undefined }}
              >
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full"
                >
                  Close
                </Button>
              </motion.div>
            </div>

            {/* Bottom Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: simple ? 0 : 1, duration: simple ? 0.2 : undefined }}
              className="bg-blue-50 px-6 py-3 text-center"
            >
              <p className="text-sm text-blue-700">
                A confirmation email will be sent to your email address.
              </p>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}