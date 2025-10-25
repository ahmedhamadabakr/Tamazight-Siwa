import nodemailer from 'nodemailer'

interface BookingEmailData {
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

export async function sendBookingConfirmationEmail(
  customerEmail: string,
  bookingData: BookingEmailData
) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const emailHtml = `
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
          <h1>Booking Confirmation</h1>
          <p>Booking Reference: ${bookingData.bookingReference}</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            Hello ${bookingData.customerName},
          </div>
          
          <p>Thank you for choosing our tours! Your booking has been confirmed and here are your tour details:</p>
          
          <div class="section">
            <div class="section-title">Tour Details</div>
            <div class="info-row">
              <span class="info-label">Tour Title:</span>
              <span class="info-value">${bookingData.tourTitle}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Destination:</span>
              <span class="info-value">${bookingData.destination}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Start Date:</span>
              <span class="info-value">${formatDate(bookingData.startDate)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">End Date:</span>
              <span class="info-value">${formatDate(bookingData.endDate)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Number of People:</span>
              <span class="info-value">${bookingData.travelers} People</span>
            </div>
          </div>
          
          ${bookingData.specialRequests ? `
          <div class="section">
            <div class="section-title">Special Requests</div>
            <p>${bookingData.specialRequests}</p>
          </div>
          ` : ''}
          
          <div class="total-amount">
            Total Amount: ${bookingData.totalAmount.toLocaleString()} Dollars
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-bottom: 10px;">Important Notes:</h3>
            <ul style="color: #92400e; margin: 0; padding-right: 20px;">
              <li>Please keep your booking reference for your records</li>
              <li>You can cancel the booking before 48 hours from the tour date</li>
              <li>We will contact you 24 hours before the tour date</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Thank you for your trust!</strong></p>
          <div class="contact-info">
            <p>📞 For inquiries: 966501234567+</p>
            <p>📧 Email: info@tamazight-siwa.com</p>
            <p>🌐 website: www.tamazight-siwa.com</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  const emailText = `
Hello ${bookingData.customerName},

Thank you for choosing our tours! Your booking has been confirmed.

Booking Reference: ${bookingData.bookingReference}

Tour Details:
- Tour Title: ${bookingData.tourTitle}
- Destination: ${bookingData.destination}
- Start Date: ${formatDate(bookingData.startDate)}
- End Date: ${formatDate(bookingData.endDate)}
- Number of People: ${bookingData.travelers} People

${bookingData.specialRequests ? `Special Requests: ${bookingData.specialRequests}` : ''}

Total Amount: ${bookingData.totalAmount.toLocaleString()} Dollars

Important Notes:
- Please keep your booking reference for your records
- You can cancel the booking before 48 hours from the tour date
- We will contact you 24 hours before the tour date

For inquiries:
Phone: 966501234567+
Email: info@tamazight-siwa.com

Thank you for your trust!
Tamazight Siwa Team
  `

  const mailOptions = {
    from: `"Tamazight Siwa" <${process.env.GMAIL_USER}>`,
    to: customerEmail,
    subject: `Booking Confirmation - ${bookingData.bookingReference}`,
    text: emailText,
    html: emailHtml
  }

  await transporter.sendMail(mailOptions)
}

export async function sendBookingCancellationEmail(
  customerEmail: string,
  bookingData: BookingEmailData
) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const emailHtml = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Cancellation</title>
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
          background: linear-gradient(135deg, #dc2626, #b91c1c);
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
          color: #dc2626;
        }
        
        .section {
          margin-bottom: 25px;
          padding: 20px;
          background: #fef2f2;
          border-radius: 8px;
          border-right: 4px solid #dc2626;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #dc2626;
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
          <h1>Booking Cancellation</h1>
          <p>Booking Reference: ${bookingData.bookingReference}</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            Hello ${bookingData.customerName},
          </div>
          
          <p>We regret to inform you that your booking has been cancelled. Here are the details of the cancelled booking:</p>
          
          <div class="section">
            <div class="section-title">Cancelled Tour Details</div>
            <div class="info-row">
              <span class="info-label">Tour Title:</span>
              <span class="info-value">${bookingData.tourTitle}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Destination:</span>
              <span class="info-value">${bookingData.destination}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Start Date:</span>
              <span class="info-value">${formatDate(bookingData.startDate)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">End Date:</span>
              <span class="info-value">${formatDate(bookingData.endDate)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Number of People:</span>
              <span class="info-value">${bookingData.travelers} People</span>
            </div>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-bottom: 10px;">Refund Information:</h3>
            <ul style="color: #92400e; margin: 0; padding-right: 20px;">
              <li>Your refund will be processed within 5-7 business days</li>
              <li>The refund will be credited to your original payment method</li>
              <li>You will receive a confirmation email once the refund is processed</li>
            </ul>
          </div>
          
          <p>We apologize for any inconvenience caused. If you have any questions or would like to book another tour, please don't hesitate to contact us.</p>
        </div>
        
        <div class="footer">
          <p><strong>We hope to serve you again soon!</strong></p>
          <div class="contact-info">
            <p>📞 For inquiries: 966501234567+</p>
            <p>📧 Email: info@tamazight-siwa.com</p>
            <p>🌐 website: www.tamazight-siwa.com</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  const emailText = `
Hello ${bookingData.customerName},

We regret to inform you that your booking has been cancelled.

Booking Reference: ${bookingData.bookingReference}

Cancelled Tour Details:
- Tour Title: ${bookingData.tourTitle}
- Destination: ${bookingData.destination}
- Start Date: ${formatDate(bookingData.startDate)}
- End Date: ${formatDate(bookingData.endDate)}
- Number of People: ${bookingData.travelers} People

Refund Information:
- Your refund will be processed within 5-7 business days
- The refund will be credited to your original payment method
- You will receive a confirmation email once the refund is processed

We apologize for any inconvenience caused. If you have any questions or would like to book another tour, please don't hesitate to contact us.

For inquiries:
Phone: 966501234567+
Email: info@tamazight-siwa.com

We hope to serve you again soon!
Tamazight Siwa Team
  `

  const mailOptions = {
    from: `"Tamazight Siwa" <${process.env.GMAIL_USER}>`,
    to: customerEmail,
    subject: `Booking Cancellation - ${bookingData.bookingReference}`,
    text: emailText,
    html: emailHtml
  }

  await transporter.sendMail(mailOptions)
}