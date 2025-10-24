import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { getAuthOptions } from '@/lib/auth'
import { getMongoClient } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { bookingCollectionName } from '@/models/Booking'
import nodemailer from 'nodemailer'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(await getAuthOptions()) as any

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'معرف الحجز غير صحيح' },
        { status: 400 }
      )
    }

    const client = await getMongoClient()
    const db = client.db()

    // Find the booking with user and tour details
    const matchCondition: any = { _id: new ObjectId(id) }

    if (session.user.role !== 'admin' && session.user.role !== 'manager') {
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
        { success: false, message: 'الحجز غير موجود' },
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
      from: `"تمازيغت سيوة للسياحة" <${process.env.GMAIL_USER}>`,
      to: bookingData.user.email,
      subject: `تأكيد حجز الرحلة - ${bookingData.bookingReference}`,
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
      message: 'تم إرسال تأكيد الحجز بنجاح إلى البريد الإلكتروني'
    })

  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في إرسال البريد الإلكتروني' },
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
      case 'confirmed': return 'مؤكد'
      case 'pending': return 'في الانتظار'
      case 'cancelled': return 'ملغي'
      case 'completed': return 'مكتمل'
      case 'paid': return 'مدفوع'
      case 'on-demand': return 'تحت الطلب'
      case 'refunded': return 'مسترد'
      case 'failed': return 'فشل'
      default: return status
    }
  }

  return `
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
          <h1>🎉 تم تأكيد حجزك بنجاح!</h1>
          <p>رقم الحجز: ${booking.bookingReference}</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            مرحباً ${booking.user.name}،
          </div>
          
          <p>نشكرك لاختيارك رحلاتنا! تم تأكيد حجزك بنجاح وإليك تفاصيل رحلتك:</p>
          
          <div class="section">
            <div class="section-title">📍 تفاصيل الرحلة</div>
            <div class="info-row">
              <span class="info-label">اسم الرحلة:</span>
              <span class="info-value">${booking.tour.title}</span>
            </div>
            <div class="info-row">
              <span class="info-label">الوجهة:</span>
              <span class="info-value">${booking.tour.destination}</span>
            </div>
            <div class="info-row">
              <span class="info-label">تاريخ البداية:</span>
              <span class="info-value">${formatDate(booking.tour.startDate)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">تاريخ النهاية:</span>
              <span class="info-value">${formatDate(booking.tour.endDate)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">المدة:</span>
              <span class="info-value">${booking.tour.duration} أيام</span>
            </div>
            <div class="info-row">
              <span class="info-label">عدد الأفراد:</span>
              <span class="info-value">${booking.travelers} أشخاص</span>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">📋 حالة الحجز</div>
            <div class="info-row">
              <span class="info-label">حالة الحجز:</span>
              <span class="status-badge">${getStatusText(booking.status)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">حالة الدفع:</span>
              <span class="status-badge">${getStatusText(booking.paymentStatus)}</span>
            </div>
          </div>
          
          ${booking.specialRequests ? `
          <div class="section">
            <div class="section-title">📝 الطلبات الخاصة</div>
            <p>${booking.specialRequests}</p>
          </div>
          ` : ''}
          
          <div class="total-amount">
            💰 المبلغ الإجمالي: ${booking.totalAmount.toLocaleString()} ريال سعودي
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
      case 'confirmed': return 'مؤكد'
      case 'pending': return 'في الانتظار'
      case 'cancelled': return 'ملغي'
      case 'completed': return 'مكتمل'
      case 'paid': return 'مدفوع'
      case 'on-demand': return 'تحت الطلب'
      case 'refunded': return 'مسترد'
      case 'failed': return 'فشل'
      default: return status
    }
  }

  return `
تم تأكيد حجزك بنجاح!

مرحباً ${booking.user.name},

نشكرك لاختيارك رحلاتنا! تم تأكيد حجزك بنجاح.

رقم الحجز: ${booking.bookingReference}

تفاصيل الرحلة:
- اسم الرحلة: ${booking.tour.title}
- الوجهة: ${booking.tour.destination}
- تاريخ البداية: ${formatDate(booking.tour.startDate)}
- تاريخ النهاية: ${formatDate(booking.tour.endDate)}
- المدة: ${booking.tour.duration} أيام
- عدد الأفراد: ${booking.travelers} أشخاص

حالة الحجز: ${getStatusText(booking.status)}
حالة الدفع: ${getStatusText(booking.paymentStatus)}

${booking.specialRequests ? `الطلبات الخاصة: ${booking.specialRequests}` : ''}

المبلغ الإجمالي: ${booking.totalAmount.toLocaleString()} ريال سعودي

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
}