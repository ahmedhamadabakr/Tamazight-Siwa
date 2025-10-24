import { NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/mongodb'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
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
        message: 'If the email exists, you will receive a reset password link'
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
    await sendResetPasswordEmail(email, user.name || 'User', resetUrl)

    return NextResponse.json({
      success: true,
      message: 'A reset password link has been sent to your email'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to send email' },
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
      <title>Reset Password</title>
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
          <h1>Reset Password</h1>
        </div>
        
        <div class="content">
          <h2>Hello ${name}</h2>
          
          <p>We received a request to reset your password for your account on Tamazight Siwa.</p>
          
          <p>To proceed, please click the button below:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="reset-button">Reset Password</a>
          </div>
          
          <p>Or you can copy the link below and paste it in your browser:</p>
          <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px;">
            ${resetUrl}
          </p>
          
          <div class="warning">
            <strong>Warning:</strong>
            <ul>
              <li>This link is valid for one hour only</li>
              <li>If you did not request a password reset, please ignore this email</li>
              <li>Do not share this link with anyone else</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p>This email was sent automatically, please do not reply to it.</p>
          <p>For support: info@tamazight-siwa.com</p>
        </div>
      </div>
    </body>
    </html>
  `

  const textContent = `
Reset Password

Hello ${name}

We received a request to reset your password for your account on Tamazight Siwa.

To proceed, please visit the following link:
${resetUrl}

Warning:
- This link is valid for one hour only
- If you did not request a password reset, please ignore this email
- Do not share this link with anyone else

For support: info@tamazight-siwa.com
  `

  const mailOptions = {
    from: `"Tamazight Siwa" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Reset Password - Tamazight Siwa',
    text: textContent,
    html: htmlContent,
  }

  await transporter.sendMail(mailOptions)
}