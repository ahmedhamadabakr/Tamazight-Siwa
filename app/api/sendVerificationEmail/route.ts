import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/models"; // Import database
import crypto from "crypto"; // Import crypto for token generation

export async function POST(req: NextRequest) {
  const { email } = await req.json(); // Only need email from request body

  // Find the user by email
  const user = await database.findUserByEmail(email);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 404 }
    );
  }

  // Generate a unique token
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiration

  // Save the verification token to the database
  await database.createVerificationToken({
    userId: user._id as any, // Cast to any as ObjectId type might not match directly
    token,
    identifier: email, // Can be email or userId string
    expires,
  });

  // إعداد الـ transporter الخاص بجوجل
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER, // بريدك الجيميل
      pass: process.env.GMAIL_APP_PASSWORD, // App Password
    },
  });

  // إعداد رابط التأكيد
  const verificationLink = `https://tamazight-siwa.vercel.app/verify-token?token=${token}`;

  // إعداد الإيميل
  const mailOptions = {
    from: `"Tamazight Siwa" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Account activation - Tamazight Siwa',
    html: `
      <div dir="rtl" style="font-family: 'Tajawal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #f0f0f0;">
          <h1 style="color: #2d3748; margin-bottom: 10px;">Welcome to Tamazight Siwa</h1>
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">Thank you for registering with us. Please verify your email to activate your account and start your journey with us.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" 
             style="display: inline-block; background-color: #4299e1; color: white; 
                    text-decoration: none; padding: 12px 30px; border-radius: 6px; 
                    font-weight: bold; font-size: 16px; transition: background-color 0.3s ease;
                    box-shadow: 0 2px 4px rgba(66, 153, 225, 0.3);">
            Verify your email
          </a>
        </div>
        
        <div style="margin: 30px 0; padding: 15px; background-color: #f8f9fa; border-radius: 6px;">
          <p style="color: #4a5568; margin: 0; font-size: 14px; line-height: 1.6;">
            If you did not create an account, please ignore this email. 
            <br>
            <span style="color: #718096; font-size: 13px; display: inline-block; margin-top: 8px;">
              The activation link is valid for 24 hours only.
            </span>
          </p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="color: #718096; font-size: 14px;">
            If you did not request this email, you can safely ignore it.
          </p>
          <p style="color: #a0aec0; font-size: 12px; margin-top: 20px;">
            © ${new Date().getFullYear()} Tamazight Siwa. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: "Verification email sent successfully." });
  } catch (error: any) {
    console.error("Email error:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage });
  }
}
