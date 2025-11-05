import { NextResponse } from 'next/server'
import { getServerAuthSession } from '@/lib/server-auth';



import { getMongoClient } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { bookingCollectionName } from '@/models/Booking'
import nodemailer from 'nodemailer'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession() as any

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid booking ID' }, 
        { status: 400 }
      )
    }

    const client = await getMongoClient()
    const db = client.db()

    // Find the booking with user and tour details
    const matchCondition: any = { _id: new ObjectId(id) }

    if (session.user.role !== 'manager') {
      matchCondition.user = new ObjectId(session.user.id)
    }

    const booking = await db.collection(bookingCollectionName).aggregate([
      {
        $match: matchCondition
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $lookup: {
          from: 'tours',
          localField: 'trip',
          foreignField: '_id',
          as: 'tourDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $unwind: '$tourDetails'
      },
      {
        $project: {
          _id: 1,
          user: {
            name: '$userDetails.name',
            email: '$userDetails.email',
            phone: '$userDetails.phone'
          },
          tour: {
            _id: '$tourDetails._id',
            title: '$tourDetails.title',
            destination: '$tourDetails.destination',
            duration: '$tourDetails.duration',
            price: '$tourDetails.price',
            startDate: '$tourDetails.startDate',
            endDate: '$tourDetails.endDate'
          },
          travelers: '$numberOfTravelers',
          specialRequests: 1,
          totalAmount: 1,
          status: 1,
          paymentStatus: 1,
          bookingReference: 1,
          createdAt: 1
        }
      }
    ]).toArray()

    if (!booking || booking.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      )
    }

    const bookingData = booking[0]

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    })

    // Generate email content
    const emailHtml = generateBookingEmailHTML(bookingData)
    const emailText = generateBookingEmailText(bookingData)

    // Send email
    const mailOptions = {
      from: `"Tamazight Siwa" <${process.env.GMAIL_USER}>`,
      to: bookingData.user.email,
      subject: `Booking Confirmation - ${bookingData.bookingReference}`,
      text: emailText,
      html: emailHtml
    }

    await transporter.sendMail(mailOptions)

    // Update booking to mark email as sent
    await db.collection(bookingCollectionName).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          emailSent: true,
          emailSentAt: new Date(),
          updatedAt: new Date()
        }
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Booking confirmation email sent successfully'
    })

  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred while sending email' },
      { status: 500 }
    )
  }
}

function generateBookingEmailHTML(booking: any): string {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmed'
      case 'pending': return 'Pending'
      case 'cancelled': return 'Cancelled'
      case 'completed': return 'Completed'
      case 'paid': return 'Paid'
      case 'on-demand': return 'On-demand'
      case 'refunded': return 'Refunded'
      case 'failed': return 'Failed'
      default: return status
    }
  }

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          background: #f8f9fa;
          margin: 0;
          padding: 20px;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .header {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          padding: 30px;
          text-align: center;
        }
        
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 24px;
        }
        
        .content {
          padding: 30px;
        }
        
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
          color: #2563eb;
        }
        
        .section {
          margin-bottom: 25px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
          border-right: 4px solid #2563eb;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 15px;
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          padding: 5px 0;
        }
        
        .info-label {
          font-weight: bold;
          color: #374151;
        }
        
        .info-value {
          color: #6b7280;
        }
        
        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          background: #dcfce7;
          color: #166534;
        }
        
        .total-amount {
          font-size: 18px;
          font-weight: bold;
          color: #2563eb;
          text-align: center;
          padding: 15px;
          background: #eff6ff;
          border-radius: 8px;
          margin: 20px 0;
        }
        
        .footer {
          background: #f1f5f9;
          padding: 20px;
          text-align: center;
          color: #64748b;
          font-size: 14px;
        }
        
        .contact-info {
          margin-top: 15px;
        }
        
        .contact-info p {
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Booking confirmed!</h1>
          <p>Booking Reference: ${booking.bookingReference}</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            Hello ${booking.user.name},
          </div>
          
          <p>Thank you for choosing our tours! Your booking has been confirmed and here are your tour details:</p>
          
          <div class="section">
            <div class="section-title">📍 Tour Details</div>
            <div class="info-row">
              <span class="info-label">Tour Name:</span>
              <span class="info-value">${booking.tour.title}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Destination:</span>
              <span class="info-value">${booking.tour.destination}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Start Date:</span>
              <span class="info-value">${formatDate(booking.tour.startDate)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">End Date:</span>
              <span class="info-value">${formatDate(booking.tour.endDate)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Duration:</span>
              <span class="info-value">${booking.tour.duration} days</span>
            </div>
            <div class="info-row">
              <span class="info-label">Number of travelers:</span>
              <span class="info-value">${booking.travelers} people</span>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">📋 Booking Status</div>
            <div class="info-row">
              <span class="info-label">Booking Status:</span>
              <span class="status-badge">${getStatusText(booking.status)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Payment Status:</span>
              <span class="status-badge">${getStatusText(booking.paymentStatus)}</span>
            </div>
          </div>
          
          ${booking.specialRequests ? `
          <div class="section">
            <div class="section-title">📝 Special Requests</div>
            <p>${booking.specialRequests}</p>
          </div>
          ` : ''}
          
          <div class="total-amount">
            💰 Total Amount: ${booking.totalAmount.toLocaleString()} dollars
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-bottom: 10px;">📌 Important Notes:</h3>
            <ul style="color: #92400e; margin: 0; padding-right: 20px;">
              <li>Please keep your booking reference for review</li>
              <li>You can cancel the booking before 48 hours from the tour date</li>
              <li>We will contact you 24 hours before the tour date</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Thank you for choosing us!</strong></p>
          <div class="contact-info">
            <p>📞 For inquiries: 966501234567+</p>
            <p>📧 Email: info@tamazight-siwa.com</p>
            <p>🌐 Website: www.tamazight-siwa.com</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateBookingEmailText(booking: any): string {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmed'
      case 'pending': return 'Pending'
      case 'cancelled': return 'Cancelled'
      case 'completed': return 'Completed'
      case 'paid': return 'Paid'
      case 'on-demand': return 'On-demand'
      case 'refunded': return 'Refunded'
      case 'failed': return 'Failed'
      default: return status
    }
  }

  return `
Booking confirmed!

Hello ${booking.user.name},

Thank you for choosing our tours! Your booking has been confirmed.

Booking Reference: ${booking.bookingReference}

Tour Details:
- Tour Name: ${booking.tour.title}
- Destination: ${booking.tour.destination}
- Start Date: ${formatDate(booking.tour.startDate)}
- End Date: ${formatDate(booking.tour.endDate)}
- Duration: ${booking.tour.duration} days
- Number of travelers: ${booking.travelers} people

Booking Status: ${getStatusText(booking.status)}
Payment Status: ${getStatusText(booking.paymentStatus)}

${booking.specialRequests ? `Special Requests: ${booking.specialRequests}` : ''}

Total Amount: ${booking.totalAmount.toLocaleString()} dollars

Important Notes:
- Please keep your booking reference for review
- You can cancel the booking before 48 hours from the tour date
- We will contact you 24 hours before the tour date

For inquiries:
Phone: 966501234567+
Email: info@tamazight-siwa.com

Thank you for choosing us!
Tamazight Siwa Team
  `
}