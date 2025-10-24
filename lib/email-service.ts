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
      <title>تأكيد الحجز</title>
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
          <h1>🎉 تم تأكيد حجزك بنجاح!</h1>
          <p>رقم الحجز: ${bookingData.bookingReference}</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            مرحباً ${bookingData.customerName}،
          </div>
          
          <p>نشكرك لاختيارك رحلاتنا! تم تأكيد حجزك بنجاح وإليك تفاصيل رحلتك:</p>
          
          <div class="section">
            <div class="section-title">📍 تفاصيل الرحلة</div>
            <div class="info-row">
              <span class="info-label">اسم الرحلة:</span>
              <span class="info-value">${bookingData.tourTitle}</span>
            </div>
            <div class="info-row">
              <span class="info-label">الوجهة:</span>
              <span class="info-value">${bookingData.destination}</span>
            </div>
            <div class="info-row">
              <span class="info-label">تاريخ البداية:</span>
              <span class="info-value">${formatDate(bookingData.startDate)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">تاريخ النهاية:</span>
              <span class="info-value">${formatDate(bookingData.endDate)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">عدد الأفراد:</span>
              <span class="info-value">${bookingData.travelers} أشخاص</span>
            </div>
          </div>
          
          ${bookingData.specialRequests ? `
          <div class="section">
            <div class="section-title">📝 الطلبات الخاصة</div>
            <p>${bookingData.specialRequests}</p>
          </div>
          ` : ''}
          
          <div class="total-amount">
            💰 المبلغ الإجمالي: ${bookingData.totalAmount.toLocaleString()} ريال سعودي
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-bottom: 10px;">📌 ملاحظات مهمة:</h3>
            <ul style="color: #92400e; margin: 0; padding-right: 20px;">
              <li>يرجى الاحتفاظ برقم الحجز للمراجعة</li>
              <li>يمكن إلغاء الحجز قبل 48 ساعة من موعد الرحلة</li>
              <li>سيتم التواصل معك قبل موعد الرحلة بـ 24 ساعة</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>شكراً لثقتك بنا!</strong></p>
          <div class="contact-info">
            <p>📞 للاستفسارات: 966501234567+</p>
            <p>📧 البريد الإلكتروني: info@tamazight-siwa.com</p>
            <p>🌐 الموقع الإلكتروني: www.tamazight-siwa.com</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  const emailText = `
تم تأكيد حجزك بنجاح!

مرحباً ${bookingData.customerName},

نشكرك لاختيارك رحلاتنا! تم تأكيد حجزك بنجاح.

رقم الحجز: ${bookingData.bookingReference}

تفاصيل الرحلة:
- اسم الرحلة: ${bookingData.tourTitle}
- الوجهة: ${bookingData.destination}
- تاريخ البداية: ${formatDate(bookingData.startDate)}
- تاريخ النهاية: ${formatDate(bookingData.endDate)}
- عدد الأفراد: ${bookingData.travelers} أشخاص

${bookingData.specialRequests ? `الطلبات الخاصة: ${bookingData.specialRequests}` : ''}

المبلغ الإجمالي: ${bookingData.totalAmount.toLocaleString()} ريال سعودي

ملاحظات مهمة:
- يرجى الاحتفاظ برقم الحجز للمراجعة
- يمكن إلغاء الحجز قبل 48 ساعة من موعد الرحلة
- سيتم التواصل معك قبل موعد الرحلة بـ 24 ساعة

للاستفسارات:
هاتف: 966501234567+
بريد إلكتروني: info@tamazight-siwa.com

شكراً لثقتك بنا!
فريق تمازيغت سيوة
  `

  const mailOptions = {
    from: `"تمازيغت سيوة للسياحة" <${process.env.GMAIL_USER}>`,
    to: customerEmail,
    subject: `تأكيد حجز الرحلة - ${bookingData.bookingReference}`,
    text: emailText,
    html: emailHtml
  }

  await transporter.sendMail(mailOptions)
}