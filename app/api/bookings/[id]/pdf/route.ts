import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { getAuthOptions } from '@/lib/auth'
import { getMongoClient } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { bookingCollectionName } from '@/models/Booking'

export async function GET(
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

    const { id: bookingId } = params

    if (!ObjectId.isValid(bookingId)) {
      return NextResponse.json(
        { success: false, message: 'معرف الحجز غير صحيح' },
        { status: 400 }
      )
    }

    const client = await getMongoClient()
    const db = client.db()

    // Get booking details
    const booking = await db.collection(bookingCollectionName).aggregate([
      {
        $match: {
          _id: new ObjectId(bookingId),
          user: new ObjectId(session.user.id)
        }
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
          localField: 'tour',
          foreignField: '_id',
          as: 'tourDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $unwind: '$tourDetails'
      }
    ]).toArray()

    if (!booking || booking.length === 0) {
      return NextResponse.json(
        { success: false, message: 'الحجز غير موجود' },
        { status: 404 }
      )
    }

    const bookingData = booking[0]

    // Generate PDF content (HTML)
    const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تأكيد الحجز - ${bookingData.bookingReference}</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f8f9fa;
                color: #333;
            }
            .container {
                max-width: 800px;
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
                font-size: 28px;
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
                margin-bottom: 30px;
            }
            .section h2 {
                color: #1d4ed8;
                border-bottom: 2px solid #e5e7eb;
                padding-bottom: 10px;
                margin-bottom: 20px;
                font-size: 20px;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 20px;
            }
            .info-item {
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
                border-right: 4px solid #3b82f6;
            }
            .info-item label {
                display: block;
                font-weight: bold;
                color: #374151;
                margin-bottom: 5px;
            }
            .info-item span {
                color: #6b7280;
            }
            .status {
                display: inline-block;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: bold;
            }
            .status.confirmed {
                background: #dcfce7;
                color: #166534;
            }
            .status.pending {
                background: #fef3c7;
                color: #92400e;
            }
            .price-summary {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                border: 2px solid #e5e7eb;
            }
            .price-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
            }
            .price-total {
                border-top: 2px solid #3b82f6;
                padding-top: 15px;
                margin-top: 15px;
                font-size: 18px;
                font-weight: bold;
                color: #1d4ed8;
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
            @media print {
                body { background: white; }
                .container { box-shadow: none; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>تأكيد الحجز</h1>
                <p>رقم الحجز: ${bookingData.bookingReference}</p>
            </div>
            
            <div class="content">
                <div class="section">
                    <h2>معلومات الرحلة</h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <label>اسم الرحلة</label>
                            <span>${bookingData.tourDetails.title}</span>
                        </div>
                        <div class="info-item">
                            <label>الوجهة</label>
                            <span>${bookingData.tourDetails.destination}</span>
                        </div>
                        <div class="info-item">
                            <label>تاريخ البداية</label>
                            <span>${new Date(bookingData.tourDetails.startDate).toLocaleDateString('ar-SA')}</span>
                        </div>
                        <div class="info-item">
                            <label>تاريخ النهاية</label>
                            <span>${new Date(bookingData.tourDetails.endDate).toLocaleDateString('ar-SA')}</span>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>معلومات العميل</h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <label>الاسم</label>
                            <span>${bookingData.userDetails.name}</span>
                        </div>
                        <div class="info-item">
                            <label>البريد الإلكتروني</label>
                            <span>${bookingData.userDetails.email}</span>
                        </div>
                        <div class="info-item">
                            <label>رقم الهاتف</label>
                            <span>${bookingData.userDetails.phone || 'غير محدد'}</span>
                        </div>
                        <div class="info-item">
                            <label>عدد الأفراد</label>
                            <span>${bookingData.travelers} أشخاص</span>
                        </div>
                    </div>
                    
                    ${bookingData.specialRequests ? `
                    <div class="info-item" style="grid-column: 1 / -1;">
                        <label>الطلبات الخاصة</label>
                        <span>${bookingData.specialRequests}</span>
                    </div>
                    ` : ''}
                </div>

                <div class="section">
                    <h2>تفاصيل الحجز</h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <label>حالة الحجز</label>
                            <span class="status ${bookingData.status}">${bookingData.status === 'confirmed' ? 'مؤكد' : bookingData.status === 'pending' ? 'في الانتظار' : bookingData.status}</span>
                        </div>
                        <div class="info-item">
                            <label>حالة الدفع</label>
                            <span class="status ${bookingData.paymentStatus}">${bookingData.paymentStatus === 'paid' ? 'مدفوع' : bookingData.paymentStatus === 'pending' ? 'في الانتظار' : bookingData.paymentStatus}</span>
                        </div>
                        <div class="info-item">
                            <label>تاريخ الحجز</label>
                            <span>${new Date(bookingData.createdAt).toLocaleDateString('ar-SA')}</span>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>ملخص الأسعار</h2>
                    <div class="price-summary">
                        <div class="price-row">
                            <span>سعر الفرد الواحد</span>
                            <span>${bookingData.tourDetails.price.toLocaleString()} ريال</span>
                        </div>
                        <div class="price-row">
                            <span>عدد الأفراد</span>
                            <span>${bookingData.travelers}</span>
                        </div>
                        <div class="price-row price-total">
                            <span>المجموع الكلي</span>
                            <span>${bookingData.totalAmount.toLocaleString()} ريال</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="footer">
                <p>شكراً لاختياركم خدماتنا</p>
                <p>للاستفسارات: 966501234567+ | info@example.com</p>
                <p>تم إنشاء هذا المستند في: ${new Date().toLocaleDateString('ar-SA')}</p>
            </div>
        </div>
    </body>
    </html>
    `

    // For now, return the HTML content as a simple text response
    // In a real application, you would use a library like Puppeteer to generate PDF
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="booking-confirmation-${bookingData.bookingReference}.html"`
      }
    })

  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء إنشاء ملف التأكيد' },
      { status: 500 }
    )
  }
}