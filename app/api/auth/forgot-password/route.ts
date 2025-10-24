import { NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/mongodb'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      )
    }

    const client = await getMongoClient()
    const db = client.db()

    // Check if user exists
    const user = await db.collection('users').findOne({ email })
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: 'إذا كان البريد الإلكتروني موجود، ستتلقى رابط إعادة تعيين كلمة المرور'
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save reset token to database
    await db.collection('users').updateOne(
      { email },
      {
        $set: {
          resetToken,
          resetTokenExpiry,
          updatedAt: new Date()
        }
      }
    )

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

    // Send email
    await sendResetPasswordEmail(email, user.name || 'المستخدم', resetUrl)

    return NextResponse.json({
      success: true,
      message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في إرسال البريد الإلكتروني' },
      { status: 500 }
    )
  }
}

async function sendResetPasswordEmail(email: string, name: string, resetUrl: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })

  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>إعادة تعيين كلمة المرور</title>
      <style>
        body {
          font-family: 'Arial', 'Tahoma', sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f8f9fa;
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
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 30px;
        }
        .reset-button {
          display: inline-block;
          background: #2563eb;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          margin: 20px 0;
          text-align: center;
        }
        .reset-button:hover {
          background: #1d4ed8;
        }
        .warning {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          color: #92400e;
        }
        .footer {
          background: #f1f5f9;
          padding: 20px;
          text-align: center;
          color: #64748b;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>إعادة تعيين كلمة المرور</h1>
        </div>
        
        <div class="content">
          <h2>مرحباً ${name}</h2>
          
          <p>تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في موقع تمازيغت سيوة.</p>
          
          <p>للمتابعة، يرجى النقر على الزر أدناه:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="reset-button">إعادة تعيين كلمة المرور</a>
          </div>
          
          <p>أو يمكنك نسخ الرابط التالي ولصقه في متصفحك:</p>
          <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px;">
            ${resetUrl}
          </p>
          
          <div class="warning">
            <strong>تنبيه:</strong>
            <ul>
              <li>هذا الرابط صالح لمدة ساعة واحدة فقط</li>
              <li>إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد</li>
              <li>لا تشارك هذا الرابط مع أي شخص آخر</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p>هذا البريد الإلكتروني تم إرساله تلقائياً، يرجى عدم الرد عليه.</p>
          <p>للدعم الفني: info@tamazight-siwa.com</p>
        </div>
      </div>
    </body>
    </html>
  `

  const textContent = `
إعادة تعيين كلمة المرور

مرحباً ${name}

تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في موقع تمازيغت سيوة.

للمتابعة، يرجى زيارة الرابط التالي:
${resetUrl}

تنبيه:
- هذا الرابط صالح لمدة ساعة واحدة فقط
- إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد
- لا تشارك هذا الرابط مع أي شخص آخر

للدعم الفني: info@tamazight-siwa.com
  `

  const mailOptions = {
    from: `"تمازيغت سيوة" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'إعادة تعيين كلمة المرور - تمازيغت سيوة',
    text: textContent,
    html: htmlContent,
  }

  await transporter.sendMail(mailOptions)
}