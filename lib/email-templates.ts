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

export function generateBookingConfirmationEmail(data: BookingEmailData): string {
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
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
            color: #333;
            direction: rtl;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section h2 {
            color: #1d4ed8;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
            margin-bottom: 15px;
            font-size: 18px;
        }
        .info-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f3f4f6;
        }
        .info-item:last-child {
            border-bottom: none;
        }
        .info-label {
            font-weight: bold;
            color: #374151;
        }
        .info-value {
            color: #6b7280;
        }
        .price-summary {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border: 2px solid #e5e7eb;
        }
        .price-total {
            border-top: 2px solid #3b82f6;
            padding-top: 15px;
            margin-top: 15px;
            font-size: 18px;
            font-weight: bold;
            color: #1d4ed8;
            text-align: center;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 5px 0;
            color: #6b7280;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background: #3b82f6;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
        }
        .success-icon {
            width: 60px;
            height: 60px;
            background: #10b981;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="success-icon">✓</div>
            <h1>Booking Confirmation</h1>
            <p>Hello ${data.customerName}</p>
        </div>
        
        <div class="content">
            <div class="section">
                <h2>Booking Details</h2>
                <div class="info-item">
                    <span class="info-label">Booking Reference</span>
                    <span class="info-value">${data.bookingReference}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Tour Title</span>
                    <span class="info-value">${data.tourTitle}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Destination</span>
                    <span class="info-value">${data.destination}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Start Date</span>
                    <span class="info-value">${new Date(data.startDate).toLocaleDateString('ar-EG')}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">End Date</span>
                    <span class="info-value">${new Date(data.endDate).toLocaleDateString('ar-EG')}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Number of People</span>
                    <span class="info-value">${data.travelers} People</span>
                </div>
                ${data.specialRequests ? `
                <div class="info-item">
                    <span class="info-label">Special Requests</span>
                    <span class="info-value">${data.specialRequests}</span>
                </div>
                ` : ''}
            </div>

            <div class="section">
                <h2>Price Summary</h2>
                <div class="price-summary">
                    <div class="price-total">
                        Total Amount: ${data.totalAmount.toLocaleString()} Dollars
                    </div>
                </div>
            </div>

            <div style="text-align: center;">
                <a href="#" class="button">View Booking Details</a>
            </div>
        </div>

        <div class="footer">
            <p><strong>Important Notes:</strong></p>
            <p> Please keep your booking reference for your records</p>
            <p>You can cancel the booking before 48 hours from the tour date</p>
            <p>In case of any inquiries, please contact us</p>
            <br>
            <p>Thank you for choosing our services</p>
            <p>For inquiries: 966501234567+ | info@example.com</p>
        </div>
    </div>
</body>
</html>
  `
}

export function generateBookingCancellationEmail(data: {
  customerName: string
  bookingReference: string
  tourTitle: string
  refundAmount?: number
}): string {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Cancellation</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
            color: #333;
            direction: rtl;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
        }
        .content {
            padding: 30px;
        }
        .info-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f3f4f6;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Booking Cancellation</h1>
            <p>Hello ${data.customerName}</p>
        </div>
        
        <div class="content">
            <p>We are sorry to cancel your booking. The following booking has been canceled successfully:</p>
            
            <div class="info-item">
                <span>Booking Reference:</span>
                <span>${data.bookingReference}</span>
            </div>
            <div class="info-item">
                <span>Tour Title:</span>
                <span>${data.tourTitle}</span>
            </div>
            
            ${data.refundAmount ? `
            <div class="info-item">
                <span>Refund Amount:</span>
                <span>${data.refundAmount.toLocaleString()} Dollars</span>
            </div>
            <p>Refund will be processed within 5-7 business days.</p>
            ` : ''}
        </div>

        <div class="footer">
            <p>Thank you for choosing our services</p>
            <p>For inquiries: 966501234567+ | info@example.com</p>
        </div>
    </div>
</body>
</html>
  `
}