import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.findUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'This email is already in use' },
        { status: 400 }
      );
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create verification code in database
    await prisma.createVerificationCode({
      code: verificationCode,
      email,
      expires,
      used: false,
    });

    // Create verification link with all necessary data
    const verificationLink = `https://tamazight-siwa.vercel.app/verify-email?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&password=${encodeURIComponent(password)}`;

    // Send verification code via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Tamazight Siwa" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Verification code - Tamazight Siwa',
      html: `
        <div dir="rtl" style="font-family: 'Tajawal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #f0f0f0;">
            <h1 style="color: #2d3748; margin-bottom: 10px;">Welcome to Tamazight Siwa</h1>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">Thank you for registering with us. Use the code below to verify your email:</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background-color: #f8f9fa; border: 2px solid #4299e1; border-radius: 8px; padding: 20px 40px;">
              <span style="font-size: 32px; font-weight: bold; color: #4299e1; letter-spacing: 3px;">${verificationCode}</span>
            </div>
          </div>
          
          <div style="margin: 30px 0; padding: 15px; background-color: #f0f9ff; border-radius: 6px; border-right: 4px solid #4299e1;">
            <p style="color: #0369a1; margin: 0; font-size: 14px; line-height: 1.6;">
              <strong>Important Instructions: </strong>
            </p>
            <ol style="padding-right: 15px; margin: 10px 0 0 0;">
              <li>Copy the code above</li>
              <li>Go back to the email verification page</li>
              <li>Paste the code in the designated field</li>
              <li>Click on the "Verify" button</li>
            </ol>
          </div>
          
          <div style="margin: 30px 0; padding: 15px; background-color: #fff3cd; border-radius: 6px; border-right: 4px solid #ffc107;">
            <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.6;">
              <strong>Note:</strong> This code is valid for 10 minutes only. If it expires, please request a new code.
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="color: #718096; font-size: 14px; line-height: 1.6;">
              If you face any issues, do not hesitate to contact the support team:
              <br>
              <a href="mailto:support@tamazight-siwa.com" style="color: #4299e1; text-decoration: none;">support@tamazight-siwa.com</a>
            </p>
            <p style="color: #a0aec0; font-size: 12px; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
              © ${new Date().getFullYear()} Tamazight Siwa. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
      email: email // Send back email for verification step
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while sending the verification code' },
      { status: 500 }
    );
  }
}
