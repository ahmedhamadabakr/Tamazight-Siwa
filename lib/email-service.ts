import { generateBookingConfirmationEmail, generateBookingCancellationEmail } from './email-templates'

interface EmailConfig {
  to: string
  subject: string
  html: string
}

// This is a placeholder for email service
// In production, you would integrate with services like:
// - SendGrid
// - AWS SES
// - Nodemailer with SMTP
// - Resend
// - etc.

export async function sendEmail(config: EmailConfig): Promise<boolean> {
  try {
    // For development, just log the email
    console.log('📧 Email would be sent:')
    console.log('To:', config.to)
    console.log('Subject:', config.subject)
    console.log('HTML length:', config.html.length)
    
    // In production, replace this with actual email sending logic
    // Example with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    
    const msg = {
      to: config.to,
      from: process.env.FROM_EMAIL,
      subject: config.subject,
      html: config.html,
    }
    
    await sgMail.send(msg)
    */
    
    return true
  } catch (error) {
    console.error('Email sending error:', error)
    return false
  }
}

export async function sendBookingConfirmationEmail(
  customerEmail: string,
  bookingData: {
    customerName: string
    bookingReference: string
    tourTitle: string
    destination: string
    startDate: string
    endDate: string
    travelers: number
    totalAmount: number
    specialRequests?: string
  }
): Promise<boolean> {
  const html = generateBookingConfirmationEmail(bookingData)
  
  return await sendEmail({
    to: customerEmail,
    subject: `تأكيد الحجز - ${bookingData.bookingReference}`,
    html
  })
}

export async function sendBookingCancellationEmail(
  customerEmail: string,
  cancellationData: {
    customerName: string
    bookingReference: string
    tourTitle: string
    refundAmount?: number
  }
): Promise<boolean> {
  const html = generateBookingCancellationEmail(cancellationData)
  
  return await sendEmail({
    to: customerEmail,
    subject: `إلغاء الحجز - ${cancellationData.bookingReference}`,
    html
  })
}

// Email validation helper
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Email templates for different scenarios
export const EMAIL_TEMPLATES = {
  BOOKING_CONFIRMATION: 'booking_confirmation',
  BOOKING_CANCELLATION: 'booking_cancellation',
  BOOKING_REMINDER: 'booking_reminder',
  PAYMENT_CONFIRMATION: 'payment_confirmation',
} as const

export type EmailTemplate = typeof EMAIL_TEMPLATES[keyof typeof EMAIL_TEMPLATES]