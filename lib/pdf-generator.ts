interface BookingData {
  _id: string
  user: {
    name: string
    email: string
    phone?: string
  }
  tour: {
    _id: string
    title: string
    destination: string
    duration: number
    price: number
    startDate: string
    endDate: string
  }
  travelers: number
  specialRequests?: string
  totalAmount: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed' | 'on-demand'
  bookingReference: string
  createdAt: string
}

export function generateBookingHTML(booking: BookingData): string {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'confirmed'
      case 'pending': return 'pending'
      case 'cancelled': return 'cancelled'
      case 'completed': return 'completed'
      case 'paid': return 'paid'
      case 'on-demand': return 'on-demand'
      case 'refunded': return 'refunded'
      case 'failed': return 'failed'
      default: return status
    }
  }

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation - ${booking.bookingReference}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', 'Tahoma', sans-serif;
          line-height: 1.6;
          color: #333;
          background: #ffffff;
          padding: 20px;
          font-size: 14px;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border: 2px solid #2563eb;
          border-radius: 10px;
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          padding: 30px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 32px;
          margin-bottom: 10px;
          font-weight: bold;
        }
        
        .header p {
          font-size: 20px;
          opacity: 0.95;
          font-weight: 500;
        }
        
        .content {
          padding: 30px;
        }
        
        .section {
          margin-bottom: 25px;
          page-break-inside: avoid;
        }
        
        .section-title {
          font-size: 22px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e5e7eb;
          text-align: right;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 20px;
        }
        
        .info-item {
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 8px 0;
          border-bottom: 1px dotted #e5e7eb;
        }
        
        .info-label {
          font-weight: bold;
          color: #374151;
          min-width: 120px;
          text-align: right;
        }
        
        .info-value {
          color: #6b7280;
          font-size: 16px;
          text-align: left;
          flex: 1;
          margin-left: 15px;
        }
        
        .status-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: bold;
          text-align: center;
        }
        
        .status-confirmed {
          background: #dcfce7;
          color: #166534;
          border: 2px solid #22c55e;
        }
        
        .status-pending {
          background: #fef3c7;
          color: #92400e;
          border: 2px solid #f59e0b;
        }
        
        .status-paid {
          background: #dcfce7;
          color: #166534;
          border: 2px solid #22c55e;
        }
        
        .price-summary {
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          border: 2px solid #2563eb;
          border-radius: 12px;
          padding: 25px;
          margin-top: 20px;
        }
        
        .price-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          padding: 8px 0;
          font-size: 16px;
        }
        
        .price-total {
          border-top: 3px solid #2563eb;
          padding-top: 20px;
          margin-top: 20px;
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
          background: #f0f9ff;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }
        
        .footer {
          background: #f1f5f9;
          padding: 25px 30px;
          border-top: 3px solid #2563eb;
        }
        
        .footer h3 {
          color: #2563eb;
          margin-bottom: 15px;
          font-size: 20px;
        }
        
        .footer ul {
          list-style: none;
        }
        
        .footer li {
          margin-bottom: 10px;
          color: #64748b;
          font-size: 15px;
          padding-right: 20px;
          position: relative;
        }
        
        .footer li:before {
          content: "●";
          color: #2563eb;
          position: absolute;
          right: 0;
          font-size: 18px;
        }
        
        .special-requests {
          background: #fef7cd;
          border: 2px solid #f59e0b;
          border-radius: 8px;
          padding: 20px;
          margin: 15px 0;
        }
        
        .special-requests h4 {
          color: #92400e;
          margin-bottom: 10px;
          font-size: 18px;
        }
        
        .special-requests p {
          color: #78350f;
          font-size: 16px;
          line-height: 1.6;
        }
        
        @media print {
          body {
            background: white;
            padding: 0;
            font-size: 12px;
          }
          
          .container {
            box-shadow: none;
            border-radius: 0;
            border: none;
          }
          
          .header {
            background: #2563eb !important;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .price-summary {
            background: #f8fafc !important;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .footer {
            background: #f1f5f9 !important;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .status-badge {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmation</h1>
          <p>Booking Reference: ${booking.bookingReference}</p>
        </div>
        
        <div class="content">
          <div class="info-grid">
            <div class="section">
              <h2 class="section-title">Tour Information</h2>
              
              <div class="info-item">
                <div class="info-label">Tour Name:</div>
                <div class="info-value">${booking.tour.title}</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">Destination:</div>
                <div class="info-value">${booking.tour.destination}</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">Start Date:</div>
                <div class="info-value">${formatDate(booking.tour.startDate)}</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">End Date:</div>
                <div class="info-value">${formatDate(booking.tour.endDate)}</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">Duration:</div>
                <div class="info-value">${booking.tour.duration} days</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">Travelers:</div>
                <div class="info-value">${booking.travelers} people</div>
              </div>
            </div>
            
            <div class="section">
              <h2 class="section-title">Customer Information</h2>
              
              <div class="info-item">
                <div class="info-label">Name:</div>
                <div class="info-value">${booking.user.name}</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">Email:</div>
                <div class="info-value">${booking.user.email}</div>
              </div>
              
              ${booking.user.phone ? `
              <div class="info-item">
                <div class="info-label">Phone:</div>
                <div class="info-value">${booking.user.phone}</div>
              </div>
              ` : ''}
              
              <div class="info-item">
                <div class="info-label">Booking Status:</div>
                <div class="info-value">
                  <span class="status-badge status-${booking.status}">${getStatusText(booking.status)}</span>
                </div>
              </div>
              
              <div class="info-item">
                <div class="info-label">Payment Status:</div>
                <div class="info-value">
                  <span class="status-badge status-${booking.paymentStatus}">${getStatusText(booking.paymentStatus)}</span>
                </div>
              </div>
              
              <div class="info-item">
                <div class="info-label">Booking Date:</div>
                <div class="info-value">${formatDate(booking.createdAt)}</div>
              </div>
            </div>
          </div>
          
          ${booking.specialRequests ? `
          <div class="section">
            <h2 class="section-title">Special Requests</h2>
            <div class="special-requests">
              <h4>Special Requests Details:</h4>
              <p>${booking.specialRequests}</p>
            </div>
          </div>
          ` : ''}
          
          <div class="section">
            <h2 class="section-title">Cost Summary</h2>
            <div class="price-summary">
              <div class="price-row">
                <span><strong>Price per person:</strong></span>
                <span><strong>${booking.tour.price.toLocaleString()} $</strong></span>
              </div>
              <div class="price-row">
                <span><strong>Number of people:</strong></span>
                <span><strong>${booking.travelers} people</strong></span>
              </div>
              <div class="price-total">
                <div>Total amount: ${booking.totalAmount.toLocaleString()} Dollars</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <h3>Important Notes</h3>
          <ul>
            <li>Please keep this confirmation for your records</li>
            <li>You can cancel the booking before 48 hours from the tour date</li>
            <li>For inquiries: 966501234567+</li>
            <li>Email: info@tamazight-siwa.com</li>
            <li>Please verify the accuracy of all the information above</li>
            <li>In case of any error, please contact us immediately</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `
}

export function generateSimplePDFContent(booking: BookingData): string {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
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
      case 'on-demand': return 'On Demand'
      case 'refunded': return 'Refunded'
      case 'failed': return 'Failed'
      default: return status
    }
  }

  return `
BOOKING CONFIRMATION
====================

Booking Reference: ${booking.bookingReference}
Date: ${new Date().toLocaleDateString('en-US')}

CUSTOMER INFORMATION
--------------------
Name: ${booking.user.name}
Email: ${booking.user.email}
${booking.user.phone ? `Phone: ${booking.user.phone}` : ''}

TOUR INFORMATION
----------------
Tour Name: ${booking.tour.title}
Destination: ${booking.tour.destination}
Start Date: ${formatDate(booking.tour.startDate)}
End Date: ${formatDate(booking.tour.endDate)}
Duration: ${booking.tour.duration} days
Number of Travelers: ${booking.travelers} persons

${booking.specialRequests ? `
SPECIAL REQUESTS
----------------
${booking.specialRequests}
` : ''}

PRICE SUMMARY
-------------
Price per person: ${booking.tour.price.toLocaleString()} $
Number of travelers: ${booking.travelers}
Total Amount: ${booking.totalAmount.toLocaleString()} $

BOOKING STATUS
--------------
Booking Status: ${getStatusText(booking.status)}
Payment Status: ${getStatusText(booking.paymentStatus)}
Booking Date: ${formatDate(booking.createdAt)}

IMPORTANT NOTES
---------------
• Please keep this confirmation for your records
• Cancellation allowed up to 48 hours before tour date
• For inquiries: +966501234567
• Email: info@tamazight-siwa.com

Thank you for choosing our services!
  `
}